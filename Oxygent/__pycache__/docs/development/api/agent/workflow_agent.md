# WorkflowAgent
---
The position of the class is:


```markdown
[Oxy](./base_oxy.md)
├── [BaseFlow](./base_flow.md)
    └── [BaseAgent](./base_agent.md)
        ├── [LocalAgent](./local_agent.md)
        │       ├── [ParallelAgent](./parallel_agent.md)
        │       ├── [ReActAgent](./react_agent.md)
        │       ├── [ChatAgent](./chat_agent.md)
        │       └── [WorkflowAgent](./workflow_agent.md)
        └── [RemoteAgent](./remote_agent.md)
                └── [SSEOxyGent](./sse_oxy_agent.md)
└── [BaseTool](../tools/base_tools.md)
```
---

## Introduction

`ReActAgent` is the agent implementing the ReAct (Reasoning and Acting) paradigm.

## Parameters


| Parameter                 | Type / Allowed value                         | Default       | Description                                              |
| ------------------------- | -------------------------------------------- | ------------- | -------------------------------------------------------- |
| `func_workflow`        | `Optional[Callable]`                                        | `None`          | The workflow function to execute              |

## Methods


| Method                                                        | Coroutine (async) | Return Value    | Purpose (concise)                                                                                                 |
| ------------------------------------------------------------- | ----------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |

| `_execute(oxy_request)`                                       | Yes               | `OxyResponse`   | Execute func_workflow                       |


## Inherited
 Please refer to the [LocalAgent](./local_agent.md) class for inherited parameters and methods.

## Usage
A simple usage of `WorkflowAgent` is like:

```python
    oxy.WorkflowAgent(
        name="workflow_agent",
        desc="An agent for executing workflows",
        func_workflow=my_workflow_function,
    ),
```

Where `my_workflow_function` is a callable that defines the workflow logic to be executed by the agent.
