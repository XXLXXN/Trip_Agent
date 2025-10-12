# 如何选择智能体？

OxyGent提供了很多种预设智能体，这些智能体足以帮助您完成基础的MAS构建，以下是简要介绍：

## `oxy.ChatAgent`

`oxy.ChatAgent`是最初级的聊天agent，功能和内部的LLM大致相同。您可以使用`oxy.ChatAgent`进行文本相关的工作。

```python
    oxy.ChatAgent(
        name="planner_agent",
        desc="An agent capable of making plans",
        llm_model="default_llm",
        prompt="""
            For a given goal, create a simple and step-by-step executable plan. \
            The plan should be concise, with each step being an independent and complete functional module—not an atomic function—to avoid over-fragmentation. \
            The plan should consist of independent tasks that, if executed correctly, will lead to the correct answer. \
            Ensure that each step is actionable and includes all necessary information for execution. \
            The result of the final step should be the final answer. Make sure each step contains all the information required for its execution. \
            Do not add any redundant steps, and do not skip any necessary steps.
        """.strip(),
    )
```

## `oxy.WorkFlowAgent`

在Chat的基础上增加[工作流](./9_workflow.md)，可以自定义内部流程走向的Agent。

```python
    oxy.WorkflowAgent(
        name='search_agent',
        desc='一个可以查询数据的工具',
        sub_agents=['ner_agent', 'nen_agent'],
        func_workflow=data_workflow,
        llm_model='default_llm',
    )
```

## `oxy.ReActAgent`

一种支持[规划、执行、观察、纠错重试](https://www.promptingguide.ai/zh/techniques/react)的agent，适合进行复杂的工作, 常常作为master_agent。

```python
    oxy.ReActAgent(
        name="master_agent",
        sub_agents=["knowledge_agent", "find_agent", "search_agent"],
        is_master=True,
        llm_model="default_llm",
    )
```

ReActAgent包含一些独特的可调节参数，包括：

+ `max_react_rounds: int `：最大react轮数
+ `trust_mode: bool`：是否[提供响应元数据](./8_1_trust_mode.md)
+ `func_parse_llm_response: Optional[Callable[[str], LLMResponse]]` ：[处理LLM输出](./8_2_handle_output.md)

## `oxy.SSEOxygent`

支持[分布式](./11_dstributed.md)的agent。

```python
    oxy.MASAgent(
        name = 'math_agent',
        desc = '一个可以查询圆周率的工具',
        server_url = 'http://127.0.0.1:8081'
    )
```

## `oxy.ParallelAgent`

支持[并行](./7_parallel.md)的agent。

```python
    oxy.ParallelAgent(
        name="analyzer",
        desc="A tool that analyze markdown document",
        permitted_tool_name_list=["text_summarizer", "data_analyser", "document_checker"]
    ),
```

[上一章：预设提示词](./1_3_select_prompt.md)
[下一章：注册一个工具](./2_register_single_tool.md)
[回到首页](./readme.md)