# 如何修改记忆节点？

OxyGent支持读取记忆及重新执行功能。您可以在`chat_with_agent`方法中指定要访问的节点，您可以修改节点内容并从被修改的节点开始重新运行系统。

```python
async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        # 第一次运行
        payload = {
            "query": "Get what time it is in America/New_York and save in `log.txt` under `./local_file`",
        }
        oxy_response = await mas.chat_with_agent(payload=payload)
        from_trace_id = oxy_response.oxy_request.current_trace_id
        print("LLM: ", oxy_response.output, from_trace_id)
```

假设在这一次运行中，您想要修改以下节点的内容：

```apache
2025-07-29 23:21:45,029 - INFO - i4oNVqcwQjz6KVg6 - 6m8jX6xmQF4xXzpo - user <<< master_agent <<< time_agent <<< get_current_time  : {
  "timezone": "America/New_York",
  "datetime": "2025-07-30T02:21:45-04:00",
  "is_dst": true
}
```

您可以记录需要修改的节点编号，并在`payload`中使用如下方法修改：

```python
async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        # 第二次运行
        payload = {
            "query": "Get what time it is in America/New_York and save in `log.txt` under `./local_file`",  
            "from_trace_id": "",
            "reference_trace_id": "i4oNVqcwQjz6KVg6",  #trace编号（可选）
            "restart_node_id": "6m8jX6xmQF4xXzpo", #节点编号（必要）
            "restart_node_output": """{ 
                "timezone": "America/New_York",
                "datetime": "2024-07-21T05:32:43-04:00",
                "is_dst": true
            }""", #要修改的输出(注意格式最好保持一致)
        }
        oxy_response = await mas.chat_with_agent(payload=payload)
        from_trace_id = oxy_response.oxy_request.current_trace_id
        print("LLM: ", oxy_response.output, from_trace_id)
```

重新运行之后，系统的输出将会是您设定的`2024-07-21T05:32:43-04:00`。

```
2025-07-29 23:22:46,506 - INFO - qgk2gECEE7GFiB7X - ci4fmTXrvn35YSTV - user <<< master_agent <<< default_llm  Wrote by user: {
                "timezone": "America/New_York",
                "datetime": "2024-07-21T05:39:43-04:00",
                "is_dst": true
            }
...
LLM:  The current time in America/New_York has been successfully recorded as 05:39 AM, and the information has been saved in the file `./local_file/log.txt`. qgk2gECEE7GFiB7X
```

您也可以在可视化界面进行详细调试和重新运行。

[上一章：创建流](./9_2_preset_flow.md)
[下一章：创建分布式系统](./11_dstributed.md)
[回到首页](./readme.md)