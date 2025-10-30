# 如何调用LLM模型？

OxyGent所指的LLM是传统的LLM形式，它支持输入一个字符串并输出一个字符串。您可以通过`oxy.HttpLLM`或者`oxy.OpenAILLM`调用模型。

## 调用一般模型

```python
    import os

    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4, # 并发量
        timeout=240, # 最大执行时间
    ),
```

对于常见的开源模型和闭源模型，OxyGent均支持以这种方式进行调用。
> OxyGent支持直接url调用和加后缀`/chat/completions`的模型调用。

## 调用OpenAI接口模型

对于支持OpenAI接口的模型，可以使用以下方法进行调用：

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

## 调用ollama部署模型

如果您使用ollama在本地部署了模型，请使用以下方式进行调用：

```python
    oxy.HttpLLM(                
        name="local_gemma",  
        # 注意不要传入api_key参数
        base_url="http://localhost:11434/api/chat", # 替换为本地的url接口
        model_name=os.getenv("DEFAULT_OLLAMA_MODEL"),   
        llm_params={"temperature": 0.2},    
        semaphore=1,              
        timeout=240,
    ),
```
### url补全说明

OxyGent支持自动补全url，补全逻辑简要如下：
```python
        if is_gemini:                                                    
            if not url.endswith(":generateContent"):
                url = f"{url}/models/{self.model_name}:generateContent"
        elif use_openai:
            if not url.endswith("/chat/completions"):
                url = f"{url}/chat/completions"
        else:
            if not url.endswith("/api/chat"): # only support ollama
                url = f"{url}/api/chat"
```
因此，请您注意以下内容，如果您遇到404问题，大概率是url错误导致的：
- 使用Gemini是可以直接传入模型api，例如`https://generativelanguage.googleapis.com/v1beta`
- 使用通用开源模型（DeepSeek, Qwen）时，即使api_key为EMPTY，也请您写在环境变量中并传入`oxy.HttpLLM`。
- 使用基于OpenAI协议的闭源模型（ChatGPT）时，请使用`oxy.OpenAILLM`。
- 使用ollama模型时，不要传入`api_key`参数。

## 常用参数设置
OxyGent支持细致设置模型参数，您可以在调用时或者在[设置](./3_set_config.md)里设置LLM参数。以下是一些常用的参数列表：
- **category**: 始终为"llm"，表示这是LLM模型的配置。
- **timeout**: 最大执行时间，单位为秒。
- **llm_params**: 模型的额外参数（如温度设置等）。
- **is_send_think**: 是否向前端发送思考消息。
- **friendly_error_text**: 错误信息的用户友好提示。
- **is_multimodal_supported**: 模式是否支持多模态输入。
- **is_convert_url_to_base64**: 是否将媒体URL转换为base64格式。
- **max_image_pixels**: 图片处理的最大像素数。
- **max_video_size**: 视频处理的最大字节数。

OxyGent默认为每个agent提供单独的LLM。如果您需要配置统一的LLM，请参考[设置默认LLM](./3_set_config.md)；如果您需要并行运行多种LLM，请参考[并行](./7_parallel.md)。

[上一章：和智能体交流](./1_1_chat_with_agent.md)
[下一章：预设提示词](./1_3_select_prompt.md)
[回到首页](./readme.md)