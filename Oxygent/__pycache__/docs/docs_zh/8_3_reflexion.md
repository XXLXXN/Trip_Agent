# 如何让智能体进行反思？

## 使用ReActAgent进行反思

`oxy.ReActAgent`支持传入反思函数进行反思。在未达到最大反思次数的情况下，Agent能够根据反思结果进行重做，直到返回要求的结果。

反思函数的形式非常自由，您可以要求对于特定的疑问返回特定的回答，或是要求过滤部分回答。如果反思结果不为`None`，Agent将根据反思进行重做：

```python
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
        if not any(word in response.lower() for word in ["hello", "hi", "hey", "greetings", "welcome"]):
            return "This is a greeting. Please respond in a more friendly and welcoming manner."
    
    if "math" in oxy_request.get_query().lower() or "calculate" in oxy_request.get_query().lower():
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
        "not possible"
    ]
    
    if any(phrase in response.lower() for phrase in unhelpful_phrases):
        return "Your response seems unhelpful. Please try to provide a more constructive answer or suggest alternative solutions."
    
    return None
```

反思函数可以嵌套，如果您希望对数学计算做更严格的反思，比如让Agent输出详细的步骤，可以采取如下方法：

```python
def math_reflexion(response: str, oxy_request: OxyRequest) -> str:
    """Specialized reflexion function for mathematical problems."""
    # First apply basic checks
    basic_msg = custom_reflexion(response, oxy_request)
    if basic_msg:
        return basic_msg
    
    # Math-specific checks
    if any(word in oxy_request.get_query().lower() for word in ["calculate", "compute", "solve", "math", "equation"]):
        # Expect step-by-step solution
        if "step" not in response.lower() and "=" not in response:
            return "For mathematical problems, please provide a step-by-step solution showing your work."
    
    return None
```

反思需要指定`oxy.ReActAgent`执行。值得注意的是，如果您要让Master Agent输出反思后的结果，需要为每一层添加反思。

```python
    oxy.ReActAgent(
        name="math_agent",
        desc="A specialized agent for mathematical problems with advanced reflexion",
        llm_model="default_llm",
        func_reflexion=math_reflexion, # 关键参数
        max_react_rounds=30, # 指定最大重做次数
        # ...
    ),
    # Master agent that coordinates others
    oxy.ReActAgent(
        name="master_agent",
        sub_agents=["basic_agent", "smart_agent", "math_agent"],
        is_master=True,
        llm_model="default_llm",
        func_reflexion=math_reflexion,
        # ...
    ),
```

## 使用流进行反思

我们提供了[流](./9_2_preset_flow.md)`oxy.Reflexion`用于一般任务的反思，`oxy.MathReflexion`用于计算任务的反思或验算。您可以使用以下的方法调用：

```python
    Reflexion(
        name="general_reflexion",
        worker_agent="worker_agent", # 工作智能体
        reflexion_agent="reflexion_agent", # 反思智能体
        evaluation_template="...", # 反思模板
        max_reflexion_rounds=3, # 反思轮数
    ),
    
    MathReflexion(
        name="math_reflexion", 
        worker_agent="worker_agent", # 工作智能体
        reflexion_agent="reflexion_agent", # 反思智能体
        evaluation_template="...", # 反思模板
        max_reflexion_rounds=3, # 反思轮数
    ),
```


## 使用工作流进行反思

在一些情况下，您可能希望使用一个智能体而不是固定的方法进行反思。此时您可以指定一个`oxy.ChatAgent`或其他类型的Agent进行反思：

```python
    # Reflexion Agent - responsible for evaluating answer quality
    oxy.ChatAgent(
        name="reflexion_agent",
        desc="Reflexion agent responsible for evaluating answer quality and providing improvement suggestions",
        llm_model="default_llm",
    ),
```

您可以使用一个[工作流](./9_workflow.md)管理反思过程。以下展示了利用查询更新进行反思的全流程：

```python
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
    
    # Step 1: 获取原始查询
    user_query = oxy_request.get_query(master_level=True)
    print(f"=== User Query ===\n{user_query}\n")
    
    max_iterations = 3
    current_iteration = 0
    
    while current_iteration < max_iterations:
        current_iteration += 1
        print(f"=== Reflexion Round {current_iteration} ===")
        
        # Step 2: 执行
        worker_resp = await oxy_request.call(
            callee="worker_agent",
            arguments={"query": user_query}
        )
        worker_answer = worker_resp.output
        print(f"Worker Answer:\n{worker_answer}\n")
        
        # Step 3: 输入要反思的内容
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
            callee="reflexion_agent",
            arguments={"query": evaluation_query}
        )
        reflexion_result = reflexion_resp.output
        print(f"Reflexion Evaluation:\n{reflexion_result}\n")
        
        # Step 4: 获取反思结果
        if "Satisfactory" in reflexion_result and "Unsatisfactory" not in reflexion_result:
            print("=== Reflexion Complete, Answer Quality Satisfactory ===")
            return f"Final answer optimized through {current_iteration} rounds of reflexion:\n\n{worker_answer}"
        
        # Step 5: 使用反思结果更新查询
        improvement_suggestion = ""
        lines = reflexion_result.split('\n')
        for line in lines:
            if "Improvement Suggestions" in line:
                improvement_suggestion = line.split(":", 1)[-1].strip()
                break
        
        if improvement_suggestion:
            user_query = f"{oxy_request.get_query(master_level=True)}\n\nPlease note the following improvement suggestions: {improvement_suggestion}"
            print(f"Updated query with improvement suggestions:\n{user_query}\n")
    
    # 如果重做次数用尽，返回当前最好结果
    print(f"=== Reached maximum iterations ({max_iterations}), returning current best answer ===")
    return f"Answer after {max_iterations} rounds of reflexion attempts:\n\n{worker_answer}"
```

最后您需要使用`oxy.WorkFlowAgent`管理反思过程：

```python
    oxy.WorkflowAgent(
        name="general_reflexion_agent",
        desc="Workflow agent that optimizes answer quality through external reflexion",
        sub_agents=["worker_agent", "reflexion_agent"],
        func_workflow=reflexion_workflow,
        llm_model="default_llm",
    ),
```

[上一章：处理LLM和智能体输出](./8_2_handle_output.md)
[下一章：创建工作流](./9_workflow.md)
[回到首页](./readme.md)