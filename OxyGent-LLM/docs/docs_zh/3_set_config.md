# 如何进行设置？

在 OxyGent 中，您可以使用 [设置（Config）](https://github.com/jd-opensource/OxyGent/blob/main/oxygent/config.py) 来管理您的自定义内容。

## 1. 设置 LLM 模型

如果您的多个 Agent 都使用相同的 LLM，您可以通过设置 LLM 来方便地管理这些 Agent，使得所有的 Agent 使用您指定的 `llm_name`：

```python
Config.set_agent_llm_model("default_llm")
```
## 2. 加载设置

您可以通过加载设置的方法导入配置文件：

```python
Config.load_from_json("./config.json", env="default")
```
## 3. 设置模型参数

您可以通过 `Config.set_llm_config` 方法设置模型的参数。例如，设置温度、最大 token 数量和 top-p：

```python
Config.set_llm_config(
    {
        "temperature": 0.2,
        "max_tokens": 2048,
        "top_p": 0.9,
    }
)
```

## 4. 设置日志格式

您可以通过 `Config.set_log_config` 设置日志记录的详细信息，包括日志的路径、日志级别以及颜色等：

```python
Config.set_log_config(
    {
        "path": "./cache_dir/demo.log",
        "level_root": "DEBUG",
        "level_terminal": "DEBUG",
        "level_file": "DEBUG",
        "color_is_on_background": True,
        "is_bright": True,
        "only_message_color": False,
        "color_tool_call": "MAGENTA",
        "color_observation": "GREEN",
        "is_detailed_tool_call": True,
        "is_detailed_observation": True,
    }
)
```
## 5. 设置智能体输入格式

您可以通过 `Config.set_agent_input_schema` 来设置智能体的输入格式，定义输入的属性及必需字段：

```python
Config.set_agent_input_schema(
    {
        "properties": {
            "query": {"description": "Query question"},
            "path": {"description": "File path to save the result"},
        },
        "required": ["query"],
    }
)
```

## 6. 设置结果输出格式

您可以通过 `Config.set_message_config` 设置结果的输出格式，决定是否发送工具调用、观察信息、思考过程或最终答案：

```python
Config.set_message_config(
    {
        "is_send_tool_call": False,
        "is_send_observation": False,
        "is_send_think": False,
        "is_send_answer": True,
    }
)
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
    tools.file_tools,
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        tools=["file_tools"],
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

[上一章：管理工具调用](./2_2_manage_tools.md)
[下一章：设置数据库](./3_1_set_database.md)
[回到首页](./readme.md)