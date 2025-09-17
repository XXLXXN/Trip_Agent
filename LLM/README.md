# Trip-AGENT 后端接口介绍

## 概述

采用**大模型** + **MCP** + **RAG** 的方法实现智能旅行规划工具，通过调用多种旅行相关服务（天气、铁路、航班、景点、餐饮、酒店后续可以继续添加工具）来帮助用户制定个性化的旅行行程规划。
项目的核心是基于 **MCP** 技术的智能旅行规划工具。预期效果**部分未实现**：
1. 根据用户的出发地、目的地调用相应的MCP工具，给出第一个版本的输出：景点的规划信息，交通的规划信息
2. 继续调用相应的MCP工具以及用户的二轮输入，餐饮的规划信息，酒店的信息，行程的具体规划信息。
3. 根据搜索MCP结合他人的相关用例以及用户偏好，给出最终版本的输出：最终版包括行程的具体规划信息（即每天进行的活动），景点的具体位置以及门票的相应情况，交通的规划信息（只提供各地点的具体位置，**后续转接至其他模块），餐饮的规划信息，酒店的信息（酒店和餐饮暂无有效的API，内容为模型提供）以及相关的注意事项以及提示，是一个详细的、完整的规划流程。

## 项目主要功能

1. **MCP工具调用**：根据用户输入的旅行信息（出发地、目的地、日期以及个性化需求[个性化需求暂时无特殊处理函数]），通过调用不同的MCP工具（在搜索MCP的基础上，现如今包含天气、火车、航班、景点）生成旅行日程。
2. **多轮修复**：通过**Deepseek-V3**模型（或者Ollma的本地模型：进行微调处理过的Deepseek-R1的7B模型）对初步生成的行程进行修复，确保各项活动安排合理且符合用户偏好。
3. **多轮富化**：结合外部数据（现包含web-search的多次搜索结果），对行程中的活动进行详细补充，包括景点、餐厅、酒店的描述、详细的地址信息等。
4. **保证完整性**：所有活动必须提供详细的描述与备注，并且所有景点与餐饮活动必须提供精确的地址和坐标信息。
5. **成本计算**：为每个活动分配成本，计算每日总花费，帮助用户预算旅行开销（可保证交通费用正确，而餐饮和酒店的价格为估算值）

## 项目流程

1. **输入旅程信息**：用户提供的旅行信息，简单模板，存放在json文件中，其格式为

```json
{
  "query": "我想去婺源旅游",
  "prefs": {
    "origin": "上海",
    "destination": "婺源",
    "start_date": "2025-09-19",
    "end_date": "2025-09-24",
    "themes": ["自然", "人文", "打卡"],
    "people_count": 2,
    "budget_level": "中等"
  }
}
```
# 旅游行程查询请求
请生成从上海到婺源的5天旅游行程安排，中等预算水平，包含自然景观、人文景点和网红打卡地的推荐方案。

2. **路由分类**：将用户的需求拆分成多个子任务，每个子任务对应一个MCP服务。
3. **调用MCP服务**：系统逐个调用MCP服务并获取结果。
4. **初步规划生成**：根据MCP服务返回的数据，生成初步的旅行行程安排。
5. **多轮修复与富化**：通过多次调用Search_MCP以及模型多轮修复和富化，完善行程细节，确保所有活动都有充分的描述和备注，并提供精确地址。
6. **输出最终行程**：生成基富化版本的旅行计划。

## 项目特点

* **自动化**：用户只需提供简单的旅行信息，系统会自动生成并修复行程。
* **多源化**：系统调用多个MCP服务，结合外部数据源，全面覆盖交通、景点、天气、餐饮等信息。
* **完备性**：确保所有活动安排符合规范，避免模糊描述和占位信息。
* **灵活配置**：用户可以通过偏好设置定制旅行计划。
* **多轮优化**：行程生成后会经过多轮修复和富化，确保最终输出的计划精确、合理。
* **前端友好**：最终输出按照限定的json格式，方便去前端展示以及进一步操作。

## 技术架构                    
### 1. **MCP架构**：使用Adalflow的MCP工具集成方法，共集成了5个MCP服务器：搜索，天气，地点，火车票查询以及飞机票查询，每个模块包含多个工具负责实现不同的任务。

### 2. **LLM大模型**：使用Deepseek-V3模型进行任务分类、行程修复与富化，确保最终的行程规划符合用户需求。

### 3. **用户交互**：使用命令行接口与JSON格式的（输入）输出，用户可以通过命令行或脚本与系统交互。

## 文件架构 
### 目录架构
* **根目录**
  * `.env`：全局环境变量（包含DeepSeek的API-Key、各个MCP server的API-Key（12306的没有API-KEY）以及相应的路径变量：`TRAIN_MCP_FILE`、`WEATHER_MCP_FILE`、`LOCATION_MCP_FILE`、`FLIGHT_MCP_FILE`、`SEARCH_MCP_FILE`。
  * `agent.py`：调用个MCP工具以及大模型完成Trip_Agent的核心任务：实际上就是“旅行规划”工作流入口（包括解析偏好、聚合 MCP、digest、planner、refine、enrich、sanitize这些组件）。
  * `README.md` / `requirement.txt`：说明与依赖清单。
  * `trip_data.json`：样例行程数据或样例输入/输出。
  * `trip_example.json`：样例行程数据的输入样例（暂时没有实现，现在还是基础的命令行输入）。

* **MCP 服务分组**

  * `mcp-echo`：样例 MCP，测试验证连通。
  * `mcp-location`：地理/交通相关工具，选择高德的**AMAP_API_KEY**，
    * `server.py`：以 **MCP Server** 形式包括
    `get_traffic_status`：获得路况信息、
    `get_nearby_attractions`：获得附近的知名景点信息、    `get_city_top_attractions`：获得该城市的景点信息。
    * `client.py`：测试该 MCP 的脚本。
  * `mcp-search`：通用搜索/新闻/学术检索的 MCP，选择谷歌的**SERPER_API_KEY**
     * 包含工具`search_web`：网络内容查找、
     `search_news`：最新新闻查找、
     `search_scholar`：学术论文查找。
  * `mcp-weather`：天气近况/预报 MCP，选择高德的**AMAP_API_KEY**，
      * 包含工具`get_recent_weather`：获得最近的天气只支持三天的、`get_weather_forecast`：最近时间的天气预报。
  * `mcp_flight_ticket`：航班/票务 MCP，选择聚合的**JUHE_API_KEY**，
      * 包含工具`get_flight_info`：获得航班信息、`get_flight_forecast`：最近航班预报。
  * `mcp_train_ticket`：火车票 MCP 
      * 包含工具`get_train_info`：获得火车信息。
  * 每个服务均为**同构结构**：`server.py`：提供工具、`client.py`：调试、`._env`：该服务的API_KEY。

# 运行流程图

```mermaid
flowchart TD
    A[命令行调用<br/>user_text + prefs(现在这个部分失效了)] --> B[agent.py 主流程 run_trip_plan]
    B --> C[gather_with_mcp<br/>LLM 分类 tasks + 必须进行的搜索 web_search]
    C -->|按意图分发，分发器| D1[mcp_train_ticket/server.py]
    C --> D2[mcp_weather/server.py]
    C --> D3[mcp_location/server.py]
    C --> D4[mcp_flight_ticket/server.py]
    C --> D5[mcp_search/server.py]
    D1 --> E[原始结果聚合，聚合器]
    D2 --> E
    D3 --> E
    D4 --> E
    D5 --> E
    E --> F[build_tool_digest<br/>抽取 flights/trains/routes/attractions/dining/hotels/weather]
    F --> G[_llm_make_plan<br/>生成多日行程]
    G --> H[_iterative_refine_plan<br/>多轮质量修复，更接近所给的例子]
    H --> I[enrich_plan_with_mcp<br/>对所缺的描述活动再搜证据并回填]
    I --> J[_post_sanitize<br/>排序/裁剪每天的活动数默认大于等于3且小于等于5，最后重算cost花费]
    J --> K[过程中输出 base_version 和 enriched_version，其中base_version为简易版本为enriched_version的输入]
```

* **MCP 路由**：`agent.py` 内将不同意图映射到不同 `MCP_SERVER_MAP`，每个映射值来源于环境变量（例如 `TRAIN_MCP_FILE` 指向 `mcp_train_ticket/server.py` 的绝对路径）。

# 具体代码的各部分，主要介绍的是各个部分
**目标**
把用户的自然语言出行诉求 → 拆成一组 MCP 子任务 → 调用外部工具收集事实 → 统一抽取 digest → 产出多天行程 JSON（含活动、交通、描述、备注、费用）→ 多轮质量修复 → 二次富化（补充描述详细的地址和坐标）→ 输出基础版与富化版。

**核心思路**

* 用一个分类 LLM 把用户请求拆分为 `tasks=[{intent, query}]`；并且确保至少调用一个 `web_search`。
* 按给出的意图选 MCP 服务从而收集原始数据。
* 对原始数据进行**轻量规整**。
* 交给抽取 LLM把 MCP 输出+搜索文本提取为统一digest。
* 交给规划 LLM按严格 Schema 生成日程；再做 **迭代修复**（现在是 3 轮）。
* 对缺描述/备注/精确地址的活动，分项 web 搜索取证 → 交给富化 LLM产生 **updates** 回填。
* 本地只做**排序与裁剪**每天最多 5 个活动。
* 返回 `{ base_version, enriched_version }` 两个版本 JSON。

# 运行方式

1. 按照requirement.txt的内容安装相应的依赖环境。
2. .env的配置，除了聚合的API都是可用的。
3. 直接运行agent.py其他的不用管，文件传输的部分，它的qury有问题，直接在命令行输入{\"origin\":\"上海\",\"destination\":\"婺源\",\"start_date\":\"2025-09-28\",\"end_date\":\"2025-10-01\",\"themes\":[\"自然\",\"人文\",\"打卡\"],\"people_count\":2,\"budget_level\":\"中等\"}，这个格式本质上没有要求，大模型会处理，但是上下文参数--prefs会为空传递不进去，后面的问题列表里有。
4. 会不断输出调试信息，先给出基础版本的内容，在进行web_search多轮给出富化版本。
---

# 关键模块

## 1 MCP 启动与调用

* `_mcp_params(server_path)`：把 MCP 脚本封装为 `MCPServerStdioParams`，用当前 Python 解释器启动，传入 `PYTHONUNBUFFERED=1`。
* `call_mcp_tool(server_file, tool_name, **kwargs)`：

  1. 没配路径→直接返回 error；
  2. `mcp_session_context(params)` 异步建立会话；
  3. `list_tools()` 找到 `tool_name`；
  4. `MCPFunctionTool(params, found).acall(**kwargs)` 调用；
  5. 捕获异常并包装为 `{status:"error", ...}`。

假设 MCP 服务以“列出工具 + 调用工具”的规范实现，且工具名与 `MCP_SERVER_MAP` 里的键对应。

## 2 分类器（CLASSIFY\_INSTRUCT）

* 要求输出**严格 JSON**，字段只有 `tasks`；并**百分之百调用** `web_search`。
* `INTENT_ENUM` 限定可用意图；`_parse_tasks()` 负责校验与归一化。
* 如果分类阶段出错，返回一个 `none` 结果条，后续照常。

## 3 轻量规整函数（*norm*\*）

把不同 MCP 的输出映射到统一键：

* `_norm_flights`：`flight_no/carrier/airport/time/duration/stops/price`
* `_norm_trains`：`train_no/from/to/depart_time/arrive_time/duration/seats`
* `_norm_weather_forecast`：`date/high_c/low_c/text/precip_prob`
* `_norm_attractions`：`name/rating/tags/area/lat/lng/open_hours/address/ticket_from`
  给下一步抽取 LLM 的草稿。

## 4 抽取LLM（TOOL\_DIGEST\_INSTRUCT）

* 传入 `raw`（所有 MCP 原始输出）+ `draft`（上一步的草稿）。
* 让模型输出一个 **严格 JSON** digest：包含 `flights/trains/routes/attractions/dining/hotels/weather/notes`。
* 规则强调“尽可能基于证据抽取、不要编造”。

## 5 规划LLM（PLANNER\_INSTRUCT）

* 份提示词：

  * 每天 3–5 个活动；**禁止占位**词；
  * `total_cost = sum(activities.cost)`；
  * 非交通类必须有**非空 description（≥40字）** 和 **notes（≥2条要点）**；
  * 景点/餐饮**尽量给地址+坐标**；
  * 天气差时要调室内活动；
  * 最终输出**只能**是一个 JSON 对象，遵循 `STRICT_SCHEMA_JSON_TEXT`。

## 6 JSON 补齐与校验

* `_ensure_dates(prefs)`：将 `prefs.start_date/end_date` 解析为 `date`，缺失时用**今天**和 +2 天；若顺序颠倒则交换。
* 统一补齐 `trip_id/trip_name/destination/...`。
* 确保 `days` 覆盖从 start 到 end 的每一天。
* 为每个 activity 补全必要字段。
* `_validate_output_format(plan)`：校验 Schema 完整性。

## 7 迭代修复

* `_plan_quality_issues(plan)`：统计问题，我试了一下包括：活动数量、占位、描述/备注缺失、地址/坐标缺失、cost 缺失大概这些。
* `_iterative_refine_plan()`：把问题清单交给 LLM 修复，最多 3 轮，原来的 5 轮太慢了。

## 8 富化LLM

* `_collect_enrich_targets(plan)`：找出需要富化的活动。
* `enrich_plan_with_mcp()`：逐个活动用 `search_web` 构造查询并交给富化 LLM（ENRICH\_INSTRUCT）产出 `updates=[{id, description, notes, location{address,coordinates}}]` → `_apply_enrichment_updates()` 回填。
* 两轮富化后，做 `_post_sanitize()` 排序和裁剪。

## 每个部分都是独立可以修改的，各个部分的接口已经衔接好，不再局限于只能是JSON输入，但是--prefs失效的问题没有解决。
---

# 当前存在的问题
* 性能差：原因是MCP 任务当前是 **串行** 调用，MCP按顺序调用多轮搜索的时候性能稍差*，多轮富化时对每个目标再次调用 `search_web`，请求爆发式增长。
查阅资料发现同一轮 MCP 可使用 `asyncio.gather(*coros)` 并发，但是报错无法处理。
。

* 提示词调整，我尽量把“**不确定就搜索**”加入规划模型与富化模型的系统提示，减少模型本身的臆断，但是这样性能太差了。

* --prefs失效的问题没有解决：使用命令行输入的时候没法传入参数--prefs，原来的文件输入导致query失效，还未完全解决。加入新的提示词工具导致传递出现问题？

* 日期传递错误，传进去的日期无法正确识别，时间必须是JSON格式的才能传入，需要修改，可以识别有效日期，现在只能使用模糊时间（从今天开始的三天），问题出现在`_ensure_dates(prefs)`函数中，需要修改，我尝试用JSON传递可以成功。

* 未实现输入也可以是JSON格式，分类器的提示词需要打磨，接受--prefs参数，但是目前无法传递，需要修改。

* MCP工具各部分功能不完全后续需要调整和添加。

* 整体上性能不好，功能也不完善，需要后续的优化和调整。

# 使用方法详解

## 安装依赖

```bash
pip install -r requirements.txt
```

## 运行示例

使用命令行输入查询内容来生成旅行计划：

```bash
python agent.py "我要去哈尔滨旅游，计划从2025-09-12出发，2025-09-14返回，预算适中"
```

你也可以通过`--prefs`选项指定额外的偏好设置：

```bash
python trip_planner.py "我要去哈尔滨旅游" --prefs '{"origin":"上海","destination":"哈尔滨","start_date":"2025-09-12","end_date":"2025-09-14","themes":["自然","人文"],"people_count":2,"budget_level":"中等"}'
```

## 输出

最终的行程将分为两个版本：

1. **基础版本**：生成的初步行程，先输出。
2. **富化版本**：基于多轮搜索结果和修复，补充了更详细的信息。

# 总结

代码思路没有问题，骨干很早就写完了，后面不停的用AI优化，但是效果不好，海报露出一些问题，总共跑了400次左右的不同示例，还是或出现幻觉和编造地点，但是比之前好很多，小问题多，最主要性能差，后续需要优化和调整。

# 和其它部分的衔接输入为JSON格式（现在最好用的还是文本输入，直接传入JSON文件分类器任务规划有问题），输出为JSON格式。
