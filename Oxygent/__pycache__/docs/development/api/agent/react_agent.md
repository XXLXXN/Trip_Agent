# ReActAgent
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
| `max_react_rounds`        | `int`                                        | `16`          | Maximum reasoning–acting cycles per request              |
| `is_discard_react_memory` | `bool`                                       | `True`        | Drop detailed ReAct memory and keep only Q-A pairs       |
| `func_map_memory_order`   | `Callable[[int], int]`                       | `lambda x: x` | Maps the chronological order of a QA pair to a score     |
| `memory_max_tokens`       | `int`                                        | `24800`       | Token budget for memory trimming                         |
| `weight_short_memory`     | `int`                                        | `5`           | Importance weight given to short-term memory             |
| `weight_react_memory`     | `int`                                        | `1`           | Importance weight given to ReAct memory shards           |
| `trust_mode`              | `bool`                                       | `False`       | When `True`, return tool results directly to the user    |
| `func_parse_llm_response` | `Optional[Callable[[str], LLMResponse]]`     | `None`        | Custom parser for raw LLM output                         |
| `func_reflexion`          | `Optional[Callable[[str, OxyRequest], str]]` | `None`        | Callback that critiques an LLM answer and asks for fixes |

## Methods

| Method                                                        | Coroutine (async) | Return Value    | Purpose (concise)                                                                                                 |
| ------------------------------------------------------------- | ----------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `__init__(**kwargs)`                                          | No                | `None`          | Initialise prompt, response parser, reflexion function and attach `retrieve_tools` if vector search is configured |
| `_default_reflexion(response, oxy_request)`                   | No                | `Optional[str]` | Basic quality check — returns feedback if the LLM reply is empty                                                  |
| `_get_history(oxy_request, is_get_user_master_session=False)` | Yes               | `Memory`        | Retrieve and intelligently prune conversation history (scored & token-limited)                                    |
| `_parse_llm_response(ori_response, oxy_request=None)`         | No                | `LLMResponse`   | Detects *tool call*, *answer*, or *format error* and structures the result                                        |
| `_execute(oxy_request)`                                       | Yes               | `OxyResponse`   | Implements the ReAct loop: think → call tools → observe → repeat until answer or max rounds                       |

## Inherited
 Please refer to the [LocalAgent](./local_agent.md) class for inherited parameters and methods.

## Usage

A simple usage of `ReActAgent` is like:

```python
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool that can query the time",
        tools=["time_tools"],
        llm_model="default_llm",
        prompt=SYSTEM_PROMPT,
        timeout=30,
        is_multimodal_supported=False,
        semaphore=2
    ),
```