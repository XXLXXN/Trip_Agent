# 如何注册一个智能体?

在OxyGent中，基础的智能体由[智能体（Agent）](./1_4_select_agent.md)和内部封装的[大语言模型（LLM）](./1_2_select_llm.md)组成。

对于新用户，您可以使用`oxy.HttpLLM`方法通过您的`api_key`注册LLM：

```python
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4, # 并发量
        timeout=240, # 最大执行时间
    ),
```
> 其中 `semaphore` 参数的详细说明请参见 [并行](./7_parallel.md) 部分。

接下来，您可以使用`oxy.ChatAgent`或者`oxy.ReActAgent`封装您的第一个agent：
```python
    oxy.ReActAgent(
        name="master_agent",
        prompt = master_prompt, # 支持自定义prompt
        is_master=True, # 设置为master
        llm_model="default_llm",
    ),
```

为了使 LLM 和智能体生效，它们需要被添加到 `oxy_space` 中。

## 完整的可运行样例

以下是可运行的完整代码示例：

```python
import asyncio

from oxygent import MAS, oxy
import os

master_prompt = """
你是一个文档分析专家，用户会向你提供文档，请为用户提供简要的文档摘要。
摘要可以是markdown格式。
"""

oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
    ),
    oxy.ReActAgent(
        name="master_agent",
        prompt = master_prompt,
        is_master=True,
        llm_model="default_llm",
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"
        )


if __name__ == "__main__":
    asyncio.run(main())
```

[上一章：运行demo](./0_1_demo.md)
[下一章：和智能体交流](./1_1_chat_with_agent.md)
[回到首页](./readme.md)