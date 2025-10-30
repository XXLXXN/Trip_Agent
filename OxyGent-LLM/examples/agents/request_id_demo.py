"""Demo for using OxyGent with multiple LLMs and an agent."""

import asyncio

from oxygent import MAS, oxy
from oxygent.utils.common_utils import generate_uuid
from oxygent.utils.env_utils import get_env_var

oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=get_env_var("DEFAULT_LLM_API_KEY"),
        base_url=get_env_var("DEFAULT_LLM_BASE_URL"),
        model_name=get_env_var("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        llm_model="default_llm",
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        request_id = generate_uuid(length=22)
        result = await mas.chat_with_agent(
            {
                "query": "hello!",
                "request_id": request_id,
            }
        )

        print("output :", result)
        print("used request_id :", request_id)


if __name__ == "__main__":
    asyncio.run(main())
