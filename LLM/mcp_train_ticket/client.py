import asyncio
import json
from adalflow.core.mcp_tool import MCPFunctionTool, mcp_session_context, MCPServerStdioParams

async def get_train_info(from_city: str, to_city: str, date: str):
    """调用12306余票查询MCP工具获取指定地点的余票信息，并以JSON返回"""
    server_params = MCPServerStdioParams(
        command="python",
        args=["server.py"],  # 确保服务器文件名为server.py
        env=None
    )

    try:
        async with mcp_session_context(server_params) as session:
            tools = await session.list_tools()

            # 查找余票查询工具
            ticket_tool = None
            for tool in tools.tools:
                if tool.name == "get_train_info":
                    ticket_tool = tool
                    break

            if not ticket_tool:
                return json.dumps({
                    "status": "error",
                    "message": "未找到余票查询工具"
                }, ensure_ascii=False, indent=2)

            mcp_tool = MCPFunctionTool(server_params, ticket_tool)
            output = await mcp_tool.acall(from_city=from_city, to_city=to_city, date=date)

            # 统一JSON结构
            return json.dumps({
                "status": "success",
                "query": {
                    "from_city": from_city,
                    "to_city": to_city,
                    "date": date
                },
                "result": output.output
            }, ensure_ascii=False, indent=2)

    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"获取余票信息时出错: {str(e)}"
        }, ensure_ascii=False, indent=2)

async def main():
    # 测试获取余票信息
    print("\n=== 获取余票信息===")
    result = await get_train_info("哈尔滨", "太原", "2025-09-06")  # 查询指定日期的余票信息
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
