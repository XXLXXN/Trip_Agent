# Reflexion
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

`Reflexion` is a flow for iterative answer improvement through self-reflection. It coordinates between a worker agent that generates answers and a reflexion agent that evaluates and provides feedback, enabling continuous improvement of responses through multiple rounds of refinement.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `max_reflexion_rounds` | `int` | `3` | Maximum reflexion iterations |
| `worker_agent` | `str` | `"worker_agent"` | Worker agent name for generating answers |
| `reflexion_agent` | `str` | `"reflexion_agent"` | Reflexion agent name for evaluation |
| `func_parse_worker_response` | `Optional[Callable]` | `None` | Custom worker response parser function |
| `func_parse_reflexion_response` | `Optional[Callable]` | `None` | Custom reflexion response parser function |
| `pydantic_parser_reflexion` | `PydanticOutputParser` | `PydanticOutputParser(ReflectionEvaluation)` | Pydantic parser for reflexion responses |
| `evaluation_template` | `str` | Default template | Template for evaluation query |
| `improvement_template` | `str` | Default template | Template for improvement query |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute the reflexion flow with iterative improvement |

## Inherited
 Please refer to the [BaseFlow](../agents/base_flow.md) class for inherited parameters and methods.
 
## Usage

```python
oxy.Reflexion(
    name="general_reflexion",
    worker_agent="worker_agent",
    reflexion_agent="reflexion_agent",
    evaluation_template="...",
    max_reflexion_rounds=3,
),
```