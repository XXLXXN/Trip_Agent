## 如何使用 OxyGent 训练我的模型？

OxyGent 支持通过自动存储所有中间节点的数据，来帮助您生成 SFT训练样本，并支持 GRPO 多智能体联合训练的采样过程。由于训练过程较为复杂，本文档将提供一个最简单的生成 SFT 样本的例子，您可以使用这些样本进行下一轮训练。

### 步骤 1：从数据库抽取历史调用记录

首先，您需要从数据库中检索历史的调用记录。以下是使用 `es_client` 从 Elasticsearch 中检索数据的示例：

```python
es_response = await mas.es_client.search(...)  # 替换为真实数据库
```

### 步骤 2：构建样本结构

然后，您需要将数据构建为训练样本的格式：

```python
{
  "node_id": "...",
  "input": { "messages": [...] },
  "output": "..."  # 模型给出的回复
}
```

### 步骤 3：使用 `sft_agent` 自动打标签

通过 `sft_agent`，您可以自动打上标签并生成训练数据。

### 步骤 4：写入训练集文件

最后，将生成的训练样本写入文件以供后续使用：

```python
with open(to_jsonl_path, "w") as f:
    f.write("\n".join(datasets))  # 保存的文件可以直接用于下一轮训练
```

## 完整的可运行样例

以下是可运行的完整代码示例：

```python
"""Demo for using OxyGent with SFT data review agent."""

import json
import os
import re

from oxygent import MAS, oxy


sft_prompt = """
    **Your Task**
    Act as a strict **SFT data reviewer**. Each time, you will evaluate **a single sample**, which includes:

    ```json
    {
    "node_id": "9rZhhWFhiZkrnUMf",
    "input": "<A JSON string containing a messages array: each item has a role and content>",
    "output": "<Candidate assistant reply>"
    }
    ```

    You need to parse the `messages` inside `input`, and based on the *system instructions* and *user queries*, determine whether the `output` qualifies as a high-quality SFT positive sample.

    **Evaluation Criteria** (All must be satisfied to mark as "keep")

    1. **Follows system instructions / tool invocation rules**
    - If the system requires calling a specific agent or outputting JSON, the `output` must follow.
    - If the system explicitly prohibits directly answering professional questions but the `output` does so → discard.
    2. **Fulfills user needs and is factually correct**
    - The response must be logically sound, factually accurate, properly formatted, and polite.
    3. **No violations / low-quality content**
    - No privacy breaches, offensive language, or meaningless filler.
    4. **Clear and fluent language**
    - The language should be smooth and clear (in a single language or with reasonable multilingual use).

    **Output Format**
    Output a single JSON object **only** (no extra text):

    ```json
    {
    "node_id": "9rZhhWFhiZkrnUMf",
    "keep": true | false,          // true = suitable for SFT; false = discard
    "reason": "<within 20 characters>"
    }
    ```

    Example `reason`s: `"Follows flow"`, `"Missing agent call"`, `"Irrelevant answer"`, `"Format error"`.

    **Additional Notes**

    - Only evaluate the current sample; do not consider cross-sample context.
    - If the `input` cannot be parsed, return `"keep": false`, `"reason": "Invalid input"`.
    - Your output **must strictly follow the JSON format** above, or it will be treated as invalid.
"""
oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        semaphore=4,
        is_save_data=False,
    ),
    oxy.ChatAgent(
        name="sft_agent",
        prompt=sft_prompt,
        llm_model="default_llm",
        is_save_data=False,
    ),
]


async def get_llm_node_data(mas):
    es_response = await mas.es_client.search(
        mas.name + "_node",
        {
            "query": {"term": {"node_type": "llm"}},
            "size": 32,
            "sort": [{"create_time": {"order": "desc"}}],
        },
    )
    app_node_data = []
    datas = []
    if es_response["hits"]["hits"]:
        for data in es_response["hits"]["hits"]:
            item = data["_source"]
            llm_input = json.loads(item["input"])
            app_node_data.append(f"""{{
                "node_id": "{item["node_id"]}",
                "input": {llm_input["arguments"]},
                "output": "{item["output"]}"
            }}""")
            datas.append(
                json.dumps(llm_input["arguments"]["messages"], ensure_ascii=False)
            )
    return app_node_data, datas


def parse_results(to_jsonl_path, datas, results):
    datasets = []
    pattern = r"```json\s*(.*?)\s*```"
    for data, result in zip(datas, results):
        match = re.search(pattern, result, re.DOTALL)
        if match:
            json_str = match.group(1)
            rs = json.loads(json_str)
            if rs.get("keep", False):
                datasets.append(data)
    print(
        f"Filter out {len(datas) - len(datasets)} samples and keep {len(datasets)} samples."
    )
    with open(to_jsonl_path, "w") as f:
        f.write("\n".join(datasets))
    print(f"The SFT training data has been generated to the directory {to_jsonl_path}.")


async def main():
    to_jsonl_path = "./sft_dataset.jsonl"
    async with MAS(oxy_space=oxy_space) as mas:
        app_node_data, datas = await get_llm_node_data(mas)
        results = await mas.start_batch_processing(app_node_data)
        parse_results(to_jsonl_path, datas, results)


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())

```

[上一章：检索增强生成(RAG)](./12_rag.md)
[下一章：可视化界面调试](./14_debugging.md)
[回到首页](./readme.md)