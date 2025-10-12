import asyncio
from dotenv import load_dotenv
from oxygent import MAS, oxy, weather_tools
import os

load_dotenv()
oxy_space = [
    oxy.HttpLLM(
        name="deepseek_llm",
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL"),
        model_name=os.getenv("DEEPSEEK_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
    ),
    weather_tools.weather_tools,  # 工具包可以整个放入oxy_space
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        tools=["weather_tools"],  # 在这里放入工具
        llm_model="deepseek_llm",
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"
        )


if __name__ == "__main__":
    asyncio.run(main())