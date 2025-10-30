# 如何使用多模态？

OxyGent 当前版本支持图片和视频的多模态输入。通过多模态，您可以将图像和视频等附件作为输入，结合文本进行处理，从而实现更丰富的交互。

## 配置多模态模型

首先，您需要声明您的多模态模型，特别是需要设置 `is_multimodal_supported` 为 `True`，以启用多模态支持：

```python
oxy.HttpLLM(
    name="default_vlm",
    api_key=os.getenv("DEFAULT_VLM_API_KEY"),
    base_url=os.getenv("DEFAULT_VLM_BASE_URL"),
    model_name=os.getenv("DEFAULT_VLM_MODEL_NAME"),
    llm_params={"temperature": 0.6, "max_tokens": 2048},
    max_pixels=10000000,  # 设置最大像素大小
    is_multimodal_supported=True,  # 开启多模态支持
    is_convert_url_to_base64=True,  # 如果需要，将 URL 转换为 base64 格式
    semaphore=4,
)
```

## 传入附件

一旦启用多模态支持，您可以通过 `attachments` 参数（或可视化界面）传入附件，OxyGent 会自动处理这些附件并将其与查询一起传递：

```python
async with MAS(oxy_space=oxy_space) as mas:
    """单轮对话"""
    payload = {
        "query": "What is it in the picture?",  # 提问
        "attachments": [os.getenv("DEFAULT_IMAGE_URL")],  # 传入图片附件
    }
    oxy_response = await mas.chat_with_agent(payload=payload)
    print("LLM: ", oxy_response.output)
```

在这个例子中，`attachments` 包含了图片的 URL，OxyGent 会自动从 URL 中获取图片并进行处理。

## 完整的可运行示例

以下是一个完整的可运行示例，展示了如何配置和使用多模态输入：

```python
import asyncio

from oxygent import MAS, Config, OxyRequest, OxyResponse, oxy
import os

# 设置 LLM 模型
Config.set_agent_llm_model("default_vlm")


async def master_workflow(oxy_request: OxyRequest) -> OxyResponse:
    # 调用 generate_agent 处理图片描述
    generate_agent_oxy_response = await oxy_request.call(
        callee="generate_agent",
        arguments={
            "query": oxy_request.get_query(),
            "attachments": oxy_request.arguments.get("attachments", []),
            "llm_params": {"temperature": 0.6},
        },
    )
    # 调用 discriminate_agent 判断图片描述是否准确
    discriminate_agent_oxy_response = await oxy_request.call(
        callee="discriminate_agent",
        arguments={
            "query": str(generate_agent_oxy_response.output),
            "attachments": oxy_request.arguments.get("attachments", []),
        },
    )
    return f"generate_agent output: {generate_agent_oxy_response.output} \n discriminate_agent output: {discriminate_agent_oxy_response.output}"


# 初始化 oxy_space
oxy_space = [
    oxy.HttpLLM(
        name="default_vlm",
        api_key=os.getenv("DEFAULT_VLM_API_KEY"),
        base_url=os.getenv("DEFAULT_VLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_VLM_MODEL_NAME"),
        llm_params={"temperature": 0.6, "max_tokens": 2048},
        max_pixels=10000000,  # 设置最大像素数
        is_multimodal_supported=True,  # 开启多模态支持
        is_convert_url_to_base64=True,  # 将图片 URL 转换为 base64 格式
        semaphore=4,
    ),
    oxy.ChatAgent(
        name="generate_agent",
        prompt="You are a helpful assistant. Please describe the content of the image in detail.",
    ),
    oxy.ChatAgent(
        name="discriminate_agent",
        prompt="Please determine whether the following text is a description of the content of the image. If it is, please output 'True', otherwise output 'False'.",
    ),
    oxy.Workflow(
        name="master_agent",
        is_master=True,
        permitted_tool_name_list=["generate_agent", "discriminate_agent"],
        func_workflow=master_workflow,
    ),
]

# 主函数
async def main():
    # 多模态输入
    async with MAS(oxy_space=oxy_space) as mas:
        """单轮对话"""
        payload = {
            "query": "What is it in the picture?",
            "attachments": [os.getenv("DEFAULT_IMAGE_URL")],  # 传入图片 URL
        }
        oxy_response = await mas.chat_with_agent(payload=payload)
        print("LLM: ", oxy_response.output)


if __name__ == "__main__":
    asyncio.run(main())
```

### 说明

1. **`is_multimodal_supported=True`**：启用多模态支持，允许您将图像、视频等附件作为输入。
2. **`attachments`**：用于传入图像或其他附件。您可以提供 URL 或 Base64 编码的文件。
3. **`os.getenv("DEFAULT_IMAGE_URL")`**：获取环境变量中定义的图像 URL，您也可以根据需要传入其他图像资源。


[上一章：创建分布式系统](./11_dstributed.md)
[下一章：导入附件](./10_1_attachments.md)
[回到首页](./readme.md)

