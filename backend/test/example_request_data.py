"""
前端API路由发送到后端的示例数据结构
根据 frontend/src/app/api/trip-planning/route.ts 的数据转换逻辑
"""

# 前端发送的原始数据格式（tripData）
FRONTEND_REQUEST_EXAMPLE = {
    "departure": "上海",
    "destination": "北京",
    "startDate": "2025.8.24",
    "endDate": "2025.9.15",
    "adults": 2,
    "elderly": 0,
    "children": 1,
    "priceRange": [200, 30000],
    "selectedTransport": "plane",
    "selectedAccommodation": "hotel",
    "selectedStyles": ["文艺", "美食"],
    "additionalRequirements": "希望酒店有游泳池，景点不要太拥挤"
}

# 经过API路由转换后的后端数据格式（backendData）
BACKEND_REQUEST_EXAMPLE = {
    "departure_city": "上海",
    "destination_city": "北京",
    "departure_date": "2025-08-24",
    "return_date": "2025-09-15",
    "travellers_count": {
        "travellers": {
            "成人": 2,
            "老人": 0,
            "儿童": 1,
            "学生": 0
        }
    },
    "budget": {
        "min": 200,
        "max": 30000
    },
    "trip_style": "文艺,美食",
    "other_requirement": "希望酒店有游泳池，景点不要太拥挤"
}

# 用于测试的完整HTTP请求示例
HTTP_REQUEST_EXAMPLE = {
    "method": "POST",
    "url": "http://localhost:8000/api/trip-planning",
    "headers": {
        "Content-Type": "application/json"
    },
    "json": BACKEND_REQUEST_EXAMPLE
}

# 使用 additionalRequirements 的不同场景示例
EXAMPLES_WITH_ADDITIONAL_REQUIREMENTS = [
    {
        "description": "有特殊饮食需求",
        "additionalRequirements": "有素食者同行，需要安排素食餐厅",
        "backend_data": {
            "departure_city": "上海",
            "destination_city": "北京",
            "departure_date": "2025-08-24",
            "return_date": "2025-09-15",
            "travellers_count": {
                "travellers": {
                    "成人": 2,
                    "老人": 0,
                    "儿童": 1,
                    "学生": 0
                }
            },
            "budget": {
                "min": 200,
                "max": 30000
            },
            "trip_style": "文艺,美食",
            "other_requirement": "有素食者同行，需要安排素食餐厅"
        }
    },
    {
        "description": "有行动不便的成员",
        "additionalRequirements": "有老人同行，需要无障碍设施",
        "backend_data": {
            "departure_city": "上海",
            "destination_city": "北京",
            "departure_date": "2025-08-24",
            "return_date": "2025-09-15",
            "travellers_count": {
                "travellers": {
                    "成人": 2,
                    "老人": 1,
                    "儿童": 0,
                    "学生": 0
                }
            },
            "budget": {
                "min": 200,
                "max": 30000
            },
            "trip_style": "自然",
            "other_requirement": "有老人同行，需要无障碍设施"
        }
    },
    {
        "description": "商务旅行需求",
        "additionalRequirements": "需要靠近会议中心，有商务设施",
        "backend_data": {
            "departure_city": "上海",
            "destination_city": "北京",
            "departure_date": "2025-08-24",
            "return_date": "2025-09-15",
            "travellers_count": {
                "travellers": {
                    "成人": 1,
                    "老人": 0,
                    "儿童": 0,
                    "学生": 0
                }
            },
            "budget": {
                "min": 500,
                "max": 10000
            },
            "trip_style": None,
            "other_requirement": "需要靠近会议中心，有商务设施"
        }
    }
]

if __name__ == "__main__":
    print("前端API路由发送到后端的示例数据结构")
    print("=" * 50)
    
    print("\n1. 前端原始数据格式:")
    print(FRONTEND_REQUEST_EXAMPLE)
    
    print("\n2. 转换后的后端数据格式:")
    print(BACKEND_REQUEST_EXAMPLE)
    
    print("\n3. 包含additionalRequirements的不同场景:")
    for example in EXAMPLES_WITH_ADDITIONAL_REQUIREMENTS:
        print(f"\n{example['description']}:")
        print(f"其他需求: {example['additionalRequirements']}")
        print(f"后端数据: {example['backend_data']}")
