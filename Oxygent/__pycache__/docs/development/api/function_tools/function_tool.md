# FunctionTool
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

`FunctionTool` is a tool that wraps Python functions for execution within the OxyGent system. It automatically extracts input schemas from function signatures and handles execution with proper error handling, providing a bridge between regular Python functions and the OxyGent tool system.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `is_permission_required` | `bool` | `True` | Whether permission is required for execution |
| `func_process` | `Optional[Callable]` | `None` | The Python function to execute |
| `needs_oxy_request` | `bool` | `False` | Whether this tool needs oxy_request parameter |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `_extract_input_schema(func)` | No | `dict` | Extract input schema from function signature with parameters and types |
| `_execute(oxy_request)` | Yes | `OxyResponse` | Execute the wrapped function with provided arguments and error handling |

## Inherited
 Please refer to the [BaseTool](../tools/base_tools.md) class for inherited parameters and methods.
 

