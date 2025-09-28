import httpx
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import asyncio
import json

# --- Pydantic 模型 ---
# 定义一个模型来规定传入请求的JSON结构
# 这样FastAPI可以自动验证请求体
class RequestData(BaseModel):
    content: str  # 我们希望调用方传入一个名为 "content" 的字符串

# --- FastAPI 应用实例 ---
app = FastAPI()

# --- 腾讯云 API 配置 ---
# 这是发送到腾讯云API的payload模板
# 注意: 'content' 字段将被动态替换
base_payload = {
    "session_id": "c41c2a64-54f3-4649-b4bd-1fbbc3b75010",
    "bot_app_key":"thtprpkQjZcMgPxiSuDHESIkYVvYkIYitXhFPwsafMncoDgtygPfPpzAsDfLvaLlJZcUCTpqpDoyzJGFpVArDyPClSsRBAsyzhwxRvOnqTIAtFDDCfMGTFVIOtPNtSHH",#"gJGSTrbEDHlmKPCozkJabmcorQGcrPmCSjuXAMpLTevTqQDmHfHXxPAygVyDfcguQrxUkAIFWsEqrCwVVhVcqlZUqZaDroiOHmOAlZPQxcNHfQnBWpfsKutbSDCGbXOM",
    "visitor_biz_id": "c41c2a64-54f3-4649-b4bd-1fbbc3b75010",
    "content":"我们有一个学生和三个成人，想要在2025年11月27日出发去上海玩5天，体验当地文化",
    "incremental": False,
    "streaming":  False,
    "streaming_throttle": 100,
    "visitor_labels": [],
    "custom_variables": {},
    "search_network": "enable",
    "model_name": "",
    "stream": "disable",
    "workflow_status": "disable",
    "tcadp_user_id": ""
}

api_url = "https://wss.lke.cloud.tencent.com/v1/qbot/chat/sse"
headers = {
    'Content-Type': 'application/json'
}

def process_and_filter_reply(json_string: str):
    """
    接收一个JSON字符串, 解析并检查它是否是我们需要的机器人回复。
    - event 必须是 'reply' (这个在调用此函数前已经判断)。
    - data.payload.is_from_self 必须是 False。

    如果满足所有条件, 返回解析后的Python字典, 否则返回None。
    """
    try:
        data = json.loads(json_string)
        # 使用 .get() 来安全地访问嵌套的键, 避免因缺少键而导致的错误
        payload = data.get("payload", {})
        if isinstance(payload, dict) and payload.get("is_from_self") is False:
            # 条件满足: 这是一个来自机器人的、非回显的回复
            return payload
    except (json.JSONDecodeError, AttributeError):
        # 如果JSON格式错误或数据结构不符合预期, 则忽略
        return None
    return None

# --- API 端点 ---
@app.post("/call_api")
async def call_tencent_api(data: RequestData):
    success= False
    print(f"Received web request to /call_api with content: '{data.content}'")
    
    request_payload = base_payload.copy()
    request_payload["content"] = data.content

    print("\n--- Sending Request Payload to Tencent Cloud ---")
    print("--------------------------------------------\n")

    extracted_replies = [] # 用于存储所有符合条件的回复

    try:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", api_url, json=request_payload, headers=headers) as response:
                print(f"Request sent to {api_url}, status code: {response.status_code}")
                response.raise_for_status()

                print("--- Streaming Response From Tencent Cloud ---")
                current_event_type = None
                async for chunk in response.aiter_text():
                    lines = chunk.strip().split('\n')
                    for line in lines:
                        print(line) # 打印原始行数据
                        if line.startswith('event:'):
                            # 捕获当前事件类型
                            current_event_type = line.split(':', 1)[1].strip()
                        elif line.startswith('data:') and current_event_type == 'reply':
                            print("Detected 'reply' event data.!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                            # 如果是reply事件的数据, 则进行处理
                            json_data_string = line.split(':', 1)[1].strip()
                            # 调用我们的新函数来处理和筛选
                            filtered_data = process_and_filter_reply(json_data_string)

                            if filtered_data:
                                # 如果函数返回了数据 (即满足所有条件)
                                extracted_replies.append(filtered_data)
                                success = True
                                print("\n✅ --- DETECTED & EXTRACTED BOT REPLY --- ✅")
                                # 'filtered_data' 是一个Python字典, 已经是FastAPI可用的类型
                                print(json.dumps(filtered_data, indent=2, ensure_ascii=False))
                                print("------------------------------------------\n")
                            else:
                                print("Ignored non-bot or self-echoed reply.*********************\n")

                print("--- End of Stream ---")

        # 在这里, `extracted_replies` 列表包含了所有我们想要的回复数据(字典格式)
        # 你可以根据业务需求对这个列表进行后续处理
        return {
            "success": success,
            "message": f"Stream processed. Found {len(extracted_replies)} valid bot replies.",
            "extracted_data": extracted_replies # 将提取的数据作为API的响应返回
        }

    except httpx.RequestError as exc:
        # ... (异常处理代码保持不变) ...
        error_message = f"An error occurred while requesting {exc.request.url!r}: {exc}"
        print(error_message)
        return {"status": "error", "message": error_message}
    except httpx.HTTPStatusError as exc:
        error_message = f"Error response {exc.response.status_code} while requesting {exc.request.url!r}."
        print(error_message)
        print(f"Response body: {exc.response.text}")
        return {"status": "error", "message": error_message, "details": exc.response.text}

if __name__ == "__main__":
    print("Starting FastAPI server...")
    print("Send a POST request to http://12.0.0.1:8000/call_api")
    print("Request body should be a JSON like: {\"content\": \"your question here\"}")
    uvicorn.run(app, host="127.0.0.1", port=8000)