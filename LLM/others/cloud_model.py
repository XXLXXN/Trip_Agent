from openai import OpenAI
import os
from dotenv import load_dotenv

# 初始化客户端
load_dotenv()
api_key = os.getenv("DEEPSEEK_API_KEY")  # 从环境变量获取密钥

client = OpenAI( api_key=api_key, base_url="https://api.deepseek.com/v1")

# 初始化对话消息
messages = [{"role": "system", "content": "You are a helpful assistant."}]

print("对话开始！输入 'exit' 结束对话。")

# 持续对话
while True:
    # 获取用户输入
    user_input = input("用户: ")

    # 如果用户输入 'exit'，结束对话
    if user_input.lower() == "exit":
        print("对话结束。")
        break

    # 添加用户输入到消息列表
    messages.append({"role": "user", "content": user_input})

    # 调用模型进行推理
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        stream=False
    )

    # 获取模型回复
    bot_reply = response.choices[0].message.content
    print("助手:", bot_reply)

    # 将助手的回复添加到消息列表中，以便后续对话
    messages.append({"role": "assistant", "content": bot_reply})
