# 如何快速复制多个智能体？

如果您需要生成多个相同的智能体，您可以使用`team_size`参数快速复制智能体。

```
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool for time query",
        tools=["time_tools"],
        llm_model="default_llm",
        team_size=2,
    ),
```

`team_size`目前仅能复制较为简单的智能体，之后我们会支持更完备的智能体复制。

[上一章：创建简单的多agent系统](./6_register_multi_agent.md)
[下一章：并行调用agent](./7_parallel.md)
[回到首页](./readme.md)