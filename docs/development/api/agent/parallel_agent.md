# ParallelAgent
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

## Parameters


| Parameter       | Type / Allowed value | Default | Description                                                                                                      |
| --------------- | -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| *None declared* | —                    | —       | `ParallelAgent` adds **no new dataclass fields**; it inherits every parameter from `LocalAgent` (and its bases). |


## Methods


| Method                        | Coroutine (async) | Return Value  | Purpose (concise)                                                                                                                                                                     |
| ----------------------------- | ----------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_execute(self, oxy_request)` | Yes               | `OxyResponse` | Distributes the incoming task to all permitted tools **concurrently**, collects their outputs, then uses the agent’s LLM to summarise those parallel results into a single response.  |

## Inherited
 Please refer to the [LocalAgent](./local_agent.md) class for inherited parameters and methods.
 
## Usage

A simple usage of `ParallelAgent` is like:
```python
    oxy.ParallelAgent(
        name="expert_panel",
        llm_model="default_llm",
        desc="Expert panel parallel evaluation",
        permitted_tool_name_list=[
            "tech_expert",
            "business_expert",
            "risk_expert",
            "legal_expert",
        ],
        is_master=True,
    ),
```