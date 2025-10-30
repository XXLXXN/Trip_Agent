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

`BaseTool` is the abstract base class for all tools in the OxyGent system. It provides common functionality for tool implementations including permission control, category identification, and execution timeout management. Tools are specialized Oxy instances that typically require permissions and have shorter timeout periods.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `is_permission_required` | `bool` | `True` | Whether permission is required for execution |
| `category` | `str` | `"tool"` | Tool category identifier |
| `timeout` | `float` | `60` | Execution timeout in seconds |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_execute(oxy_request)` | Yes | `OxyResponse` | **Abstract method** - Execute the tool request (must be implemented by subclasses) |

## Inherited
 Please refer to the [Oxy](../agents/base_oxy.md) class for inherited parameters and methods.
 
## Usage

The class `BaseTool` must be inherited.