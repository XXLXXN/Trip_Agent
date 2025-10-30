# 如何分布式运行智能体？

OxyGent MAS支持操作简单的分布式调用。您可以使用`oxy.SSEOxyGent`连接远端运行的agent，能够和本地agent以相同的方式运行。

考虑[如何自定义处理提示词？](./8_update_prompts.md)中的例子入手，我们可以创建一一个分布式的获取时间的智能体：

```python
# app_time_agent.py
from oxygent import MAS, Config, oxy
import os

Config.set_app_name("app-time")
Config.set_server_port(8082) # 替换为实际端口

oxy_space = [
    oxy.HttpLLM(
        name="default_name",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
    ),
    oxy.StdioMCPClient(
        name="time_tools",
        params={
            "command": "uvx",
            "args": ["mcp-server-time", "--local-timezone=Asia/Shanghai"],
        },
    ),
    oxy.ReActAgent(
        name="time_agent",
        desc="A tool for time query",
        is_master=True,
        tools=["time_tools"],
        llm_model="default_name",
        timeout=10,
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(first_query="What time is it now?")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
```

然后您可以使用`oxy.SSEOxyGent`替代原有的time_agent：

```python
    oxy.SSEOxyGent(
        name="time_agent",
        desc="Remote time query agent",
        server_url="http://127.0.0.1:8082", # 替换为app_time_agent.py实际所在的位置
    ),
```

如果您使用localhost，可以使用以下的简单脚本启动分布式服务：

```bash
#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

cleanup() {
    log "Cleaning up processes..."
    jobs -p | xargs -r kill 2>/dev/null || true
    wait 2>/dev/null || true
    log "Cleanup complete"
}

trap cleanup EXIT INT TERM

start_service() {
    local cmd=$1
    local name=$2
    local wait_time=${3:-5}
    
    log "Starting $name..."
    $cmd &
    local pid=$!
    
    sleep $wait_time
    
    # Check if the process is still running
    if kill -0 $pid 2>/dev/null; then
        log "$name started successfully (PID: $pid)"
        return 0
    else
        error "$name failed to start"
        return 1
    fi
}

main() {
    log "Starting distributed services..."

    start_service "python -m app_time_agent" "TimeAgent" 5
    start_service "python -m your_master_agent" "MasterAgent" 5

    log "All services have been started"
    log "Press Ctrl+C to stop all services"

    wait
}

main "$@"
```

## 完整的可运行样例

以下是可运行的完整代码示例(启动需配合上面的bash脚本)：
```python
import asyncio

from oxygent import MAS, oxy, Config, OxyRequest
import os
import prompts
import tools

Config.set_agent_llm_model("default_llm")

def update_query(oxy_request: OxyRequest):
    user_query = oxy_request.get_query(master_level=True)
    current_query = oxy_request.get_query()
    oxy_request.set_query(
        f"user query is {user_query}\ncurrent query is {current_query}"
    )
    return oxy_request

oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key=os.getenv("DEFAULT_LLM_API_KEY"),
        base_url=os.getenv("DEFAULT_LLM_BASE_URL"),
        model_name=os.getenv("DEFAULT_LLM_MODEL_NAME"),
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
    ),
    oxy.StdioMCPClient(
        name="time_tools",
        params={
            "command": "uvx",
            "args": ["mcp-server-time", "--local-timezone=Asia/Shanghai"],
        },
    ),
    tools.file_tools,
    oxy.ReActAgent(
        name="file_agent",
        desc="A tool that can operate the file system",
        tools=["file_tools"],
        func_process_input=update_query,
    ),
    oxy.SSEOxyGent(
        name="time_agent",
        desc="Remote time query agent",
        server_url="http://127.0.0.1:8082",
    ),
    oxy.ChatAgent(
        name="text_summarizer",
        desc="A tool that can summarize markdown text",
        prompt=prompts.text_summarizer_prompt,
        func_process_input=update_query,
    ),
    oxy.ChatAgent(
        name="data_analyser",
        desc="A tool that can summarize echart data",
        prompt=prompts.data_analyser_prompt,
        func_process_input=update_query,
    ),
    oxy.ChatAgent(
        name="document_checker",
        desc="A tool that can find problems in document",
        prompt=prompts.document_checker_prompt,
        func_process_input=update_query,
    ),
    oxy.ParallelAgent(
        name="analyzer",
        desc="A tool that analyze markdown document",
        permitted_tool_name_list=["text_summarizer", "data_analyser", "document_checker"],
        func_process_input=update_query,
    ),
    oxy.ReActAgent(
        name="master_agent",
        is_master=True,
        sub_agents=["file_agent", "time_agent", "analyzer"],
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!"
        )


if __name__ == "__main__":
    asyncio.run(main())
```

[上一章：获取记忆和重新生成](./9_1_continue_exec.md)
[下一章：使用多模态智能体](./10_multimodal.md)
[回到首页](./readme.md)