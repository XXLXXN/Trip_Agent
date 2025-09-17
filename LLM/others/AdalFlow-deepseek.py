from adalflow.core import Generator
from adalflow.components.model_client.deepseek_client import DeepSeekClient
from dotenv import load_dotenv
import os
load_dotenv()

llm = Generator(
    model_client=DeepSeekClient(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1"),
    model_kwargs={"model": "deepseek-chat"}  # 确保模型名正确
)

prompt_kwargs = {
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is LLM?"}
    ]
}

response = llm(prompt_kwargs=prompt_kwargs)
print(response)
