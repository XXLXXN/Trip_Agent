# 基于OxyGent框架下的Trip_Agent行迹智策

---
## 文件结构，包含5个小Agent一个大Agent
### 小Agent如下：
1. **fare_agent**对应搜索特定日期下的飞机票和火车票。
    * 对应网络端口号为**8081**，对应提示词为`TRANSPORTATION_AGENT_PROMPT`，包含的工具有["train_ticket_tools", "flight_ticket_tools", "location_tools"]。
    * 其中使用**func_parse_llm_response=json_parser.json_parser**方法，没法联系上下文，但是**可以连续的提问两个不同的地方，例如：询问`给我上海2025-11-7到哈尔滨的车票`后续可以再用Postman的方式继续询问`哈尔滨2025-11-10到长春的车票`，可以满足从A->B，之后从B->C的连番询问，但是不能组织更多的信息**。
    * 小问题：**飞的准API**获得的飞机信息，有的飞机可能无法购票。
2. **scenic_spot_agent**对应搜索大到一个城市的知名景点，小到一个地方附近的景点的信息。
    * 对应网络端口号为**8082**，对应提示词为`ATTRACTION_AGENT_PROMPT`，包含的工具有["baidu_search_tools", "xhs_tools", "location_tools"]。
    * 这个部分可以联系上下文多次询问，并且能做到根据兴趣进行筛选。
3. **hotel_agent**对应搜索景点附近的的宾馆。
    * 对应网络端口号为**8083**，对应提示词为`HOTEL_AGENT_PROMPT`，包含的工具有["baidu_search_tools", "location_tools", "xhs_tools"]。
    * 其中使用**func_parse_llm_response=json_parser.json_parser**方法，没法联系上下文，但是**可以连续的提问两个不同的地方，例如：询问`给我推荐华东师范大学（普陀校区）附近的宾馆`后续可以再用Postman的方式继续询问`给我推荐珊上海东方明珠附近的宾馆`，可以满足提供景点附近的宾馆信息**。
    * 小问题：没有**携程的相关API**，没法获得酒店的房间空余相关信息。
4. **table_agent**综合上述的三个信息根据人员结构、兴趣爱好、天气情况和交通信息等。
    * 对应网络端口号为**8084**，对应提示词为`TABLE_AGENT_PROMPT`，包含的工具有["time_tools", "table_tools", "math_tools", "weather_tools", "baidu_search_tools"]。
    * 其中使用**func_parse_llm_response=json_parser.json_parser**方法，没法联系上下文，但是**可以连续的提问两个不同的地方，进行规划，但是没法衔接上下文，所以输出的内容是一次性的，不能再次输入需求修改此次行程**。
    * 小问题：最大的问题是没法二次提问，所以**这个部分和modify_agent的衔接尤为重要**。
5. **modify_agent**在得到的**table_agent**的输出基础上，结合用户的需求进行修改。
    * 对应网络端口号为**8085**，对应提示词为`MODIFY_AGENT_PROMPT`，包含的工具有["time_tools", "math_tools", "baidu_search_tools", "xhs_tools"]。
    * 其中使用**func_parse_llm_response=json_parser.json_parser**方法，没法联系上下文，但是**可以很具需求进行单次整改**。
    * 小问题：**不明确modify_agent的输入，没法接受过长的query请求**，后续可以考虑引入**reflexion功能**，该功能对于不满意的输出直接进行整改重新输出。
### 大Agent如下：
* 一个master_agent通过分布式的方法，控制其他小的Agent，并对其他小Agent的工具进行调用汇总并输出。
* 对应网络端口号为**8080**，其sub_agent包括sub_agents=["fare_agent", "scenic_spot_agent", "hotel_recommend_agent", "table_agent", "modify_agent"]。
* 由于是分布式调用所以需要先启动`8081-8085`的端口后，再启动`master_agent`实现**大Agent可以调用小Agent，而小Agent又可以自行调用**的功能。
* 小问题：提示词初稿为`TRIP_AGENT_PROMPT`但是还未完善，后续还需根据需求继续修改，并且老问题`Json格式不方便直接输出`，但是只输出Json格式后直接放弃交互，已解决小Agent的相关问题，大Agent的输出还需要斟酌。
---
## 快速入门：
### 根据requirement.txt配置环境
```bash
pip install -r requirements.txt
```
### 配置环境变量.env，分别在主文件夹以及oxygent文件夹中仿照一下形式增加.env
```
OPENAI_API_KEY = "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"
OPENAI_BASE_URL = "https://api.openai.com/v1"
AMAP_API_KEY = "77e28c476fa29b6e3cb13daa04c36358"
DEEPSEEK_API_KEY = "sk-1ce69c2b85484349b96d44c8b2438af0"
FLIGHT_API_KEY = "sk-ZCd_qGtJNlCKruELUEN0BKGwa6HSmj8tPde_JFiIuPQ"
JUHE_API_KEY = "ac0a4bc4841491125a55900c64bf48ad"
SERPER_API_KEY = "cae1171e839356eb26edb629332c1b80b54534ff"
OPENCAGE_API_KEY = "234d4f6c53064ccc9da2898eba2349f5"
TRAIN_MCP_FILE=C:\Users\XHSli\Desktop\LLM\mcp_train_ticket\server.py
FLIGHT_MCP_FILE=C:\Users\XHSli\Desktop\LLM\mcp_flight_ticket\server.py
WEATHER_MCP_FILE=C:\Users\XHSli\Desktop\LLM\mcp-weather\server.py
LOCATION_MCP_FILE=C:\Users\XHSli\Desktop\LLM\mcp-location\server.py
SEARCH_MCP_FILE=C:\Users\XHSli\Desktop\LLM\mcp-search\server.py
DEEPSEEK_BASE_URL= "https://api.deepseek.com/v1"
DEEPSEEK_MODEL_NAME = "deepseek-chat"
VARIFLIGHT_API_KEY = "sk-rPm1xPmhVyUowx8BOzGx9vV9V1u7IozCIE_5RRl-X5o"
XHS_COOKIE = "abRequestId=05c79aa5-a7b9-5b1c-8009-ae71a227ab8f; a1=199d39173b7z4b1gdeni3bjpvdmrc2uoaaapbjjnn50000516514; webId=ab143fda08582ba390bf95f4b625e197; gid=yjjfqjyYjJ04yjjfqjyWq0VVDWu4DykfdI3q0IIDVUhf6U28FSJ7lD8882yK2y48ydY00WJy; customer-sso-sid=68c517559963973879611392jt4oys7tfr5hnhxb; x-user-id-ad-market.xiaohongshu.com=68d74e6d000000002101d9aa; customerClientId=560596725378490; access-token-ad-market.xiaohongshu.com=customer.ad_market.AT-68c517559963973878726658fhwqjrs5tgftzxel; webBuild=4.82.0; xsecappid=xhs-pc-web; acw_tc=0a4ad02717602693157712201e05406475b223d3d0f4cb0a125d646482a08e; web_session=040069b9a30d25d789fc4adcde3a4b65884d6e; websectiga=634d3ad75ffb42a2ade2c5e1705a73c845837578aeb31ba0e442d75c648da36a; sec_poison_id=e253c9b8-68de-4788-8590-4fa078e70a1a; unread={%22ub%22:%2268e8b3ae00000000070239d9%22%2C%22ue%22:%2268e7619f0000000007031e28%22%2C%22uc%22:31}; loadts=176027057370"
```
### 根据start.sh启动大小`Agent`
首先配置.sh相关文件，选取git/bin/sh.exe作为驱动，在终端输入
```bash
./start.sh
```
即可启动全部的服务器
### 使用`Postman`向**Agent**发送请求
1. 在**Postman官网**上下载客户端。
2. 首先创建Headers，**Key的形式**为Content-Type，**Value的形式**为Json格式。
3. 端口选择如果向**大Agent**发送请求，选取`http://127.0.0.1:8080/chat` 即可，其余小Agent把端口换成相对应的端口即可向其发送询问，例如向fare_agent发送请求则将Post换成`http://127.0.0.1:8081/chat` 。
4. 在query里面发送请求即可和大模型进行交互。
---
## 部分关键信息：
1. 相关工具在oxygent文件夹下面，例如**train_ticket_tools.py**，后续添加工具可在oxygent文件下直接创建即可命名为**_tools.py，在相关的Agent文件中使用import导入即可，若想要使用集成好的MCP工具，可参考一下使用xhs_tools的示例。
```python
    oxy.StdioMCPClient(
        name="xhs_tools",
        params={
            "command": "uv",
            "args": [
                "--directory",
                "mcp_servers\\xhs-mcp",
                "run",
                "main.py"
            ],
            "env": {
                "XHS_COOKIE": os.getenv("XHS_COOKIE")}
        },
    ),
```
2. 相关提示词在oxygent文件夹下面的**prompts.py**中，每个Agent对应的提示词都为一个对象，**直接对该对象的内容进行修改即可**。
3. oxygent的子文件夹schemas里面的文件可以对输出进行处理，其中的`json_parser.py`文件使得输出可以为Json格式，但是导致其无法接纳上下文，后续需要对其进行修改。
---
## 总结：
Trip_Agent的基础已大致完毕，后续进行微调使其达到更好的效果，后续的目标是并行调用Agent提高效率。