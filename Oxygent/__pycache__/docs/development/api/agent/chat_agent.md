# ChatAgent
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


| Parameter       | Type / Allowed value | Default | Description                                                                                                                                               |
| --------------- | -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *None declared* | —                    | —       | `ChatAgent` introduces **no new dataclass fields**; it **inherits** every parameter already defined in `LocalAgent` (and therefore in `BaseAgent`/`Oxy`). |


## Methods


| Method                        | Coroutine (async) | Return Value  | Purpose (concise)                                                                                                                                                                               |
| ----------------------------- | ----------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_execute(self, oxy_request)` | Yes               | `OxyResponse` | Builds a temporary conversation **memory**, appends the latest user query, merges any `llm_params`, and calls the configured LLM model; returns the model’s reply wrapped in an `OxyResponse`.  |

## Inherited
 Please refer to the [LocalAgent](./local_agent.md) class for inherited parameters and methods.

## Usage

A simple usage of `ChatAgent` is like:
```python
    oxy.ChatAgent(
        name="planner_agent",
        desc="An agent capable of making plans",
        llm_model="default_llm",
        prompt="""
            For a given goal, create a simple and step-by-step executable plan. \
            The plan should be concise, with each step being an independent and complete functional module—not an atomic function—to avoid over-fragmentation. \
            The plan should consist of independent tasks that, if executed correctly, will lead to the correct answer. \
            Ensure that each step is actionable and includes all necessary information for execution. \
            The result of the final step should be the final answer. Make sure each step contains all the information required for its execution. \
            Do not add any redundant steps, and do not skip any necessary steps.
        """.strip(),
    ),
```