## 如何进行检索增强生成？

OxyGent支持通过`knowledge`参数向prompts注入知识。以下将展示一个最简单的RAG示例：

如果您还没有学习如何处理提示词，建议阅读[如何自定义处理提示词？](./8_update_prompts.md)。

您需要先创建一个`retrieval`方法：

```python
def retrieval(query):
    # 替换为实际的数据库
    return "\n".join(["knowledge1", "knowledge2", "knowledge3"])
```

然后，需要在`update_query`中将检索的知识进行注入：

```python
def update_query(oxy_request: OxyRequest):
    current_query = oxy_request.get_query()

    def retrieval(query):
        return "\n".join(["knowledge1", "knowledge2", "knowledge3"])

    oxy_request.arguments["knowledge"] = retrieval(current_query) # 关键方法
    return oxy_request
```

## 完整的可运行样例

以下是可运行的完整代码示例：

```python
import asyncio

from oxygent import MAS, OxyRequest, oxy
import os

INSTRUCTION = """
You are a helpful assistant and can use these tools:
${tools_description}

Experience in choosing tools:
${knowledge}

Select the appropriate tool based on the user's question.
If no tool is needed, reply directly.
If answering the user's question requires calling multiple tools, call only one tool at a time. After the user receives the tool result, they will give you feedback on the tool call result.

Important notes:
1. When you have collected enough information to answer the user's question, please respond in the following format:
<think>Your reasoning (if analysis is needed)</think>
Your response content
2. When you find that the user's question lacks certain conditions, you can ask them back. Please respond in the following format:
<think>Your reasoning (if analysis is needed)</think>
Your follow-up question to the user
3. When you need to use a tool, you must respond **only** with the following exact JSON object format, and nothing else:

{
    "think": "Your reasoning (if analysis is needed)",
    "tool_name": "Tool name",
    "arguments": {
        "Parameter name": "Parameter value"
    }
}
"""


def update_query(oxy_request: OxyRequest):
    current_query = oxy_request.get_query()

    def retrieval(query):
        return "\n".join(["knowledge1", "knowledge2", "knowledge3"])

    oxy_request.arguments["knowledge"] = retrieval(current_query)
    return oxy_request


oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        llm_model="default_llm",
        timeout=100,
        prompt=INSTRUCTION,
        func_process_input=update_query,
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="This is an example for rag. Please modify it according to the specific needs",
        )

if __name__ == "__main__":
    asyncio.run(main())

```


[上一章：导入附件](./10_1_attachments.md)
[下一章：生成训练样本](./13_training.md)
[回到首页](./readme.md)