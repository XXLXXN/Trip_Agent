# 如何导入附件？

OxyGent支持导入简单的附件。OxyGent能够接受的附件格式包括：
+ `.txt`文件
+ `.jpg/.jpeg/.png/.mp4`文件（需要配合多模态模型）
+ `.xlsx/.xls/.docx/.doc`文件（需要提供能够访问文件的工具或环境，或者在`preset_tools/file_tools`中启用默认阅读器）
+ `.pdf`文件（需要提供能够访问文件的工具或环境）
+ `.csv/.tsv`文件
+ `.py/.md/.json`文件（需要提供能够访问文件的工具或环境，或者在`preset_tools/file_tools`中启用默认阅读器）

您可以使用以下方式导入附件：

## 使用A2A风格导入附件

您可以使用A2A风格的query导入附件的路径或url：

```python
    a2a_parts = [
        {
            "part": {
                "content_type": "path",       
                "data": "/Users/zhangzeyu.35/local_oxygent/rebuttal.docx",
            }
        },
        {
            "part": {
                "content_type": "text/plain",
                "data": "Please introduce the content of the document.",
            }
        },
    ]

    async with MAS(oxy_space=oxy_space) as mas:
        payload = {
            "query": a2a_parts, }           # a2a style
        oxy_resp = await mas.chat_with_agent(payload=payload)
        print("LLM:\n", oxy_resp.output)
```

## 使用attachment导入附件

您也可以使用单独的`attachment`导入附件，目前前端使用此方法导入。

```python
async with MAS(oxy_space=oxy_space) as mas:
        payload = {
            "query": "Please introduce the content of the document.",            
            "attachments": ["sample.docx"],  } # Anthropic style
        oxy_resp = await mas.chat_with_agent(payload=payload)
        print("LLM:\n", oxy_resp.output)
```

对于小文件（默认2MB以下），OxyGent支持传递元数据；如果您需要对大文件进行处理，可能需要配置您的云服务并增加url解析工具。

[上一章：使用多模态智能体](./10_multimodal.md)
[下一章：检索增强生成(RAG)](./12_rag.md)
[回到首页](./readme.md)
