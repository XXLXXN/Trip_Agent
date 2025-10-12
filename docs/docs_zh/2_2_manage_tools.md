# 如何管理智能体使用工具的行为？

在默认情况下，agent对工具的调用由内部的LLM负责，但是OxyGent提供了一系列参数帮助您管理agent调用工具的方案，以下是您可能用到的参数：

+ 允许/禁止智能体使用工具

```python
    oxy.LocalAgent(
        name="time_agent",
        desc="A tool that can get current time",
        tools=["time_tools"], # 允许使用
        except_tools=["math_tools"], #禁止使用
    ),
```

+ 管理智能体检索工具

```python
    oxy.LocalAgent(
        name="time_agent",
        desc="A tool that can get current time",
        tools=["time_tools"], 
        is_sourcing_tools = True, # 是否检索工具
        is_retain_subagent_in_toolset = True, # 是否将subagent放入工具集
        top_k_tools = 10; #检索返回的工具数量
        is_retrieve_even_if_tools_scarce = True, # 是否在工具数量不足时保持检索
    ),
```

[上一章：使用MCP自定义工具](./2_4_use_mcp_tools.md)
[下一章：设置OxyGent Config](./3_set_config.md)
[回到首页](./readme.md)