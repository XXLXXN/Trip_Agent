# OpenAILLM
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

OpenAILLM is a concrete implementation of RemoteLLM specifically designed for OpenAI's language models. It uses the official AsyncOpenAI client for optimal performance and compatibility with OpenAI's API standards. This class supports all OpenAI models and compatible APIs, handling payload construction, configuration merging, and response processing for OpenAI's chat completion API.

## Parameters

No additional parameters beyond inherited ones.

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute a request using the OpenAI API, creating a chat completion request and processing the response |

## Inherited
 Please refer to the [RemoteLLM](./remote_llm.md) class for inherited parameters and methods.

## Usage
```python
    oxy.OpenAILLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"), 
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
    ),
```


