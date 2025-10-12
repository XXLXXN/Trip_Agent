# SSEMCPClient
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

`SSEMCPClient` is an MCP client implementation using Server-Sent Events transport in the OxyGent system. It extends BaseMCPClient to provide MCP communication over SSE, enabling real-time, unidirectional communication from servers to clients, making it suitable for streaming responses and live data updates.

## Parameters


| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `sse_url` | `AnyUrl` | `""` | The URL for the Server-Sent Events connection to the MCP server |
| `headers` | `Dict[str, str]` | `{}` | Extra HTTP headers to include in the SSE connection |
| `middlewares` | `List[Any]` | `[]` | Client-side MCP middlewares to apply to the session |

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `init()` | Yes | `None` | Initialize the SSE connection to the MCP server and discover available tools |

## Inherited
 Please refer to the [BaseMCPClient](./base_mcp_client.md) class for inherited parameters and methods.
 
## Usage

```python
oxy.SSEMCPClient(
    name="my_tools",
    sse_url="http://127.0.0.1:9000/sse"
)
```