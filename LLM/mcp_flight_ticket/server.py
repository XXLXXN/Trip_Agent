from mcp.server.fastmcp import FastMCP
import httpx
import json
import time
from typing import Optional, Dict, Any, List, Tuple
from dotenv import load_dotenv
import os
import re

# === 初始化 ===
mcp = FastMCP("flight-mcp-server")
load_dotenv()

JUHE_API_URL = "https://apis.juhe.cn/flight/query"
JUHE_FLIGHT_API_KEY = os.getenv("JUHE_API_KEY")
HTTP_TIMEOUT = 15.0
CACHE_TTL_SEC = 300
MAX_FLIGHTS_PREVIEW = 5

# CITY_DB 结构说明：
# 中每个条目：
#  - city: 中文城市名
#  - city_code: 城市 IATA 三字码
#  - city_aliases: 识别城市用的别名（中文/常见写法/拼音）
#  - airports: 该城市下的机场列表，每个机场包含：
#      - name: 机场常用中文名
#      - code: 机场 IATA
#      - aliases: 识别机场用的别名（中文/常见写法）
CITY_DB: List[Dict[str, Any]] = [
    {
        "city": "北京",
        "city_code": "BJS",
        "city_aliases": ["北京", "北京市", "beijing"],
        "airports": [
            {"name": "北京首都", "code": "PEK", "aliases": ["首都", "北京首都", "首都机场"]},
            {"name": "北京大兴", "code": "PKX", "aliases": ["大兴", "北京大兴"]},
        ],
    },
    {
        "city": "上海",
        "city_code": "SHA",
        "city_aliases": ["上海", "上海市", "shanghai", "沪"],
        "airports": [
            {"name": "上海浦东", "code": "PVG", "aliases": ["浦东", "上海浦东"]},
            {"name": "上海虹桥", "code": "SHA", "aliases": ["虹桥", "上海虹桥"]},
        ],
    },
    {
        "city": "广州",
        "city_code": "CAN",
        "city_aliases": ["广州", "广州市", "guangzhou"],
        "airports": [
            {"name": "广州白云", "code": "CAN", "aliases": ["白云", "广州白云"]},
        ],
    },
    {
        "city": "深圳",
        "city_code": "SZX",
        "city_aliases": ["深圳", "深圳市", "shenzhen", "鹏城"],
        "airports": [
            {"name": "深圳宝安", "code": "SZX", "aliases": ["宝安", "深圳宝安"]},
        ],
    },
    {
        "city": "成都",
        "city_code": "CTU",
        "city_aliases": ["成都", "成都市", "chengdu"],
        "airports": [
            {"name": "成都双流", "code": "CTU", "aliases": ["双流", "成都双流"]},
            {"name": "成都天府", "code": "TFU", "aliases": ["天府", "成都天府"]},
        ],
    },
    {
        "city": "重庆",
        "city_code": "CKG",
        "city_aliases": ["重庆", "重庆市", "chongqing", "渝"],
        "airports": [
            {"name": "重庆江北", "code": "CKG", "aliases": ["江北", "重庆江北"]},
        ],
    },
    {
        "city": "杭州",
        "city_code": "HGH",
        "city_aliases": ["杭州", "杭州市", "hangzhou"],
        "airports": [
            {"name": "杭州萧山", "code": "HGH", "aliases": ["萧山", "杭州萧山"]},
        ],
    },
    {
        "city": "西安",
        "city_code": "SIA",
        "city_aliases": ["西安", "西安市", "xian", "xi'an"],
        "airports": [
            {"name": "西安咸阳", "code": "XIY", "aliases": ["咸阳", "西安咸阳"]},
        ],
    },
    {
        "city": "武汉",
        "city_code": "WUH",
        "city_aliases": ["武汉", "武汉市", "wuhan"],
        "airports": [
            {"name": "武汉天河", "code": "WUH", "aliases": ["天河", "武汉天河"]},
        ],
    },
    {
        "city": "昆明",
        "city_code": "KMG",
        "city_aliases": ["昆明", "昆明市", "kunming"],
        "airports": [
            {"name": "昆明长水", "code": "KMG", "aliases": ["长水", "昆明长水"]},
        ],
    },
    {
        "city": "青岛",
        "city_code": "TAO",
        "city_aliases": ["青岛", "青岛市", "qingdao"],
        "airports": [
            {"name": "青岛胶东", "code": "TAO", "aliases": ["胶东", "青岛胶东"]},
        ],
    },
    {
        "city": "厦门",
        "city_code": "XMN",
        "city_aliases": ["厦门", "厦门市", "xiamen"],
        "airports": [
            {"name": "厦门高崎", "code": "XMN", "aliases": ["高崎", "厦门高崎"]},
        ],
    },
    {
        "city": "郑州",
        "city_code": "CGO",
        "city_aliases": ["郑州", "郑州市", "zhengzhou"],
        "airports": [
            {"name": "郑州新郑", "code": "CGO", "aliases": ["新郑", "郑州新郑"]},
        ],
    },
    {
        "city": "长沙",
        "city_code": "CSX",
        "city_aliases": ["长沙", "长沙市", "changsha"],
        "airports": [
            {"name": "长沙黄花", "code": "CSX", "aliases": ["黄花", "长沙黄花"]},
        ],
    },
    {
        "city": "南京",
        "city_code": "NKG",
        "city_aliases": ["南京", "南京市", "nanjing"],
        "airports": [
            {"name": "南京禄口", "code": "NKG", "aliases": ["禄口", "南京禄口"]},
        ],
    },
    {
        "city": "天津",
        "city_code": "TSN",
        "city_aliases": ["天津", "天津市", "tianjin"],
        "airports": [
            {"name": "天津滨海", "code": "TSN", "aliases": ["滨海", "天津滨海"]},
        ],
    },
    {
        "city": "大连",
        "city_code": "DLC",
        "city_aliases": ["大连", "大连市", "dalian"],
        "airports": [
            {"name": "大连周水子", "code": "DLC", "aliases": ["周水子", "大连周水子"]},
        ],
    },
    {
        "city": "沈阳",
        "city_code": "SHE",
        "city_aliases": ["沈阳", "沈阳市", "shenyang"],
        "airports": [
            {"name": "沈阳桃仙", "code": "SHE", "aliases": ["桃仙", "沈阳桃仙"]},
        ],
    },
    {
        "city": "哈尔滨",
        "city_code": "HRB",
        "city_aliases": ["哈尔滨", "哈市", "harbin"],
        "airports": [
            {"name": "哈尔滨太平", "code": "HRB", "aliases": ["太平", "哈尔滨太平"]},
        ],
    },
    {
        "city": "长春",
        "city_code": "CGQ",
        "city_aliases": ["长春", "长春市", "changchun"],
        "airports": [
            {"name": "长春龙嘉", "code": "CGQ", "aliases": ["龙嘉", "长春龙嘉"]},
        ],
    },
    {
        "city": "石家庄",
        "city_code": "SJW",
        "city_aliases": ["石家庄", "石市", "shijiazhuang"],
        "airports": [
            {"name": "石家庄正定", "code": "SJW", "aliases": ["正定", "正定机场"]},
        ],
    },
    {
        "city": "太原",
        "city_code": "TYN",
        "city_aliases": ["太原", "并州", "taiyuan"],
        "airports": [
            {"name": "太原武宿", "code": "TYN", "aliases": ["武宿", "太原武宿"]},
        ],
    },
    {
        "city": "呼和浩特",
        "city_code": "HET",
        "city_aliases": ["呼和浩特", "呼市", "huhehaote", "huhehot", "hohhot"],
        "airports": [
            {"name": "呼和浩特白塔", "code": "HET", "aliases": ["白塔"]},
        ],
    },
    {
        "city": "银川",
        "city_code": "INC",
        "city_aliases": ["银川", "yinchuan"],
        "airports": [
            {"name": "银川河东", "code": "INC", "aliases": ["河东", "银川河东"]},
        ],
    },
    {
        "city": "兰州",
        "city_code": "LHW",
        "city_aliases": ["兰州", "lanzhou"],
        "airports": [
            {"name": "兰州中川", "code": "LHW", "aliases": ["中川", "兰州中川"]},
        ],
    },
    {
        "city": "西宁",
        "city_code": "XNN",
        "city_aliases": ["西宁", "xining"],
        "airports": [
            {"name": "西宁曹家堡", "code": "XNN", "aliases": ["曹家堡"]},
        ],
    },
    {
        "city": "乌鲁木齐",
        "city_code": "URC",
        "city_aliases": ["乌鲁木齐", "wulumuqi"],
        "airports": [
            {"name": "乌鲁木齐地窝堡", "code": "URC", "aliases": ["地窝堡"]},
        ],
    },
    {
        "city": "拉萨",
        "city_code": "LXA",
        "city_aliases": ["拉萨", "lasa"],
        "airports": [
            {"name": "拉萨贡嘎", "code": "LXA", "aliases": ["贡嘎"]},
        ],
    },
    {
        "city": "南宁",
        "city_code": "NNG",
        "city_aliases": ["南宁", "nanning"],
        "airports": [
            {"name": "南宁吴圩", "code": "NNG", "aliases": ["吴圩"]},
        ],
    },
    {
        "city": "桂林",
        "city_code": "KWL",
        "city_aliases": ["桂林", "guilin"],
        "airports": [
            {"name": "桂林两江", "code": "KWL", "aliases": ["两江"]},
        ],
    },
    {
        "city": "海口",
        "city_code": "HAK",
        "city_aliases": ["海口", "haikou"],
        "airports": [
            {"name": "海口美兰", "code": "HAK", "aliases": ["美兰"]},
        ],
    },
    {
        "city": "三亚",
        "city_code": "SYX",
        "city_aliases": ["三亚", "sanya"],
        "airports": [
            {"name": "三亚凤凰", "code": "SYX", "aliases": ["凤凰"]},
        ],
    },
    {
        "city": "福州",
        "city_code": "FOC",
        "city_aliases": ["福州", "fuzhou"],
        "airports": [
            {"name": "福州长乐", "code": "FOC", "aliases": ["长乐"]},
        ],
    },
    {
        "city": "宁波",
        "city_code": "NGB",
        "city_aliases": ["宁波", "ningbo"],
        "airports": [
            {"name": "宁波栎社", "code": "NGB", "aliases": ["栎社", "lishi"]},
        ],
    },
    {
        "city": "温州",
        "city_code": "WNZ",
        "city_aliases": ["温州", "wenzhou"],
        "airports": [
            {"name": "温州龙湾", "code": "WNZ", "aliases": ["龙湾"]},
        ],
    },
    {
        "city": "合肥",
        "city_code": "HFE",
        "city_aliases": ["合肥", "hefei"],
        "airports": [
            {"name": "合肥新桥", "code": "HFE", "aliases": ["新桥"]},
        ],
    },
    {
        "city": "南昌",
        "city_code": "KHN",
        "city_aliases": ["南昌", "nanchang"],
        "airports": [
            {"name": "南昌昌北", "code": "KHN", "aliases": ["昌北"]},
        ],
    },
    {
        "city": "苏南",
        "city_code": "WUX",
        "city_aliases": ["无锡", "苏南", "wuxi", "苏州", "常州", "suzhou", "changzhou", "sunan"],
        "airports": [
            {"name": "苏南硕放", "code": "WUX", "aliases": ["苏南", "硕放", "苏南硕放"]},
        ],
    },
    {
        "city": "南通",
        "city_code": "NTG",
        "city_aliases": ["南通", "nantong"],
        "airports": [
            {"name": "南通兴东", "code": "NTG", "aliases": ["兴东"]},
        ],
    },
    {
        "city": "扬州/泰州",
        "city_code": "YTY",
        "city_aliases": ["扬州", "泰州", "yangzhou", "taizhou"],
        "airports": [
            {"name": "扬州泰州", "code": "YTY", "aliases": ["扬泰", "扬州泰州"]},
        ],
    },
    {
        "city": "盐城",
        "city_code": "YNZ",
        "city_aliases": ["盐城", "yancheng"],
        "airports": [
            {"name": "盐城南洋", "code": "YNZ", "aliases": ["南洋"]},
        ],
    },
    {
        "city": "连云港",
        "city_code": "LYG",
        "city_aliases": ["连云港", "lianyungang"],
        "airports": [
            {"name": "连云港花果山", "code": "LYG", "aliases": ["花果山"]},
        ],
    },
    {
        "city": "香港",
        "city_code": "HKG",
        "city_aliases": ["香港", "hongkong"],
        "airports": [
            {"name": "香港国际", "code": "HKG", "aliases": ["赤鱲角"]},
        ],
    },
    {
        "city": "澳门",
        "city_code": "MFM",
        "city_aliases": ["澳门", "macao"],
        "airports": [
            {"name": "澳门国际", "code": "MFM", "aliases": ["澳門"]},
        ],
    },
    {
        "city": "台北",
        "city_code": "TPE",
        "city_aliases": ["台北", "taipei"],
        "airports": [
            {"name": "桃园", "code": "TPE", "aliases": ["桃園", "桃园机场", "桃園機場", "桃机"]},
            {"name": "松山", "code": "TSA", "aliases": ["台北松山"]},
        ],
    },
    {
        "city": "高雄",
        "city_code": "KHH",
        "city_aliases": ["高雄", "kaohsiung", "gaoxiong"],
        "airports": [
            {"name": "高雄小港", "code": "KHH", "aliases": ["小港"]},
        ],
    },
]

# 统一去尾缀
_SUFFIXES = ("国际机场", "国际機場", "机场", "市", "区", "县", "州", "地", "站")

def _compact(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", "", s)
    for suf in _SUFFIXES:
        if s.endswith(suf.lower()):
            s = s[: -len(suf)]
    return s

def _list_all_codes_for_text(text: str) -> Dict[str, Any]:
    """
    输入中文/拼音，返回：
    {
      "matched_city": "北京",
      "city_code": "BJS",
      "airports": [{"name":"北京首都","code":"PEK"}, {"name":"北京大兴","code":"PKX"}],
      "all_codes": ["BJS","PEK","PKX"],
      "matched_aliases": ["北京", "大兴"]
    }
    若未找到，返回 {"all_codes": [], "airports": []}
    """
    key = _compact(text)
    hit_city = None
    city_code = None
    airports: List[Dict[str, str]] = []
    matched_aliases: List[str] = []

    # 先精确命中，再做进行包含匹配
    def alias_hit(k: str, al: List[str]) -> Tuple[bool, Optional[str]]:
        for a in al:
            ak = _compact(a)
            if k == ak:
                return True, a
        for a in al:
            ak = _compact(a)
            if ak and ak in k:
                return True, a
        return False, None

    for city in CITY_DB:
        # 城市匹配
        ok, alias = alias_hit(key, city.get("city_aliases", []) + [city["city"]])
        city_ok = False
        if ok:
            hit_city = city["city"]
            city_code = city["city_code"]
            matched_aliases.append(alias or city["city"])
            city_ok = True

        # 机场匹配
        local_airports: List[Dict[str, str]] = []
        for ap in city.get("airports", []):
            ap_ok, ap_alias = alias_hit(key, ap.get("aliases", []) + [ap["name"], ap["code"]])
            if ap_ok:
                local_airports.append({"name": ap["name"], "code": ap["code"]})
                matched_aliases.append(ap_alias or ap["name"])

        if city_ok or local_airports:
            hit_city = hit_city or city["city"]
            city_code = city_code or city["city_code"]
            airports += local_airports

    seen = set()
    airports = [a for a in airports if not (a["code"] in seen or seen.add(a["code"]))]
    all_codes = []
    if city_code:
        all_codes.append(city_code)
    all_codes += [a["code"] for a in airports]
    all_codes = list(dict.fromkeys(all_codes))  # 去重并保序

    return {
        "matched_city": hit_city,
        "city_code": city_code,
        "airports": airports,
        "all_codes": all_codes,
        "matched_aliases": list(dict.fromkeys(matched_aliases)),
    }

def _best_single_code_from_text(text: str) -> Optional[str]:
    """
    挑选一个IATA 码用于请求：
    若命中某具体机场，优先返回该机场码；
    否则若命中城市：返回城市码。
    否则返回 None。
    """
    info = _list_all_codes_for_text(text)
    if info["airports"]:
        return info["airports"][0]["code"]
    if info["matched_city"]:
        return info["city_code"]
    return None

def _is_iata(code: str) -> bool:
    return bool(re.fullmatch(r"[A-Z]{3}", (code or "").upper()))

# ===================== 原有工具函数 =====================
def _normalize_airport(code_or_name: str) -> str:
    if not code_or_name:
        return ""
    s = code_or_name.strip()
    if _is_iata(s):
        return s.upper()
    best = _best_single_code_from_text(s)
    return best or ""


def _build_query_params(
    departure: str,
    arrival: str,
    departure_date: str,
    flight_no: str = "",
    max_segments: str = "1",
) -> Dict[str, str]:
    return {
        "key": JUHE_FLIGHT_API_KEY or "",
        "departure": _normalize_airport(departure),
        "arrival": _normalize_airport(arrival),
        "departureDate": (departure_date or "").strip(),
        "flightNo": (flight_no or "").strip(),
        "maxSegments": (max_segments or "1"),
    }

def _preview_text_from_result(api_data: dict) -> str:
    try:
        if api_data.get("error_code") != 0:
            reason = api_data.get("reason", "未知错误")
            return f"查询失败：{reason}（错误代码：{api_data.get('error_code')}）"

        result = api_data.get("result") or {}
        flights = result.get("data") or []
        if not flights:
            return "没有找到符合条件的航班信息"

        lines = [f"找到 {len(flights)} 个航班，预览前 {min(MAX_FLIGHTS_PREVIEW, len(flights))} 个：\n"]
        for i, f in enumerate(flights[:MAX_FLIGHTS_PREVIEW], 1):
            lines.append(
                f"{i}. 航班号: {f.get('flightNo','未知')} | 航司: {f.get('airline','未知')} | "
                f"{f.get('depTime','?')} -> {f.get('arrTime','?')} | "
                f"{f.get('departureAirport','?')} -> {f.get('arrivalAirport','?')} | "
                f"机型: {f.get('planeType','?')}"
            )
        return "\n".join(lines)
    except Exception as e:
        return f"摘要生成失败：{e}"

def _first_non_empty(*vals):
    for v in vals:
        if v is not None and f"{v}".strip() != "":
            return f"{v}".strip()
    return None

# ===================== 统一参数解析 =====================
def _parse_and_validate(
    dep_raw: Optional[str],
    arr_raw: Optional[str],
    dep_date: Optional[str],
    *,
    flight_no: Optional[str] = None,
) -> Dict[str, Any]:
    """把两个工具里重复的参数校验/解析收敛到一起，返回统一结构。"""
    if not dep_raw or not arr_raw or not dep_date:
        return {
            "ok": False,
            "error": "缺少必要参数",
            "params": {"departure": dep_raw, "arrival": arr_raw, "departure_date": dep_date},
        }

    try:
        time.strptime(dep_date, "%Y-%m-%d")
    except ValueError:
        return {"ok": False, "error": "日期格式不正确，应为 YYYY-MM-DD"}

    dep_all = (_list_all_codes_for_text(dep_raw)
               if not _is_iata(dep_raw)
               else {"matched_city": None, "city_code": None, "airports": [],
                     "all_codes": [dep_raw.upper()], "matched_aliases": []})

    arr_all = _list_all_codes_for_text(arr_raw) if not _is_iata(arr_raw or "") else {
        "matched_city": None, "city_code": None, "airports": [], "all_codes": [arr_raw.upper()], "matched_aliases": []
    }

    dep_code = _normalize_airport(dep_raw)
    arr_code = _normalize_airport(arr_raw)
    if not _is_iata(dep_code) or not _is_iata(arr_code):
        return {
            "ok": False,
            "error": "无法识别出发地/到达地，请输入 IATA 三字码或常用中文名称（如：上海、北京、浦东、虹桥、首都、大兴）。",
            "resolved_candidates": {"departure": dep_all, "arrival": arr_all},
            "params": {"departure": dep_raw, "arrival": arr_raw, "departure_date": dep_date},
        }

    return {
        "ok": True,
        "dep_code": dep_code,
        "arr_code": arr_code,
        "dep_date": dep_date,
        "flight_no": (flight_no or "").strip() or None,
        "resolved_candidates": {"departure": dep_all, "arrival": arr_all},
    }

# ===================== 服务类创建 =====================
class FlightService:
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_timeout = CACHE_TTL_SEC

    async def fetch_flights(
        self,
        departure: str,
        arrival: str,
        departure_date: str,
        flight_no: str = "",
    ) -> Dict[str, Any]:
        if not JUHE_FLIGHT_API_KEY:
            return {"error": "缺少 JUHE_FLIGHT_API_KEY 环境变量，请先配置 API 密钥。"}

        dep_code = _normalize_airport(departure)
        arr_code = _normalize_airport(arrival)

        cache_key = "|".join([dep_code, arr_code, departure_date.strip(), (flight_no or "").strip()])
        now = time.time()
        if cache_key in self.cache and (now - self.cache[cache_key]["ts"] < self.cache_timeout):
            return self.cache[cache_key]["data"]

        params = _build_query_params(dep_code, arr_code, departure_date, flight_no=flight_no)
        try:
            async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
                resp = await client.get(JUHE_API_URL, params=params)
                resp.raise_for_status()
                data = resp.json()
        except httpx.TimeoutException:
            return {"error": "请求超时，请稍后重试。"}
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP 错误：{e.response.status_code} - {e}"}
        except httpx.RequestError as e:
            return {"error": f"网络请求错误：{e}"}
        except json.JSONDecodeError:
            return {"error": "响应不是合法的 JSON。"}
        except Exception as e:
            return {"error": f"请求失败：{e}"}

        if data.get("error_code") != 0:
            return {"error": data.get("reason", "第三方接口返回失败"), "code": data.get("error_code"), "raw": data}

        self.cache[cache_key] = {"ts": now, "data": data}
        return data

flight_service = FlightService()

# ===================== 具体工具创建 =====================
''' 查询指定出发地、到达地及日期的航班信息。返回 JSON 字符串。'''
@mcp.tool()
async def get_flight_info(
    departure: Optional[str] = None,
    arrival: Optional[str] = None,
    departure_date: Optional[str] = None,
    flight_no: Optional[str] = None,
    # 别名
    departureDate: Optional[str] = None,
    date: Optional[str] = None,
    flightNo: Optional[str] = None,
    flightNumber: Optional[str] = None,
    fromAirport: Optional[str] = None,
    toAirport: Optional[str] = None,
    from_: Optional[str] = None,
    to: Optional[str] = None,
) -> str:
    dep_raw = _first_non_empty(departure, fromAirport, from_)
    arr_raw = _first_non_empty(arrival, toAirport, to)
    dep_date = _first_non_empty(departure_date, departureDate, date)
    fno = _first_non_empty(flight_no, flightNo, flightNumber)

    parsed = _parse_and_validate(dep_raw, arr_raw, dep_date, flight_no=fno)
    if not parsed.get("ok"):
        return json.dumps(parsed, ensure_ascii=False, indent=2)

    data = await flight_service.fetch_flights(parsed["dep_code"], parsed["arr_code"], parsed["dep_date"], flight_no=parsed.get("flight_no") or "")
    if "error" in data:
        return json.dumps({
            "ok": False,
            "error": data["error"],
            "params": {"departure": parsed["dep_code"], "arrival": parsed["arr_code"]},
            "resolved_candidates": parsed["resolved_candidates"]
        }, ensure_ascii=False, indent=2)

    return json.dumps({
        "ok": True,
        "params": {
            "departure": parsed["dep_code"],
            "arrival": parsed["arr_code"],
            "departure_date": parsed["dep_date"],
            "flight_no": parsed.get("flight_no"),
        },
        "resolved_candidates": parsed["resolved_candidates"],
        "result": data.get("result"),
        "preview": _preview_text_from_result(data)
    }, ensure_ascii=False, indent=2)

''' 获取指定航线在某天的可用航班。支持 IATA 或中文地名/机场名。返回 JSON 字符串。'''
@mcp.tool()
async def get_flight_forecast(
    departure: Optional[str] = None,
    arrival: Optional[str] = None,
    departure_date: Optional[str] = None,
    # 别名
    departureDate: Optional[str] = None,
    date: Optional[str] = None,
    fromAirport: Optional[str] = None,
    toAirport: Optional[str] = None,
    from_: Optional[str] = None,
    to: Optional[str] = None,
) -> str:
    dep_raw = _first_non_empty(departure, fromAirport, from_)
    arr_raw = _first_non_empty(arrival, toAirport, to)
    dep_date = _first_non_empty(departure_date, departureDate, date)

    parsed = _parse_and_validate(dep_raw, arr_raw, dep_date)
    if not parsed.get("ok"):
        return json.dumps(parsed, ensure_ascii=False, indent=2)

    data = await flight_service.fetch_flights(parsed["dep_code"], parsed["arr_code"], parsed["dep_date"])
    if "error" in data:
        return json.dumps({
            "ok": False,
            "error": data["error"],
            "params": {"departure": parsed["dep_code"], "arrival": parsed["arr_code"]},
            "resolved_candidates": parsed["resolved_candidates"]
        }, ensure_ascii=False, indent=2)

    return json.dumps({
        "ok": True,
        "params": {"departure": parsed["dep_code"], "arrival": parsed["arr_code"], "departure_date": parsed["dep_date"]},
        "resolved_candidates": parsed["resolved_candidates"],
        "result": data.get("result"),
        "preview": _preview_text_from_result(data)
    }, ensure_ascii=False, indent=2)

''' 把中文城市/机场名解析为“全部候选 IATA 代码”'''
@mcp.tool()
async def resolve_all_iata(
    text: Optional[str] = None,
) -> str:
    if not text or not text.strip():
        return json.dumps({"ok": False, "error": "缺少参数 text"}, ensure_ascii=False, indent=2)
    info = _list_all_codes_for_text(text)
    ok = bool(info.get("all_codes"))
    return json.dumps({"ok": ok, "text": text, "resolved": info}, ensure_ascii=False, indent=2)

# ---------- 运行 ----------
if __name__ == "__main__":
    mcp.run()
