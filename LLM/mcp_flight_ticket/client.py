import asyncio
from adalflow.core.mcp_tool import MCPFunctionTool, mcp_session_context, MCPServerStdioParams

async def get_flight_info(departure: str, arrival: str, departure_date: str):
    """调用航班查询MCP工具获取指定航班的信息"""
    server_params = MCPServerStdioParams(
        command="python",
        args=["server.py"],
        env=None
    )

    try:
        async with mcp_session_context(server_params) as session:
            tools = await session.list_tools()

            # 查找航班查询工具
            flight_tool = None
            for tool in tools.tools:
                if tool.name == "get_flight_info":
                    flight_tool = tool
                    break

            if not flight_tool:
                return "错误: 未找到航班查询工具"

            mcp_tool = MCPFunctionTool(server_params, flight_tool)
            output = await mcp_tool.acall(departure=departure, arrival=arrival, departure_date=departure_date)
            return output.output

    except Exception as e:
        return f"获取航班信息时出错: {str(e)}"


async def get_flight_forecast(departure: str, arrival: str, departure_date: str):
    """调用航班预定MCP工具获取指定航班的预定信息"""
    server_params = MCPServerStdioParams(
        command="python",
        args=["server.py"],  # 确保服务器文件名为server.py
        env=None
    )

    try:
        async with mcp_session_context(server_params) as session:
            tools = await session.list_tools()

            # 查找航班预定工具
            forecast_tool = None
            for tool in tools.tools:
                if tool.name == "get_flight_forecast":
                    forecast_tool = tool
                    break

            if not forecast_tool:
                return "错误: 未找到航班预定工具"

            mcp_tool = MCPFunctionTool(server_params, forecast_tool)
            output = await mcp_tool.acall(departure=departure, arrival=arrival, departure_date=departure_date)
            return output.output

    except Exception as e:
        return f"获取航班预定时出错: {str(e)}"


async def main():
    # 测试获取航班信息
    print("\n=== 获取航班信息 ===")
    result = await get_flight_info("泰州", "上海", "2025-09-06")
    print(result)

if __name__ == "__main__":
    # 运行异步主函数
    asyncio.run(main())
