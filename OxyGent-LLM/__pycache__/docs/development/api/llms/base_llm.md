# BaseLLM
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

`BaseLLM` is the abstract base class for all Large Language Model implementations in the OxyGent system. It provides common functionality for LLM implementations including multimodal input processing, think message extraction and forwarding, Base64 conversion for media URLs, and error handling with user-friendly messages.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `category` | `str` | `"llm"` | Category flag identifying the object as an LLM |
| `timeout` | `float` | `300` | Maximum execution time in seconds |
| `llm_params` | `dict` | `{}` | Additional parameters specific to the LLM implementation |
| `is_send_think` | `bool` | `True` | Whether to send think messages to the frontend |
| `friendly_error_text` | `Optional[str]` | `"Sorry, I seem to have encountered a problem. Please try again."` | User-friendly error message displayed when exceptions occur |
| `is_multimodal_supported` | `bool` | `False` | Whether to support multimodal input |
| `is_convert_url_to_base64` | `bool` | `False` | Whether to convert image or video URLs to base64 format |
| `max_image_pixels` | `int` | `10000000` | Maximum pixel count allowed per image |
| `max_video_size` | `int` | `12582912` (12MB) | Maximum video file size in bytes |
| `max_file_size_bytes` | `int` | `2097152` (2MB) | Maximum non-media file size (bytes) for base64 embedding |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_get_messages(oxy_request)` | Yes | `list` | Preprocesses messages for multimodal input, converts URLs to base64 if enabled |
| `_execute(oxy_request)` | Yes | `OxyResponse` | **Abstract method** - Execute the LLM request (must be implemented by subclasses) |
| `_post_send_message(oxy_response)` | Yes | `None` | Extracts and forwards thinking process messages to the frontend |

## Inherited
 Please refer to the [Oxy](../agents/base_oxy.md) class for inherited parameters and methods.
 
## Usage

The class `BaseAgent` must be inherited.

