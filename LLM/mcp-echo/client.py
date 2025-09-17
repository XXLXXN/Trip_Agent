import asyncio
from adalflow.core.mcp_tool import MCPFunctionTool, mcp_session_context, MCPServerStdioParams


async def call_echo_server(message: str):
    """
    调用回显MCP服务器

    Args:
        message: 要回显的消息

    Returns:
        服务器返回的回显结果
    """
    # 配置MCP服务器参数
    server_params = MCPServerStdioParams(
        command="python",
        args=["server.py"],  # 假设您的服务器文件名为echo_server.py
        env=None
    )

    async with mcp_session_context(server_params) as session:
        # 获取可用工具列表
        tools = await session.list_tools()
        print(f"找到 {len(tools.tools)} 个工具")

        # 查找回显工具
        echo_tool = None
        for tool in tools.tools:
            print(f"工具名称: {tool.name}, 描述: {tool.description}")
            if tool.name == "echo_tool":
                echo_tool = tool
                break

        # 创建工具调用实例
        mcp_tool = MCPFunctionTool(server_params, echo_tool)

        # 调用工具
        output = await mcp_tool.acall(message=message)
        return output.output


async def main():
    # 测试调用回显服务器
    result = await call_echo_server("你好，世界!")
    print("回显结果:", result)

    # 再次调用测试
    result = await call_echo_server("这是第二条测试消息")
    print("回显结果:", result)


if __name__ == "__main__":
    # 运行异步主函数
    asyncio.run(main())