# 如何设置数据库？

OxyGent支持设置外部工具，比如您的数据库。现在OxyGent支持三种类型的外部数据库：

+ Elasticsearch: https://www.elastic.co/elasticsearch
+ Redis: https://redis.io/
+ Vearch: https://github.com/vearch/vearch

以Elasticsearch为例，您可以在[设置（Config）](https://github.com/jd-opensource/OxyGent/blob/main/oxygent/config.py)中输入数据库信息：

```python
Config.set_es_config( # 请按照数据库实际类型调整
    {
        "hosts": ["${PROD_ES_HOST_1}", "${PROD_ES_HOST_2}", "${PROD_ES_HOST_3}"],
        "user": "${PROD_ES_USER}",
        "password": "${PROD_ES_PASSWORD}",
    }
)
```

在设置好数据库后，agent会自动使用数据库进行存储与检索。如果您没有设置数据库，OxyGent将会使用本地文件系统模拟数据库运行。

## 完整的可运行样例

以下是可运行的完整代码示例：

```python
"""Demo for using OxyGent with multiple LLMs and an agent."""

import asyncio

from oxygent import MAS, Config, oxy
import os

Config.set_es_config(
    {
        "hosts": ["${PROD_ES_HOST_1}", "${PROD_ES_HOST_2}", "${PROD_ES_HOST_3}"],
        "user": "${PROD_ES_USER}",
        "password": "${PROD_ES_PASSWORD}",
    }
)
oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        llm_model="default_llm",
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        messages = [
            {"role": "system", "content": "You are a helpful assistant"},
            {"role": "user", "content": "hello"},
        ]
        result = await mas.call(callee="master_agent", arguments={"messages": messages})
        print(result)


if __name__ == "__main__":
    asyncio.run(main())
```

[上一章：设置OxyGent Config](./3_set_config.md)
[下一章：设置全局数据](./3_2_set_global.md)
[回到首页](./readme.md)