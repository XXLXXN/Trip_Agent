# Workflow
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

`Workflow` is a flow that executes custom workflow functions within the OxyGent flow system. It serves as a bridge between the flow framework and user-defined workflow logic, enabling execution of custom workflow functions that accept OxyRequest and return OxyResponse.

## Parameters


| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `func_workflow` | `Optional[Callable]` | `None` | The custom workflow function to execute |

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute the custom workflow function with the given request |

## Inherited
 Please refer to the [BaseFlow](../agents/base_flow.md) class for inherited parameters and methods.
 
## Usage

```python
    oxy.Workflow(
        name="custom_workflow",
        desc="A flow for executing custom workflow functions",
        func_workflow=my_workflow_function,
    ),
```

Where `my_workflow_function` is a callable that defines the workflow logic to be executed within the flow system.