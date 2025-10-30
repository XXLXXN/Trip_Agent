# 如何建立简单的多智能体系统？

如果您认为单个智能体无法满足业务需求，使用多智能体系统可以有效地解决这个问题。

在下面的简单示例中，我们将功能相关的工具使用子智能体（subagent）进行管理。我们推荐新用户使用 oxy.ReActAgent 来调用这些工具：

```python
    oxy.ReActAgent(
        name="file_agent",
        desc="A tool that can operate the file system",
        tools=["file_tools"],
    ),
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool that can get current time",
        tools=["time_tools"],
    ),
    oxy.ReActAgent(
        name="math_agent",
        desc="A tool that can do math calculates",
        tools=["my_tools"],
    ),
```

接下来，您需要注册一个 **master_agent**，它负责在 MAS 中总调度其他智能体。将其他子智能体声明为 **master_agent** 的 `sub_agents`：
```python
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        sub_agents=["file_agent","time_agent","math_agent"],
    ),
```

OxyGent 的智能体系统结构非常灵活，这意味着您可以注册多层子智能体（subagent），而无需手动管理它们之间的协作关系。

## 完整的可运行样例

以下是可运行的完整代码示例：

```python
"""Demo for using OxyGent with multiple LLMs and an agent."""

import asyncio

from oxygent import MAS, oxy, Config
import os
import prompts
import tools

Config.set_agent_llm_model("default_llm")

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
    oxy.StdioMCPClient(
        name="time_tools",
        params={
            "command": "uvx",
            "args": ["mcp-server-time", "--local-timezone=Asia/Shanghai"],
        },
    ),
    oxy.StdioMCPClient(
        name="my_tools",
        params={
            "command": "uv",
            "args": ["--directory", "./mcp_servers", "run", "my_tools.py"],
        },
    ),
    tools.file_tools,
    oxy.ReActAgent(
        name="file_agent",
        desc="A tool that can operate the file system",
        tools=["file_tools"],
    ),
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool that can get current time",
        tools=["time_tools"],
    ),
    oxy.ReActAgent(
        name="math_agent",
        desc="A tool that can do math calculates",
        tools=["my_tools"],
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        sub_agents=["file_agent","time_agent","math_agent"],
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

[上一章：设置全局数据](./3_2_set_global.md)
[下一章：复制相同智能体](./6_1_moa.md)
[回到首页](./readme.md)