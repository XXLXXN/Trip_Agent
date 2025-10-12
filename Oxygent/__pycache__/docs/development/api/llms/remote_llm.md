# RemoteLLM
---
The position of the class is:


```markdown
[Oxy](../agent/base_oxy.md)
├── [BaseLLM](./base_llm.md)
    └── [RemoteLLM](./remote_llm.md)
        ├──[HttpLLM](./http_llm.md)
        └──[OpenAILLM](./openai_llm.md)
├── [BaseTool](../tools/base_tools.md)
└── [BaseFlow](../agent/base_flow.md)
```

---

## Introduce

`RemoteLLM` is a concrete implementation of `BaseLLM` for communicating with remote Large Language Model APIs. It provides a standardized interface for connecting to remote LLM services, handling API authentication, request formatting, and response parsing for OpenAI-compatible APIs. This class extends the base functionality with specific remote API communication capabilities.

## Parameters


| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `api_key` | `Optional[str]` | `None` | The API key for authentication with the remote LLM service |
| `base_url` | `Optional[str]` | `""` | The base URL endpoint for the remote LLM API (required) |
| `model_name` | `Optional[str]` | `""` | The specific model name to use for requests (required) |

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute the remote LLM API request and return response (to be implemented by subclasses) |

## Inherited
 Please refer to the [BaseLLM](./base_llm.md) class for inherited parameters and methods.

## Usage

The class `RemoteLLM` must be inherited.
