# PlanAndSolve
---
The position of the class is:


```markdown
[Oxy](../agent//base_oxy.md)
├── [BaseFlow](./base_flow.md)
    ├── [WorkFlow](./workflow.md)
    ├── [ParallelFlow](./parallel_flow.md)
    ├── [PlanAndSolve](./plan_and_solve.md)
    ├── [Reflexion](./reflexion.md)
    └── [BaseAgent](../agent/base_agent.md)
        ├── [LocalAgent](../agent/local_agent.md)
        │       ├── [ParallelAgent](../agent/parallel_agent.md)
        │       ├── [ReActAgent](../agent/react_agent.md)
        │       ├── [ChatAgent](../agent/chat_agent.md)
        │       └── [WorkflowAgent](../agent/workflow_agent.md)
        └── [RemoteAgent](../agent/remote_agent.md)
                └── [SSEOxyGent](../agent/sse_oxy_agent.md)
└── [BaseTool](../tools/base_tools.md)
```

---

## Introduce

`PlanAndSolve` is a prompting workflow that implements a plan-and-solve strategy for complex problem-solving. It breaks down complex tasks into structured plans through a planner agent, then executes each step sequentially through an executor agent, with optional replanning capabilities for adaptive execution.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `max_replan_rounds` | `int` | `30` | Maximum retries for operations |
| `planner_agent_name` | `str` | `"planner_agent"` | Name of the planner agent for creating execution plans |
| `pre_plan_steps` | `List[str]` | `None` | Pre-defined plan steps to use instead of generating new ones |
| `enable_replanner` | `bool` | `False` | Whether to enable dynamic replanning during execution |
| `executor_agent_name` | `str` | `"executor_agent"` | Name of the executor agent for step execution |
| `llm_model` | `str` | `"default_llm"` | LLM model name for fallback operations |
| `func_parse_planner_response` | `Optional[Callable]` | `None` | Custom planner response parser function |
| `pydantic_parser_planner` | `PydanticOutputParser` | `PydanticOutputParser(Plan)` | Pydantic parser for planner responses |
| `func_parse_replanner_response` | `Optional[Callable]` | `None` | Custom replanner response parser function |
| `pydantic_parser_replanner` | `PydanticOutputParser` | `PydanticOutputParser(Action)` | Pydantic parser for replanner responses |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute the plan-and-solve workflow with planning and sequential execution |

## Inherited
 Please refer to the [BaseFlow](../agents/base_flow.md) class for inherited parameters and methods.
 
## Usage

```python
oxy.PlanAndSolve(
    name="master_agent",
    is_discard_react_memory=True,
    llm_model="default_llm",
    is_master=True,
    planner_agent_name="planner_agent",
    executor_agent_name="executor_agent",
    enable_replanner=False,
    timeout=100,
)
```