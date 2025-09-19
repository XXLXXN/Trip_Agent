from backend.DataDefinition.DataDefinition import CreateItineraryRequest


def build_create_itinerary_prompt(request:CreateItineraryRequest) :
    prompt_content=f"""
    这里是prompt构造的内容
    可以插入{request.user_id}变量之类的，我要在{request.departure_date}出去玩
    """
    return prompt_content


def build_create_spot_prompt():
    return None


def build_create_hotel_prompt():
    return None