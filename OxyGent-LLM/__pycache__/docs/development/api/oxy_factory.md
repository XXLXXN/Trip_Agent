# OxyFactory
---
The position of the class is:

```
oxygent/oxy_factory.py
```

---

## Introduce

`OxyFactory` is a factory class for creating OxyGent operators. It provides a centralized way to create various types of Oxy components including agents, tools, LLMs, and workflows. The factory uses a registry pattern with a static dictionary mapping class names to their corresponding class constructors, enabling dynamic component creation based on string identifiers.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `_creators` | `dict` | `{}` | Static dictionary mapping class names to class constructors |

### Supported Components

| Component Type | Class Name | Description |
| -------------- | ---------- | ----------- |
| Agent | `ChatAgent` | Chat-based conversational agent |
| Agent | `ReActAgent` | ReAct pattern reasoning agent |
| Agent | `WorkflowAgent` | Workflow-based agent |
| Tool | `HttpTool` | HTTP-based tool for web requests |
| Tool | `MCPTool` | Model Context Protocol tool |
| Tool | `FunctionTool` | Function-based tool |
| LLM | `HttpLLM` | HTTP-based language model |
| LLM | `OpenAILLM` | OpenAI language model |
| MCP Client | `StdioMCPClient` | Standard I/O MCP client |
| MCP Client | `SSEMCPClient` | Server-Sent Events MCP client |
| Workflow | `Workflow` | Workflow component |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `create_oxy()` | No | `object` | Static method to create Oxy component instance based on class name |

 
