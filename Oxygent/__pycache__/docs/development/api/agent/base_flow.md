# BaseFlow

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

## Introduce

`BaseFlow` is the base flow module for OxyGent framework.

This module provides the `BaseFlow` class, which serves as the abstract base class for all the agents and flows in the OxyGent system. Flows are specialized Oxy instances that orchestrate complex workflows and coordinate multiple agents or tools.

## Parameters


| Parameter                | Type / Allowed value | Default   | Description                                                                     |
| ------------------------ | -------------------- | --------- | ------------------------------------------------------------------------------- |
| `is_permission_required` | `bool`               | `True`    | Whether this flow requires explicit permission before it can run.               |
| `category`               | `str`                | `"agent"` | Category flag inherited from `Oxy`; flows may later override this to `"flow"`.  |
| `is_master`              | `bool`               | `False`   | Marks the flow as the central “MASTER” controller when set.                     |


## Methods


| Method                        | Coroutine (async) | Purpose (concise)                                                                                         |
| ----------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------- |
| `_execute(self, oxy_request)` | Yes               | Core execution hook for a flow; subclasses **must** implement—current body raises `NotImplementedError`.  |


## Inherited
 Please refer to the [Oxy](./base_oxy.md) class for inherited parameters and methods.

## Usage

The class `BaseFlow` must be inherited.