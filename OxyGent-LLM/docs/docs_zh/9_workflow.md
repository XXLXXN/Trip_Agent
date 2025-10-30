# 如何使用工作流？

## 简单实例

OxyGent支持以外部工作流控制智能体的工作次序。您可以通过在工作流中使用 `call` 方法指定智能体的任务执行顺序。例如，在 `demo.py` 中，我们使用工作流确保智能体在计算 Pi 之前首先查询时间：

```python
async def workflow(oxy_request: OxyRequest):
    short_memory = oxy_request.get_short_memory()
    print("--- History record --- :", short_memory)
    master_short_memory = oxy_request.get_short_memory(master_level=True)
    print("--- History record-User layer --- :", master_short_memory)
    print("user query:", oxy_request.get_query(master_level=True))
    await oxy_request.send_message("msg")
    oxy_response = await oxy_request.call(
        callee="time_agent",
        arguments={"query": "What time is it now in Asia/Shanghai?"},
    )
    print("--- Current time --- :", oxy_response.output)
    oxy_response = await oxy_request.call(
        callee="default_llm",
        arguments={
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello!"},
            ],
            "llm_params": {"temperature": 0.6},
        },
    )
    print(oxy_response.output)
    import re

    numbers = re.findall(r"\d+", oxy_request.get_query())
    if numbers:
        n = numbers[-1]
        oxy_response = await oxy_request.call(callee="calc_pi", arguments={"prec": n})
        return f"Save {n} positions: {oxy_response.output}"
    else:
        return "Save 2 positions: 3.14, or you could ask me to save how many positions you want."
```

在此工作流中，我们先查询时间，再进行文档分析，并最终保存计算结果。工作流需要一个上层的 Agent 进行执行，您可以使用 `oxy.WorkflowAgent` 来控制工作流：

```python
    oxy.WorkflowAgent(
        name="math_agent",
        desc="A tool for pi query",
        sub_agents=["time_agent"],
        tools=["my_tools"],
        func_workflow=workflow,
        is_retain_master_short_memory=True,
    ),
```
完整的样例请参考`demo.py`。

## 构建 Workflow

Workflow是一种非常精细的方法，下面将以[如何自定义处理提示词？](./8_update_prompts.md)中的例子入手，逐步写一个可以运行的workflow。

### 假设的工作需求

假设我们的工作需求是：

> 为用户输入的文档写一段总结，并将带时间的总结存储在 `output.txt` 文件里。

可以将工作流拆分为如下步骤：

1. 获取时间（不需要原始输入）
2. 分析文档（需要用户原始输入）
3. 写入文件（需要前两步的输出）

### 将步骤转化为代码

#### 获取时间（不需要原始输入）

```python
    time_resp = await oxy_request.call(
        callee="time_agent", arguments={"query": "现在的北京时间是？"}
    )
    current_time = time_resp.output
```

#### 分析文档（需要用户原始输入）

```python
    # 使用get_query获取用户原始输入
    user_query = oxy_request.get_query(master_level=True)

    analysis_resp = await oxy_request.call(
        callee="analyzer",
        arguments={"query": f"请分析文档：{user_query}"},
    )
    analysis_result = analysis_resp.output
```

#### 写入文件（需要前两步的输出）

```python
final_content = f"时间：{current_time}\n\n分析结果：{analysis_result}"
    file_resp = await oxy_request.call(
        callee="file_agent",
        arguments={"query": f"请将以下内容写入 output.txt：\n{final_content}"},
    )
```

### 包装一个workflow

将上述步骤按照顺序包装成一个工作流，需要传入一个 `OxyRequest` 对象作为参数：

```python
async def workflow(oxy_request: OxyRequest):
    # Step 1: 获取时间
    time_resp = await oxy_request.call(
        callee="time_agent", arguments={"query": "现在的北京时间是？"}
    )
    current_time = time_resp.output
    print("== 当前时间 ==\n", current_time)

    # 后续的steps...
    return "流程完成，output.txt 写入成功"
```

### 指定一个调用workflow的agent

通过 `oxy.WorkflowAgent` 控制整个工作流，并指定其调用的 subagent 和所需工具：

```python
    oxy.WorkflowAgent(
        name="workflow_agent",
        desc="时间获取 + 文档分析 + 写入文件的工作流",
        sub_agents=["file_agent", "time_agent", "analyzer"],
        func_workflow=workflow,
        llm_model="default_llm",
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        sub_agents=["workflow_agent"],
    ),
```

预期的输出结果是：

```markdown
时间：当前的北京时间是2025年7月25日09:27:01。

分析结果：Based on the parallel execution of the tasks, the following summary has been compiled and stored in the `output.txt` file:

---

**当前时间：2023-12-05 10:00:00**

**总结：**

...

---

以上总结已存储在`output.txt`文件中。
```

## 完整的可运行样例

以下是可运行的完整代码示例：

```python
import asyncio
from oxygent import MAS, OxyRequest, Config, oxy
import os
import tools
import prompts

# 设置 LLM 模型
Config.set_agent_llm_model("default_llm")

# Workflow 核心逻辑
async def workflow(oxy_request: OxyRequest):
    # Step 1: 获取时间
    time_resp = await oxy_request.call(
        callee="time_agent", arguments={"query": "现在的北京时间是？"}
    )
    current_time = time_resp.output
    print("== 当前时间 ==\n", current_time)

    # Step 2: 获取用户原始 markdown 文件 query
    user_query = oxy_request.get_query(master_level=True)

    # Step 3: 分析文档（保留原始 query 作为文件路径）
    analysis_resp = await oxy_request.call(
        callee="analyzer",
        arguments={"query": f"请分析文档：{user_query}"},
    )
    analysis_result = analysis_resp.output
    print("== 分析结果 ==\n", analysis_result)

    # Step 4: 写入文件
    final_content = f"时间：{current_time}\n\n分析结果：{analysis_result}"
    file_resp = await oxy_request.call(
        callee="file_agent",
        arguments={"query": f"请将以下内容写入 output.txt：\n{final_content}"},
    )
    print("== 写入文件结果 ==\n", file_resp.output)
    return "流程完成，output.txt 写入成功"

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
        name="file_agent",
        desc="A tool that can operate the file system",
        tools=["file_tools"],
    ),
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool that can get current time",
        tools=["time_tools"],
    ),
    oxy.ChatAgent(
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
        desc="文档校验器",
        prompt=prompts.document_checker_prompt,
    ),
    oxy.ParallelAgent(
        name="analyzer",
        desc="A tool that analyze markdown document",
        permitted_tool_name_list=["text_summarizer", "data_analyser", "document_checker"],
    ),
    oxy.WorkflowAgent(
        name="workflow_agent",
        desc="时间获取 + 文档分析 + 写入文件的工作流",
        sub_agents=["file_agent", "time_agent", "analyzer"],
        func_workflow=workflow,
        llm_model="default_llm",
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        sub_agents=["workflow_agent"],
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

[上一章：反思重做模式](./8_3_reflexion.md)
[下一章：创建流](./9_2_preset_flow.md)
[回到首页](./readme.md)