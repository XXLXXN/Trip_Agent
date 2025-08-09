from backend.DataDefinition.DataDefinition import CreateItineraryRequest


def build_prompt(request:CreateItineraryRequest) :
    prompt_content=f"""
    这里是prompt构造的内容
    可以插入{request.user_id}变量之类的
    """
    return prompt_content