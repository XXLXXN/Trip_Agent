# OxyGent API Document

## Agents
---
+ [BaseOxy](./agent/base_oxy.md)
+ [BaseFlow](./agent/base_flow.md)
+ [BaseAgent](./agent/base_agent.md)
+ [LocalAgent](./agent/local_agent.md)
+ [ChatAgent](./agent/chat_agent.md)
+ [ReActAgent](./agent/react_agent.md)
+ [ParallelAgent](./agent/parallel_agent.md)
+ [WorkflowAgent](./agent/workflow_agent.md)
+ [RemoteAgent](./agent/remote_agent.md)
+ [SSEOxygent](./agent/sse_oxy_agent.md)

## Tools
---
+ [BaseTool](./tools/base_tools.md)
+ [HttpTool](./api_tools/http_tool.md)
+ [FunctionTool](./function_tools/function_tool.md)
+ [FunctionHub](./function_tools/function_hub.md)
+ [MCPTool](./tools/mcp_tool.md)
+ [BaseMCPClient](./tools/base_mcp_client.md)
    + [StdioMCPClient](./tools/stdio_mcp_client.md) 
    + [SSEMCPClient](./tools/sse_mcp_client.md)
    + [StreamableMCPClient](./tools/streamable_mcp_client.md)

## Flow
---
+ [WorkFlow](./flows/workflow.md)
+ [ParallelFlow](./flows/parallel_flow.md)
+ [PlanAndSolve](./flows/plan_and_solve.md)
+ [Reflexion](./flows/reflexion.md)

## LLM
---
+ [BaseLLM](./llms/base_llm.md)
+ [RemoteLLM](./llms/remote_llm.md)
+ [HttpLLM](./llms/http_llm.md)
+ [OpenAILLM](./llms/openai_llm.md)

## Database
---
+ [BaseDB](./databases/base_db.md)
+ [BaseES](./databases/db_es/base_es.md)
+ [JesES](./databases/db_es/jes_es.md)
+ [LocalES](./databases/db_es/local_es.md)
+ [BaseRedis](./databases/db_redis/base_redis.md)
+ [JimdbApRedis](./databases/db_redis/jimdb_ap_redis.md)
+ [LocalRedis](./databases/db_redis/local_redis.md)
+ [BaseVectorDB](./databases/db_vector/base_vector_db.md)
+ [VearchDB](./databases/db_vector/vearch_db.md)

## MAS system modules
---
+ [OxyRequest](./schemas/oxy.md)
+ [Config](./config.md)
+ [DBFactory](./db_factory.md)
+ [EmbeddingCache](./embedding_cache.md)
+ [MAS](./mas.md)
+ [OxyFactory](./oxy_factory.md)