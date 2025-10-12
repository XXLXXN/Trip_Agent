# StdioMCPClient
---
The position of the class is:


```markdown
[Oxy](../agent/base_oxy.md)
├── [BaseTool](../tools/base_tools.md)
    ├── [MCPTool](../tools/mcp_tool.md)
    ├── [BaseMCPClient](../tools/base_mcp_client.md)
    │   ├──[StdioMCPClient](../tools/stdio_mcp_client.md)
    │   ├──[SSEMCPClient](../tools/sse_mcp_client.md)
    │   └──[StreamableMCPClient](../tools/streamable_mcp_client.md)
    ├── [HttpTool](../api_tools/http_tool.md)
    ├── [FunctionHub](../function_tools/function_hub.md)
    └── [FunctionTool](../function_tools/function_tool.md)
└── [BaseFlow](../agent/base_flow.md)
```

---

## Introduce

`StdioMCPClient` is an MCP client implementation that communicates with MCP servers through standard input/output streams. It extends BaseMCPClient to provide MCP communication over stdio, spawning and managing external processes (like Node.js scripts) that act as MCP servers and communicating through standard input/output streams.

## Parameters


| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `params` | `dict[str, Any]` | `{}` | Configuration parameters including command, arguments, and environment variables |

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `init()` | Yes | `None` | Initialize the stdio connection to the MCP server process |
| `_ensure_directories_exist(args)` | Yes | `None` | Ensure required directories exist before starting MCP server |

## Inherited
 Please refer to the [BaseMCPClient](./base_mcp_client.md) class for inherited parameters and methods.
 
## Usage

```python
oxy.StdioMCPClient(
    name="time_tools",
    params={
        "command": "uvx",
        "args": ["mcp-server-time", "--local-timezone=Asia/Shanghai"],
    },
)
```
