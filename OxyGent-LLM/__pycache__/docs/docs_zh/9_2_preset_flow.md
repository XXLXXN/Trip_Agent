# 如何使用预设的流（Flow）？

对于开发者来说，将常用的工作流封装为预设的 [流 (Flow)] 是非常必要的。

您可以通过继承 `BaseFlow` 类来创建自己的流，并在 `_execute()` 方法中实现流的具体工作逻辑。流接受一个 `oxy.OxyRequest` 作为输入，并以 `oxy.Response` 作为输出，因此能够在 MAS 系统中像正常的 Agent 一样运行，不会发生兼容性问题。

下面以 OxyGent 预设的 `PlanAndSolve` 流为例，演示如何创建一个流。

## 数据类

### 1. Plan（计划）

- **作用**：定义未来需要执行的步骤。
- **核心字段**：`steps: List[str]`：排序后的任务步骤。

```python
class Plan(BaseModel):
    """Plan to follow in future."""
    steps: List[str] = Field(
        description="different steps to follow, should be in sorted order"
    )
```

### 2. Response（直接响应）

- **作用**：当不需要再执行工具时，直接返回答案给用户。
- **核心字段**：`response: str`

```python
class Response(BaseModel):
    """Response to user."""
    response: str
```

### 3. Action（动作）

- **作用**：封装下一步的动作。
- **核心字段**：`action: Union[Response, Plan]`：可以是一个新的计划，也可以是直接的响应。

```python
class Action(BaseModel):
    """Action to perform."""
    action: Union[Response, Plan] = Field(
        description="Action to perform. If you want to respond to user, use Response. "
                    "If you need to further use tools to get the answer, use Plan."
    )
```

## 主流程类

### PlanAndSolve（主流程类）：继承自 `BaseFlow`

#### 核心属性：

- **`planner_agent_name`**：负责生成计划的 agent。
- **`executor_agent_name`**：执行每个步骤的 agent。
- **`enable_replanner`**：是否允许在执行中动态调整计划。
- **`pydantic_parser_planner`**：将 LLM 输出解析成 Plan。
- **`pydantic_parser_replanner`**：将 LLM 输出解析成 Action。
- **`max_replan_rounds`**：最大迭代次数。

```python
class PlanAndSolve(BaseFlow):
    """Plan-and-Solve Prompting Workflow."""

    max_replan_rounds: int = Field(30, description="Maximum retries for operations.")

    planner_agent_name: str = Field("planner_agent", description="planner agent name")
    pre_plan_steps: List[str] = Field(None, description="pre plan steps")

    enable_replanner: bool = Field(False, description="enable replanner")

    executor_agent_name: str = Field(
        "executor_agent", description="executor agent name"
    )

    llm_model: str = Field("default_llm", description="LLM model name for fallback")

    func_parse_planner_response: Optional[Callable[[str], LLMResponse]] = Field(
        None, exclude=True, description="planner response parser"
    )

    pydantic_parser_planner: PydanticOutputParser = Field(
        default_factory=lambda: PydanticOutputParser(output_cls=Plan),
        description="planner pydantic parser",
    )

    func_parse_replanner_response: Optional[Callable[[str], LLMResponse]] = Field(
        None, exclude=True, description="replanner response parser"
    )

    pydantic_parser_replanner: PydanticOutputParser = Field(
        default_factory=lambda: PydanticOutputParser(output_cls=Action),
        description="replanner pydantic parser",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.add_permitted_tools(
            [
                self.planner_agent_name,
                self.executor_agent_name,
            ]
        )

    async def _execute(self, oxy_request: OxyRequest) -> OxyResponse:
        pass
```

## 工作流逻辑

### 1. 规划阶段：

- 调用 `planner_agent` → 生成 `Plan.steps`

### 2. 执行阶段：

- 逐个执行 `steps`，每个步骤由 `executor_agent` 完成。

### 3. 重规划（可选）：

- 如果开启 `enable_replanner`，执行后可动态调整计划。

### 4. 结束阶段：

- 如果步骤执行完毕或 `replanner` 返回 `Response`，输出最终结果。

对应的代码逻辑如下：

```python
    async def _execute(self, oxy_request: OxyRequest) -> OxyResponse:
        plan_str = ""
        past_steps = ""
        original_query = oxy_request.get_query()
        plan_steps = self.pre_plan_steps
        for current_round in range(self.max_replan_rounds + 1):
            if (current_round == 0) and (self.pre_plan_steps is None):
                if self.pydantic_parser_planner:
                    query = self.pydantic_parser_planner.format(original_query)
                else:
                    query = original_query.copy()

                oxy_response = await oxy_request.call(
                    callee=self.planner_agent_name,
                    arguments={"query": query},
                )
                if self.pydantic_parser_planner:
                    plan_response = self.pydantic_parser_planner.parse(
                        oxy_response.output
                    )
                else:
                    plan_response = self.func_parse_planner_response(
                        oxy_response.output
                    )
                plan_steps = plan_response.steps
                plan_str = "\n".join(
                    f"{i + 1}. {step}" for i, step in enumerate(plan_steps)
                )

            task = plan_steps[0]
            task = plan_steps[0]
            task_formatted = f"""
                We have finished the following steps: {past_steps}
                The current step to execute is:{task}
                You should only execute the current step, and do not execute other steps in our plan. Do not execute more than one step continuously or skip any step.
            """.strip()
            excutor_response = await oxy_request.call(
                callee=self.executor_agent_name,
                arguments={"query": task_formatted},
            )
            past_steps = (
                past_steps
                + "\n"
                + f"task:{task}, execute task result:{excutor_response.output}"
            )
            if self.enable_replanner:
                # Replanning logic
                query = """
                The target of user is:
                {input}

                The origin plan is:
                {plan}

                We have finished the following steps:
                {past_steps}

                Please update the plan considering the mentioned information. If no more operation is supposed, Use **Response** to answer the user. 
                Otherwise, please update the plan. The plan should only contain the steps to be executed, and do not 
                include the past steps or any other information.
                """.format(input=original_query, plan=plan_str, past_steps=past_steps)
                if self.pydantic_parser_replanner:
                    query = self.pydantic_parser_replanner.format(query)

                replanner_response = await oxy_request.call(
                    callee=self.replanner_agent_name,
                    arguments={
                        "query": query,
                    },
                )
                if self.pydantic_parser_replanner:
                    plan_response = self.pydantic_parser_replanner.parse(
                        replanner_response.output
                    )
                else:
                    plan_response = self.func_parse_planner_response(
                        replanner_response.output
                    )

                if hasattr(plan_response.action, "response"):
                    return OxyResponse(
                        state=OxyState.COMPLETED,
                        output=plan_response.action.response,
                    )
                else:
                    plan_response = plan_response.action
                    plan_steps = plan_response.steps
                    plan_str = "\n".join(
                        f"{i + 1}. {step}" for i, step in enumerate(plan_steps)
                    )
            else:
                plan_steps = plan_steps[1:]

                if 0 == len(plan_steps):
                    return OxyResponse(
                        state=OxyState.COMPLETED,
                        output=excutor_response.output,
                    )

        plan_steps = plan_response.steps
        plan_str = "\n".join(f"{i + 1}. {step}" for i, step in enumerate(plan_steps))
        user_input_with_results = f"Your objective was this：{oxy_request.get_query()}\n---\nFor the following plan：{plan_str}"
        temp_messages = [
            Message.system_message(
                "Please answer user questions based on the given plan."
            ),
            Message.user_message(user_input_with_results),
        ]
        oxy_response = await oxy_request.call(
            callee=self.llm_model,
            arguments={"messages": [msg.to_dict() for msg in temp_messages]},
        )
        return OxyResponse(
            state=OxyState.COMPLETED,
            output=oxy_response.response,
        )
```

## 执行流

OxyGent 支持像 Agent 一样调用 Flow。您可以通过以下方式调用您的自定义流：

```python
    oxy.PlanAndSolve(
        # 对于自定义 flow，按照您的方法调用
        name="master_agent",
        is_discard_react_memory=True,
        llm_model="default_llm",
        is_master=True,
        planner_agent_name="planner_agent",
        executor_agent_name="executor_agent",
        enable_replanner=False,
        timeout=100,
    )
```

[上一章：创建工作流](./9_workflow.md)
[下一章：获取记忆和重新生成](./9_1_continue_exec.md)
[回到首页](./readme.md)