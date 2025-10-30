# HttpLLM
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

`HttpLLM` is an HTTP-based Large Language Model implementation that provides a concrete implementation of RemoteLLM for communicating with remote language model APIs over HTTP. It supports various LLM providers that follow OpenAI-compatible API standards, including OpenAI, Google Gemini, and Ollama, with automatic provider detection and format handling.

## Parameters

No additional parameters beyond inherited ones.

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute an HTTP request to the remote LLM API with authentication and response parsing |

## Inherited
 Please refer to the [RemoteLLM](./remote_llm.md) class for inherited parameters and methods.
 
## Usage

```python
oxy.HttpLLM(
    name="default_name",
    api_key=os.getenv("DEFAULT_LLM_API_KEY"),
    base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
    model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
    llm_params={"temperature": 0.01},
    semaphore=4,
)
```
