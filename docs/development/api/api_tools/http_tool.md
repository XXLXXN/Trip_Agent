# HttpTool
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

`HttpTool` is a tool class for making HTTP requests to external APIs and services in the OxyGent system. It supports configurable methods, headers, and parameters with proper timeout handling.

## Parameters


| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `method` | `str` | `"GET"` | HTTP method to use |
| `url` | `str` | `""` | Target URL for the HTTP request |
| `headers` | `dict` | `{}` | HTTP headers to include in the request |
| `default_params` | `dict` | `{}` | Default parameters that will be merged with request arguments |

## Methods


| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute the HTTP request with merged parameters and timeout handling |

## Inherited
 Please refer to the [BaseTool](../agent/base_tools.md) class for inherited parameters and methods.
 
## Usage

