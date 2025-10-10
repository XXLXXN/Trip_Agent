import os
from dotenv import load_dotenv
from oxygent import MAS, Config, oxy, preset_tools, location_tools, weather_tools
from oxygent.prompts import A_AGENT_PROMPT
import ssl

Config.set_agent_llm_model("deepseek_llm")

# 加载环境变量
load_dotenv()

# 配置 oxy_space，包括代理、工具等
oxy_space = [
    oxy.HttpLLM(
        name="deepseek_llm",
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL"),  # 确保这个 URL 使用的是 https://
        model_name=os.getenv("DEEPSEEK_MODEL_NAME"),
    ),
    preset_tools.time_tools,
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool that can query the time",
        tools=["time_tools"],
    ),
    preset_tools.file_tools,
    oxy.ReActAgent(
        name="file_agent",
        desc="A tool that can operate the file system",
        tools=["file_tools"],
    ),
    preset_tools.math_tools,
    oxy.ReActAgent(
        name="math_agent",
        desc="A tool that can perform mathematical calculations.",
        tools=["math_tools"],
    ),
    preset_tools.train_ticket_tools,
    oxy.ReActAgent(
        name="train_ticket_agent",
        desc="A tool that can check available train tickets between two stations.",
        tools=["train_ticket_tools"],
    ),
    preset_tools.baidu_search_tools,
    oxy.ReActAgent(
        name="baidu_search_agent",
        desc="A tool that can be used for searching Baidu web pages.",
        tools=["baidu_search_tools"],
    ),
    location_tools.location_tools,
    oxy.ReActAgent(
        name="location_agent",
        desc="A tool that can provide information about attractions in a certain place and real-time traffic conditions.",
        tools=["location_tools"],
    ),
    weather_tools.weather_tools,
    oxy.ReActAgent(
        name="weather_agent",
        desc="A tool that can provide real-time weather information.",
        tools=["time_tools", "weather_tools"],
    ),
    oxy.ReActAgent(
        is_master=True,
        name="master_agent",
        sub_agents=["baidu_search_agent"],
        prompt=A_AGENT_PROMPT,
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"  # 聊天框中的默认内容
        )

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
