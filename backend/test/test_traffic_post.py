import requests
import json

BASE_URL = "http://127.0.0.1:8002"

def test_traffic_post_endpoint():
    print("=== 测试交通推荐POST端点 ===")
    
    # 测试数据
    test_data = {
        "departure_city": "苏州",
        "destination_city": "昆山",
        "departure_date": "2023-12-15",
        "return_date": "2023-12-15",
        "traffic_budget": {
            "min": 500,
            "max": 2000
        },
        "traffic_level": "standard",
        "travellers_count": {
            "travellers": {
                "成人": 2,
                "老人": 0,
                "儿童": 0,
                "学生": 0
            }
        }
    }
    
    print("发送POST请求到 /api/traffic-recommendation")
    print(f"请求数据: {json.dumps(test_data, indent=2, ensure_ascii=False)}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/traffic-recommendation",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("\n响应数据:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            print("\n响应结构分析:")
            if 'data' in data:
                print(f"  包含 voyage: {'voyage' in data['data']}")
                print(f"  包含 trainLines: {'trainLines' in data['data']}")
                
                if 'voyage' in data['data']:
                    voyage = data['data']['voyage']
                    print(f"  voyage 航班数: {len(voyage.get('flights', []))}")
                    print(f"  出发城市: {voyage.get('fromCityName', 'N/A')}")
                    print(f"  到达城市: {voyage.get('toCityName', 'N/A')}")
                
                if 'trainLines' in data['data']:
                    print(f"  trainLines 列车数: {len(data['data']['trainLines'])}")
            else:
                print("  响应中没有 'data' 字段")
        else:
            print(f"错误响应: {response.text}")
            
    except Exception as e:
        print(f"请求失败: {e}")

if __name__ == "__main__":
    test_traffic_post_endpoint()
