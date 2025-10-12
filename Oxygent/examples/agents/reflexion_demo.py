"""Demo for using OxyGent with reflexion capabilities."""

import asyncio

from oxygent import MAS, Config, OxyRequest, oxy
from oxygent.utils.env_utils import get_env_var

Config.set_server_port(8083)


def custom_reflexion(response: str, oxy_request: OxyRequest) -> str:
    """Custom reflexion function to evaluate response quality.

    Args:
        response (str): The agent's response to evaluate
        query (str): The original user query
        oxy_request: The current request context

    Returns:
        tuple[bool, str]: (is_acceptable, reflection_message)
    """
    # Basic checks from default implementation
    if not response or len(response.strip()) < 5:
        return "The response is too short or empty. Please provide a more detailed and helpful answer."

    # Custom business logic checks
    if "hello" in oxy_request.get_query().lower():
        # For greeting queries, expect friendly response
        if not any(
            word in response.lower()
            for word in ["hello", "hi", "hey", "greetings", "welcome"]
        ):
            return "This is a greeting. Please respond in a more friendly and welcoming manner."

    if (
        "math" in oxy_request.get_query().lower()
        or "calculate" in oxy_request.get_query().lower()
    ):
        # For math queries, expect numerical content
        if not any(char.isdigit() for char in response):
            return "This seems to be a math-related question but your answer doesn't contain any numbers. Please provide a numerical answer or calculation."

    if "explain" in oxy_request.get_query().lower():
        # For explanation requests, expect detailed responses
        if len(response.split()) < 20:
            return "The user asked for an explanation, but your response is too brief. Please provide a more detailed explanation."

    # Check for common unhelpful responses
    unhelpful_phrases = [
        "i don't know",
        "i can't help",
        "sorry, i cannot",
        "i'm not sure",
        "not possible",
    ]

    if any(phrase in response.lower() for phrase in unhelpful_phrases):
        return "Your response seems unhelpful. Please try to provide a more constructive answer or suggest alternative solutions."

    return None


def math_reflexion(response: str, oxy_request: OxyRequest) -> str:
    """Specialized reflexion function for mathematical problems."""
    # First apply basic checks
    basic_msg = custom_reflexion(response, oxy_request)
    if basic_msg:
        return basic_msg

    # Math-specific checks
    if any(
        word in oxy_request.get_query().lower()
        for word in ["calculate", "compute", "solve", "math", "equation"]
    ):
        # Expect step-by-step solution
        if "step" not in response.lower() and "=" not in response:
            return "For mathematical problems, please provide a step-by-step solution showing your work."

    return None


def process_basic_input(oxy_request: OxyRequest):
    """Process input for basic agent - just pass through the query"""
    current_query = oxy_request.get_query()
    oxy_request.arguments["query"] = current_query
    return oxy_request


def process_smart_input(oxy_request: OxyRequest):
    """Process input for smart agent - add some context"""
    current_query = oxy_request.get_query()
    oxy_request.arguments["query"] = current_query
    oxy_request.arguments["context"] = (
        "You are an intelligent assistant focused on providing high-quality responses."
    )
    return oxy_request


def process_math_input(oxy_request: OxyRequest):
    """Process input for math agent - add math-specific context"""
    current_query = oxy_request.get_query()
    oxy_request.arguments["query"] = current_query
    oxy_request.arguments["context"] = (
        "You are a mathematics expert. Always show your work step by step and provide clear final answers."
    )
    return oxy_request


def process_master_input(oxy_request: OxyRequest):
    """Process input for master agent - coordinate sub-agents"""
    current_query = oxy_request.get_query()
    oxy_request.arguments["query"] = current_query
    oxy_request.arguments["coordination"] = (
        "Coordinate with sub-agents as needed to provide the best response."
    )
    return oxy_request


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
    # Basic agent with default reflexion
    oxy.ReActAgent(
        name="basic_agent",
        desc="A basic agent with default reflexion capabilities",
        llm_model="default_llm",
        func_process_input=process_basic_input,
    ),
    # Agent with custom reflexion for general queries
    oxy.ReActAgent(
        name="smart_agent",
        desc="An agent with custom reflexion for better response quality",
        llm_model="default_llm",
        func_reflexion=custom_reflexion,
        func_process_input=process_smart_input,
    ),
    # Specialized agent for math problems
    oxy.ReActAgent(
        name="math_agent",
        desc="A specialized agent for mathematical problems with advanced reflexion",
        llm_model="default_llm",
        func_reflexion=math_reflexion,
        func_process_input=process_math_input,
    ),
    # Master agent that coordinates others
    oxy.ReActAgent(
        name="master_agent",
        sub_agents=["basic_agent", "smart_agent", "math_agent"],
        is_master=True,
        llm_model="default_llm",
        func_reflexion=math_reflexion,
        func_process_input=process_master_input,
    ),
]


async def test_reflexion_capabilities():
    """Test different reflexion scenarios."""
    async with MAS(oxy_space=oxy_space) as mas:
        print("=== Testing Basic Agent (Default Reflexion) ===")
        result = await mas.call(
            callee="basic_agent", arguments={"query": "Hello there!"}
        )
        print(f"Query: Hello there!\nResponse: {result}\n")

        print("=== Testing Smart Agent (Custom Reflexion) ===")
        result = await mas.call(
            callee="smart_agent",
            arguments={"query": "Can you explain how photosynthesis works?"},
        )
        print(f"Query: Can you explain how photosynthesis works?\nResponse: {result}\n")

        print("=== Testing Math Agent (Specialized Reflexion) ===")
        result = await mas.call(
            callee="math_agent",
            arguments={"query": "Calculate the area of a circle with radius 5"},
        )
        print(
            f"Query: Calculate the area of a circle with radius 5\nResponse: {result}\n"
        )

        print("=== Testing Master Agent Coordination ===")
        result = await mas.call(
            callee="master_agent",
            arguments={
                "query": "Solve this equation: 2x + 5 = 15, then explain the steps"
            },
        )
        print(
            f"Query: Solve this equation: 2x + 5 = 15, then explain the steps\nResponse: {result}\n"
        )


async def test_reflexion_failure_scenarios():
    """Test scenarios where reflexion should trigger improvements."""
    async with MAS(oxy_space=oxy_space) as mas:
        print("=== Testing Reflexion Improvement Scenarios ===")

        # Test with a query that might initially produce a short response
        test_queries = [
            "Hi",  # Should trigger friendly response requirement
            "What's 2+2?",  # Should trigger math explanation requirement
            "Explain quantum physics",  # Should trigger detailed explanation requirement
        ]

        for query in test_queries:
            print(f"\nTesting query: '{query}'")
            result = await mas.call(callee="smart_agent", arguments={"query": query})
            print(f"Final response: {result}")


async def test():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Calculate the area of a circle with radius 5"
        )


async def main():
    # Test basic reflexion capabilities
    await test_reflexion_capabilities()

    print("\n" + "=" * 60 + "\n")

    # Test reflexion improvement scenarios
    await test_reflexion_failure_scenarios()


if __name__ == "__main__":
    asyncio.run(test())
