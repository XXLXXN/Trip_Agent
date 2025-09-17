import json
import time
import httpx
import re
from datetime import datetime
from mcp.server.fastmcp import FastMCP

# ================= TRAIN_MCP 初始化 =================
mcp = FastMCP("train_mcp_server")

# 12306站点列表，12306网站上使用的是IATA码，将具体的地址转换成IATA码
STATION_LIST_URL = "https://kyfw.12306.cn/otn/resources/js/framework/station_name.js"

# ================= 检查函数 =================
def _looks_like_json(text: str) -> bool:
    """检查文本格式"""
    if not text:
        return False
    t = text.lstrip("\ufeff").lstrip()
    return t.startswith("{") or t.startswith("[")  # 判断是否以{或[开头


def _safe_json(text: str):
    """安全地解析JSON"""
    if not text:
        return None
    try:
        return json.loads(text.lstrip("\ufeff"))
    except Exception:
        return None  # 解析失败返回None


def _is_past_date_yyyy_mm_dd(s: str) -> bool:
    """检查日期字符串是否是过去日期"""
    try:
        d = datetime.strptime(s, "%Y-%m-%d").date()  # 解析日期
        return d < datetime.now().date()  # 比较是否为过去日期
    except Exception:
        return False  # 解析失败视为非过去日期


# ================= 票价解析映射 =================
# 座席标准代码转换成可读名称
SEAT_CODE_TO_NAME = {
    "A9": "商务座",
    "A": "商务座",
    "P": "特等座",
    "M": "一等座",
    "O": "二等座",
    "F": "动卧",
    "A6": "高级软卧",
    "A4": "软卧",
    "A3": "硬卧",
    "A2": "软座",
    "A1": "硬座",
    "WZ": "无座",
}

# 价格编码串里的首字母转换成标准座席代码
PRICE_LETTER_TO_SEAT_CODE = {
    "A": "A9",  # 商务
    "P": "P",  # 特等
    "M": "M",  # 一等
    "O": "O",  # 二等
    "F": "F",  # 动卧
    "H": "A6",  # 高级软卧
    "D": "A4",  # 软卧
    "J": "A3",  # 硬卧
    "Q": "A2",  # 软座
    "I": "A1",  # 硬座
    "W": "WZ",  # 无座
}


# ================= MCP服务 =================
class TrainTicketService:
    """12306火车票查询服务类"""

    def __init__(self):
        self.station_map = None  # 中文站名转换成映射字典
        self.cache = {}  # 查询缓存
        self.cache_timeout = 300  # 缓存超时时间

    async def _load_station_map(self, client: httpx.AsyncClient):
        """从官网获取并解析站点名称与代码映射表"""
        try:
            # 设置请求头，模拟浏览器行为
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://www.12306.cn/index/",
                "Accept": "text/javascript, application/javascript, */*; q=0.1",
                "Accept-Language": "zh-CN,zh;q=0.9",
            }
            resp = await client.get(STATION_LIST_URL, headers=headers)
            resp.raise_for_status()  # 检查HTTP状态码
        except Exception as e:
            return {"error": f"站点代码表获取失败: {e}"}

        text = resp.text or ""
        # 使用Javascript正则表达式提取站点数据
        match = re.search(r"var station_names\s*=\s*'([^']+)';", text)
        if not match:
            return {"error": "无法解析站点数据格式"}

        station_data = match.group(1)
        stations = station_data.split('@')[1:]  # 分割站点数据
        station_map = {}
        for entry in stations:
            if not entry:
                continue
            fields = entry.split('|')  # 分割字段
            # fields格式为[简拼, 站点名, 电报码, 拼音, 缩写, 编号]
            if len(fields) >= 3:
                name = fields[1]  # 站点名
                code = fields[2]  # 电报码
                station_map[name] = code  # 添加到映射表

        self.station_map = station_map
        return {"ok": True}

    # 票价解析与格式化
    def _format_price_map(self, price_map: dict) -> dict:
        """
        格式化价格映射
        输入：{'A1': 123.5, 'O': 443.5, ...} 或 {'A1': '123.5', ...}
        输出：{'硬座': '¥123.5', '二等座': '¥443.5', ...}
        """
        out = {}
        for seat_code, price in (price_map or {}).items():
            sc = str(seat_code).upper()
            seat_name = SEAT_CODE_TO_NAME.get(sc, sc)  # 获取座位名称，缺失则回退显示原码
            try:
                # 清理价格字符串并转换为浮点数
                p = float(str(price).replace("¥", "").replace("元", "").strip())
                # 格式化价格显示
                if abs(p - round(p)) < 1e-9:  # 判断是否为整数
                    out[seat_name] = f"¥{int(round(p))}"  # 整数价格
                else:
                    out[seat_name] = f"¥{p:.2f}".rstrip("0").rstrip(".")  # 小数价格，去除尾随零
            except Exception:
                if price not in (None, ""):
                    out[seat_name] = f"{price}"  # 无法解析则保留原值
        return out

    def _parse_price_payload(self, data_dict: dict) -> dict:
        """
        解析价格负载数据
        兼容两种返回格式：
        1) 标准键：{'A1': '123.5', 'O': '443.5', 'WZ': '443.5', ...}
        2) 编码串：{'prices': 'I026500001#J019800002#O008700000#...'}
           规则：段以 # 分隔，首字母映射座席，后数字通常为"角"
        返回：{'A1': 123.5, 'O': 443.5, ...}
        """
        if not isinstance(data_dict, dict):
            return {}

        # 情况1：已存在标准键
        standard_keys = set(SEAT_CODE_TO_NAME.keys())
        if any(k in data_dict for k in standard_keys):
            clean = {}
            for k, v in data_dict.items():
                ku = k.upper()  # 转换为大写
                if ku in standard_keys:  # 如果是标准键
                    try:
                        # 清理并转换价格
                        clean[ku] = float(str(v).replace("¥", "").replace("元", "").strip())
                    except Exception:
                        pass  # 转换失败跳过
            return clean

        # 情况2：尝试从编码串字段解析得到标准键
        blob = None
        for key in ("prices", "price", "data", "result"):
            val = data_dict.get(key)
            if isinstance(val, str) and ("#" in val or (val and val[0].isalpha())):
                blob = val  # 找到可能的编码串
                break
        if not blob:
            return {}

        out = {}
        parts = [p for p in blob.split("#") if p]  # 分割编码串
        for seg in parts:
            # 如 "I026500001"：I=硬座；026500001 取数字段
            letter = seg[0].upper()  # 首字母
            seat_code = PRICE_LETTER_TO_SEAT_CODE.get(letter, letter)  # 映射到标准座位代码
            # 抓取从 index=1 起的连续数字
            m = re.search(r"(\d{3,9})", seg[1:])
            if not m:
                continue
            num = int(m.group(1))
            price = num / 10.0 if num < 200000 else num / 100.0
            # 若同席别多段，取较大值
            out[seat_code] = max(price, out.get(seat_code, 0))
        return out

    async def get_ticket_data(self, from_city: str, to_city: str, date: str):
        """查询指定日期、出发城市和到达城市的余票信息，返回列表或错误 dict"""
        # 检查是否为过去日期
        if _is_past_date_yyyy_mm_dd(date):
            return {"error": f"查询日期 {date} 已是过去日期，12306 不提供历史余票。"}

        # 检查缓存
        cache_key = f"{from_city}_{to_city}_{date}"
        if cache_key in self.cache:
            cached = self.cache[cache_key]
            if time.time() - cached['timestamp'] < self.cache_timeout:
                return cached['data']  # 返回缓存数据

        # 设置请求头
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://kyfw.12306.cn/otn/leftTicket/init",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "X-Requested-With": "XMLHttpRequest",
        }

        # 创建HTTP客户端
        transport = httpx.AsyncHTTPTransport(retries=2, http2=True)
        async with httpx.AsyncClient(headers=headers, timeout=15.0, follow_redirects=True,
                                     transport=transport) as client:
            # 确保当前的站点映射可用
            if self.station_map is None:
                m = await self._load_station_map(client)
                if isinstance(m, dict) and m.get("error"):
                    return m

            # 获取城市代码
            from_code = self.station_map.get(from_city)
            to_code = self.station_map.get(to_city)
            if not from_code or not to_code:
                return {"error": f"无法找到出发或到达城市的车站代码: {from_city} -> {to_city}"}

            # 尝试访问初始页以获取必要 Cookie
            try:
                await client.get("https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc")
            except Exception:
                pass

            # 构建查询URL和相应的参数
            query_url = "https://kyfw.12306.cn/otn/leftTicket/query"
            params = {
                "leftTicketDTO.train_date": date,
                "leftTicketDTO.from_station": from_code,
                "leftTicketDTO.to_station": to_code,
                "purpose_codes": "ADULT",  # 成人票
            }

            try:
                resp = await client.get(query_url, params=params)
                if resp.status_code != 200:
                    return {"error": f"查询请求失败，HTTP {resp.status_code}", "location": resp.headers.get("Location")}

                # 检查响应内容类型
                ctype = (resp.headers.get("content-type") or "").lower()
                text = resp.text or ""
                if ("json" not in ctype) and (not _looks_like_json(text)):
                    return {"error": "12306返回的不是JSON", "content_type": ctype, "text_tail": text[:500]}

                # 解析JSON响应
                data = _safe_json(text)
                if not isinstance(data, dict):
                    return {"error": "无法解析JSON响应（格式异常）", "text_tail": text[:500]}

                # 检查响应状态
                if not data.get("status") or data.get("httpstatus") != 200:
                    return {"error": "12306接口返回异常或无有效数据",
                            "payload_head": json.dumps(data, ensure_ascii=False)[:400]}

                # 提取结果列表和站点名称映射
                result_list = data.get("data", {}).get("result", [])
                station_name_map = data.get("data", {}).get("map", {})
                if not result_list:
                    return []

                # 解析每趟列车信息
                tickets = []
                for train_str in result_list:
                    fields = train_str.split('|')  # 分割字段
                    if len(fields) < 40:
                        continue

                    # 提取关键字段
                    train_code = fields[3]  # 车次
                    train_no = fields[2]  # 每个火车的train_no
                    from_station_code = fields[6]  # 出发站代码
                    to_station_code = fields[7]  # 到达站代码
                    depart_time = fields[8]  # 出发时间
                    arrive_time = fields[9]  # 到达时间
                    duration = fields[10]  # 历时

                    # 关键：站序号，注意：票价接口不是电报码
                    from_station_no = fields[16]  # 出发站序号
                    to_station_no = fields[17]  # 到达站序号

                    # 座型串
                    seat_types = fields[35] if len(fields) > 35 else ""

                    # 获取站点名称
                    from_station_name = station_name_map.get(from_station_code, from_city)
                    to_station_name = station_name_map.get(to_station_code, to_city)

                    # 常见余票字段
                    seat_second = fields[30] if len(fields) > 30 else ""  # 二等座
                    seat_first = fields[31] if len(fields) > 31 else ""  # 一等座
                    seat_business = fields[32] if len(fields) > 32 else ""  # 商务座
                    hard_sleeper = fields[28] if len(fields) > 28 else ""  # 硬卧
                    soft_sleeper = fields[23] if len(fields) > 23 else ""  # 软卧
                    adv_soft_slp = fields[21] if len(fields) > 21 else ""  # 高级软卧

                    # 检查是否有票
                    available = any(
                        s and s not in ("无", "0", "")
                        for s in (seat_second, seat_first, seat_business, hard_sleeper, soft_sleeper, adv_soft_slp)
                    )

                    # 获取票价信息
                    try:
                        price_info_raw = await self._get_ticket_price(
                            client=client,
                            train_no=train_no,
                            from_station_no=from_station_no,
                            to_station_no=to_station_no,
                            seat_types=seat_types,
                            date=date,
                        )
                    except Exception:
                        price_info_raw = {}  # 获取票价失败

                    # 构建车票信息字典
                    tickets.append({
                        "train_code": train_code,
                        "train_no": train_no,
                        "from_station": from_station_name,
                        "to_station": to_station_name,
                        "departure_time": depart_time,
                        "arrival_time": arrive_time,
                        "duration": duration,
                        "available": available,
                        "seat_second": seat_second,
                        "seat_first": seat_first,
                        "seat_business": seat_business,
                        "hard_sleeper": hard_sleeper,
                        "soft_sleeper": soft_sleeper,
                        "advanced_soft_sleeper": adv_soft_slp,
                        "price_info": price_info_raw,  # 格式化后的票价信息
                    })

                # 更新缓存
                self.cache[cache_key] = {"data": tickets, "timestamp": time.time()}
                return tickets

            except httpx.TimeoutException:
                return {"error": "查询超时"}
            except httpx.HTTPError as e:
                return {"error": f"查询请求失败: {e}"}
            except Exception as e:
                return {"error": f"未知错误: {type(e).__name__}: {e}"}

    async def _get_ticket_price(self, client: httpx.AsyncClient, train_no: str, from_station_no: str, to_station_no: str, seat_types: str, date: str) -> dict:
        """获取票价信息：返回 {'一等座': '¥', '二等座': '¥', ...}"""
        price_url = "https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice"
        params = {
            "train_no": train_no,
            "from_station_no": from_station_no,
            "to_station_no": to_station_no,
            "seat_types": seat_types or "",
            "train_date": date,
        }
        try:
            r = await client.get(price_url, params=params)
            if r.status_code != 200:
                return {}

            # 检查响应内容类型
            ctype = (r.headers.get("content-type") or "").lower()
            text = r.text or ""
            if "json" not in ctype and not _looks_like_json(text):
                return {}  # 非 JSON 时直接返回空票价

            # 解析JSON响应
            jd = _safe_json(text)
            if not isinstance(jd, dict) or not jd.get("status") or jd.get("httpstatus") != 200:
                return {}

            raw = jd.get("data", {}) or {}

            # 按格式转换
            parsed = self._parse_price_payload(raw)  # {'A1': 123.5, 'O': 443.5, ...}
            human = self._format_price_map(parsed)  # {'硬座': '¥123.5', '二等座': '¥443.5', ...}
            return human
        except Exception:
            return {}  # 静默失败，避免影响主流程


# 创建服务实例
ticket_service = TrainTicketService()


# ================= 导出 MCP 工具 =================
@mcp.tool()
async def get_train_info(from_city: str, to_city: str, date: str) -> str:
    """查询指定日期出发城市到目的城市的列车余票情况"""
    data = await ticket_service.get_ticket_data(from_city, to_city, date)

    # 错误或空结果处理
    if isinstance(data, dict) and data.get("error"):
        return f"查询失败: {data['error']}"
    if not data:
        return f"未找到 {from_city} 到 {to_city} 在 {date} 的列车余票信息。"

    # 构建结果字符串
    lines = [f"票务信息（{from_city} -> {to_city}, {date}）:"]
    for t in data:
        availability = "有票" if t.get("available") else "无票"  # 余票状态
        seat_info = []  # 座位信息列表

        # 添加各类座位信息
        if t.get("seat_second"):
            seat_info.append(f"二等座: {t['seat_second']}")
        if t.get("seat_first"):
            seat_info.append(f"一等座: {t['seat_first']}")
        if t.get("seat_business"):
            seat_info.append(f"商务座: {t['seat_business']}")
        if t.get("hard_sleeper"):
            seat_info.append(f"硬卧: {t['hard_sleeper']}")
        if t.get("soft_sleeper"):
            seat_info.append(f"软卧: {t['soft_sleeper']}")
        if t.get("advanced_soft_sleeper"):
            seat_info.append(f"高级软卧: {t['advanced_soft_sleeper']}")

        # 格式化价格信息
        price_info_str = ""
        if t.get("price_info"):
            kvs = [f"{k}: {v}" for k, v in t["price_info"].items()]
            price_info_str = ", 票价: " + ", ".join(kvs)

        # 构建单条车次信息
        lines.append(
            f"车次: {t.get('train_code') or t.get('train_no')}, "
            f"发车: {t['departure_time']}, 到达: {t['arrival_time']}, "
            f"历时: {t['duration']}, 余票状态: {availability}, "
            f"座位: {', '.join(seat_info) if seat_info else '无座位信息'}{price_info_str}"
        )

    return "\n".join(lines)  # 返回格式化后的结果


# ================= 服务器启动 =================
if __name__ == "__main__":
    print("12306 余票查询服务正在启动...")
    mcp.run()  # 启动MCP服务器