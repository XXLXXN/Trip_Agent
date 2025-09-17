import asyncio
from adalflow.core.mcp_tool import MCPFunctionTool, mcp_session_context, MCPServerStdioParams


async def call_tool(tool_name: str, **kwargs):
    """通用调用函数"""
    server_params = MCPServerStdioParams(
        command="python",
        args=["server.py"],  # 确保服务端脚本名是 server.py
        env=None
    )

    try:
        async with mcp_session_context(server_params) as session:
            tools = await session.list_tools()

            tool = next((t for t in tools.tools if t.name == tool_name), None)
            if not tool:
                return f"错误: 服务器未提供 {tool_name} 工具"

            mcp_tool = MCPFunctionTool(server_params, tool)
            output = await mcp_tool.acall(**kwargs)
            return output.output

    except Exception as e:
        return f"调用 {tool_name} 出错: {e}"


async def get_recent_weather(location: str):
    """获取实时天气"""
    return await call_tool("get_recent_weather", city=location)


async def get_weather_forecast(location: str, days: int = 3):
    """获取未来几天的天气预报"""
    return await call_tool("get_weather_forecast", city=location, days=days)


async def main():
    print("\n=== 实时天气 ===")
    result = await get_recent_weather("灌南")
    print(result)

    print("\n=== 天气预报（未来2天）===")
    result = await get_weather_forecast("灌南", days=2)
    print(result)

    print("\n=== 天气预报（未来4天）===")
    result = await get_weather_forecast("上海", days=4)
    print(result)


if __name__ == "__main__":
    asyncio.run(main())

