from pydantic import Field
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from enum import Enum

from oxygent.oxy import FunctionHub

table_tools = FunctionHub(name="table_tools")


class TravelInterest(str, Enum):
    """旅行兴趣枚举"""
    CULTURE = "culture"
    NATURE = "nature"
    ADVENTURE = "adventure"
    FOOD = "food"
    SHOPPING = "shopping"
    RELAXATION = "relaxation"
    HISTORY = "history"
    ART = "art"


class AgeGroup(str, Enum):
    """年龄组枚举"""
    CHILDREN = "children"
    TEENAGERS = "teenagers"
    ADULTS = "adults"
    SENIORS = "seniors"


@table_tools.tool(
    description="根据目的地、时长、团队构成和兴趣生成完整的旅行行程"
)
async def generate_itinerary(
        destination: str = Field(description="旅行目的地"),
        duration_days: int = Field(description="旅行总天数", ge=1, le=30),
        group_size: int = Field(description="团队人数", ge=1, le=20),
        age_groups: Dict[AgeGroup, int] = Field(description="各年龄组人数"),
        interests: List[TravelInterest] = Field(description="团队兴趣列表"),
        start_date: Optional[str] = Field(default=None, description="开始日期，格式为YYYY-MM-DD"),
        pace: str = Field(default="moderate", description="旅行节奏：'relaxed'轻松、'moderate'适中、'intensive'紧凑")
) -> Dict:
    """
    根据所有因素生成个性化旅行行程
    """
    # 根据团队构成和节奏计算每日活动限制
    max_daily_activities = _calculate_daily_activity_limit(age_groups, pace)

    # 生成日期范围
    dates = _generate_date_range(start_date, duration_days)

    # 生成活动池
    activities_pool = _generate_activities_pool(destination, interests, age_groups)

    # 构建完整行程
    itinerary = {
        "destination": destination,
        "duration_days": duration_days,
        "group_size": group_size,
        "age_groups": age_groups,
        "interests": interests,
        "pace": pace,
        "daily_activity_limit": max_daily_activities,
        "days": []
    }

    # 创建每日计划
    for day_num in range(duration_days):
        day_plan = _create_daily_plan(
            day_num=day_num,
            date=dates[day_num],
            activities_pool=activities_pool,
            max_activities=max_daily_activities,
            age_groups=age_groups
        )
        itinerary["days"].append(day_plan)

    return itinerary


@table_tools.tool(
    description="根据反馈和请求优化现有行程"
)
async def optimize_itinerary(
        current_itinerary: Dict,
        feedback: Dict = Field(description="对当前行程的反馈"),
        changes_requested: List[str] = Field(description="请求的更改")
) -> Dict:
    """
    根据团队反馈优化现有行程
    """
    optimized = current_itinerary.copy()
    optimized["optimization_notes"] = []  # 优化说明
    optimized["feedback_received"] = feedback  # 收到的反馈
    optimized["changes_requested"] = changes_requested  # 请求的更改

    # 根据反馈应用优化逻辑
    for change in changes_requested:
        change_lower = change.lower()

        if any(keyword in change_lower for keyword in ["休息", "放慢", "轻松"]):
            current_limit = optimized.get("daily_activity_limit", 3)
            optimized["daily_activity_limit"] = max(1, current_limit - 1)
            optimized["optimization_notes"].append("减少每日活动限制以增加休息时间")
            optimized["pace"] = "relaxed"

        elif any(keyword in change_lower for keyword in ["更多活动", "更忙", "紧凑"]):
            current_limit = optimized.get("daily_activity_limit", 3)
            optimized["daily_activity_limit"] = min(5, current_limit + 1)
            optimized["optimization_notes"].append("增加每日活动限制以获得更多体验")
            optimized["pace"] = "intensive"

    return optimized


@table_tools.tool(
    description="获取目的地的活动建议和推荐"
)
async def get_travel_recommendations(
        destination: str,
        interests: List[TravelInterest],
        age_groups: Dict[AgeGroup, int],
        duration_days: int = Field(default=3, description="旅行时长，用于推荐")
) -> Dict:
    """
    获取个性化活动建议和旅行推荐
    """
    activities = _generate_activities_pool(destination, interests, age_groups)

    # 根据团队构成获取推荐
    recommendations = _get_group_recommendations(age_groups, interests, duration_days)

    # 按兴趣分类活动
    categorized_activities = {}
    for activity in activities:
        interest = activity["interest"]
        if interest not in categorized_activities:
            categorized_activities[interest] = []
        categorized_activities[interest].append({
            "name": activity["name"],
            "duration": f"{activity['duration_hours']}小时",
            "intensity": activity["intensity"]
        })

    return {
        "destination": destination,
        "trip_duration": duration_days,
        "total_activities": len(activities),
        "categorized_activities": categorized_activities,
        "group_recommendations": recommendations,
        "ideal_pace": _recommend_pace(age_groups, duration_days)
    }


def _calculate_daily_activity_limit(age_groups: Dict[AgeGroup, int], pace: str) -> int:
    """根据年龄组和节奏计算最佳每日活动限制"""
    pace_limits = {"relaxed": 2, "moderate": 3, "intensive": 4}  # 节奏限制
    base_activities = pace_limits.get(pace, 3)  # 基础活动数

    adjustment = 0  # 调整值
    if age_groups.get(AgeGroup.CHILDREN, 0) > 0:
        adjustment -= 1  # 有儿童则减少活动
    if age_groups.get(AgeGroup.SENIORS, 0) > 0:
        adjustment -= 1  # 有老年人则减少活动
    if age_groups.get(AgeGroup.TEENAGERS, 0) > 0:
        adjustment += 0.5  # 有青少年则增加活动
    if age_groups.get(AgeGroup.ADULTS, 0) > 0:
        adjustment += 0.5  # 有成人则增加活动

    return max(1, min(5, int(base_activities + adjustment)))  # 确保在1-5范围内


def _generate_date_range(start_date: Optional[str], duration_days: int) -> List[str]:
    """为行程生成日期范围"""
    start = datetime.strptime(start_date, "%Y-%m-%d") if start_date else datetime.now()
    return [(start + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(duration_days)]


def _generate_activities_pool(destination: str, interests: List[TravelInterest], age_groups: Dict[AgeGroup, int]) -> \
List[Dict]:
    """根据目的地和兴趣生成活动池"""
    activity_templates = {
        TravelInterest.CULTURE: [
            "参观{destination}博物馆", "探索{destination}文化中心",
            "观看传统表演", "游览当地遗产景点"
        ],
        TravelInterest.NATURE: [
            "在{destination}国家公园徒步", "参观植物园",
            "观鸟之旅", "自然漫步和摄影"
        ],
        TravelInterest.ADVENTURE: [
            "体验冒险运动", "滑索之旅",
            "水上运动活动", "山地自行车"
        ],
        TravelInterest.FOOD: [
            "{destination}美食之旅", "当地美食烹饪课程",
            "参观当地市场", "葡萄酒/啤酒品尝"
        ],
        TravelInterest.SHOPPING: [
            "在{destination}市中心购物", "参观手工艺品市场",
            "探索购物区", "购买当地工艺品"
        ],
        TravelInterest.RELAXATION: [
            "水疗和养生日", "海滩放松",
            "瑜伽和冥想", "悠闲公园游览"
        ],
        TravelInterest.HISTORY: [
            "历史城市之旅", "参观古迹",
            "当地历史博物馆", "导游带领的遗产步行"
        ],
        TravelInterest.ART: [
            "艺术画廊之旅", "街头艺术探索",
            "当代艺术博物馆", "当地工匠工作坊"
        ]
    }

    activities = []
    for interest in interests:
        if interest in activity_templates:
            for template in activity_templates[interest]:
                activity_name = template.format(destination=destination)
                activity = {
                    "name": activity_name,
                    "interest": interest,
                    "duration_hours": 2.0,  # 默认时长2小时
                    "intensity": _calculate_activity_intensity(interest)  # 活动强度
                }
                activities.append(activity)

    return activities


def _create_daily_plan(day_num: int, date: str, activities_pool: List[Dict],
                       max_activities: int, age_groups: Dict[AgeGroup, int]) -> Dict:
    """创建单日计划"""
    # 每日时间表模板
    daily_template = {
        "morning": {"start": "08:00", "end": "12:00", "activities": [], "breakfast": "08:00-09:00"},  # 早晨
        "afternoon": {"start": "13:00", "end": "17:00", "activities": [], "lunch": "12:00-13:00",
                      "rest": "15:00-15:30"},  # 下午
        "evening": {"start": "18:00", "end": "22:00", "activities": [], "dinner": "18:00-19:00"}  # 晚上
    }

    day_plan = {
        "date": date,
        "day_number": day_num + 1,
        **daily_template
    }

    # 选择当天的活动
    selected_activities = []  # 已选活动
    remaining_activities = activities_pool.copy()  # 剩余活动

    # 在不同时间段分配活动
    for time_slot in ["morning", "afternoon", "evening"]:
        if len(selected_activities) < max_activities and remaining_activities:
            # 筛选适合该时间段的活动
            suitable_activities = [
                act for act in remaining_activities
                if _is_activity_suitable_for_timeslot(act, time_slot)
            ]

            if suitable_activities:
                selected_activity = suitable_activities[0]
                selected_activities.append(selected_activity)
                day_plan[time_slot]["activities"].append({
                    "name": selected_activity["name"],
                    "duration": f"{selected_activity['duration_hours']}小时",
                    "interest": selected_activity["interest"],
                    "intensity": selected_activity["intensity"]
                })
                remaining_activities.remove(selected_activity)

    # 添加特定日期的备注
    notes = []
    if day_num == 0:  # 第一天
        notes.extend(["抵达日 - 建议安排轻松行程", "办理入住手续"])
        # 抵达日清除早晨活动
        day_plan["morning"]["activities"] = []

    if day_num == len(activities_pool) // max_activities - 1:  # 最后一天
        notes.extend(["出发日 - 打包和准备", "办理退房手续"])
        # 出发日清除晚上活动
        day_plan["evening"]["activities"] = []

    if notes:
        day_plan["notes"] = notes

    return day_plan


def _calculate_activity_intensity(interest: TravelInterest) -> str:
    """计算活动强度级别"""
    intensity_map = {
        TravelInterest.ADVENTURE: "高",
        TravelInterest.NATURE: "中",
        TravelInterest.CULTURE: "低",
        TravelInterest.FOOD: "低",
        TravelInterest.SHOPPING: "低",
        TravelInterest.RELAXATION: "非常低",
        TravelInterest.HISTORY: "低",
        TravelInterest.ART: "低"
    }
    return intensity_map.get(interest, "中")


def _is_activity_suitable_for_timeslot(activity: Dict, time_slot: str) -> bool:
    """检查活动是否适合特定时间段"""
    # 高强度活动不适合晚上
    if time_slot == "evening" and activity["intensity"] == "高":
        return False
    return True


def _get_group_recommendations(age_groups: Dict[AgeGroup, int], interests: List[TravelInterest], duration_days: int) -> \
List[str]:
    """根据团队构成获取个性化推荐"""
    recommendations = []

    # 基于年龄的推荐
    if AgeGroup.CHILDREN in age_groups and age_groups[AgeGroup.CHILDREN] > 0:
        recommendations.extend([
            "包含适合儿童的活动，时长较短",
            "计划频繁休息和零食时间",
            "考虑具有教育价值的活动"
        ])

    if AgeGroup.SENIORS in age_groups and age_groups[AgeGroup.SENIORS] > 0:
        recommendations.extend([
            "考虑无障碍设施和步行距离",
            "包含有座位的活动和舒适的节奏",
            "活动之间计划休息时间"
        ])

    if AgeGroup.TEENAGERS in age_groups and age_groups[AgeGroup.TEENAGERS] > 0:
        recommendations.extend([
            "包含互动和社交活动",
            "考虑科技友好的地点",
            "平衡教育和娱乐体验"
        ])

    # 基于兴趣的推荐
    if TravelInterest.ADVENTURE in interests:
        recommendations.append("冒险活动可能需要提前预订和身体准备")

    if TravelInterest.FOOD in interests:
        recommendations.append("提前研究饮食选择并预订餐厅")

    if TravelInterest.SHOPPING in interests:
        recommendations.append("分配预算并查看当地市场时间表")

    # 基于时长的推荐
    if duration_days > 7:
        recommendations.append("考虑在旅行中间安排休息日")

    if duration_days < 3:
        recommendations.append("由于时间有限，专注于主要景点")

    return recommendations


def _recommend_pace(age_groups: Dict[AgeGroup, int], duration_days: int) -> str:
    """根据团队和时长推荐理想旅行节奏"""
    if AgeGroup.CHILDREN in age_groups or AgeGroup.SENIORS in age_groups:
        return "轻松"
    elif duration_days > 10:
        return "适中"
    else:
        return "适中"