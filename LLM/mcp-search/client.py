import asyncio
from adalflow.core.mcp_tool import MCPFunctionTool, mcp_session_context, MCPServerStdioParams


async def call_tool(tool_name: str, **kwargs):
    """通用调用函数"""
    server_params = MCPServerStdioParams(
        command="python",
        args=["server.py"],  # 使用搜索服务器脚本
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


async def search_web(query: str, num_results: int = 5):
    """搜索网络获取相关信息"""
    return await call_tool("search_web", query=query, num_results=num_results)


async def search_news(query: str):
    """搜索最新新闻资讯"""
    return await call_tool("search_news", query=query)


async def search_scholar(query: str, num_results: int = 5):
    """搜索学术文献和研究成果"""
    return await call_tool("search_scholar", query=query, num_results=num_results)


async def main():
    # 测试网页搜索
    print("\n=== 网页搜索 ===")
    result = await search_web("人工智能发展趋势", num_results=3)
    print(result)

    # 测试新闻搜索
    print("\n=== 新闻搜索 ===")
    result = await search_news("气候变化")
    print(result)

    # 测试学术搜索
    print("\n=== 学术搜索 ===")
    result = await search_scholar("深度学习", num_results=2)
    print(result)


if __name__ == "__main__":
    asyncio.run(main())