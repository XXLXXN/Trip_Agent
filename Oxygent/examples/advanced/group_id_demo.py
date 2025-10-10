"""Demo for testing group_id behavior in OxyGent MAS."""

import asyncio

from oxygent import MAS, oxy
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
        gid = "group_test_001"

        first_resp = await mas.chat_with_agent(
            {
                "query": "what is AI?",
                "group_id": gid,
            }
        )
        print("First output:", first_resp.output)
        trace_1 = first_resp.oxy_request.current_trace_id
        print("Used group_id:", gid)
        print("Trace 1:", trace_1)
        second_resp = await mas.chat_with_agent(
            {
                "query": "and how does it work?",
                "from_trace_id": trace_1,
            }
        )
        trace_2 = second_resp.oxy_request.current_trace_id
        group_2 = second_resp.oxy_request.group_id
        print("Second output:", second_resp.output)
        print("Trace 2:", trace_2)
        print("Inherited group_id:", group_2)

        assert group_2 == gid, "Group ID inheritance failed!"


if __name__ == "__main__":
    asyncio.run(main())
