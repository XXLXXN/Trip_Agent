import requests
import json
from typing import Dict, List, Optional
import os
import time
from itertools import zip_longest

# 统一的导入策略 - 动态导入
import sys
import os
from pathlib import Path

# 获取当前文件所在目录的父目录的父目录（项目根目录）
current_dir = Path(__file__).parent
backend_dir = current_dir.parent
project_root = backend_dir.parent

# 将项目根目录添加到sys.path（如果尚未添加）
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# 现在应该可以安全地从backend包导入
from backend.DataDefinition.DataDefinition import HotelDetailInfo, HotelNameAndRecReason, HotelnoPOI


# 高德地图API配置
AMAP_API_KEY = os.getenv('AMAP_API_KEY', '794ffc804bdb7d0d5e8fa6191f034ad9')  # 需要设置环境变量
AMAP_POI_DETAIL_URL = "https://restapi.amap.com/v5/place/detail"


def grouper(iterable, n, fillvalue=None):
    """将可迭代对象分组为固定大小的组"""
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)

def add_hotel_detail_info(hotel_rec: List[HotelNameAndRecReason]) -> List[HotelDetailInfo]:
    """根据推荐的酒店名称和推荐理由，调用地图API获取详细信息，并返回包含详细信息的列表"""
    
    print(f"\n=== 开始处理酒店详细信息 ===")
    print(f"需要处理的酒店数量: {len(hotel_rec)}")
    
    if not hotel_rec:
        print("警告：酒店推荐列表为空")
        return []
    
    result = []
    
    # 将POI ID分组，每10个一组
    poi_ids = [hotel.POIId for hotel in hotel_rec]
    print(f"所有POI IDs: {poi_ids}")
    poi_groups = list(grouper(poi_ids, 10))
    print(f"POI分组数量: {len(poi_groups)}")
    
    for group_index, poi_group in enumerate(poi_groups):
        # 过滤掉None值（最后一组可能不足10个）
        valid_poi_ids = [poi_id for poi_id in poi_group if poi_id is not None]
        
        if not valid_poi_ids:
            print(f"第 {group_index + 1} 组没有有效的POI IDs，跳过")
            continue
            
        print(f"\n--- 处理第 {group_index + 1} 组 POI IDs ---")
        print(f"本组有效POI IDs: {valid_poi_ids}")
        
        # 批量获取POI详情
        batch_details = get_poi_detail_batch(valid_poi_ids)
        print(f"批量获取到的POI详情数量: {len(batch_details)}")
        
        # 将批量结果映射到对应的酒店
        for i, poi_id in enumerate(valid_poi_ids):
            # 找到对应的酒店索引
            hotel_index = group_index * 10 + i
            if hotel_index >= len(hotel_rec):
                break
                
            hotel = hotel_rec[hotel_index]
            detail_info = batch_details.get(poi_id)
            
            print(f"\n处理酒店 {hotel_index + 1}: {hotel.hotel_name}")
            print(f"  POI ID: {poi_id}")
            print(f"  是否获取到详情: {'是' if detail_info else '否'}")
            
            if detail_info:
                # 构建HotelDetailInfo对象
                hotel_detail = HotelDetailInfo(
                    hotel_name=hotel.hotel_name,
                    rec_reason=hotel.rec_reason,
                    POIId=hotel.POIId,
                    description=detail_info.get('description', hotel.description or ''),
                    address=detail_info.get('address', ''),
                    photos=detail_info.get('photos', []),
                    rating=detail_info.get('rating'),
                    cost=detail_info.get('cost') 
                )
                result.append(hotel_detail)
                print(f"  使用API获取的详细信息创建对象")
            else:
                # 如果无法获取详细信息，使用基础信息创建对象
                hotel_detail = HotelDetailInfo(
                    hotel_name=hotel.hotel_name,
                    rec_reason=hotel.rec_reason,
                    POIId=hotel.POIId,
                    description=hotel.description or '',
                    address='',
                    photos=None,
                    rating=None,
                    cost=None
                )
                result.append(hotel_detail)
                print(f"  使用基础信息创建对象（降级处理）")
        
        # 控制QPS：每处理完一批后等待一段时间，确保不超过API限制
        if group_index < len(poi_groups) - 1:
            print(f"等待350ms以控制API调用频率...")
            time.sleep(0.35)  # 350毫秒延迟
    
    print(f"\n=== 酒店详细信息处理完成 ===")
    print(f"最终返回结果数量: {len(result)}")
    return result


def get_poi_detail_batch(poi_ids: List[str]) -> Dict[str, Dict]:
    """批量获取POI详情，最多支持10个POI ID"""
    
    print(f"\n=== 开始批量获取POI详情 ===")
    print(f"请求的POI IDs: {poi_ids}")
    
    if not poi_ids or not AMAP_API_KEY or AMAP_API_KEY == 'your_amap_api_key_here':
        print("错误：POI IDs为空或API密钥无效")
        return {}
    
    # 检查POI ID数量，最多10个
    if len(poi_ids) > 10:
        poi_ids = poi_ids[:10]
        print(f"POI IDs数量超过10个，截取前10个: {poi_ids}")
    
    try:
        # 将POI ID用"|"分隔
        poi_ids_str = "|".join(poi_ids)
        
        params = {
            'key': AMAP_API_KEY,
            'id': poi_ids_str,
            'show_fields': 'business,photos'  # 获取详细信息，包括图片等
        }
        
        print(f"API请求参数: {params}")
        print("正在发送API请求...")
        
        response = requests.get(AMAP_POI_DETAIL_URL, params=params, timeout=10)
        
        print(f"API响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"API响应数据: {data}")
            
            # 检查API响应状态
            if data.get('status') == '0':
                error_info = data.get('info', '未知错误')
                print(f"批量API调用失败: {error_info}")
                return {}
                
            if data.get('status') == '1' and data.get('pois'):
                pois_data = data['pois']
                print(f"成功获取到 {len(pois_data)} 个POI的详细信息")
                
                result = {}
                for poi_data in pois_data:
                    poi_id = poi_data.get('id')
                    poi_name = poi_data.get('name', '未知名称')
                    print(f"\n处理POI: {poi_name} (ID: {poi_id})")
                    
                    if poi_id:
                        # 提取需要的信息
                        address = poi_data.get('address', '')
                        rating = poi_data.get('business', {}).get('rating', '')
                        photos_data = poi_data.get('photos', [])
                        cost_str = poi_data.get('business', {}).get('cost', '')
                        # 处理cost字段：如果为空字符串，设置为None；否则尝试转换为浮点数
                        cost = None
                        if cost_str and cost_str != '':
                            try:
                                cost = float(cost_str)
                            except (ValueError, TypeError):
                                cost = None
                        
                        print(f"  地址: {address}")
                        print(f"  评分: {rating}")
                        print(f"  图片数量: {len(photos_data)}")
                        print(f"  人均消费: {cost}")
                        
                        detail_info = {
                            'address': address,
                            'rating': rating,
                            'photos': [],
                            'cost': cost
                        }
                        
                        # 处理图片信息
                        if photos_data:
                            for photo in photos_data[:5]:  # 最多取5张图片
                                photo_url = photo.get('url', '')
                                photo_title = photo.get('title', photo.get('name', '无标题'))
                                print(f"    图片标题: {photo_title}, URL: {photo_url[:100]}")
                                
                                photo_info = {
                                    'url': photo_url,
                                    'title': photo_title
                                }
                                detail_info['photos'].append(photo_info)
                        
                        result[poi_id] = detail_info
                        print(f"  成功提取POI {poi_id} 的详细信息")
                    else:
                        print(f"  警告：POI数据缺少ID字段，跳过处理")
                
                print(f"批量处理完成，成功获取 {len(result)} 个POI的详细信息")
                return result
            else:
                print(f"批量获取POI详情失败: 未找到POI数据")
                print(f"响应状态: {data.get('status')}, POIS字段存在: {'pois' in data}")
                return {}
        else:
            print(f"批量HTTP请求失败: {response.status_code}")
            print(f"响应内容: {response.text[:200]}...")
            return {}
            
    except requests.exceptions.RequestException as e:
        print(f"批量请求异常: {e}")
        return {}
    except json.JSONDecodeError as e:
        print(f"批量JSON解析错误: {e}")
        return {}


def search_and_add_hotel_poi_from_hotelno(hotel_rec: List[HotelnoPOI], city: str = "") -> List[HotelNameAndRecReason]:
    """根据酒店名称搜索POI ID并添加进数据里（处理HotelnoPOI对象）
    
    Args:
        hotel_rec: HotelnoPOI对象列表，包含酒店名称和推荐理由
        city: 城市名称，用于提高搜索精度（可选）
        
    Returns:
        包含POI ID的酒店推荐列表
    """
    
    print(f"\n=== 开始搜索酒店POI ID（HotelnoPOI处理）===")
    print(f"需要处理的酒店数量: {len(hotel_rec)}")
    print(f"搜索城市: {city if city else '未指定'}")
    
    if not hotel_rec:
        print("警告：酒店推荐列表为空")
        return []
    
    result = []
    
    for i, hotel in enumerate(hotel_rec):
        print(f"\n--- 处理酒店 {i + 1}: {hotel.hotel_name} ---")
        
        # 搜索POI ID
        poi_id = search_poi_id_by_name(hotel.hotel_name, city)
        
        if poi_id:
            print(f"  成功找到POI ID: {poi_id}")
            # 创建包含POI ID的酒店对象
            hotel_with_poi = HotelNameAndRecReason(
                hotel_name=hotel.hotel_name,
                rec_reason=hotel.rec_reason,
                POIId=poi_id,
                description=hotel.description
            )
            result.append(hotel_with_poi)
        else:
            print(f"  警告：未找到酒店 '{hotel.hotel_name}' 的POI ID")
            # 如果没有找到POI ID，使用空字符串作为POI ID
            hotel_with_poi = HotelNameAndRecReason(
                hotel_name=hotel.hotel_name,
                rec_reason=hotel.rec_reason,
                POIId="",
                description=hotel.description
            )
            result.append(hotel_with_poi)
        
        # 控制API调用频率，避免超过限制
        if i < len(hotel_rec) - 1:
            print("等待200ms以控制API调用频率...")
            time.sleep(0.2)
    
    print(f"\n=== 酒店POI ID搜索完成 ===")
    print(f"成功处理酒店数量: {len(result)}")
    return result


def search_poi_id_by_name(hotel_name: str, city: str = "") -> Optional[str]:
    """根据酒店名称搜索POI ID
    
    Args:
        hotel_name: 酒店名称
        city: 城市名称（可选）
        
    Returns:
        POI ID字符串，如果未找到则返回None
    """
    
    print(f"搜索酒店: {hotel_name}, 城市: {city if city else '未指定'}")
    
    if not hotel_name:
        print("酒店名称为空，跳过搜索")
        return None
    
    if not AMAP_API_KEY or AMAP_API_KEY == 'your_amap_api_key_here':
        print("错误：高德地图API密钥未配置")
        return None
    
    try:
        # 构建请求参数
        params = {
            'key': AMAP_API_KEY,
            'keywords': hotel_name,
        }
        
        # 如果指定了城市，添加城市参数
        if city:
            params['region'] = city
        
        print(f"API请求参数: {params}")
        print("正在发送API请求...")
        
        # 发送API请求
        response = requests.get("https://restapi.amap.com/v5/place/text", params=params, timeout=10)
        
        print(f"API响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"API响应数据: {data}")
            
            # 检查API响应状态
            if data.get('status') == '0':
                error_info = data.get('info', '未知错误')
                print(f"API调用失败: {error_info}")
                return None
                
            if data.get('status') == '1' and data.get('pois'):
                pois = data['pois']
                print(f"找到 {len(pois)} 个相关POI")
                
                # 优先选择名称完全匹配的POI
                for poi in pois:
                    poi_name = poi.get('name', '')
                    if poi_name == hotel_name:
                        poi_id = poi.get('id')
                        print(f"找到完全匹配的POI: {poi_id} - {poi_name}")
                        return poi_id
                
                # 如果没有完全匹配，选择第一个POI
                if pois:
                    first_poi = pois[0]
                    poi_id = first_poi.get('id')
                    poi_name = first_poi.get('name', '未知名称')
                    print(f"选择第一个相关POI: {poi_id} - {poi_name}")
                    return poi_id
            
            print(f"未找到酒店 '{hotel_name}' 的相关POI")
            return None
        else:
            print(f"HTTP请求失败: {response.status_code}")
            print(f"响应内容: {response.text[:200]}...")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"请求异常: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON解析错误: {e}")
        return None


def process_hotel_recommendations(hotel_rec: List[HotelnoPOI], city: str = "") -> List[HotelDetailInfo]:
    """处理酒店推荐数据（HotelnoPOI版本）
    
    Args:
        hotel_rec: HotelnoPOI对象列表，包含酒店名称和推荐理由
        city: 城市名称，用于POI搜索（可选）
        
    Returns:
        处理后的酒店详细信息列表
    """
    
    print(f"\n=== 开始处理酒店推荐数据（HotelnoPOI版本）===")
    print(f"需要处理的酒店数量: {len(hotel_rec)}")
    print(f"搜索城市: {city if city else '未指定'}")
    
    if not hotel_rec:
        print("警告：酒店推荐列表为空")
        return []
    
    # 搜索并添加POI ID
    hotels_with_poi = search_and_add_hotel_poi_from_hotelno(hotel_rec, city)
    
    # 获取详细信息
    detailed_hotels = add_hotel_detail_info(hotels_with_poi)
    
    print(f"\n=== 酒店推荐数据处理完成 ===")
    print(f"最终返回 {len(detailed_hotels)} 个酒店的详细信息")
    print("==============================返回的数据为\n")
    print(detailed_hotels)   
    return detailed_hotels
