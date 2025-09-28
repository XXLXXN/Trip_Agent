from typing import Dict, List


def search_and_add_poi(spot_rec:List[Dict[str,str]])->List[Dict[str,str]]:
    """
    输入的字典列表
    输入示例：
    [
     {
        "SpotName": "外滩",
        "RecReason": "漫步黄浦江畔，欣赏“万国建筑博览群”，感受上海的历史与现代交融。夜晚灯光璀璨，适合拍照留念。"
     },
     {
        "SpotName": "城隍庙",
        "RecReason": "体验江南古典园林的精致布局，品尝南翔小笼包等传统小吃，感受老上海的民俗文化。适合家庭游玩。"
     }
   ]
   要求使用API为每个地点搜索POI，并将搜索的POI加入字典列表并输出
   输出示例：
   [
     {
        "SpotName": "外滩",
        "RecReason": "漫步黄浦江畔，欣赏“万国建筑博览群”，感受上海的历史与现代交融。夜晚灯光璀璨，适合拍照留念。"
        “POI”:"123456"
     },
     {
        "SpotName": "豫园 & 城隍庙",
        "RecReason": "体验江南古典园林的精致布局，品尝南翔小笼包等传统小吃，感受老上海的民俗文化。适合家庭游玩。"
        “POI”:"654321"
     },
   ]

   """
    return None