# Oxy

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
`Oxy` is the abstract base class for all agents and tools in the OxyGent system.

This class defines the core execution lifecycle, permission management,message handling, and data persistence patterns. It provides a unifiedinterface for both local and remote execution with comprehensive logging and error handling capabilities.

## Parameters
| Parameter                        | Type / Allowed value | Default                                    | Description                        |
| -------------------------------- | -------------------- | ------------------------------------------ | ---------------------------------- |
| `name`                           | `str`                | must be assigned                           | Identifier for the agent/tool      |
| `desc`                           | `str`                | `""`                                       | Human-readable description         |
| `category`                       | `str`                | `"tool"`                                   | Category classification            |
| `class_name`                     | `Optional[str]`      | `None`                                     | Class name (filled post-init)      |
| `input_schema`                   | `dict[str, Any]`     | `{}`                                       | Input schema definition            |
| `desc_for_llm`                   | `str`                | `""`                                       | Description shown to LLM           |
| `is_entrance`                    | `bool`               | `False`                                    | Whether this is a MAS entry point  |
| `is_permission_required`         | `bool`               | `False`                                    | Whether execution needs permission |
| `is_save_data`                   | `bool`               | `True`                                     | Persist execution data to store    |
| `permitted_tool_name_list`       | `list`               | `[]`                                       | Tools the agent/tool may call      |
| `extra_permitted_tool_name_list` | `list`               | `[]`                                       | Additional tool permissions        |
| `is_send_tool_call`              | `bool`               | `Config.get_message_is_send_tool_call()`   | Send *tool\_call* messages         |
| `is_send_observation`            | `bool`               | `Config.get_message_is_send_observation()` | Send *observation* messages        |
| `is_send_answer`                 | `bool`               | `Config.get_message_is_send_answer()`      | Send *answer* messages             |
| `is_detailed_tool_call`          | `bool`               | `Config.get_log_is_detailed_tool_call()`   | Verbose *tool\_call* logging       |
| `is_detailed_observation`        | `bool`               | `Config.get_log_is_detailed_observation()` | Verbose *observation* logging      |
| `func_process_input`             | `Callable`           | `lambda x: x`                              | Pre-processing hook for requests   |
| `func_process_output`            | `Callable`           | `lambda x: x`                              | Post-processing hook for responses |
| `func_format_input`              | `Optional[Callable]` | `lambda x: x`                              | Format request for the callee      |
| `func_format_output`             | `Optional[Callable]` | `lambda x: x`                              | Format response for the caller     |
| `func_execute`                   | `Optional[Callable]` | `None`                                     | Custom execution entrypoint        |
| `mas`                            | `Optional[Any]`      | `None`                                     | Reference to MAS instance          |
| `friendly_error_text`            | `Optional[str]`      | `None`                                     | User-facing fallback error message |
| `semaphore`                      | `int`                | `16`                                       | Maximum concurrent executions      |
| `timeout`                        | `float`              | `3600`                                     | Timeout (seconds)                  |
| `retries`                        | `int`                | `2`                                        | Retry attempts on failure          |
| `delay`                          | `float`              | `1.0`                                      | Delay (seconds) between retries    |

## Methods
| Method                              | Coroutine （async） | Purpose (concise)                                        |
| ----------------------------------- | ----------------- | -------------------------------------------------------- |
| `__init__(**kwargs)`                | No                | Construct object, initialise semaphore & LLM description |
| `model_post_init(__context)`        | No                | Fill `class_name` after Pydantic init                    |
| `set_mas(mas)`                      | No                | Attach MAS reference                                     |
| `add_permitted_tool(tool_name)`     | No                | Add one tool to permission list                          |
| `add_permitted_tools(tool_names)`   | No                | Batch-add tool permissions                               |
| `_set_desc_for_llm()`               | No                | Build human/LLM-friendly argument doc                    |
| `init()`                            | Yes               | in inheritance                                           |
| `_pre_process(oxy_request)`         | Yes               | Populate IDs, stacks, run input hook                     |
| `_pre_log(oxy_request)`             | Yes               | Emit *tool\_call* log entry                              |
| `_request_interceptor(oxy_request)` | Yes               | Restore cached output for restarts                       |
| `_pre_save_data(oxy_request)`       | Yes               | Persist initial node metadata                            |
| `_format_input(oxy_request)`        | Yes               | Apply caller-side formatting                             |
| `_pre_send_message(oxy_request)`    | Yes               | Forward *tool\_call* message to front-end                |
| `_before_execute(oxy_request)`      | Yes               | Custom hook before main execution                        |
| `_execute(oxy_request)`             | Yes               | in inheritance                                           |
| `_handle_exception(e)`              | Yes               | in inheritance                                           |
| `_after_execute(oxy_response)`      | Yes               | Custom hook after main execution                         |
| `_post_process(oxy_response)`       | Yes               | Apply response post-processing                           |
| `_post_log(oxy_response)`           | Yes               | Emit *observation* log                                   |
| `_post_save_data(oxy_response)`     | Yes               | Persist final node data                                  |
| `_format_output(oxy_response)`      | No                | Final formatting & friendly-error swap                   |
| `_post_send_message(oxy_response)`  | Yes               | Send *observation* / *answer* to front-end               |
| `execute(oxy_request)`              | Yes               | Orchestrate the full async lifecycle with retries        |

> Methods whose bodies are just `pass` are flagged “in inheritance”, meaning subclasses must implement them.

## Usage

The class `Oxy` must be inherited.