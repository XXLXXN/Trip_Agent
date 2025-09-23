from ..DataDefinition.DataDefinition import Trip
from ..Agents.SpotRecommendation import get_spot_recommendation
from ..tools.map_tools import search_and_add_poi
import json

async def send_spot_recommendation_prompt(prompts:str)->Trip:
    data=await get_spot_recommendation(prompts)
    spot_rec_str=data[0].content
    try:
        spot_rec=json.loads(spot_rec_str)
        search_and_add_poi(spot_rec)
    except json.JSONDecodeError as e:
        print(f"解析错误: {e}")



    return

