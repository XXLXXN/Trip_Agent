# BaseAgent
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

`BaseAgent` is the base class of all the agents. 

Agents are the core building block in your apps. A typical agent uses a large language model (LLM) to think, and it can call other agents or tools to execute functions.

## Parameters


| Parameter      | Type / Allowed value | Default                           | Description                                                                     |
| -------------- | -------------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| `category`     | `str`                | `"agent"`                         | Category flag identifying the object as an *agent* rather than a tool or flow.  |
| `input_schema` | `dict[str, Any]`     | `Config.get_agent_input_schema()` | JSON-schema-style definition of the accepted input arguments for this agent.    |

## Methods


| Method                                | Coroutine (async) | Return Value | Purpose (concise)                                                                                                           |
| ------------------------------------- | ----------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `_pre_process(self, oxy_request)`     | Yes               | `OxyRequest` | Resolve trace stacks, load parent-trace metadata when the caller is a user, then delegate to the superclass pre-processor.  |
| `_pre_save_data(self, oxy_request)`   | Yes               | `None`       | Persist an initial trace record to Elasticsearch before execution begins.                                                   |
| `_post_save_data(self, oxy_response)` | Yes               | `None`       | Update the trace with the final output and (optionally) log conversation history after execution completes.                 |

## Inheritance

The class `BaseAgent` inherits from `Oxy` and must be inherited by all agents.


## Inherited
 Please refer to the [Oxy](./base_oxy.md) class for inherited parameters and methods.
## Usage

The class `BaseAgent` must be inherited.