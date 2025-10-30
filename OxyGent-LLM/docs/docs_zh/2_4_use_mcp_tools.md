# 如何使用自定义MCP工具？

在OxyGent中，您可以通过本地模式或SSE模式注册自定义MCP工具。

## 1.本地MCP工具

首先，创建一个 `mcp_servers` 文件夹，并在 `/mcp_servers/my_tools.py` 文件中使用 `FastMCP` 声明一个 MCP 实例：

```python
# mcp_servers/my_tools.py
import math
from decimal import Decimal, getcontext

from mcp.server.fastmcp import FastMCP
from pydantic import Field

# Initialize FastMCP server instance
mcp = FastMCP()
```

接着，您可以使用类似 `FunctionHub` 的方式注册工具：

```python
# mcp_servers/my_tools.py
@mcp.tool(description="Index tool")
def power(
    n: int = Field(description="base"), m: int = Field(description="index", default=2)
) -> int:
    return math.pow(n, m)
# other tools...
```

然后，您可以在 `oxy_space` 中调用这些工具：

```python
    oxy.StdioMCPClient(
        name="my_tools",
        params={
            "command": "uv",
            "args": ["--directory", "./mcp_servers", "run", "my_tools.py"],
        },
    ),
```
## 完整的可运行样例

以下是完整的代码示例，展示了如何在 OxyGent 中使用多个 LLM 和一个 Agent，并调用自定义的 MCP 工具：
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
        name="master_agent",
        is_master=True,
        tools=["file_tools","time_tools","my_tools"],
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

```python
#mcp_servers/my_tools.py
import math
from decimal import Decimal, getcontext

from mcp.server.fastmcp import FastMCP
from pydantic import Field

# Initialize FastMCP server instance
mcp = FastMCP()


@mcp.tool(description="Index tool")
def power(
    n: int = Field(description="base"), m: int = Field(description="index", default=2)
) -> int:
    return math.pow(n, m)


@mcp.tool(description="Pi tool")
def calc_pi(prec: int = Field(description="How many digits after the dot")) -> float:
    """
    Calculate pi using the Chudnovsky algorithm for high precision.

    This implementation uses the Chudnovsky algorithm, which converges very rapidly.
    Each term in the series provides approximately 8 decimal digits of precision.

    Args:
        prec: The number of decimal places to calculate

    Returns:
        float: The value of pi with the specified precision
    """
    getcontext().prec = prec
    x = 0
    for k in range(
        int(prec / 8) + 1
    ):  # Calculate the series: each iteration provides ~8 decimal digits of precision
        a = 2 * Decimal.sqrt(Decimal(2)) / 9801
        b = math.factorial(4 * k) * (1103 + 26390 * k)
        c = pow(math.factorial(k), 4) * pow(396, 4 * k)
        x = x + a * b / c
    return 1 / x

# ---------------------------------------------------------------

# Entry point: run the MCP server when script is executed directly
if __name__ == "__main__":
    mcp.run()
```

## 2.SSE MCP工具

如果需要使用SSE MCP工具，您可以在声明`FastMCP`对象时增加端口参数：

```python
mcp = FastMCP("my_tools", port=9000)
```

然后您可以通过在`sse_url`中传入端口的方式注册工具到OxyGent：

```python
oxy.SSEMCPClient(
    name="my_tools",
    sse_url="http://127.0.0.1:9000/sse"
),
```

[上一章：使用MCP开源工具](./2_3_use_opensource_tools.md)
[下一章：管理工具调用](./2_2_manage_tools.md)
[回到首页](./readme.md)