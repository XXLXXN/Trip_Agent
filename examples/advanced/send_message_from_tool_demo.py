import os

from pydantic import Field

from oxygent import MAS, Config, OxyRequest, oxy

Config.set_server_port(8090)

math_fh = oxy.FunctionHub(name="math_tools")


@math_fh.tool(description="A tool that can calculate the value of pi.")
async def calc_pi(
    prec: int = Field(description="how many decimal places"),
    oxy_request: OxyRequest = Field(description="The oxy request"),
) -> float:
    import math
    from decimal import Decimal, getcontext

    getcontext().prec = int(prec)
    x = 0
    for k in range(int(int(prec) / 8) + 1):
        a = 2 * Decimal.sqrt(Decimal(2)) / 9801
        b = math.factorial(4 * k) * (1103 + 26390 * k)
        c = pow(math.factorial(k), 4) * pow(396, 4 * k)
        x = x + a * b / c
    result = 1 / x

    await oxy_request.send_message({"type": "answer", "content": result})  # 发送消息
    await oxy_request.break_task()  # 中断任务
    return result


oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
    ),
    math_fh,
    oxy.ReActAgent(
        name="master_agent",
        tools=["math_tools"],
        llm_model="default_llm",
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Please calculate the 20 positions of Pi"
        )


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
