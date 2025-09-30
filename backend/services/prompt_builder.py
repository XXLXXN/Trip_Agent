try:
    from backend.DataDefinition.DataDefinition import CreateItineraryRequest, CreateSpotsRequest
except ImportError:
    # 用于独立运行时的导入
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from backend.DataDefinition.DataDefinition import CreateItineraryRequest, CreateSpotsRequest


def build_create_itinerary_prompt(request:CreateItineraryRequest) :
    prompt_content=f"""
    这里是prompt构造的内容
    可以插入{request.user_id}变量之类的，我要在{request.departure_date}出去玩
    """
    return prompt_content


def build_create_spot_prompt(request: CreateSpotsRequest) -> str:
    """
    根据景点推荐请求对象，构建一个全面、详细的Prompt，用于LLM规划行程和推荐景点。
    
    :param request: 创建景点推荐的请求数据
    :return: 构造好的Prompt字符串
    """
    
    # --- 构造 Prompt 主体 ---
    prompt_parts = [
        "请根据以下用户需求，为他们规划一次完美的旅行，并推荐合适的景点和行程安排。要求全面、详细、符合用户偏好。",
        f"**目的地城市**：{request.destination_city}",
        f"**出发城市**：{request.departure_city}",
        f"**行程日期**：从 {request.departure_date.strftime('%Y年%m月%d日')}出发， 到 {request.return_date.strftime('%Y年%m月%d日')}返回。"
    ]

    # 1. 人数信息处理 (使用新的字典结构，包含老人和学生)
    if request.travellers_count.travellers:
        travellers_detail = []
        total_count = 0
        
        # 遍历字典，构造人数详情，只添加数量大于0的类型
        for traveller_type, count in request.travellers_count.travellers.items():
            if count > 0:
                travellers_detail.append(f"{traveller_type.value} {count} 位")
                total_count += count
        
        if travellers_detail:
            # 加入总人数和详细人数列表
            travellers_info = f"**旅行人数详情 (共 {total_count} 人)**：{'、'.join(travellers_detail)}。"
            prompt_parts.append(travellers_info)

    # 2. 预算信息处理 (Min/Max 结构)
    if request.budget:
        min_b = request.budget.min
        max_b = request.budget.max
        
        budget_info = f"**旅行预算**：总预算在 **{min_b} 到 {max_b}** 之间（单位为人民币）。"
        prompt_parts.append(budget_info)

    # 3. 旅行风格处理 (可选)
    if request.trip_style:
        prompt_parts.append(f"**偏好的旅行风格**：{request.trip_style}。")

    # 4. 其他文本要求处理 (可选)
    if request.other_requirement:
        prompt_parts.append(f"**其他特殊要求/偏好**：{request.other_requirement}。")
    
    # 5. 总结和输出指令
    prompt_parts.append("\n请综合考虑以上所有信息，特别是旅行人数结构（老人、学生）和偏好，推荐合适的景点并制定详细的行程安排。")
    
    # 将各部分组合成完整的Prompt
    prompt_content = "\n".join(prompt_parts)
    return prompt_content


def build_create_hotel_prompt():
    return None


def build_create_traffic_prompt():
    return None


# 测试函数
if __name__ == "__main__":
    import sys
    import os
    # 添加项目根目录到路径
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    
    from datetime import date
    from backend.DataDefinition.DataDefinition import CreateSpotsRequest, TravellerCount, TravellerType, Budget
    
    # 创建测试数据
    today = date.today()
    senior_student_request = CreateSpotsRequest(
        departure_city="深圳",
        destination_city="西安",
        departure_date=today,
        return_date=date(2025, 12, 5),
        travellers_count=TravellerCount(
            travellers={
                TravellerType.ADULT: 1, 
                TravellerType.SENIOR: 2,  # 老人 2 位
                TravellerType.STUDENT: 1  # 学生 1 位
            }
        ),
        budget=Budget(min=5000, max=8000),
        trip_style="历史, 美食",
        other_requirement="行程不能太紧凑，要充分考虑老年人的体力，学生希望能有一些可以拍照打卡的地方。",
    )
    
    print("测试 build_create_spot_prompt 函数:")
    print("=" * 60)
    
    # 调用函数
    prompt = build_create_spot_prompt(senior_student_request)
    
    print("生成的Prompt内容:")
    print("-" * 60)
    print(prompt)
    print("-" * 60)
    
    # 分析Prompt结构
    print("\nPrompt结构分析:")
    print(f"总字符数: {len(prompt)}")
    print(f"行数: {prompt.count(chr(10)) + 1}")  # chr(10)是换行符
    
    # 检查是否包含关键信息
    key_info = {
        "出发城市": "深圳",
        "目的地城市": "西安",
        "成人": "1",
        "老人": "2", 
        "学生": "1",
        "预算": "5000 到 8000",  # 修正为实际显示的格式
        "旅行风格": "历史, 美食",
        "老年人体力": "充分考虑老年人的体力",
        "拍照打卡": "拍照打卡的地方"
    }
    
    print("\n关键信息检查:")
    for key, value in key_info.items():
        if value in prompt:
            print(f"✓ 包含 '{key}': {value}")
        else:
            print(f"✗ 缺少 '{key}': {value}")
            # 如果是预算问题，显示实际内容
            if key == "预算":
                print(f"  实际预算显示: {prompt.split('预算')[1].split('之间')[0].strip() if '预算' in prompt else '未找到预算信息'}")
    
    print("\n测试完成！")
