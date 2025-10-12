# FunctionHub
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

`FunctionHub` is a central hub for registering and managing Python functions as tools in the OxyGent system. It provides a decorator-based interface for converting regular Python functions into executable tools, supporting both synchronous and asynchronous functions with automatic conversion.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `func_dict` | `dict` | `{}` | Registry of functions and their metadata, format: {name: (description, async_func)} |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `init()` | Yes | `None` | Initialize the hub by creating FunctionTool instances for all registered functions |
| `tool(description)` | No | `Callable` | Decorator for registering functions as tools, supports both sync and async functions |

## Inherited
 Please refer to the [BaseTool](../tools/base_tools.md) class for inherited parameters and methods.
 
## Usage
```python
file_tools = FunctionHub(name="file_tools")


@file_tools.tool(
    description="Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories."
)
def write_file(
    path: str = Field(description=""), content: str = Field(description="")
) -> str:
    with open(path, "w", encoding="utf-8") as file:
        file.write(content)
    return "Successfully wrote to " + path
```
