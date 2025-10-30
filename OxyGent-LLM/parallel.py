import asyncio

from oxygent import MAS, Config, OxyRequest, oxy
import os

Config.set_agent_llm_model("deepseek_llm")

oxy_space = [
    oxy.HttpLLM(
        name="deepseek_llm",
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL"),
        model_name=os.getenv("DEEPSEEK_MODEL_NAME"),
        llm_params={
            "temperature": 0.7,
            "max_tokens": 512,
            "chat_template_kwargs": {"enable_thinking": False},
        },
        semaphore=200,
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        llm_model="deepseek_llm",
        semaphore=200,
        timeout=100,
    ),
]

async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        outs = await mas.start_batch_processing(["Hello!"] * 10, return_trace_id=True) #并行10次
        print(outs)


if __name__ == "__main__":
    asyncio.run(main())