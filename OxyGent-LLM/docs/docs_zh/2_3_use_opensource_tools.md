# 如何使用开源MCP工具？

在使用MCP的过程中，您可能希望使用外部工具。OxyGent支持如同本地工具一样集成外部的开源工具，您可以使用基于MCP协议的`oxy.StdioMCPClient`引入外部工具。

例如，如果您希望使用工具获取时间，您可以使用`mcp-server-time`工具：

```python
oxy.StdioMCPClient(
    name="time_tools",
    params={
        "command": "uvx",
        "args": ["mcp-server-time", "--local-timezone=Asia/Shanghai"],
    },
),
```

## 完整的可运行样例

以下是可运行的完整代码示例：

```python
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
    tools.file_tools,
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        tools=["file_tools","time_tools"],
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

[上一章：注册一个工具](./2_register_single_tool.md)
[下一章：使用MCP自定义工具](./2_4_use_mcp_tools.md)
[回到首页](./readme.md)