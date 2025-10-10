import asyncio
import os

from oxygent import MAS, OxyRequest, oxy


async def func_retrieve_knowledge(oxy_request: OxyRequest) -> str:
    query = oxy_request.get_query()
    print(query)
    return "Pi is 3.141592653589793238462643383279502."


oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
    ),
    oxy.RAGAgent(
        name="intent_agent",
        llm_model="default_llm",
        func_retrieve_knowledge=func_retrieve_knowledge,
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Please calculate the 20 positions of Pi"
        )


if __name__ == "__main__":
    asyncio.run(main())
