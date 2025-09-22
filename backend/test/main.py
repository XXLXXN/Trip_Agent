import httpx
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import asyncio

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
    "bot_app_key": "gJGSTrbEDHlmKPCozkJabmcorQGcrPmCSjuXAMpLTevTqQDmHfHXxPAygVyDfcguQrxUkAIFWsEqrCwVVhVcqlZUqZaDroiOHmOAlZPQxcNHfQnBWpfsKutbSDCGbXOM",
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

# --- API 端点 ---
# 使用 @app.post 装饰器来定义一个接收POST请求的端点
@app.post("/call_api")
async def call_tencent_api(data: RequestData):
    """
    接收包含 'content' 的POST请求,
    然后异步流式请求腾讯云API并打印结果。
    """
    print(f"Received web request to /call_api with content: '{data.content}'")

    # 动态构建本次请求的payload
    request_payload = base_payload.copy()
    request_payload["content"] = data.content

    try:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", api_url, json=request_payload, headers=headers) as response:
                print(f"Request sent to {api_url}, status code: {response.status_code}")
                response.raise_for_status()

                print("--- Streaming Response From Tencent Cloud ---")
                async for chunk in response.aiter_text():
                    lines = chunk.strip().split('\n')
                    for line in lines:
                        if line:
                            print(line) # 实时打印流式结果
                print("--- End of Stream ---")

        return {"status": "success", "message": "Stream processed successfully. Check your server logs for output."}

    except httpx.RequestError as exc:
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
    print("Send a POST request to http://127.0.0.1:8000/call_api")
    print("Request body should be a JSON like: {\"content\": \"your question here\"}")
    uvicorn.run(app, host="127.0.0.1", port=8000)