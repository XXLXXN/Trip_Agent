import os
from dotenv import load_dotenv
from oxygent import MAS, oxy, location_tools, train_ticket_tools
from oxygent.schemas import json_parser
import asyncio
from oxygent.prompts import ATTRACTION_AGENT_PROMPT,TRANSPORTATION_AGENT_PROMPT, TABLE_AGENT_PROMPT, HOTEL_AGENT_PROMPT

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
    oxy.StdioMCPClient(
        name="flight_ticket_tools",
        params={
            "command": "npx",
            "args": [
                "-y",
                "@variflight-ai/tripmatch-mcp"
            ],
            "env": {
                "VARIFLIGHT_API_KEY": os.getenv("VARIFLIGHT_API_KEY")}
        },
    ),
    location_tools.location_tools,
    train_ticket_tools.train_ticket_tools,
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        tools=["location_tools","train_ticket_tools","flight_ticket_tools"],
        func_parse_llm_response=json_parser.json_parser,
        llm_model="deepseek_llm",
        prompt=TRANSPORTATION_AGENT_PROMPT,
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"
        )


if __name__ == "__main__":
    asyncio.run(main())