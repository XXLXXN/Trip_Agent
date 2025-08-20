from backend.DataDefinition.DataDefinition import Trip


def connect_location(validated_data:Trip):
    """将Trip类型的各个地点通过调用百度/高德地图相关api推荐路线"""
    return None