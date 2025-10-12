# StreamableMCPClient
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

`StreamableMCPClient` is an MCP client implementation using Streamable-HTTP transport. It extends the BaseMCPClient to provide HTTP streaming connection capabilities for communicating with MCP servers. This client supports custom headers and middlewares for enhanced HTTP communication.

## Parameters


| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `server_url` | `AnyUrl` | `""` | URL of the MCP server to connect to |
| `headers` | `Dict[str, str]` | `{}` | Extra HTTP headers for server communication |
| `middlewares` | `List[Any]` | `[]` | Client-side MCP middlewares for request processing |

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `init()` | Yes | `None` | Initialize the HTTP streaming connection to the MCP server |

## Inherited
Please refer to the [BaseMCPClient](./base_mcp_client.md) class for inherited parameters and methods.
 
