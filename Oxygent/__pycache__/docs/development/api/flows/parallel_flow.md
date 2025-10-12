# ParallelFlow
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

`ParallelFlow` is a flow that executes multiple tools or agents concurrently for parallel processing workflows. It orchestrates concurrent execution of the same request across all permitted tools simultaneously and aggregates their results into a unified response, enabling efficient parallel processing and result comparison.

## Parameters

No additional parameters beyond inherited ones.

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute the request concurrently across all permitted tools and aggregate results |

## Inherited
 Please refer to the [BaseFlow](../agents/base_flow.md) class for inherited parameters and methods.
 