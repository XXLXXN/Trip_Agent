from mcp.server.fastmcp import FastMCP

mcp = FastMCP("DemoServer")

@mcp.tool()
async def echo_tool(message: str) -> str:
    """回显输入内容"""
    return f"你刚才输入的是: {message}"

if __name__ == "__main__":
    # 默认就是 stdio 传输
    mcp.run()
