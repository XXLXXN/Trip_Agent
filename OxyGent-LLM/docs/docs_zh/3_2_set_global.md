# 如何设置系统全局数据？

OxyGent支持使用非常简单的方式设置和修改系统全局数据，这些数据类似于全局变量，能够在MAS中使用`OxyRequest`进行更改与访问。

支持的方法包括：
+ `get_global`：使用`(key,default_value)`按键值访问全局数据
+ `set_global`：使用`(key,value)`按键值修改全局数据
+ `get_all_global`：获取所有的全局数据（返回`dict`）

下面使用全局数据实现简单的计数器。

```python
class CounterAgent(BaseAgent):
    async def execute(self, oxy_request: OxyRequest):
        cnt = oxy_request.get_global("counter", 0) + 1 # 获取计数
        oxy_request.set_global("counter", cnt) # 存储计数+1

        return OxyResponse(
            state=OxyState.COMPLETED,
            output=f"This MAS has been called {cnt} time(s).",
            oxy_request=oxy_request,
        )
```

将这个`CounterAgent`作为`master`，就可以输出MAS被调用的次数。

```python
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
    CounterAgent(
        name="master_agent",  
        is_master=True,
    ),
]

async def main():
    async with MAS(name="global_demo", oxy_space=oxy_space) as mas:
        # 第一次调用 → counter = 1
        r1 = await mas.chat_with_agent({"query": "first"})
        print(r1.output)

        # 第二次调用 → counter = 2 (global_data persisted inside MAS)
        r2 = await mas.chat_with_agent({"query": "second"})
        print(r2.output)

        # 直接从MAS中获取:
        print("Current global_data:", mas.global_data)
    # 全局数据的生命周期和MAS相同
```

[上一章：设置数据库](./3_1_set_database.md)
[下一章：创建简单的多agent系统](./6_register_multi_agent.md)
[回到首页](./readme.md)