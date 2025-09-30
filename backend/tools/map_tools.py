import requests
import json
from typing import Dict, List, Optional
import os

from backend.DataDefinition.DataDefinition import SpotDetailInfo, SpotNameAndRecReason


# 高德地图API配置
AMAP_API_KEY = os.getenv('AMAP_API_KEY', '794ffc804bdb7d0d5e8fa6191f034ad9')  # 需要设置环境变量
AMAP_POI_DETAIL_URL = "https://restapi.amap.com/v5/place/detail"


def add_detail_info(spot_rec: List[SpotNameAndRecReason]) -> List[SpotDetailInfo]:
    """根据推荐的景点名称和推荐理由和POIid，调用地图API获取详细信息，并返回包含详细信息的列表"""
    
    if not spot_rec:
        return []
    
    result = []
    
    for spot in spot_rec:
        # 使用POI ID获取详细信息
        detail_info = get_poi_detail_by_id(spot.POIId)
        
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
    
    return result


def get_poi_detail_by_id(poi_id: str) -> Optional[Dict]:
    """根据POI ID获取详细信息"""
    
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
