import os
from dotenv import load_dotenv
from oxygent import MAS, Config, oxy, preset_tools, location_tools, weather_tools, train_ticket_tools, table_tools, OxyRequest
import asyncio

Config.set_agent_llm_model("deepseek_llm")
# 加载环境变量
load_dotenv()

def update_query(oxy_request: OxyRequest):
    user_query = oxy_request.get_query(master_level=True)
    current_query = oxy_request.get_query()
    oxy_request.set_query(
        f"user query is {user_query}\ncurrent query is {current_query}"
    )
    return oxy_request

oxy_space = [
    oxy.HttpLLM(
        name="deepseek_llm",
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL"),
        model_name=os.getenv("DEEPSEEK_MODEL_NAME"),
    ),
    oxy.ReActAgent(
        name="fare_agent",
        desc="A tool that can check available train tickets or plane tickets between two stations.",
        server_url="http://127.0.0.1:8081",
    ),
    oxy.ReActAgent(
        name="scenic_spot_agent",
        desc="A tool for recommending preferences and popular attractions",
        server_url="http://127.0.0.1:8082",
    ),
    oxy.ReActAgent(
        name="hotel_recommend_agent",
        desc="A tool that can provide information about attractions in a certain place and real-time traffic conditions.",
        server_url="http://127.0.0.1:8083",
    ),
    oxy.ReActAgent(
        name="table_agent",
        desc="A tool that can provide real-time weather information.",
        server_url="http://127.0.0.1:8084",
    ),
    oxy.ReActAgent(
        name="modify_agent",
        desc="A tool for modifying the itinerary information of a trip.",
        server_url="http://127.0.0.1:8085",
    ),
    oxy.ReActAgent(
        is_master=True,
        name="master_agent",
        sub_agents=["fare_agent", "scenic_spot_agent", "hotel_recommend_agent", "table_agent", "modify_agent"],
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"  # 聊天框中的默认内容
        )

if __name__ == "__main__":
    asyncio.run(main())