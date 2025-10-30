# 如何向智能体传递prompt

## 使用自定义prompt

在OxyGent中，您可以通过预设prompt告知agent一些信息。例如：

```python
text_summarizer_prompt = """
你是一个文件分析专家，用户会向你提供文档，你需要分析文件中的文字内容，并提供摘要
"""

data_analyser_prompt = """
你是一个数据分析专家，需要分析文档中的表格、图表、echart代码等数据，并提供文字版的分析结果。
"""

document_checker_prompt = """
你需要查看用户提供的文档，并尝试提出文档内容中存在的问题，例如前后矛盾、错误叙述等，帮助用户进行改进。
"""
```

之后，您可以在执行脚本中使用`prompt`参数调用prompt：

```python
    oxy.ChatAgent(
        name="text_summarizer",
        desc="A tool that can summarize markdown text",
        prompt=text_summarizer_prompt,
    ),
    oxy.ChatAgent(
        name="data_analyser",
        desc="A tool that can summarize echart data",
        prompt=data_analyser_prompt,
    ),
    oxy.ChatAgent(
        name="document_checker",
        desc="A tool that can find problems in document",
        prompt=document_checker_prompt,
    ),
```

## 使用系统预设prompt

您也可以使用以下方式调用我们的**默认prompts**：

```
from oxygent.prompts import INTENTION_PROMPT
from oxygent.prompts import SYSTEM_PROMPT
from oxygent.prompts import SYSTEM_PROMPT_RETRIEVAL
from oxygent.prompts import MULTIMODAL_PROMPT
```

> 我们的默认 [Prompts](https://github.com/jd-opensource/OxyGent/blob/main/oxygent/prompts.py)中包含了工具调用格式等关键信息。

> 因此在使用自定义 Prompt 之前，建议您先参考我们提供的默认 [Prompts](https://github.com/jd-opensource/OxyGent/blob/main/oxygent/prompts.py)，以便更好地理解如何解析大模型的输出以及如何进行工具调用或回答处理。

> 我们也提供了传入您自定义解析函数的属性，以便更加灵活地处理输出。具体请您参考[处理智能体输出](./8_2_handle_output.md)。

如果您不对prompts进行任何指定，我们的智能体将默认使用系统prompts。您可以对系统prompts进行追加：

```python
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool for time query.",
        additional_prompt="Do not send other information except time.",
        tools=["time_tools"],
    ),
```

[上一章：选择智能体使用的LLM](./1_2_select_llm.md)
[下一章：选择智能体种类](./1_4_select_agent.md)
[回到首页](./readme.md)