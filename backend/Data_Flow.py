from fastapi import FastAPI


from services.build_prompt import build_prompt
from services.send_prompt.send_prompt
from services.validate_data.validate_data

from DataDefinition.DataDefinition import CreateItineraryRequest
app = FastAPI(
    title="Data Flow",
    description="Data Flow 后端数据的处理流程",
    version="1.0.0",
)

@app.post("/dataflow")
async def data_flow (request:CreateItineraryRequest):
    """处理前端传来数据的主流程"""
    # 1. 提取参数
    # 提取前端固定填的参数，如预算，时间，目的地等
    # 提取额外的要求，如用户用自然语言给出的“文艺之旅”，“住的好点”，“相去更多有历史文化的地方”
    #在request里已被封装好
    # 2. 构建提示词
    # 构建提示词，需要根据用户要求，比如什么是不能更改的，如果有冲突按照哪个办，参数的优先级是否需要强调等
    prompts =build_prompt(request)

    # 3. 发送提示词
    #发送提示词给大模型
    llm_response = await send_prompt(prompts)

    # 4. 校验结果
    # 接受并校验返回格式是否正确
    try:
        validated_data = validate_data(llm_response)
    except Exception as e:
        # 5. 错误处理
        # #格式不正确的校验与错误抛出流程
        raise e
    # 给另一个大模型检查结果是否符合要求（可选）
    # model_to_verify()
    # 6. 返回结果
    #返回结果给前端显示（）
    return validated_data