import os

import httpx
import asyncio
import json


spot_api_key = os.getenv("SPOT_API_KEY")
# --- 腾讯云 API 配置 (保持不变) ---
# 这是发送到腾讯云API的payload模板
base_payload = {
    "session_id": "c41c2a64-54f3-4649-b4bd-1fbbc3b75010",
    # 注意：请确保这里的 bot_app_key 是有效的
    "bot_app_key": "HAwHnhhodrHKCnqQWMleDILLBHdiivZQpNoMkmKfzRWkMupxxBiKKaoEceOnkOinTqWYRtXzdJBkTAQHcvLWEZHtqTDkSKhCwKqSBApMskWpPxmPmcoJvvQxKfuFHOgh",
    "visitor_biz_id": "c41c2a64-54f3-4649-b4bd-1fbbc3b75010",
    "content": "",  # 将被动态填充
    "incremental": False,
    "streaming": False,
    "streaming_throttle": 100,
    "visitor_labels": [],
    "custom_variables": {},
    "search_network": "enable",
    "model_name": "",
    "stream": "disable",  # 注意：您之前的代码这里是disable，但接口是sse流式接口。建议改为"enable"以匹配流式处理逻辑
    "workflow_status": "disable",
    "tcadp_user_id": ""
}

api_url = "https://wss.lke.cloud.tencent.com/v1/qbot/chat/sse"
headers = {
    'Content-Type': 'application/json'
}


# --- 辅助函数 (保持不变) ---
def process_and_filter_reply(json_string: str):
    """
    接收一个JSON字符串, 解析并检查它是否是我们需要的机器人回复。
    如果满足条件, 返回解析后的payload字典, 否则返回None。
    """
    try:
        print("get reply but is_from_self is True")
        data = json.loads(json_string)
        payload = data.get("payload", {})
        if isinstance(payload, dict) and payload.get("is_from_self") is False:

            return payload
    except (json.JSONDecodeError, AttributeError):
        return None
    return None


# --- 新的核心功能函数 ---
async def get_bot_reply(content: str) -> list:
    """
    接收一个content字符串, 调用腾讯云API, 处理流式响应,
    并只返回 is_from_self 为 False 的机器人回复 payload 列表。
    """
    print(f"--- Preparing to send content: '{content}' ---")

    request_payload = base_payload.copy()
    request_payload["content"] = content


    extracted_replies = []

    try:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", api_url, json=request_payload, headers=headers) as response:
                print(f"Request sent to {api_url}, status code: {response.status_code}")
                response.raise_for_status()

                print("--- Streaming Response From Tencent Cloud ---")

                # --- START: 全新、简化的解析逻辑 ---
                current_event_type = None
                data_buffer = []
                print(response.text)
                async for line in response.aiter_lines():
                    print(line)
                    # 当遇到空行时，代表一个 SSE 事件的结束
                    if not line:
                        # 只有当事件是 'reply' 且我们有数据时才处理
                        if current_event_type == 'reply' and data_buffer:
                            print(f"\n[DEBUG] End of a 'reply' event detected. Processing collected data...")
                            full_data_string = "".join(data_buffer)

                            try:
                                data = json.loads(full_data_string)
                                payload = data.get("payload", {})

                                # 核心判断逻辑：is_from_self 必须明确为 False
                                if isinstance(payload, dict) and payload.get("is_from_self") is False:
                                    print("[DEBUG] ✅ CONDITION MET: 'is_from_self' is False. Keeping this reply.")
                                    extracted_replies.append(payload)
                                else:
                                    # is_from_self 是 True, 或者不存在，或者 payload 格式不对
                                    print(
                                        "[DEBUG] ❌ CONDITION FAILED: 'is_from_self' is not False. Discarding this reply.")

                            except json.JSONDecodeError:
                                print("[ERROR] ❌ Failed to decode JSON from data buffer. Discarding.")

                        # 不论事件是什么类型，处理完后都重置
                        current_event_type = None
                        data_buffer = []
                        continue

                    # 解析每一行
                    if line.startswith('event:'):
                        current_event_type = line.split(':', 1)[1].strip()
                    elif line.startswith('data:'):
                        # 只把 data 的内容（去掉 "data:" 前缀）存入缓冲区
                        data_buffer.append(line.split(':', 1)[1].strip())
                # --- END: 全新逻辑 ---

                print("--- End of Stream ---")

        return extracted_replies

    except httpx.RequestError as exc:
        print(f"[ERROR] An error occurred while requesting {exc.request.url!r}: {exc}")
        return []
    except httpx.HTTPStatusError as exc:
        print(f"[ERROR] Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
        print(f"Response body: {exc.response.text}")
        return []

# --- 调试专用的核心功能函数 ---
async def search_goods_prices(content: str) -> list:
    """
    接收content字符串, 调用腾讯云API, 处理流式响应,
    并只返回标记为 is_final:true 且 is_from_self:false 的最终机器人回复。
    """
    print(f"--- Preparing to send content: '{content}' ---")

    request_payload = base_payload.copy()
    request_payload["content"] = content
    request_payload["stream"] = "enable"

    extracted_replies = []

    try:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", api_url, json=request_payload, headers=headers) as response:
                print(f"Request sent to {api_url}, status code: {response.status_code}")
                response.raise_for_status()

                print("--- Streaming Response From Tencent Cloud ---")

                # --- START: 最终的、正确的解析逻辑 ---
                current_event_type = None
                data_buffer = []

                async for line in response.aiter_lines():
                    # SSE协议使用空行作为事件分隔符
                    if not line:
                        # 当一个事件结束时，我们处理累积的数据
                        if current_event_type == 'reply' and data_buffer:
                            full_data_string = "".join(data_buffer)

                            try:
                                data = json.loads(full_data_string)
                                payload = data.get("payload", {})

                                # 核心判断逻辑: 必须是最终回复 AND 不是用户自己的回显
                                is_final = payload.get("is_final")
                                is_from_self = payload.get("is_from_self")

                                if is_final is True and is_from_self is False:
                                    print("\n✅ --- FINAL BOT REPLY DETECTED --- ✅")
                                    print(json.dumps(payload, indent=2, ensure_ascii=False))
                                    print("------------------------------------\n")
                                    extracted_replies.append(payload)
                                else:
                                    # 忽略所有中间过程的流式回复和用户自己的回显
                                    pass

                            except json.JSONDecodeError:
                                # 如果中间的JSON片段不完整导致解析失败，也属正常，直接忽略
                                pass

                        # 处理完毕，重置状态以准备接收下一个事件
                        current_event_type = None
                        data_buffer = []
                        continue

                    # 逐行解析事件内容
                    if line.startswith('event:'):
                        current_event_type = line.split(':', 1)[1].strip()
                    elif line.startswith('data:'):
                        data_buffer.append(line.split(':', 1)[1].strip())
                # --- END: 最终逻辑 ---

                print("--- End of Stream ---")

        return extracted_replies

    except httpx.RequestError as exc:
        print(f"[ERROR] An error occurred while requesting {exc.request.url!r}: {exc}")
        return []
    except httpx.HTTPStatusError as exc:
        print(f"[ERROR] Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
        print(f"Response body: {exc.response.text}")
        return []
# --- 主执行入口 ---
async def main():
    """
    用于演示如何调用 get_bot_reply 函数的示例。
    """
    # 在这里定义你想发送的内容
    user_input = """{
  "user_id": "user12345",
  "destination_city": "西安",
  "travellers_count": {
    "ADULT": 2,
    "CHILD": 1,
    "SENIOR": 0,
    "STUDENT": 0
  },
  "hotel_to_book": {
    "name": "西安钟楼大酒店",
    "check_in_date": "2024-09-10",
    "check_out_date": "2024-09-13"
  },
  "tickets_to_buy": [
    {
      "spot_name": "西安城墙",
      "ticket_name": "西安城墙成人门票",
      "visit_date": "2024-09-10"
    },
    {
      "spot_name": "秦始皇兵马俑博物馆",
      "ticket_name": "秦始皇兵马俑博物馆成人门票",
      "visit_date": "2024-09-11"
    },
    {
      "spot_name": "大慈恩寺",
      "ticket_name": "大慈恩寺门票",
      "visit_date": "2024-09-12"
    },
    {
      "spot_name": "大雁塔",
      "ticket_name": "大雁塔登塔票",
      "visit_date": "2024-09-12"
    }
  ]
}"""
    print(spot_api_key)
    # 调用核心函数并等待结果
    final_replies = await search_goods_prices(user_input)

    # 打印最终提取到的数据
    print("\n================ FINAL RESULT ================")
    if final_replies:
        print(f"Successfully extracted {len(final_replies)} bot replies:")
        # final_replies 是一个列表, 包含了所有符合条件的payload字典
        print(json.dumps(final_replies, indent=2, ensure_ascii=False))
    else:
        print("No valid bot replies were extracted.")
    print("============================================")


if __name__ == "__main__":
    # 使用 asyncio.run() 来运行顶层的异步函数 main()
    asyncio.run(main())