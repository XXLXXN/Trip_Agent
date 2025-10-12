import os

from oxygent import MAS, oxy

oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01, "stream": True},
        semaphore=4,
    ),
    oxy.ChatAgent(name="intent_agent", llm_model="default_llm"),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(first_query="你好")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
