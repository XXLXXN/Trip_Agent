import asyncio
import sys
import os
from typing import Any, Coroutine, Optional, List
import json

# 添加项目根目录到Python路径
# 获取当前文件的绝对路径，然后计算项目根目录
current_file_path = os.path.abspath(__file__)
services_dir = os.path.dirname(current_file_path)
backend_dir = os.path.dirname(services_dir)
project_root = os.path.dirname(backend_dir)  # 这是 E:/work/Trip/Trip_Agent

print(f"当前文件路径: {current_file_path}")
print(f"services目录: {services_dir}")
print(f"backend目录: {backend_dir}")
print(f"项目根目录: {project_root}")

# 将项目根目录添加到Python路径
sys.path.insert(0, project_root)
print(f"Python路径已添加: {project_root}")

from backend.Agents.SpotRecommendation import get_spot_recommendation
from backend.Agents.HotelRecommendation import get_hotel_recommendation
from backend.Agents.TrafficRecommendation import get_traffic_recommendation
from backend.Agents.TripRecommendation import get_trip_recommendation
from backend.Agents.BudgetRecommendation import search_goods_prices
from backend.DataDefinition.DataDefinition import SpotNameAndRecReason, SpotnoPOI, Trip, HotelnoPOI
from backend.tools.map_tools import add_detail_info, search_and_add_poi

# 假设 SpotNameAndRecReason 和 get_spot_recommendation, search_and_add_poi 已经定义
# from somewhere import SpotNameAndRecReason, get_spot_recommendation, search_and_add_poi

async def send_spot_recommendation_prompt(prompts: str) -> Optional[List[SpotnoPOI]]:
    """
    根据用户提示获取景点推荐，并解析处理。

    Args:
        prompts: 用户输入的提示字符串。

    Returns:
        成功时返回 SpotnoPOI 对象列表，失败时返回 None。
    """
    try:
        print(f"=== 开始处理景点推荐请求 ===")
        print(f"提示词: {prompts[:200]}...")  # 只打印前200个字符
        
        # 调用API获取推荐数据
        api_response = await get_spot_recommendation(prompts)
        print(f"API响应类型: {type(api_response)}")
        print(f"API响应内容: {api_response}")

        # 检查响应是否为空或无效
        if not api_response:
            print("错误：获取的推荐数据为空。")
            return None

        # 提取第一个有效回复的内容
        if len(api_response) > 0:
            first_reply = api_response[0]
            print(f"第一个回复类型: {type(first_reply)}")
            print(f"第一个回复内容: {first_reply}")
            
            # 检查是否为字典类型并包含content字段
            if isinstance(first_reply, dict) and 'content' in first_reply:
                raw_json_string = first_reply['content']
                print(f"提取的JSON字符串: {raw_json_string[:200]}...")
                
                # 解析JSON字符串
                spot_data = json.loads(raw_json_string)
                print(f"解析后的数据: {spot_data}")
                
                # 转换为SpotnoPOI对象列表
                spot_rec = [SpotnoPOI(**item) for item in spot_data]
                print(f"转换后的Spot对象数量: {len(spot_rec)}")

                # 详细打印提取的数据信息
                print("\n=== 提取的详细信息 ===")
                for i, spot in enumerate(spot_rec):
                    print(f"\n{i+1}. {spot.SpotName}")
                    print(f"   推荐理由: {spot.RecReason}")
                    print(f"   描述: {spot.description}")
                
                return spot_rec
            else:
                print(f"错误：回复格式不正确，缺少content字段。回复内容: {first_reply}")
                return None
        else:
            print("错误：API响应中没有有效回复。")
            return None

    except json.JSONDecodeError as e:
        print(f"解析 JSON 错误: {e}")
        return None
    except IndexError:
        print("错误：API 响应格式不正确，无法访问数据。")
        return None
    except Exception as e:
        # 捕获其他未预料的错误，例如网络请求失败
        print(f"在send_spot_recommendation_prompt函数发生未知错误: {e}")
        import traceback
        print(f"详细错误信息: {traceback.format_exc()}")
        return None



async def send_hotel_recommendation_prompt(prompt: str) -> Optional[List[HotelnoPOI]]:
    """
    根据用户提示获取酒店推荐，并解析为HotelnoPOI对象列表。

    Args:
        prompt: 用户输入的提示字符串。

    Returns:
        成功时返回 HotelnoPOI 对象列表，失败时返回原始数据。
    """
    try:
        print(f"=== 开始处理酒店推荐请求 ===")
        print(f"提示词: {prompt[:200]}...")  # 只打印前200个字符
        
        # 调用API获取推荐数据
        data = await get_hotel_recommendation(prompt)
        print(f"API响应类型: {type(data)}")
        print(f"API响应内容: {data}")

        # 检查响应是否为空或无效
        if not data or len(data) == 0:
            print("错误：获取的推荐数据为空。")
            return []

        # 提取第一个有效回复的内容
        first_reply = data[0]
        print(f"第一个回复类型: {type(first_reply)}")
        print(f"第一个回复内容: {first_reply}")
        
        # 检查是否为字典类型并包含content字段
        if isinstance(first_reply, dict) and 'content' in first_reply:
            raw_json_string = first_reply['content']
            print(f"提取的JSON字符串: {raw_json_string[:200]}...")
            
            # 解析JSON字符串
            hotel_data = json.loads(raw_json_string)
            print(f"解析后的数据: {hotel_data}")
            
            # 提取Primary_Rec和Alternative_Rec中的酒店数据
            all_hotels = []
            if 'Primary_Rec' in hotel_data and isinstance(hotel_data['Primary_Rec'], list):
                all_hotels.extend(hotel_data['Primary_Rec'])
            if 'Alternative_Rec' in hotel_data and isinstance(hotel_data['Alternative_Rec'], list):
                all_hotels.extend(hotel_data['Alternative_Rec'])
            
            print(f"提取到的酒店数据数量: {len(all_hotels)}")
            
            # 转换为HotelnoPOI对象列表
            hotel_rec = [HotelnoPOI(**item) for item in all_hotels]
            print(f"转换后的Hotel对象数量: {len(hotel_rec)}")
            
            # 返回HotelnoPOI对象列表，供外部处理
            print(f"返回 {len(hotel_rec)} 个HotelnoPOI对象供外部处理")
            return hotel_rec
        else:
            print(f"错误：回复格式不正确，缺少content字段。回复内容: {first_reply}")
            return data

    except json.JSONDecodeError as e:
        print(f"解析 JSON 错误: {e}")
        return data if 'data' in locals() else []
    except IndexError:
        print("错误：API 响应格式不正确，无法访问数据。")
        return data if 'data' in locals() else []
    except Exception as e:
        # 捕获其他未预料的错误，例如网络请求失败
        print(f"在send_hotel_recommendation_prompt函数发生未知错误: {e}")
        import traceback
        print(f"详细错误信息: {traceback.format_exc()}")
        return data if 'data' in locals() else []

async def send_traffic_recommendation_prompt(prompt: str) -> list:
    """
    根据用户提示获取交通推荐，并解析处理。

    Args:
        prompt: 用户输入的提示字符串。

    Returns:
        成功时返回处理后的数据，失败时返回原始数据。
    """
    try:
        print(f"=== 开始处理交通推荐请求 ===")
        print(f"提示词: {prompt[:200]}...")
        
        # 调用API获取推荐数据
        data = await get_traffic_recommendation(prompt)
        print(f"API响应类型: {type(data)}")
        print(f"API响应内容: {data}")

        # 检查响应是否为空或无效
        if not data or len(data) == 0:
            print("错误：获取的推荐数据为空。")
            return []

        # 提取第一个有效回复的内容
        first_reply = data[0]
        print(f"第一个回复类型: {type(first_reply)}")
        print(f"第一个回复内容: {first_reply}")
        
        # 检查是否为字典类型并包含content字段
        if isinstance(first_reply, dict) and 'content' in first_reply:
            raw_json_string = first_reply['content']
            print(f"提取的JSON字符串: {raw_json_string[:200]}...")
            
            # 解析JSON字符串
            traffic_data = json.loads(raw_json_string)
            print(f"解析后的数据: {traffic_data}")
            
            # 交通推荐不需要调用地图API，直接返回解析后的数据
            print(f"交通推荐数据处理完成，返回 {len(traffic_data)} 条记录")
            return traffic_data
        else:
            print(f"错误：回复格式不正确，缺少content字段。回复内容: {first_reply}")
            return data

    except json.JSONDecodeError as e:
        print(f"解析 JSON 错误: {e}")
        return data if 'data' in locals() else []
    except IndexError:
        print("错误：API 响应格式不正确，无法访问数据。")
        return data if 'data' in locals() else []
    except Exception as e:
        print(f"在send_traffic_recommendation_prompt函数发生未知错误: {e}")
        import traceback
        print(f"详细错误信息: {traceback.format_exc()}")
        return data if 'data' in locals() else []


async def send_trip_plan_prompt(prompt: str) -> Trip:
    """
    根据用户提示获取行程推荐，并解析处理。

    Args:
        prompt: 用户输入的提示字符串。

    Returns:
        成功时返回 Trip 对象，失败时返回原始数据。
    """
    try:
        print(f"=== 开始处理行程推荐请求 ===")
        print(f"提示词: {prompt[:200]}...")
        
        # 调用API获取推荐数据
        data = await get_trip_recommendation(prompt)
        print(f"API响应类型: {type(data)}")
        print(f"API响应内容: {data}")

        # 检查响应是否为空或无效
        if not data or len(data) == 0:
            print("错误：获取的推荐数据为空。")
            return data

        # 提取第一个有效回复的内容
        first_reply = data[0]
        print(f"第一个回复类型: {type(first_reply)}")
        print(f"第一个回复内容: {first_reply}")
        
        # 检查是否为字典类型并包含content字段
        if isinstance(first_reply, dict) and 'content' in first_reply:
            raw_json_string = first_reply['content']
            print(f"提取的JSON字符串: {raw_json_string[:200]}...")
            
            # 解析JSON字符串并转换为Trip对象
            trip_data = json.loads(raw_json_string)
            print(f"解析后的数据: {trip_data}")
            
            # 转换为Trip对象
            trip = Trip(**trip_data)
            print(f"行程推荐数据处理完成，返回Trip对象")
            return trip
        else:
            print(f"错误：回复格式不正确，缺少content字段。回复内容: {first_reply}")
            return data

    except json.JSONDecodeError as e:
        print(f"解析 JSON 错误: {e}")
        return data if 'data' in locals() else Trip(user_id="", trip_id="", trip_name="", destination="", start_date=None, end_date=None)
    except IndexError:
        print("错误：API 响应格式不正确，无法访问数据。")
        return data if 'data' in locals() else Trip(user_id="", trip_id="", trip_name="", destination="", start_date=None, end_date=None)
    except Exception as e:
        print(f"在send_trip_plan_prompt函数发生未知错误: {e}")
        import traceback
        print(f"详细错误信息: {traceback.format_exc()}")
        return data if 'data' in locals() else Trip(user_id="", trip_id="", trip_name="", destination="", start_date=None, end_date=None)

async def send_goods_price_search_prompt(prompt: str) -> list:
    """
    根据用户提示获取商品价格搜索，并解析处理。

    Args:
        prompt: 用户输入的提示字符串。

    Returns:
        成功时返回处理后的数据，失败时返回原始数据。
    """
    try:
        print(f"=== 开始处理商品价格搜索请求 ===")
        print(f"提示词: {prompt[:200]}...")
        
        # 调用API获取推荐数据
        data = await search_goods_prices(prompt)
        print(f"API响应类型: {type(data)}")
        print(f"API响应内容: {data}")

        # 检查响应是否为空或无效
        if not data or len(data) == 0:
            print("错误：获取的推荐数据为空。")
            return []

        # 提取第一个有效回复的内容
        first_reply = data[0]
        print(f"第一个回复类型: {type(first_reply)}")
        print(f"第一个回复内容: {first_reply}")
        
        # 检查是否为字典类型并包含content字段
        if isinstance(first_reply, dict) and 'content' in first_reply:
            raw_json_string = first_reply['content']
            print(f"提取的JSON字符串: {raw_json_string[:200]}...")
            
            # 解析JSON字符串
            goods_data = json.loads(raw_json_string)
            print(f"解析后的数据: {goods_data}")
            
            # 商品搜索不需要调用地图API，直接返回解析后的数据
            print(f"商品价格搜索数据处理完成，返回 {len(goods_data)} 条记录")
            return goods_data
        else:
            print(f"错误：回复格式不正确，缺少content字段。回复内容: {first_reply}")
            return data

    except json.JSONDecodeError as e:
        print(f"解析 JSON 错误: {e}")
        return data if 'data' in locals() else []
    except IndexError:
        print("错误：API 响应格式不正确，无法访问数据。")
        return data if 'data' in locals() else []
    except Exception as e:
        print(f"在send_goods_price_search_prompt函数发生未知错误: {e}")
        import traceback
        print(f"详细错误信息: {traceback.format_exc()}")
        return data if 'data' in locals() else []

async def debug_spot_recommendation():
    """调试函数：专门测试景点推荐功能"""
    print("=== 开始调试景点推荐功能 ===")
    
    # 创建一个测试提示词
    test_prompt = """
    我们有一个学生和三个成人，想要在2025年11月27日出发去北京玩5天，
    体验当地文化，预算范围2000-30000元，旅行风格为文艺、美食。
    """
    
    print(f"测试提示词: {test_prompt}")
    
    try:
        result = await send_spot_recommendation_prompt(test_prompt)
        print("=== 调试结果 ===")
        if result:
            print(f"成功获取 {len(result)} 个景点推荐:")
            for i, spot in enumerate(result):
                print(f"{i+1}. {spot.SpotName} - {spot.RecReason}")
        else:
            print("未能获取景点推荐")
            
    except Exception as e:
        print(f"调试过程中发生错误: {e}")
        import traceback
        print(f"详细错误信息: {traceback.format_exc()}")

async def main():
    """主函数：可以选择运行不同的测试"""
    print("请选择要运行的测试:")
    print("1. 酒店推荐测试")
    print("2. 景点推荐调试")
    
    choice = input("请输入选择 (1 或 2): ").strip()
    
    if choice == "1":
        prompt = """
        [用户已选定的景点]:
        故宫博物院 (The Palace Museum / Forbidden City)
        天坛公园 (Temple of Heaven Park)
        颐和园 (Summer Palace)
        八达岭长城 (Badaling Great Wall)

        [用户的旅行偏好]
        目的地城市: 北京 (Beijing)
        budget_range: "每晚 600-1000 人民币"
        hotel_needs: "4星级或同等级别的精品酒店，必须靠近地铁站，方便出行。希望酒店有比较好的评价。"
        """
        print("Prompt:", prompt)
        result = await send_hotel_recommendation_prompt(prompt)
        print("结果:", result)
    elif choice == "2":
        await debug_spot_recommendation()
    else:
        print("无效选择")

if __name__ == "__main__":
    asyncio.run(main())
