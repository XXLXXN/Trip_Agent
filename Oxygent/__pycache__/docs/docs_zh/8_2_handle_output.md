# 如何处理智能体输出？

OxyGent 默认使用一个简单的 JSON 解析器来处理智能体的输出。在默认状态下，Agent 的工具调用等指令性输出格式如下：

```json
{
    "think": "Your thinking (if analysis is needed)",
    "tool_name": "Tool name",
    "arguments": {
        "parameter_name": "parameter_value"
    }
}
```

如果您需要定制智能体的输出处理方式，可以采用以下方法。

## 设置LLM的输出格式：

大部分情况下，您可以在 `prompts` 中设置提示，以让 LLM 输出特定格式。

例如，您可以使用以下格式来指导 LLM 返回工具调用的输出：

```python
SYSTEM_PROMPT = """
You are a helpful assistant that can use these tools:
${tools_description}

Choose the appropriate tool based on the user's question.
If no tool is needed, respond directly.
If answering the user's question requires multiple tool calls, call only one tool at a time. After the user receives the tool result, they will provide you with feedback on the tool call result.

Important instructions:
1. When you have collected enough information to answer the user's question, please respond in the following format:
<think>Your thinking (if analysis is needed)</think>
Your answer content
2. When you find that the user's question lacks conditions, you can ask the user back, please respond in the following format:
<think>Your thinking (if analysis is needed)</think>
Your question to the user
3. When you need to use a tool, you must only respond with the exact JSON object format below, nothing else:
{
    "think": "Your thinking (if analysis is needed)",
    "tool_name": "Tool name",
    "arguments": {
        "parameter_name": "parameter_value"
    }
}

After receiving the tool's response:
1. Transform the raw data into a natural conversational response
2. The answer should be concise but rich in content
3. Focus on the most relevant information
4. Use appropriate context from the user's question
5. Avoid simply repeating the raw data

Please only use the tools explicitly defined above.
"""
```


## 设置LLM的输出解析器:

`oxy.ReActAgent` 支持在 `func_parse_llm_response` 中传入自定义的输出解析器。

例如，在 OxyGent 的默认设置中，JSON 格式的输出会被视为工具调用指令。如果您希望仅在 `tool_name` 合法时才尝试调用工具，而其他情况将 JSON 视为普通文本处理，可以自定义解析器，如下所示：

```python
import json
import yaml
import xml.etree.ElementTree as ET
from oxy.schemas import LLMResponse, LLMState

def json_parser(ori_response: str) -> LLMResponse:
    try:
        data = json.loads(ori_response)

        # 只有当 data 是 dict 且存在非空 tool_name 才触发工具调用(换成您的要求)
        if isinstance(data, dict) and data.get("tool_name"):
            return LLMResponse(
                state=LLMState.TOOL_CALL,
                output=data,
                ori_response=ori_response
            )

        # 其他 JSON（包括数组或普通对象）一律当作回答文本返回
        return LLMResponse(
            state=LLMState.ANSWER,
            output=data,
            ori_response=ori_response
        )

    except json.JSONDecodeError as e:
        return LLMResponse(
            state=LLMState.ERROR_PARSE,
            output=f"Invalid JSON: {e}",
            ori_response=ori_response
        )


```

然后，您可以将该解析器传入 `oxy.ReActAgent`：

```python
    oxy.ReActAgent(
        name="json_agent",
        desc="A tool that can convert plaintext into json text",
        func_parse_llm_response=json_parser, # 关键方法
    ),
```

## 在MAS中进行处理：

OxyGent 还支持使用外部方法对 `oxy.Response` 进行处理。例如，您可以自定义输出格式：

```python
def format_output(oxy_response: OxyResponse) -> OxyResponse:
    oxy_response.output = "Answer: " + oxy_response.output
    return oxy_response
```

然后将该处理方法注入到对应的 Agent 中：

```python
    oxy.ReActAgent(
        name="master_agent",
        sub_agents=["time_agent", "file_agent", "math_agent"],
        is_master=True,
        func_format_output=format_output, #关键方法
        timeout=100,
        llm_model="default_llm",
    ),
```
### 说明
1. **`func_parse_llm_response`**：用于将 LLM 的输出进行自定义解析。可以根据工具调用结果或普通文本的需求进行处理。
2. **`func_format_output`**：该方法用于自定义 `oxy.Response` 的输出格式，帮助您控制最终结果的呈现方式。

[上一章：处理查询和提示词](./8_update_prompts.md)
[下一章：反思重做模式](./8_3_reflexion.md)
[回到首页](./readme.md)