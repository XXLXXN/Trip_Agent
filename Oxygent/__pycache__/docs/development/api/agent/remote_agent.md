# RemoteAgent
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

`RemoteAgent`is the base class for agents that communicate with remote systems.

This agent provides the foundation for connecting to and interacting with remote agent systems over HTTP/HTTPS.

## Parameters


| Parameter    | Type / Allowed value | Default          | Description                                                              |
| ------------ | -------------------- | ---------------- | ------------------------------------------------------------------------ |
| `server_url` | `AnyUrl`             | must be assigned | URL of the remote agent server; must start with `http://` or `https://`  |
| `org`        | `dict`               | `{}`             | Cached organization tree retrieved from the remote system                |


## Methods


| Method                        | Coroutine (async) | Return Value  | Purpose (concise)                                                                                          |
| ----------------------------- | ----------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| `check_protocol(cls, v)`      | No                | `AnyUrl`      | Field-validator that rejects URLs whose scheme is not HTTP/HTTPS                                           |
| `get_org(self)`               | No                | `list[dict]`  | Deep-copies `self.org["children"]`, marks every node with `is_remote = True`, and returns the updated list |
| `_execute(self, oxy_request)` | Yes               | `OxyResponse` | Abstract placeholder for remote invocation; currently raises `NotImplementedError`                         |

## Inherited
 Please refer to the [BaseAgent](./base_agent.md) class for inherited parameters and methods.
 
## Usage

The class `RemoteAgent` must be inherited.