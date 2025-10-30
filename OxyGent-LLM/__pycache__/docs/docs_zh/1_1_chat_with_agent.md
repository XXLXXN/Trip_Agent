# 如何和智能体交流？

OxyGent支持多种不同与智能体交流的方式。

## 1.可视化界面

假设您搭建了智能体系统，最简单的方式是使用`start_web_service`启动[官方可视化工具](./14_debugging.md)，您可以像主流ai产品客户端一样使用聊天框和agent进行对话。

```python
async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!" #聊天框中的默认内容
        )
```

## 2.命令行

此外，如果你更倾向与使用命令行进行交互，您可以使用`start_cli_mode`来启动您的智能体。
```python
async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_cli_mode(
            first_query="Hello!" #聊天框中的默认内容
        )
```

如果您只想调用与智能体交互一轮，可以使用`chat_with_agent`，并使用`payload`传递对话内容：

```python
async def test():
    async with MAS(oxy_space=oxy_space) as mas:
        out = await mas.chat_with_agent(payload={"query": "The 30 positions of pi."})
        print("output:", out.output)
```

您还可以使用`call`方法与任意指定的agent进行交流：

```python
async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        messages = [
            {"role": "system", "content": "You are a helpful assistant"},
            {"role": "user", "content": "hello"},
        ]
        result = await mas.call(callee="master_agent", arguments={"messages": messages})
        print(result)
```

如果您希望对OxyGent进行开发，还可以采取其它更复杂而自定义的方式，例如直接编辑对话数据：

```python
# find in ollama_demo.py
async def chat():
    async with MAS(oxy_space=oxy_space) as mas:
        history = [{"role": "system", "content": "You are a helpful assistant."}]

        while True:
            user_in = input("User: ").strip()
            if user_in.lower() in {"exit", "quit", "q"}:
                break

            history.append({"role": "user", "content": user_in})
            result = await mas.call(
                callee="master_agent",
                arguments={"messages": history},
            )
            assistant_out = result
            print(f"Assistant: {assistant_out}\n")
            history.append({"role": "assistant", "content": assistant_out})

if __name__ == "__main__":
    asyncio.run(chat())
```

您可以阅读源代码以获取更多相关信息。

[上一章：创建第一个智能体](./1_register_single_agent.md)
[下一章：选择智能体使用的LLM](./1_2_select_llm.md)
[回到首页](./readme.md)