import os
from dotenv import load_dotenv
from oxygent import MAS, Config, oxy, preset_tools, location_tools, weather_tools, table_tools, OxyRequest
import asyncio
from oxygent.prompts import TABLE_AGENT_PROMPT
from oxygent.schemas import json_parser

Config.set_agent_llm_model("deepseek_llm")
Config.set_app_name("app-table")
Config.set_server_port(8084)
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
        base_url=os.getenv("DEEPSEEK_BASE_URL"),  # 确保这个 URL 使用的是 https://
        model_name=os.getenv("DEEPSEEK_MODEL_NAME"),
    ),
    preset_tools.math_tools,
    preset_tools.time_tools,
    location_tools.location_tools,
    preset_tools.baidu_search_tools,
    weather_tools.weather_tools,
    table_tools.table_tools,
    oxy.ReActAgent(
        is_master=True,
        name="table_agent",
        desc="A tool that can provide real-time weather information.",
        tools=["time_tools", "table_tools", "math_tools", "weather_tools", "baidu_search_tools"],
        prompt=TABLE_AGENT_PROMPT,
        func_parse_llm_response=json_parser.json_parser
    ),
]

async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"  # 聊天框中的默认内容
        )

if __name__ == "__main__":
    asyncio.run(main())
