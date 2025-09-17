# -*- coding: utf-8 -*-
"""
根据输入调用相关的 MCP 获得相应的json输出 + 进行摘要抽取 + 多轮规划修复 + 多轮富化[描述 + 提示]
流程：
1) 输入旅程规划信息，模型根据输入将其拆分成多个MCP子任务，其中一定会调用搜索的MCP服务
2) 逐个调用 MCP，并输出json格式
2) 工具组合组件从 MCP服务器获得数据并从文本中抽取统一候选
3) 计划组件生成行程，每天生成活动
4) 多轮大模型迭代进行质量修复，按问题清单重生成为按规定形式的JSON
5) 富化处理，对缺失 description/notes的活动进行取证并回填
6) 整合输出

依赖需求：
- adalflow.core.mcp_tool
- openai SDK

环境变量：
- DEEPSEEK_API_KEY
- OPENAI_MODEL ：deepseek-chat
- SEARCH_MCP_FILE/ TRAIN_MCP_FILE / WEATHER_MCP_FILE / LOCATION_MCP_FILE / FLIGHT_MCP_FILE 后续继续完善其他的 MCP服务器
"""
from textwrap import dedent
import os
import sys
import re
import json
import asyncio
import platform
import argparse
from datetime import datetime, date, timedelta
from typing import Any, Dict, Optional, List, Tuple

from openai import OpenAI
from dotenv import load_dotenv
from adalflow.core.mcp_tool import MCPFunctionTool, mcp_session_context, MCPServerStdioParams

# ======================== 环境配置 ========================
load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "deepseek-chat")

TRAIN_MCP_FILE = os.getenv("TRAIN_MCP_FILE")
WEATHER_MCP_FILE = os.getenv("WEATHER_MCP_FILE")
LOCATION_MCP_FILE = os.getenv("LOCATION_MCP_FILE")
FLIGHT_MCP_FILE = os.getenv("FLIGHT_MCP_FILE")
WEBSEARCH_MCP_FILE = os.getenv("SEARCH_MCP_FILE")

client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")


# -------------------- MCP 启动参数 --------------------
def _mcp_params(server_path: str) -> MCPServerStdioParams:
    server_abspath = os.path.abspath(server_path) if server_path else ""
    return MCPServerStdioParams(
        command=sys.executable,
        args=["-u", server_abspath],
        env={**os.environ, "PYTHONUNBUFFERED": "1"} if server_abspath else None,
    )


# -------------------- MCP 工具调用 --------------------
async def call_mcp_tool(server_file: Optional[str], tool_name: str, **kwargs) -> Dict[str, Any]:
    ''' 调用相应的MCP服务器 '''
    if not server_file:
        return {"status": "error", "tool": tool_name, "args": kwargs, "result": "未配置对应的 MCP 文件路径。"}
    params = _mcp_params(server_file)
    try:
        async with mcp_session_context(params) as session:
            tools = await session.list_tools()
            found = None
            for t in tools.tools:
                if t.name == tool_name:
                    found = t
                    break
            if not found:
                names = [t.name for t in tools.tools]
                return {"status": "error", "tool": tool_name, "args": kwargs,
                        "result": f"未找到工具 {tool_name}；已发现：{names}"}
            mcp_tool = MCPFunctionTool(params, found)
            output = await mcp_tool.acall(**kwargs)
            return {"status": "success", "tool": tool_name, "args": kwargs, "result": output.output}
    except Exception as e:
        return {"status": "error", "tool": tool_name, "args": kwargs, "result": f"调用异常: {e}"}


# -------------------- 告知模型工具清单 --------------------
INTENT_ENUM = {
    "train_info", "weather_recent", "weather_forecast", "traffic_status",
    "nearby_attractions", "city_top_attractions", "flight_info", "flight_forecast",
    "web_search", "news_search", "scholar_search", "none"
}
# 对路由的分类处理
CLASSIFY_INSTRUCT = (
    "你是一个严格的路由分类器。将用户输入拆分为任意数量的子任务 tasks，覆盖行程规划所需的 MCP："
    "train_info, weather_recent, weather_forecast, traffic_status, nearby_attractions, city_top_attractions,"
    "flight_info, flight_forecast, web_search, news_search, scholar_search, none。"
    "无论用户输入是什么，都需要包含一个 web_search 任务，该任务用于获取目的地最新权威信息：景点/票务/交通/天气/活动/政策等。"
    "各 task 形如 {intent, query}，其中 query 为："
    "train_info:{from_city,to_city,date(YYYY-MM-DD)}; "
    "weather_recent:{city}; "
    "weather_forecast:{city,days(1-4,默认3)}; "
    "traffic_status:{location,radius_deg(可选)}; "
    "nearby_attractions:{location}; "
    "city_top_attractions:{city}; "
    "flight_info:{departure,arrival,departure_date}; "
    "flight_forecast:{departure,arrival,departure_date}; "
    "web_search:{query,num_results(默认5)}; "
    "news_search:{query}; "
    "scholar_search:{query,num_results(默认5)}。"
    "输出严格 JSON，仅包含字段 tasks 数组，不要代码块或多余文本，只需要这些关键的信息。"
)

MCP_SERVER_MAP: Dict[str, Optional[str]] = {
    "get_train_info": TRAIN_MCP_FILE,
    "get_recent_weather": WEATHER_MCP_FILE,
    "get_weather_forecast": WEATHER_MCP_FILE,
    "get_traffic_status": LOCATION_MCP_FILE,
    "get_nearby_attractions": LOCATION_MCP_FILE,
    "get_city_top_attractions": LOCATION_MCP_FILE,
    "get_flight_info": FLIGHT_MCP_FILE,
    "get_flight_forecast": FLIGHT_MCP_FILE,
    "search_web": WEBSEARCH_MCP_FILE,
    "search_news": WEBSEARCH_MCP_FILE,
    "search_scholar": WEBSEARCH_MCP_FILE,
}


# -------------------- 构造 web_search 查询 --------------------
def _build_web_query(user_text: str, prefs: Dict[str, Any]) -> str:
    today = datetime.now().strftime("%Y-%m-%d")
    origin = prefs.get("origin") or prefs.get("from") or prefs.get("city_from") or ""
    dest = prefs.get("destination") or prefs.get("city") or prefs.get("to") or ""
    sd = prefs.get("start_date") or ""
    ed = prefs.get("end_date") or ""
    parts = [
        f"日期:{today}",
        f"出发地:{origin}" if origin else "",
        f"目的地:{dest}" if dest else "",
        f"时间:{sd}~{ed}" if sd or ed else "",
        "关键词: 旅游 攻略 景点 门票 开放时间 天气 交通 火车 航班 活动 节庆 政策 美食 酒店 住宿",
        f"用户需求:{user_text}",
    ]
    return " ".join([p for p in parts if p])


# -------------------- 分类并调用 MCP --------------------
def _result_item(intent: str, query: Dict[str, Any], data: Any, note: Optional[str]) -> Dict[str, Any]:
    return {"intent": intent, "query": query, "data": data, "note": note}


async def gather_with_mcp(user_text: str, prefs: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    prefs = dict(prefs or {})
    try:
        print("正在分类用户意图...")
        first = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": CLASSIFY_INSTRUCT},
                {"role": "user", "content": user_text},
                {"role": "system", "content": "仅输出严格 JSON：{\"tasks\": [...] }。"},
            ],
            temperature=0,
        )
    except Exception as e:
        return {"route": "rule", "results": [_result_item("none", {"raw": user_text}, None, f"分类阶段接口失败：{e}")],
                "raw_classify": None}

    raw = first.choices[0].message.content or ""
    tasks: List[Dict[str, Any]] = _parse_tasks(raw) or []

    # 兜底确保 web_search 存在
    if not any(t.get("intent") == "web_search" for t in tasks):
        tasks.append({"intent": "web_search", "query": {"query": _build_web_query(user_text, prefs), "num_results": 8}})

    results: List[Dict[str, Any]] = []
    print(f"识别到 {len(tasks)} 个子任务，开始调用 MCP 工具...")

    for task in tasks:
        intent = task.get("intent")
        query = dict(task.get("query", {}))
        if not intent or not isinstance(query, dict):
            results.append(_result_item("none", {"raw": task}, None, "任务结构异常，已跳过"))
            continue

        print(f"处理子任务: {intent}")

        # 归一化
        if intent == "weather_forecast":
            try:
                query["days"] = max(1, min(4, int(query.get("days", 3))))
            except Exception:
                query["days"] = 3
        if intent == "traffic_status":
            try:
                rd = float(query.get("radius_deg", 0.01))
            except Exception:
                rd = 0.01
            query["radius_deg"] = min(0.05, max(0.002, rd))

        # 调用
        if intent == "train_info" and all(k in query for k in ("from_city", "to_city", "date")):
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_train_info"], "get_train_info", **query)
        elif intent == "weather_recent" and "city" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_recent_weather"], "get_recent_weather", **query)
        elif intent == "weather_forecast" and "city" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_weather_forecast"], "get_weather_forecast", **query)
        elif intent == "traffic_status" and "location" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_traffic_status"], "get_traffic_status", **query)
        elif intent == "nearby_attractions" and "location" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_nearby_attractions"], "get_nearby_attractions", **query)
        elif intent == "city_top_attractions" and "city" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_city_top_attractions"], "get_city_top_attractions", **query)
        elif intent == "flight_info" and all(k in query for k in ("departure", "arrival", "departure_date")):
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_flight_info"], "get_flight_info", **query)
        elif intent == "flight_forecast" and all(k in query for k in ("departure", "arrival", "departure_date")):
            tr = await call_mcp_tool(MCP_SERVER_MAP["get_flight_forecast"], "get_flight_forecast", **query)
        elif intent == "web_search" and "query" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["search_web"], "search_web", **query)
        elif intent == "news_search" and "query" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["search_news"], "search_news", **query)
        elif intent == "scholar_search" and "query" in query:
            tr = await call_mcp_tool(MCP_SERVER_MAP["search_scholar"], "search_scholar", **query)
        else:
            tr = {"status": "error", "result": "该子任务缺少必要参数或意图未实现，不调用 MCP。"}

        data, note = (tr.get("result"), None) if tr.get("status") == "success" else (None, tr.get("result"))
        results.append(_result_item(intent, query, data, note))

    print("所有 MCP 工具调用完成")
    return {"route": "rule", "results": results, "raw_classify": raw}


# -------------------- 轻量提取（Python侧兜底候选） --------------------
def _safe_get(d, keys, default=None):
    if not isinstance(d, dict):
        return default
    for k in keys:
        if k in d:
            return d[k]
    return default


def _coerce_float(x, default=None):
    try:
        return float(x)
    except Exception:
        return default


def _norm_weather_forecast(data: Any) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    if not data: return out
    seq = data
    if isinstance(data, dict):
        for k in ["forecast", "daily", "days"]:
            if isinstance(data.get(k), list):
                seq = data.get(k)
                break
    if isinstance(seq, list):
        for d in seq:
            if not isinstance(d, dict): continue
            out.append({
                "date": _safe_get(d, ["date", "day"]),
                "high_c": _coerce_float(_safe_get(d, ["high_c", "max_temp_c", "high"])),
                "low_c": _coerce_float(_safe_get(d, ["low_c", "min_temp_c", "low"])),
                "text": _safe_get(d, ["text", "condition", "weather"]),
                "precip_prob": _coerce_float(_safe_get(d, ["precip_prob", "pop"])),
            })
    return out


def _norm_flights(data: Any) -> List[Dict[str, Any]]:
    flights: List[Dict[str, Any]] = []
    if not data: return flights
    seq = data if isinstance(data, list) else data.get("flights") if isinstance(data, dict) else None
    if isinstance(seq, list):
        for f in seq:
            if not isinstance(f, dict): continue
            flights.append({
                "flight_no": _safe_get(f, ["flight_no", "no", "number"]),
                "carrier": _safe_get(f, ["carrier", "airline"]),
                "depart_airport": _safe_get(f, ["from", "depart_airport", "orig"]),
                "depart_time_local": _safe_get(f, ["depart_time_local", "depart_time", "departure"]),
                "arrive_airport": _safe_get(f, ["to", "arrive_airport", "dest"]),
                "arrive_time_local": _safe_get(f, ["arrive_time_local", "arrive_time", "arrival"]),
                "duration_min": _coerce_float(_safe_get(f, ["duration_min", "duration"])),
                "stops": _coerce_float(_safe_get(f, ["stops"])),
                "price": _safe_get(f, ["price"]),
            })
    else:
        flights.append({"raw": data})
    return flights


def _norm_trains(data: Any) -> List[Dict[str, Any]]:
    trains: List[Dict[str, Any]] = []
    if not data: return trains
    seq = data if isinstance(data, list) else data.get("trains") if isinstance(data, dict) else None
    if isinstance(seq, list):
        for t in seq:
            if not isinstance(t, dict): continue
            trains.append({
                "train_no": _safe_get(t, ["train_no", "code"]),
                "from": _safe_get(t, ["from", "depart_station"]),
                "to": _safe_get(t, ["to", "arrive_station"]),
                "depart_time": _safe_get(t, ["depart_time"]),
                "arrive_time": _safe_get(t, ["arrive_time"]),
                "duration_min": _coerce_float(_safe_get(t, ["duration_min", "duration"])),
                "seats": _safe_get(t, ["seats", "seat_types"]),
            })
    else:
        trains.append({"raw": data})
    return trains


def _norm_routes(data: Any) -> List[Dict[str, Any]]:
    routes: List[Dict[str, Any]] = []
    if not data: return routes
    seq = data if isinstance(data, list) else data.get("routes") if isinstance(data, dict) else None
    if isinstance(seq, list):
        for r in seq:
            if not isinstance(r, dict): continue
            routes.append({
                "mode": _safe_get(r, ["mode", "type"]),
                "summary": _safe_get(r, ["summary"]),
                "duration_min": _coerce_float(_safe_get(r, ["duration_min", "duration"])),
                "distance_km": _coerce_float(_safe_get(r, ["distance_km", "distance"])),
                "steps": _safe_get(r, ["steps"]),
            })
    else:
        routes.append({"raw": data})
    return routes


def _norm_attractions(data: Any) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    if not data: return out
    seq = data if isinstance(data, list) else data.get("attractions") if isinstance(data, dict) else None
    if isinstance(seq, list):
        for a in seq:
            if isinstance(a, dict):
                out.append({
                    "name": _safe_get(a, ["name", "title"]),
                    "rating": _coerce_float(_safe_get(a, ["rating", "score"])) or 0,
                    "tags": _safe_get(a, ["tags", "category"]) or [],
                    "area": _safe_get(a, ["area", "district"]),
                    "lat": _coerce_float(_safe_get(a, ["lat", "latitude"])),
                    "lng": _coerce_float(_safe_get(a, ["lng", "longitude"])),
                    "open_hours": _safe_get(a, ["open_hours", "hours"]),
                    "address": _safe_get(a, ["address", "addr"]),
                    "ticket_from": _coerce_float(_safe_get(a, ["ticket_from", "price_from"])) or 0,
                })
            else:
                out.append({"name": str(a)})
    else:
        out.append({"raw": data})
    return out


# -------------------- 抽取与对齐） --------------------
TOOL_DIGEST_INSTRUCT = (
    "你是数据提取器。只输出严格 JSON，按下列 Schema 从 MCP 原始输出与 web_search 文本中抽取候选：\n"
    "{\n"
    '  "flights": [ {"flight_no":"","carrier":"","depart_airport":"","depart_time_local":"","arrive_airport":"","arrive_time_local":"","duration_min":0,"stops":0,"price":0} ],\n'
    '  "trains":  [ {"train_no":"","from":"","to":"","depart_time":"","arrive_time":"","duration_min":0,"seats":""} ],\n'
    '  "routes":  [ {"mode":"car|taxi|bus|ferry|walk","summary":"","duration_min":0,"distance_km":0} ],\n'
    '  "attractions": [ {"name":"","rating":0,"tags":[""],"area":"","open_hours":"","address":"","lat":null,"lng":null,"ticket_from":0} ],\n'
    '  "dining": [ {"name":"","cuisine":"","signature_dishes":[""],"price_per_person":0,"area":"","address":"","open_hours":""} ],\n'
    '  "hotels": [ {"name":"","address":"","area":"","price_min":0,"price_max":0,"phone":""} ],\n'
    '  "weather": [ {"date":"YYYY-MM-DD","high_c":0,"low_c":0,"text":"","precip_prob":0} ],\n'
    '  "notes": ""\n'
    "}\n"
    "规则：\n"
    "1) 尽可能的基于提供的 MCP 原始数据与 web_search 文本抽取，能从文本推断出数值/地址时请写入，这里需要写入准确值，例如：火车票或者机票的价格；如果无法获取调用 web_search；\n"
    "2) attractions ≤ 20，dining ≤ 20，hotels ≤ 10；\n"
    "3) 不要编造；只输出一个 JSON 对象，不要多余文本。"
)


async def build_tool_digest(raw_items: List[Dict[str, Any]], pre_norm: Dict[str, Any]) -> Dict[str, Any]:
    draft = {
        "flights": pre_norm.get("flights", []),
        "trains": pre_norm.get("trains", []),
        "routes": pre_norm.get("routes", []),
        "attractions": pre_norm.get("attractions", []),
        "dining": [], "hotels": [],
        "weather": pre_norm.get("weather", []),
        "notes": ""
    }
    raw_payload = [{"intent": it.get("intent"), "query": it.get("query"), "data": it.get("data")} for it in raw_items]
    try:
        print("正在构建工具摘要...")
        rsp = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": TOOL_DIGEST_INSTRUCT},
                {"role": "user", "content": json.dumps({"raw": raw_payload, "draft": draft}, ensure_ascii=False)},
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        out = json.loads(rsp.choices[0].message.content or "{}")
        out.setdefault("dining", [])
        out.setdefault("hotels", [])
        print("工具摘要构建完成")
        return out
    except Exception:
        return draft


# -------------------- 起止地/日期工具 --------------------
def _slug(s: str) -> str:
    s = (s or "").strip()
    s = re.sub(r"\s+", "_", s)
    s = re.sub(r"[^\w.-]+", "", s)
    return s.lower()


def _infer_origin_destination(items: List[Dict[str, Any]], prefs: Dict[str, Any]) -> Tuple[
    Optional[str], Optional[str]]:
    origin = prefs.get("origin") or prefs.get("from") or prefs.get("city_from")
    dest = prefs.get("destination") or prefs.get("city") or prefs.get("to")
    for it in items:
        q = it.get("query", {})
        if it.get("intent") in ("flight_info", "flight_forecast"):
            origin = origin or q.get("departure")
            dest = dest or q.get("arrival")
        if it.get("intent") == "train_info":
            origin = origin or q.get("from_city")
            dest = dest or q.get("to_city")
        if it.get("intent") in ("city_top_attractions", "nearby_attractions") and not dest:
            dest = q.get("city") or q.get("location") or q.get("destination") or dest
    return origin, dest

# 这个地方有问题
def _coerce_date(s: Optional[str]) -> Optional[date]:
    """
    尝试将字符串日期转换为日期格式，若失败则返回None而不是退出程序。
    """
    if not s:
        return None
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except ValueError:
        print(f"警告: 日期格式错误 '{s}'，应使用 YYYY-MM-DD 格式")
        return None


def _ensure_dates(prefs: Optional[Dict[str, Any]]) -> Tuple[date, date]:
    """
    确保start_date和end_date存在并且格式正确，如果缺失或格式错误则使用默认值。
    """
    # 确保 prefs 是一个字典
    prefs_dict = prefs or {}

    # 尝试获取并解析日期
    sd_str = prefs_dict.get("start_date")
    ed_str = prefs_dict.get("end_date")

    print(
        f"调试: 从prefs获取的日期 - start_date: {sd_str} (类型: {type(sd_str)}), end_date: {ed_str} (类型: {type(ed_str)})")

    sd = _coerce_date(sd_str)
    ed = _coerce_date(ed_str)

    print(f"调试: 解析后的日期 - start_date: {sd}, end_date: {ed}")

    # 如果start_date缺失或格式错误，则使用当前日期
    if not sd:
        today = date.today()
        sd = today
        print(f"start_date未提供或格式错误，使用当前日期 {sd}")

    # 如果end_date缺失或格式错误，则使用start_date后的两天
    if not ed:
        ed = sd + timedelta(days=2)
        print(f"end_date未提供或格式错误，使用默认日期 {ed}")

    # 确保end_date大于start_date
    if ed < sd:
        sd, ed = ed, sd
        print(f"交换日期顺序: start_date={sd}, end_date={ed}")

    return sd, ed


# -------------------- 规划格式 --------------------
STRICT_SCHEMA_JSON_TEXT = (
    "{\n"
    '  "trip_id": "<string>",\n'
    '  "trip_name": "<string>",\n'
    '  "destination": "<string>",\n'
    '  "start_date": "YYYY-MM-DD",\n'
    '  "end_date": "YYYY-MM-DD",\n'
    '  "days": [\n'
    "    {\n"
    '      "date": "YYYY-MM-DD",\n'
    '      "day_of_week": "星期一|星期二|星期三|星期四|星期五|星期六|星期日",\n'
    '      "day_index": <int 从1开始>,\n'
    '      "total_cost": <int>,\n'
    '      "activities": [\n'
    "        {\n"
    '          "id": "<string>",\n'
    '          "type": "transportation|activity",\n'
    '          "mode": "plane|train|car|taxi|bus|ferry|null",\n'
    '          "start_time": "HH:MM",\n'
    '          "end_time": "HH:MM",\n'
    '          "origin": {"name":"<string>","address":"<string|null>","coordinates":{"latitude":<float|null>,"longitude":<float|null>}} | null,\n'
    '          "destination": {"name":"<string>","address":"<string|null>","coordinates":{"latitude":<float|null>,"longitude":<float|null>}} | null,\n'
    '          "title": "<string|null>",\n'
    '          "location": {"name":"<string>","address":"<string|null>","coordinates":{"latitude":<float|null>,"longitude":<float|null>}} | null,\n'
    '          "description": "<string>",\n'
    '          "notes": "<string|null>",\n'
    '          "cost": <int>,\n'
    '          "ticket_info": {"price":<int>,"url":null|"https://...","description":"<string>"} | null,\n'
    '  "recommended_products": [ {"name":"<string>","price":<int>,"description":"<string>","url":null|"https://..."} ]\n'
    "        }\n"
    "      ]\n"
    "    }\n"
    "  ]\n"
    "}\n"
)

# -------------------- 规划提示（严禁占位 + 必填描述/备注/地址） --------------------
PLANNER_INSTRUCT = dedent(f"""\
你是旅行行程设计助手。只输出严格 JSON，Schema 如下：
{STRICT_SCHEMA_JSON_TEXT}
硬性规则：
A) 每天 3–5 个活动（含交通/景点/用餐/酒店），按 start_time 升序；禁止“自由活动”“待定”“闲逛”“城市漫步”“本地特色餐厅”“本地口碑酒店”“补齐”等模糊词；
B) total_cost = 当天 activities.cost 求和（整数）；
C) 长途段优先用 digest.flights/trains；城市内段可用 digest.routes 或 taxi/bus；
D) 景点/餐厅/酒店需给出**具体名称**（尽可能从 digest 或 web_search 文本中选取）；
E) 用餐：明确餐厅名、菜系/招牌菜、人均；酒店：明确酒店名与价位区间；
F) 若天气显示降雨/大风，则减少户外并加入室内活动；
G) 所有非交通类活动必须提供非空 description（≥40字中文）与非空 notes（用简短句/要点，≥2条）；description 要基于已提供的数据与 web_search 文本的事实；
H) 所有景点与餐饮类活动必须提供精确位置：location.address（街道门牌或商场楼层）与 coordinates.latitude/longitude（若确实未知，填 null，但尽量给出）；
I) 输出只能是一个 JSON 对象，不能有任何额外文本。
""")

# -------------------- 富化提示词 --------------------
ENRICH_INSTRUCT = dedent("""\
你是行程富化助手。根据提供的 evidence（搜索结果/官方信息），
仅输出严格 JSON：{"updates": [{"id":"","description":"","notes":"","location":{"address":"","coordinates":{"latitude":null,"longitude":null}}}] }。
规则：
1) 仅针对给定 id 的活动回填/覆盖字段（不要产生新活动）。
2) description：基于证据，用 60–150 中文字概括亮点/看点/开放时间/门票/人均/适合人群/交通要点（视场景而定）。
3) notes：输出 2–4 条要点（用分号或换行分隔），写预约/高峰排队/安检/穿衣/天气应对/交通换乘建议等实用提醒。
4) 从搜索文本中抽取地址（尽量含门牌/楼层）。坐标未知可为 null。
5) 保持 JSON 严格；不要输出多余文本。
""")

# -------------------- 主流程 --------------------
def _daterange_inclusive(d1: date, d2: date) -> List[date]:
    if d2 < d1: d1, d2 = d2, d1
    return [d1 + timedelta(days=i) for i in range((d2 - d1).days + 1)]


def _has_placeholderish(text: Optional[str]) -> bool:
    if not text: return True
    bad = ["自由活动", "待定", "闲逛", "城市漫步", "本地特色餐厅", "本地口碑酒店", "行程安排待定", "自动补齐", "占位"]
    return any(k in text for k in bad)


def _plan_quality_issues(plan: Dict[str, Any]) -> List[str]:
    issues = []
    if not _validate_output_format(plan):
        issues.append("JSON Schema 不完整或字段缺失")
        return issues
    for d in plan.get("days", []):
        acts = d.get("activities", [])
        if len(acts) < 3: issues.append(f"{d.get('date')} 活动少于3个")
        if len(acts) > 5: issues.append(f"{d.get('date')} 活动超过5个")
        for a in acts:
            title = a.get("title") or ""
            loc = a.get("location") or {}
            name = (loc or {}).get("name") or title
            # 1) 占位/模糊名
            if _has_placeholderish(title) or _has_placeholderish(name):
                issues.append(f"{d.get('date')} 存在占位或模糊名称：{title or name}")
            # 2) 非交通类：描述与备注必须充分
            if (a.get("type") != "transportation"):
                desc = (a.get("description") or "").strip()
                notes = (a.get("notes") or "").strip()
                if len(desc) < 20:
                    issues.append(f"{d.get('date')} 活动[{title}] description 过短或缺失")
                if len(notes) < 6:
                    issues.append(f"{d.get('date')} 活动[{title}] notes 过短或缺失")
                # 3) 景点/餐饮：需要精确地址或坐标
                need_precise = any(k in title for k in
                                   ["景区", "公园", "博物馆", "纪念馆", "展览", "美术馆", "寺", "殿", "宫", "塔",
                                    "餐厅", "小吃", "馆", "酒家", "火锅", "烤肉", "咖啡", "面包", "甜品"]) or (
                                           loc and not a.get("type") == "transportation")
                addr = (loc.get("address") or "").strip() if isinstance(loc, dict) else ""
                coords = (loc.get("coordinates") or {}) if isinstance(loc, dict) else {}
                lat = coords.get("latitude")
                lng = coords.get("longitude")
                if need_precise and (not addr or lat is None or lng is None):
                    issues.append(f"{d.get('date')} 活动[{title}] 缺少精确地址或坐标")
            # 4) 成本缺失
            if a.get("cost") is None:
                issues.append(f"{d.get('date')} 活动[{title}] 缺少 cost")
    return issues


async def _llm_make_plan(user_text: str, digest: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    msgs = [
        {"role": "system", "content": PLANNER_INSTRUCT},
        {"role": "user", "content": f"用户原始需求：{user_text}"},
        {"role": "user", "content": "工具摘要（digest）：\n" + json.dumps(digest, ensure_ascii=False)},
        {"role": "user", "content": "用户偏好与上下文：\n" + json.dumps(context, ensure_ascii=False)},
    ]
    try:
        print("正在生成行程规划...")
        rsp = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=msgs,
            temperature=0.25,
            response_format={"type": "json_object"},
        )
        return json.loads(rsp.choices[0].message.content or "{}")
    except Exception:
        # 兜底：不强制 JSON 模式再尝试一次
        rsp = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=msgs,
            temperature=0.25,
        )
        try:
            return json.loads(rsp.choices[0].message.content or "{}")
        except Exception:
            return {}

async def _llm_fix_plan(
    plan: Dict[str, Any],
    digest: Dict[str, Any],
    context: Dict[str, Any],
    issues: List[str],
) -> Dict[str, Any]:
    instruct = (
        "请修复以下问题并输出**完整 JSON**（Schema 与字段名保持一致，且每天 3–5 个活动，禁止占位词，具体名称）：\n- "
        + "\n- ".join(issues)
    )
    msgs = [
        {"role": "system", "content": PLANNER_INSTRUCT},
        {"role": "user", "content": "当前草案：\n" + json.dumps(plan, ensure_ascii=False)},
        {"role": "user", "content": "工具摘要（digest）：\n" + json.dumps(digest, ensure_ascii=False)},
        {"role": "user", "content": "用户偏好与上下文：\n" + json.dumps(context, ensure_ascii=False)},
        {"role": "user", "content": instruct},
    ]
    try:
        print("正在修复行程规划问题...")
        rsp = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=msgs,
            temperature=0.25,
            response_format={"type": "json_object"},
        )
        return json.loads(rsp.choices[0].message.content or "{}")
    except Exception:
        # 兜底：不强制 JSON 模式再尝试
        rsp = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=msgs,
            temperature=0.25,
        )
        try:
            return json.loads(rsp.choices[0].message.content or "{}")
        except Exception:
            return plan


async def _iterative_refine_plan(plan: Dict[str, Any], digest: Dict[str, Any], context: Dict[str, Any],
                                 rounds: int = 3) -> Dict[str, Any]:
    for i in range(max(1, rounds)):
        issues = _plan_quality_issues(plan)
        if not issues:
            print(f"行程规划质量检查通过 (第{i + 1}轮)")
            return plan
        print(f"发现 {len(issues)} 个质量问题，进行第 {i + 1} 轮修复")
        plan = await _llm_fix_plan(plan, digest, context, issues)
    return plan


def _post_sanitize(plan: Dict[str, Any]) -> Dict[str, Any]:
    """只做排序与最多5个活动裁剪；不增加占位活动，不限制天数。"""
    if not isinstance(plan.get("days"), list):
        return plan
    for d in plan["days"]:
        acts = d.get("activities", [])
        if not isinstance(acts, list):
            acts = []
        # 时间排序
        acts = sorted(acts, key=lambda x: x.get("start_time", "23:59"))

        # 最多5个：优先保留交通、餐饮、酒店
        def _prio(a):
            title = (a.get("title") or "")
            if a.get("type") == "transportation": return 0
            if any(k in title for k in ["酒店", "入住", "返回酒店"]): return 1
            if any(k in title for k in ["餐", "早餐", "午餐", "晚餐", "餐厅", "美食"]): return 2
            return 3

        if len(acts) > 5:
            acts = sorted(acts, key=lambda x: (_prio(x), x.get("start_time", "23:59")))[:5]
        # 重新求和
        total = 0
        for a in acts:
            try:
                total += int(a.get("cost") or 0)
            except Exception:
                pass
        d["activities"] = acts
        d["total_cost"] = int(total)
    return plan


# -------------------- 富化：多轮搜索 + 精确地址回填 --------------------
def _collect_enrich_targets(plan: Dict[str, Any]) -> List[Dict[str, Any]]:
    """找出需要富化的位置"""
    targets = []
    for d in plan.get("days", []):
        for a in d.get("activities", []):
            if a.get("type") == "transportation":
                continue
            title = (a.get("title") or "").strip()
            loc = a.get("location") or {}
            addr = (loc.get("address") or "").strip() if isinstance(loc, dict) else ""
            coords = loc.get("coordinates") or {}
            lat = coords.get("latitude")
            lng = coords.get("longitude")
            desc_missing = len((a.get("description") or "").strip()) < 20
            notes_missing = len((a.get("notes") or "").strip()) < 6
            need_precise = any(k in title for k in
                               ["景区", "公园", "博物馆", "纪念馆", "展览", "美术馆", "寺", "殿", "宫", "塔", "餐厅",
                                "小吃", "馆", "酒家", "火锅", "烤肉", "咖啡", "面包", "甜品"]) or (loc and True)
            addr_missing = (not addr) or (lat is None or lng is None)
            if desc_missing or notes_missing or (need_precise and addr_missing):
                targets.append({
                    "id": a.get("id"),
                    "title": title,
                    "location_name": (loc.get("name") if isinstance(loc, dict) else "") or title,
                })
    return targets


def _apply_enrichment_updates(plan: Dict[str, Any], updates: List[Dict[str, Any]]) -> Dict[str, Any]:
    """根据模型输出的更新回填到 plan"""
    if not isinstance(updates, list): return plan
    upd_map = {u.get("id"): u for u in updates if isinstance(u, dict) and u.get("id")}
    if not upd_map: return plan
    for d in plan.get("days", []):
        for i, a in enumerate(d.get("activities", [])):
            uid = a.get("id")
            if not uid or uid not in upd_map:
                continue
            u = upd_map[uid]
            # 回填描述/备注
            if u.get("description"): a["description"] = u["description"]
            if u.get("notes"): a["notes"] = u["notes"]
            # 回填位置
            loc = a.get("location") or {"name": a.get("title") or ""}
            uloc = u.get("location") or {}
            if isinstance(uloc, dict):
                if uloc.get("address"):
                    loc["address"] = uloc["address"]
                ucoords = uloc.get("coordinates") or {}
                if isinstance(ucoords, dict):
                    lat = ucoords.get("latitude")
                    lng = ucoords.get("longitude")
                    # 只在存在时覆盖
                    if lat is not None or lng is not None:
                        loc["coordinates"] = {
                            "latitude": lat if lat is not None else (loc.get("coordinates") or {}).get("latitude"),
                            "longitude": lng if lng is not None else (loc.get("coordinates") or {}).get("longitude"),
                        }
            a["location"] = loc
    return plan


async def enrich_plan_with_mcp(plan: Dict[str, Any], context: Dict[str, Any], rounds: int = 2) -> Dict[str, Any]:
    """
    多轮富化：
      - 对缺描述/缺备注/缺地址坐标的活动
      - 逐个调用 search_web 获取文本证据
      - 交给 LLM 生成 updates 回填
    """
    dest = context.get("destination") or ""
    for _ in range(max(1, rounds)):
        targets = _collect_enrich_targets(plan)
        if not targets:
            return plan
        evidence = {}
        # 逐项取证
        for t in targets:
            q = f"{t['location_name']} {dest} 开放时间 门票 预约 地址 招牌菜 人均 停车 交通 电话 官网"
            ev_text = ""
            # 搜索证据
            try:
                tr = await call_mcp_tool(MCP_SERVER_MAP.get("search_web"), "search_web", query=q, num_results=6)
                if tr.get("status") == "success":
                    ev_text = tr.get("result") or ""
                else:
                    ev_text = tr.get("result") or ""
            except Exception as e:
                ev_text = f"[search_web error] {e}"
            # 使用web_search搜索具体位置的结果
            evidence[t["id"]] = {"search": ev_text, "query": q}

        # 给 LLM 返回 updates
        try:
            rsp = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": ENRICH_INSTRUCT},
                    {"role": "user", "content": json.dumps({
                        "destination": dest,
                        "activities": targets,
                        "evidence": evidence
                    }, ensure_ascii=False)},
                ],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            j = json.loads(rsp.choices[0].message.content or "{}")
            updates = j.get("updates", [])
        except Exception:
            updates = []

        plan = _apply_enrichment_updates(plan, updates)
    return plan

# -------------------- 主函数 --------------------
async def run_trip_plan(user_text: str, prefs: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    prefs = dict(prefs or {})

    # 聚合 MCP
    routed = await gather_with_mcp(user_text, prefs)
    items = routed.get("results", [])

    # Python 侧初步候选
    print("正在处理 MCP 结果...")
    flights: List[Dict[str, Any]] = []
    trains: List[Dict[str, Any]] = []
    attractions: List[Dict[str, Any]] = []
    weather: List[Dict[str, Any]] = []
    web_search_payload: Any = None
    for it in items:
        data = it.get("data")
        if it.get("intent") == "web_search": web_search_payload = data
        if not data: continue
        if it["intent"] in ("flight_info", "flight_forecast"):
            flights.extend(_norm_flights(data))
        elif it["intent"] == "train_info":
            trains.extend(_norm_trains(data))
        elif it["intent"] in ("city_top_attractions", "nearby_attractions"):
            attractions = _norm_attractions(data) or attractions
        elif it["intent"] == "weather_forecast":
            weather = _norm_weather_forecast(data) or weather

    pre_norm = {
        "flights": flights[:12], "trains": trains[:12],
        "attractions": attractions[:20], "weather": weather[:7]  # 天气最多7天
    }

    # 模型抽取（）
    digest = await build_tool_digest(items, pre_norm)

    # 组织 Planner 上下文
    origin, destination = _infer_origin_destination(items, prefs)
    start_date, end_date = _ensure_dates(prefs)

    # 计算天数
    days_count = (end_date - start_date).days + 1

    context = {
        "origin": origin, "destination": destination,
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "days_count": days_count,  # 添加天数信息
        "themes": prefs.get("themes") or ["自然", "人文", "打卡"],
        "people_count": prefs.get("people_count") or 2,
        "budget_level": prefs.get("budget_level") or "中等",
        "search_results": {"web_search": web_search_payload},
    }

    print(f"行程信息: {origin} -> {destination}, {start_date} 至 {end_date} ({days_count}天)")

    # 首次规划
    plan = await _llm_make_plan(user_text, digest, context)

    # 基本字段补齐
    ori_slug = _slug(origin or "origin");
    dst_slug = _slug(destination or "destination")
    plan["trip_id"] = plan.get(
        "trip_id") or f"user_trip_{ori_slug}_{dst_slug}_{start_date.strftime('%Y%m%d')}_{end_date.strftime('%Y%m%d')}"
    plan["trip_name"] = plan.get(
        "trip_name") or f"{(origin or '出发地')}到{(destination or '目的地')}{days_count}日深度游（{'·'.join(context['themes'])}）"
    plan["destination"] = plan.get("destination") or (destination or "目的地")
    plan["start_date"] = plan.get("start_date") or start_date.strftime("%Y-%m-%d")
    plan["end_date"] = plan.get("end_date") or end_date.strftime("%Y-%m-%d")

    want_dates = [d.strftime("%Y-%m-%d") for d in _daterange_inclusive(start_date, end_date)]
    got_days = plan.get("days") if isinstance(plan.get("days"), list) else []
    day_map = {(d.get("date") or ""): d for d in got_days if isinstance(d, dict) and d.get("date")}
    fixed_days: List[Dict[str, Any]] = []
    for idx, dstr in enumerate(want_dates, start=1):
        day = day_map.get(dstr) or {"date": dstr, "activities": []}
        try:
            d_obj = datetime.strptime(dstr, "%Y-%m-%d").date()
            day["day_of_week"] = day.get("day_of_week") or \
                                 ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"][d_obj.weekday()]
        except Exception:
            day["day_of_week"] = day.get("day_of_week") or "星期一"
        try:
            day["day_index"] = int(day.get("day_index", idx))
        except Exception:
            day["day_index"] = idx
        acts = day.get("activities") if isinstance(day.get("activities"), list) else []
        norm_acts: List[Dict[str, Any]] = []
        for j, a in enumerate(acts, start=1):
            if not isinstance(a, dict): continue
            a.setdefault("id", f"act_{idx}_{j}")
            a.setdefault("type", "activity")
            a.setdefault("mode", None)
            a.setdefault("start_time", "09:00")
            a.setdefault("end_time", "10:00")
            a.setdefault("origin", None)
            a.setdefault("destination", None)
            a.setdefault("title", a.get("title") or "")
            a.setdefault("location", a.get("location") or None)
            a.setdefault("description", a.get("description") or "")
            a.setdefault("notes", a.get("notes") or None)
            try:
                a["cost"] = max(0, int(a.get("cost") or 0))
            except Exception:
                a["cost"] = 0
            a.setdefault("ticket_info", a.get("ticket_info") or None)
            a.setdefault("recommended_products", a.get("recommended_products") or [])
            norm_acts.append(a)
        total = 0
        for a in norm_acts:
            try:
                total += int(a.get("cost") or 0)
            except Exception:
                pass
        day["activities"] = norm_acts
        day["total_cost"] = int(total)
        fixed_days.append(day)
    plan["days"] = fixed_days

    # 多轮 LLM 质量修复
    plan = await _iterative_refine_plan(plan, digest, context, rounds=3)

    # 保存基础版本
    base_plan = json.loads(json.dumps(plan))  # 深拷贝
    print("基础版本行程规划完成")

    # 输出基础版本
    print("\n" + "=" * 50)
    print("基础版本行程规划:")
    print("=" * 50)
    print(json.dumps(base_plan, ensure_ascii=False, indent=2))

    # 多轮搜索富化
    enriched_plan = await enrich_plan_with_mcp(plan, context, rounds=2)

    # 本地仅排序与裁剪
    base_plan = _post_sanitize(base_plan)
    enriched_plan = _post_sanitize(enriched_plan)

    # 返回两个版本
    return {
        "base_version": base_plan,
        "enriched_version": enriched_plan
    }

# -------------------- 校验工具 --------------------
def _validate_output_format(plan: Dict[str, Any]) -> bool:
    required_fields = ["trip_id", "trip_name", "destination", "start_date", "end_date", "days"]
    if not all(field in plan for field in required_fields): return False
    if not isinstance(plan.get("days"), list): return False
    for day in plan["days"]:
        if not all(
            field in day for field in ["date", "day_of_week", "day_index", "total_cost", "activities"]): return False
        if not isinstance(day.get("activities"), list): return False
        for activity in day["activities"]:
            needed = ["id", "type", "mode", "start_time", "end_time", "origin", "destination",
                      "title", "location", "description", "notes", "cost", "ticket_info", "recommended_products"]
            if not all(field in activity for field in needed): return False
    return True


# -------------------- 分类器 JSON 解析 --------------------
def _parse_tasks(text: str) -> Optional[List[Dict[str, Any]]]:
    try:
        obj = json.loads(text)
        if not isinstance(obj, dict): return None
        tasks = obj.get("tasks")
        if tasks is None or not isinstance(tasks, list): return None
        normed: List[Dict[str, Any]] = []
        for t in tasks:
            if not isinstance(t, dict): continue
            intent = t.get("intent")
            query = t.get("query")
            if intent not in INTENT_ENUM: continue
            if not isinstance(query, dict): continue
            normed.append({"intent": intent, "query": query})
        return normed
    except Exception:
        return None


# -------------------- 命令行输入代码 --------------------
def _read_query_from_stdin(prompt_text: str) -> str:
    try:
        return input(prompt_text).strip()
    except EOFError:
        return ""

if __name__ == "__main__":
    if platform.system().lower().startswith("win"):
        try:
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())  # type: ignore
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="MCP Trip Planner | 强制 web_search｜摘要+多轮规划修复+多轮富化（无占位）")
    parser.add_argument("query", nargs="*", help="自然语言查询")
    parser.add_argument(
        "--prefs",
        type=str,
        default=None,
        help=("偏好/上下文 JSON（示例：{\"origin\":\"上海\",\"destination\":\"哈尔滨\",\"start_date\":\"2025-09-12\",\"end_date\":\"2025-09-14\",\"themes\":[\"自然\",\"人文\",\"打卡\"],\"people_count\":2,\"budget_level\":\"中等\"}）")
    )
    args = parser.parse_args()

    user_text = " ".join(args.query).strip() if args.query else _read_query_from_stdin("请输入查询内容：")
    if not user_text:
        print("未输入内容，已退出。"); raise SystemExit(0)

    prefs: Optional[Dict[str, Any]] = None
    if args.prefs:
        try:
            prefs = json.loads(args.prefs)
            if not isinstance(prefs, dict):
                print("[WARN] --prefs 必须是 JSON 对象，已忽略。"); prefs = None
        except Exception as e:
            print(f"[WARN] --prefs 解析失败：{e}，已忽略。")

    print("[INFO] 统一行程模式 输入：", user_text)
    plan = asyncio.run(run_trip_plan(user_text, prefs))
    print(json.dumps(plan, ensure_ascii=False, indent=2))
