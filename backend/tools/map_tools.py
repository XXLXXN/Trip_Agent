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
from backend.DataDefinition.DataDefinition import SpotDetailInfo, SpotNameAndRecReason


# 高德地图API配置
AMAP_API_KEY = os.getenv('AMAP_API_KEY', '794ffc804bdb7d0d5e8fa6191f034ad9')  # 需要设置环境变量
AMAP_POI_DETAIL_URL = "https://restapi.amap.com/v5/place/detail"


def grouper(iterable, n, fillvalue=None):
    """将可迭代对象分组为固定大小的组"""
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)

def add_detail_info(spot_rec: List[SpotNameAndRecReason]) -> List[SpotDetailInfo]:
    """根据推荐的景点名称和推荐理由和POIid，调用地图API获取详细信息，并返回包含详细信息的列表"""
    
    print(f"\n=== 开始处理景点详细信息 ===")
    print(f"需要处理的景点数量: {len(spot_rec)}")
    
    if not spot_rec:
        print("警告：景点推荐列表为空")
        return []
    
    result = []
    
    # 将POI ID分组，每10个一组
    poi_ids = [spot.POIId for spot in spot_rec]
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
        
        # 将批量结果映射到对应的景点
        for i, poi_id in enumerate(valid_poi_ids):
            # 找到对应的景点索引
            spot_index = group_index * 10 + i
            if spot_index >= len(spot_rec):
                break
                
            spot = spot_rec[spot_index]
            detail_info = batch_details.get(poi_id)
            
            print(f"\n处理景点 {spot_index + 1}: {spot.SpotName}")
            print(f"  POI ID: {poi_id}")
            print(f"  是否获取到详情: {'是' if detail_info else '否'}")
            
            if detail_info:
                # 构建SpotDetailInfo对象
                spot_detail = SpotDetailInfo(
                    SpotName=spot.SpotName,
                    RecReason=spot.RecReason,
                    POIId=spot.POIId,
                    description=detail_info.get('description', spot.description or ''),
                    address=detail_info.get('address', ''),
                    photos=detail_info.get('photos', []),
                    rating=detail_info.get('rating')
                )
                result.append(spot_detail)
                print(f"  使用API获取的详细信息创建对象")
            else:
                # 如果无法获取详细信息，使用基础信息创建对象
                spot_detail = SpotDetailInfo(
                    SpotName=spot.SpotName,
                    RecReason=spot.RecReason,
                    POIId=spot.POIId,
                    description=spot.description or '',
                    address='',
                    photos=None,
                    rating=None
                )
                result.append(spot_detail)
                print(f"  使用基础信息创建对象（降级处理）")
        
        # 控制QPS：每处理完一批后等待一段时间，确保不超过API限制
        if group_index < len(poi_groups) - 1:
            print(f"等待350ms以控制API调用频率...")
            time.sleep(0.35)  # 350毫秒延迟
    
    print(f"\n=== 景点详细信息处理完成 ===")
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
                        
                        print(f"  地址: {address}")
                        print(f"  评分: {rating}")
                        print(f"  图片数量: {len(photos_data)}")
                        
                        detail_info = {
                            'address': address,
                            'rating': rating,
                            'photos': []
                        }
                        
                        # 处理图片信息
                        if photos_data:
                            for photo in photos_data[:5]:  # 最多取5张图片
                                photo_url = photo.get('url', '')
                                photo_title = photo.get('title', photo.get('name', '无标题'))
                                print(f"    图片标题: {photo_title}, URL: {photo_url[:50]}...")
                                
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

def get_poi_detail_by_id(poi_id: str) -> Optional[Dict]:
    """根据POI ID获取详细信息（单次请求，用于向后兼容）"""
    
    if not poi_id or not AMAP_API_KEY or AMAP_API_KEY == 'your_amap_api_key_here':
        return None
    
    try:
        params = {
            'key': AMAP_API_KEY,
            'id': poi_id,
            'show_fields': 'business,photos'  # 获取详细信息，包括图片等
        }
        
        response = requests.get(AMAP_POI_DETAIL_URL, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # 检查API响应状态
            if data.get('status') == '0':
                print(f"API调用失败: {data.get('info', '未知错误')}")
                return None
                
            if data.get('status') == '1' and data.get('pois'):
                poi_data = data['pois'][0]
                
                # 提取需要的信息
                detail_info = {
                    'address': poi_data.get('address', ''),
                    'rating': poi_data.get('business', {}).get('rating', ''),
                    'photos': []
                }
                
                # 处理图片信息 - 修正图片标题处理
                photos_data = poi_data.get('photos', [])
                if photos_data:
                    for photo in photos_data[:5]:  # 最多取5张图片
                        photo_info = {
                            'url': photo.get('url', ''),
                            'title': photo.get('title', photo.get('name', '无标题'))  # 处理标题字段
                        }
                        detail_info['photos'].append(photo_info)
                
                return detail_info
            else:
                print(f"获取POI详情失败: 未找到POI数据")
                return None
        else:
            print(f"HTTP请求失败: {response.status_code}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"请求异常: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON解析错误: {e}")
        return None
