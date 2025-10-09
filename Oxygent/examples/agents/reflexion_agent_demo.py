"""Workflow-based Reflexion Demo for OxyGent"""

import asyncio

from oxygent import MAS, Config, OxyRequest, oxy
from oxygent.utils.env_utils import get_env_var

# Set LLM model
Config.set_agent_llm_model("default_llm")


# Reflexion Workflow Core Logic
async def reflexion_workflow(oxy_request: OxyRequest):
    """
    Workflow implementing external reflexion process:
    1. Get user query
    2. Let worker_agent generate initial answer
    3. Let reflexion_agent evaluate answer quality
    4. If unsatisfactory, provide improvement suggestions and regenerate
    5. Return final satisfactory answer
    """

    # Step 1: Get original user query
    user_query = oxy_request.get_query(master_level=True)
    print(f"=== User Query ===\n{user_query}\n")

    max_iterations = 3
    current_iteration = 0

    while current_iteration < max_iterations:
        current_iteration += 1
        print(f"=== Reflexion Round {current_iteration} ===")

        # Step 2: Let worker_agent generate answer
        worker_resp = await oxy_request.call(
            callee="worker_agent", arguments={"query": user_query}
        )
        worker_answer = worker_resp.output
        print(f"Worker Answer:\n{worker_answer}\n")

        # Step 3: Let reflexion_agent evaluate answer quality
        evaluation_query = f"""
Please evaluate the quality of the following answer:

Original Question: {user_query}

Answer: {worker_answer}

Please return evaluation results in the following format:
Evaluation Result: [Satisfactory/Unsatisfactory]
Evaluation Reason: [Specific reason]
Improvement Suggestions: [If unsatisfactory, provide specific improvement suggestions]
"""

        reflexion_resp = await oxy_request.call(
            callee="reflexion_agent", arguments={"query": evaluation_query}
        )
        reflexion_result = reflexion_resp.output
        print(f"Reflexion Evaluation:\n{reflexion_result}\n")

        # Step 4: Parse evaluation results
        if (
            "Satisfactory" in reflexion_result
            and "Unsatisfactory" not in reflexion_result
        ):
            print("=== Reflexion Complete, Answer Quality Satisfactory ===")
            return f"Final answer optimized through {current_iteration} rounds of reflexion:\n\n{worker_answer}"

        # Step 5: If unsatisfactory, extract improvement suggestions and update query
        improvement_suggestion = ""
        lines = reflexion_result.split("\n")
        for line in lines:
            if "Improvement Suggestions" in line:
                improvement_suggestion = line.split(":", 1)[-1].strip()
                break

        if improvement_suggestion:
            user_query = f"{oxy_request.get_query(master_level=True)}\n\nThe result was: {reflexion_result}. Please note the following improvement suggestions: {improvement_suggestion}"
            print(f"Updated query with improvement suggestions:\n{user_query}\n")

    # Reached maximum iterations
    print(
        f"=== Reached maximum iterations ({max_iterations}), returning current best answer ==="
    )
    return f"Answer after {max_iterations} rounds of reflexion attempts:\n\n{worker_answer}"


# Math-specific Reflexion Workflow
async def math_reflexion_workflow(oxy_request: OxyRequest):
    """
    Reflexion workflow specifically for mathematical problems
    """
    user_query = oxy_request.get_query(master_level=True)
    print(f"=== Math Problem Query ===\n{user_query}\n")

    max_iterations = 3
    current_iteration = 0

    while current_iteration < max_iterations:
        current_iteration += 1
        print(f"=== Math Reflexion Round {current_iteration} ===")

        # Let math expert agent generate answer
        math_resp = await oxy_request.call(
            callee="math_expert_agent", arguments={"query": user_query}
        )
        math_answer = math_resp.output
        print(f"Math Expert Answer:\n{math_answer}\n")

        # Let math checker evaluate
        check_query = f"""
Please check the correctness and completeness of the following mathematical solution:

Problem: {oxy_request.get_query(master_level=True)}

Solution: {math_answer}

Check points:
1. Are the calculation steps correct?
2. Are there any missing steps?
3. Is the final answer clear?
4. Is the problem-solving approach clear?

Please return in format:
Check Result: [Pass/Fail]
Problem Description: [Specific issues, if any]
Correction Suggestions: [Specific correction suggestions]
"""

        checker_resp = await oxy_request.call(
            callee="math_checker_agent", arguments={"query": check_query}
        )
        checker_result = checker_resp.output
        print(f"Math Check Result:\n{checker_result}\n")

        # Check if passed
        if "Pass" in checker_result and "Fail" not in checker_result:
            print("=== Math Reflexion Complete, Solution Correct ===")
            return f"Solution verified through {current_iteration} rounds of mathematical validation:\n\n{math_answer}"

        # Extract correction suggestions
        correction_suggestion = ""
        lines = checker_result.split("\n")
        for line in lines:
            if "Correction Suggestions" in line:
                correction_suggestion = line.split(":", 1)[-1].strip()
                break

        if correction_suggestion:
            user_query = f"{oxy_request.get_query(master_level=True)}\n\nThe result was: {checker_result}. Please note the following correction suggestions: {correction_suggestion}"

    return f"Answer after {max_iterations} rounds of mathematical validation:\n\n{math_answer}"


# Define oxy_space
oxy_space = [
    # LLM model
    oxy.HttpLLM(
        name="default_llm",
        api_key=get_env_var("DEFAULT_LLM_API_KEY"),
        base_url=get_env_var("DEFAULT_LLM_BASE_URL"),
        model_name=get_env_var("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
    ),
    # Worker Agent - responsible for generating initial answers
    oxy.ReActAgent(
        name="worker_agent",
        desc="Worker agent responsible for generating initial answers",
        llm_model="default_llm",
    ),
    # Reflexion Agent - responsible for evaluating answer quality
    oxy.ChatAgent(
        name="reflexion_agent",
        desc="Reflexion agent responsible for evaluating answer quality and providing improvement suggestions",
        llm_model="default_llm",
    ),
    # Math Expert Agent - specifically handles mathematical problems
    oxy.ChatAgent(
        name="math_expert_agent",
        desc="Mathematics expert providing detailed mathematical solutions",
        llm_model="default_llm",
    ),
    # Math Checker Agent - checks mathematical solutions
    oxy.ChatAgent(
        name="math_checker_agent",
        desc="Mathematics solution checker verifying the correctness of mathematical solutions",
        llm_model="default_llm",
    ),
    # General Reflexion Workflow Agent
    oxy.Reflexion(
        name="general_reflexion",
        is_master=True,
        worker_agent="worker_agent",
        reflexion_agent="reflexion_agent",
        max_reflexion_rounds=3,
    ),
    oxy.MathReflexion(
        name="math_reflexion",
        max_reflexion_rounds=3,
    ),
    # Master Agent - coordinates different reflexion agents
    oxy.ReActAgent(
        name="master_agent",
        desc="Master agent that selects appropriate reflexion workflow based on question type",
        sub_agents=["general_reflexion", "math_reflexion"],
        llm_model="default_llm",
    ),
]


async def main():
    """Start Web Service Demo"""
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Calculate the area of a circle with radius 5."
        )


if __name__ == "__main__":
    asyncio.run(main())
