# 如何并行运行智能体？

OxyGent 支持高兼容性的并行执行功能，允许您同时运行多个智能体并进行协作。

## 1. 并行执行多个智能体

例如，如果您需要同时对一篇文档进行数据分析、文字总结和纠错，您可以注册相应功能的智能体，并使用 `oxy.ParallelAgent` 来管理这些智能体。`ParallelAgent` 会负责并行处理并汇总各个智能体的结果。

您还可以通过`semaphore`参数设置每个智能体的最大并发度。

```python
    oxy.ChatAgent( # 需要并行的agent
        name="text_summarizer",
        desc="A tool that can summarize markdown text",
        prompt=prompts.text_summarizer_prompt,
    ),
    oxy.ChatAgent(
        name="data_analyser",
        desc="A tool that can summarize echart data",
        prompt=prompts.data_analyser_prompt,
    ),
    oxy.ChatAgent(
        name="document_checker",
        desc="A tool that can find problems in document",
        prompt=prompts.document_checker_prompt,
    ),
    oxy.ParallelAgent( # 管理的上层agent
        name="analyzer",
        desc="A tool that analyze markdown document",
        permitted_tool_name_list=["text_summarizer", "data_analyser", "document_checker"]
    ),
```

`ParallelAgent` 会自动启动所有子智能体，进行并行计算，并最终返回所有任务的结果。

## 2. 同一智能体并行执行

如果您需要使同一个智能体并行运行多次，可以使用 `start_batch_processing` 方法来批量处理请求。以下是完整的可运行示例：

```python
import asyncio

from pydantic import Field

from oxygent import MAS, Config, OxyRequest, oxy
import os

Config.set_agent_llm_model("default_llm")

oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={
            "temperature": 0.7,
            "max_tokens": 512,
            "chat_template_kwargs": {"enable_thinking": False},
        },
        semaphore=200,
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        llm_model="default_llm",
        semaphore=200,
        timeout=100,
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        outs = await mas.start_batch_processing(["Hello!"] * 10, return_trace_id=True) #并行10次
        print(outs)


if __name__ == "__main__":
    asyncio.run(main())

```

### 说明

1. **`start_batch_processing`**：该方法接收一个包含多个请求的列表，异步并行执行所有请求，并返回结果。如果您希望处理多次相同的请求或不同的请求，可以通过这个方法快速进行批量处理。
2. **`semaphore`**：这是用来控制并发的参数。通过设置适当的并发数，您可以灵活控制系统的资源消耗，避免过多的并行请求导致性能瓶颈。
3. **`return_trace_id=True`**：返回每个请求的 trace ID，便于追踪请求的执行过程和结果。

[上一章：复制相同智能体](./6_1_moa.md)
[下一章：提供响应元数据](./8_1_trust_mode.md)
[回到首页](./readme.md)