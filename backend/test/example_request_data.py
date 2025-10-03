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
RETURN_DATA_EXAMPLE =[
  {
    "SpotName": "798艺术区",
    "RecReason": "798艺术区是北京著名的文艺街区，汇集了众多画廊、艺术工作室和创意店铺，非常适合文艺爱好者。",
    "POIId": "B000A81FY5",
    "description": "798艺术区位于北京市朝阳区酒仙桥路2号，是一个由旧工厂改造而成的艺术区，汇集了众多画廊、艺术工作室和创意店铺，是文艺爱好者的天堂。",
    "address": "酒仙桥路4号",
    "photos": [
      {
        "url": "http://store.is.autonavi.com/showpic/42a5f4dfacfbf2d38d20905cdc15f5ff",
        "title": ""
      },
      {
        "url": "http://store.is.autonavi.com/showpic/ee391e3f551fdd027e641c5c040e30bc",
        "title": ""
      },
      {
        "url": "http://store.is.autonavi.com/showpic/8a076e086d57c7e50f5d46477083b649",
        "title": ""
      }
    ],
    "rating": "4.8"
  },
  {
    "SpotName": "南锣鼓巷",
    "RecReason": "南锣鼓巷是北京最具文艺气息的胡同之一，街道两旁有许多特色小店和美食，适合漫步和品尝地道小吃。",
    "POIId": "B0FFFAH7I9",
    "description": "南锣鼓巷位于北京市东城区，是北京最具文艺气息的胡同之一，街道两旁有许多特色小店和美食，适合漫步和品尝地道小吃。",
    "address": "交道口街道南大街(南锣鼓巷地铁站E西北口旁)",
    "photos": [
      {
        "url": "http://store.is.autonavi.com/showpic/6aa94c24640267a56c22af0b9629030a",
        "title": ""
      },
      {
        "url": "http://store.is.autonavi.com/showpic/f2325d7c11c9453d8d7eccc96db7e77c",
        "title": ""
      },
      {
        "url": "http://store.is.autonavi.com/showpic/173b3acc0bb5c70d3710a43a137c17a7",
        "title": ""
      }
    ],
    "rating": "4.8"
  },
  {
    "SpotName": "簋街",
    "RecReason": "簋街是北京著名的美食街，汇集了各种地道的中式美食，尤其是麻辣小龙虾和火锅，非常适合美食爱好者。",
    "POIId": "B0FFHF130I",
    "description": "簋街位于北京市东城区东直门内大街，是北京著名的美食街，汇集了各种地道的中式美食，尤其是麻辣小龙虾和火锅，非常适合美食爱好者。",
    "address": "东直门大街5-11号",
    "photos": [
      {
        "url": "https://aos-comment.amap.com/B0FFHF130I/comment/bc8f5cc556907b887a8470ca7181a9ce_2048_2048_80.jpg",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B0FFHF130I/comment/6c95100d15a81296c8e661ef33990d06_2048_2048_80.jpg",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B0FFHF130I/comment/d5685f1564da211696b715f38f985ebe_2048_2048_80.jpg",
        "title": ""
      }
    ],
    "rating": "4.8"
  },
  {
    "SpotName": "相遇时光·文艺餐厅",
    "RecReason": "这家餐厅位于宋庄艺术区，环境文艺且菜品精致，适合文艺风格的用餐体验。",
    "POIId": "B0FFLMYPFF",
    "description": "相遇时光·文艺餐厅位于北京市通州区宋庄镇大巢艺术区北门135号，是一家环境文艺、菜品精致的餐厅，适合文艺风格的用餐体验。",
    "address": "宋庄镇大巢艺术区北门135号",
    "photos": [
      {
        "url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/31465374dfe52e301990410a54cb38e8_2048_2048_80.jpg",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/d08a6c5e9ad0eb8ae42208cff8761f89_2048_2048_80.jpg",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/145e2bb25df2bd6c3107c11674a404dc_2048_2048_80.jpg",
        "title": ""
      }
    ],
    "rating": "4.3"
  },
  {
    "SpotName": "什刹海",
    "RecReason": "什刹海是北京的著名风景区，周边有许多文艺酒吧和特色餐厅，适合夜晚漫步和享受美食。",
    "POIId": "B000A7O5PK",
    "description": "什刹海位于北京市西城区，是北京的著名风景区，周边有许多文艺酒吧和特色餐厅，适合夜晚漫步和享受美食。",
    "address": "地安门西大街49号",
    "photos": [
      {
        "url": "http://store.is.autonavi.com/showpic/dd97c0390e296f47a20b72063ec86990",
        "title": ""
      },
      {
        "url": "http://store.is.autonavi.com/showpic/a996834a98e84fd852162b2551c374f0",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B000A7O5PK/comment/content_media_external_file_5734_1759220682721_18610854.jpg",
        "title": ""
      }
    ],
    "rating": "4.9"
  },
  {
    "SpotName": "很文艺食堂",
    "RecReason": "这家餐厅以其独特的文艺氛围和精致菜品著称，适合文艺风格的用餐体验。",
    "POIId": "B0I1R6UJ9L",
    "description": "很文艺食堂位于北京市7克拉北门东110米，是一家以文艺氛围和精致菜品著称的餐厅，适合文艺风格的用餐体验。",
    "address": "7克拉北门东110米",
    "photos": [
      {
        "url": "https://aos-comment.amap.com/B0I1R6UJ9L/comment/f61e84e2c07bba62953c55e00ca9fc30_2048_2048_80.jpg",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B0I1R6UJ9L/comment/78ef96dc7e61178efa433b6d5f938f8d_2048_2048_80.jpg",
        "title": ""
      },
      {
        "url": "http://store.is.autonavi.com/showpic/996d90f31d5b3954ff82c8d6ba7aedef",
        "title": ""
      }
    ],
    "rating": "4.1"
  },
  {
    "SpotName": "止观小馆",
    "RecReason": "这家餐厅融合了传统与现代的文艺风格，菜品精致且环境优雅，适合文艺爱好者。",
    "POIId": "B0FFGWGO81",
    "description": "止观小馆位于北京市金鱼胡同12号，是一家融合传统与现代文艺风格的餐厅，菜品精致且环境优雅，适合文艺爱好者。",
    "address": "金鱼胡同12号(金鱼胡同地铁站B东口步行280米)",
    "photos": [
      {
        "url": "https://aos-comment.amap.com/B0FFGWGO81/comment/87182bec6a346bdbdece8ec78cacbba1_2048_2048_80.jpg",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B0FFGWGO81/comment/content_media_external_file_2832_1752932450345_57025635.jpg",
        "title": ""
      },
      {
        "url": "https://aos-comment.amap.com/B0FFGWGO81/comment/content_media_external_file_125970_ss__1753419699316_00687879.jpg",
        "title": ""
      }
    ],
    "rating": "4.6"
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
