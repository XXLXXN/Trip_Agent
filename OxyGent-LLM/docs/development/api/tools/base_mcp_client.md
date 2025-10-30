# BaseTool
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

`BaseMCPClient` is the base client for Model Context Protocol (MCP) servers. It provides a foundation for connecting to and interacting with MCP servers, handling server lifecycle management, tool discovery, dynamic tool registration, and tool execution through the MCP protocol. It inherits from BaseTool and implements the MCP client functionality.

## Parameters


| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `included_tool_name_list` | `list` | `[]` | List of tool names discovered from the MCP server |

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `list_tools()` | Yes | `None` | Discover and register tools from the MCP server |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute a tool call through the MCP server |
| `cleanup()` | Yes | `None` | Clean up MCP server resources and connections |

## Inherited
 Please refer to the [BaseTool](./base_tools.md) class for inherited parameters and methods.
 
## Usage

The class `BaseMCPClient` must be inherited.