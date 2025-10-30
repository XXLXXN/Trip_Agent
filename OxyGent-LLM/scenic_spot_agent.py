import os
from dotenv import load_dotenv
from oxygent import MAS, Config, oxy, preset_tools, location_tools, OxyRequest
import asyncio
from oxygent.prompts import ATTRACTION_AGENT_PROMPT

Config.set_agent_llm_model("deepseek_llm")
Config.set_app_name("app-scenic")
Config.set_server_port(8082)
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
    oxy.StdioMCPClient(
        name="xhs_tools",
        params={
            "command": "uv",
            "args": [
                "--directory",
                "mcp_servers\\xhs-mcp",
                "run",
                "main.py"
            ],
            "env": {
                "XHS_COOKIE": os.getenv("XHS_COOKIE")}
        },
    ),
    location_tools.location_tools,
    preset_tools.baidu_search_tools,
    oxy.ReActAgent(
        is_master=True,
        name="scenic_spot_agent",
        desc="A tool for recommending preferences and popular attractions",
        tools=["baidu_search_tools", "xhs_tools", "location_tools"],
        prompt=ATTRACTION_AGENT_PROMPT
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"  # 聊天框中的默认内容
        )

if __name__ == "__main__":
    asyncio.run(main())