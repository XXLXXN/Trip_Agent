# 如何注册一个本地工具？

在OxyGent中，建议通过[function hub](https://github.com/jd-opensource/OxyGent/blob/main/oxygent/oxy/function_tools/function_hub.py)注册本地工具。您也可可以使用MCP注册工具，具体参考[使用MCP自定义工具](./5_use_mcp_tools.md)或[使用MCP开源工具](./4_use_opensource_tools.md)。

## 步骤 1：创建工具文件
首先，您可以创建一个新的 `tools.py` 文件，并使用 `FunctionHub` 注册一个工具包：

```python
# in tools.py
import os
from pydantic import Field
from oxygent.oxy import FunctionHub

# 注册工具包
file_tools = FunctionHub(name="file_tools")
```
## 步骤 2：注册工具
接下来，您可以使用 `@file_tools.tool()` 装饰器将 Python 函数注册为工具，例如,您可以注册一些基础的文件操作工具：

```python
# in tools.py
@file_tools.tool(
    description="Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories."
)
def write_file(
    path: str = Field(description=""), content: str = Field(description="")
) -> str:
    with open(path, "w", encoding="utf-8") as file:
        file.write(content)
    return "Successfully wrote to " + path

# other tools...
```
## 步骤 3：将工具添加到 Agent

将注册的工具放入 Agent 可以调用的权限域中。Agent 将根据工具的描述自动调用相应工具：

```python
# in execute file
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
    tools.file_tools,
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        tools=["file_tools"],
        llm_model="default_llm",
    ),
]
```
## 完整的可运行样例

以下是完整的代码示例，包括如何创建工具并将其集成到 Agent 中：
```python
import asyncio

from oxygent import MAS, oxy
import os
import prompts
import tools

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
    tools.file_tools, # 工具包可以整个放入oxy_space
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        tools=["file_tools"], # 在这里放入工具
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
## 工具文件示例

以下是 `tools.py` 文件中注册的一些常用工具：
```python
import os

from pydantic import Field

from oxygent.oxy import FunctionHub

file_tools = FunctionHub(name="file_tools")

@file_tools.tool(
    description="Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories."
)
def write_file(
    path: str = Field(description=""), content: str = Field(description="")
) -> str:
    with open(path, "w", encoding="utf-8") as file:
        file.write(content)
    return "Successfully wrote to " + path


@file_tools.tool(
    description="Read the content of a file. Returns an error message if the file does not exist."
)
def read_file(path: str = Field(description="Path to the file to read")) -> str:
    if not os.path.exists(path):
        return f"Error: The file at {path} does not exist."
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


@file_tools.tool(
    description="Delete a file. Returns a success message if the file is deleted, or an error if the file does not exist."
)
def delete_file(path: str = Field(description="Path to the file to delete")) -> str:
    if not os.path.exists(path):
        return f"Error: The file at {path} does not exist."
    os.remove(path)
    return f"Successfully deleted the file at {path}"

```

[上一章：选择智能体种类](./1_4_select_agent.md)
[下一章：使用MCP开源工具](./2_3_use_opensource_tools.md)
[回到首页](./readme.md)