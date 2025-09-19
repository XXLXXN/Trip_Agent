from backend.DataDefinition.DataDefinition import Trip


def connect_location(validated_data:Trip):
    """目前Trip格式只有地点，将Trip类型的各个地点通过调用百度/高德地图相关api推荐路线，达到类似自己用百度地图导航的效果，
    返回一个包括中间导航的Trip"""
    return None