# SSEOxyGent
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

`SSEOxyGent` is the agent for communicating with remote Multi-Agent Systems via SSE (Server-Sent Events).

## Parameters


| Parameter             | Type / Allowed value | Default | Description                                                                                                                     |
| --------------------- | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `is_share_call_stack` | `bool`               | `True`  | Whether to forward the caller’s `call_stack`/`node_id_stack` to the remote agent, so tool-call chains remain visible upstream.  |


## Methods


| Method                  | Coroutine （async） | Return Value  | Purpose (concise)                                                                                                                                                                               |
| ----------------------- | ----------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init()`                | Yes               | `None`        | Calls the parent `init`, then queries `GET /get_organization` on `server_url` to cache the remote organization tree in `self.org`.                                                              |
| `_execute(oxy_request)` | Yes               | `OxyResponse` | Opens an **SSE** connection to `POST /sse/chat`, streams tool-call / observation events back to the MAS, accumulates the final answer, and returns it wrapped in an `OxyResponse (COMPLETED)`.  |

## Inherited
 Please refer to the [RemoteAgent](./remote_agent.md) class for inherited parameters and methods.

## Usage

A simple usage of `SSEOxyGent` is like:

```python
    oxy.SSEOxyGent(
        name="time_agent",
        desc="An tool for time query",
        server_url="http://127.0.0.1:8082",
    ),
```