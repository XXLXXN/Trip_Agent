from openai import OpenAI
import deepseek
def get_openai():
    # 初始化客户端
    client = OpenAI(base_url="http://127.0.0.1:11434/v1", api_key="")  # 调用本地大模型
    # 对话消息
    messages = [{"role": "system", "content": "你是一个专业的助手，回答问题时必须准确，且不能胡言乱语。"}]

    print("对话开始！输入 'exit' 结束对话。")

    # 持续对话
    while True:
        user_input = input("用户: ")

        # 如果用户输入 'exit'，结束对话
        if user_input.lower() == "exit":
            print("对话结束。")
            break

        # 添加用户的输入到消息列表
        messages.append({"role": "user", "content": user_input})

        # 提示正在思考
        print("助手: 正在思考，请稍候...")

        # 调用API生成对话
        completion = client.chat.completions.create(
            model="DeepSeek-R1:8b",  # 使用的模型
            messages=messages,
            temperature=0.7,  # 控制输出的随机性，值越低输出越确定
            top_p=0.9,  # 控制输出的多样性，值越低输出越集中
            max_tokens=512,  # 控制生成的最大token数量
            frequency_penalty=0.5,  # 减少重复内容的生成
            presence_penalty=0.5  # 鼓励模型引入新内容
        )

        # 获取生成的回复
        bot_reply = completion.choices[0].message.content

        # 打印生成的回复
        print("助手:", bot_reply)

        # 将助手的回复添加到消息列表中，以便后续对话
        messages.append({"role": "assistant", "content": bot_reply})

if __name__ == '__main__':
    get_openai()