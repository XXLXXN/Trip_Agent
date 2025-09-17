import asyncio
from adalflow.core.mcp_tool import MCPFunctionTool, mcp_session_context, MCPServerStdioParams

class MCPClient:
    def __init__(self, server_script_path="server.py"):
        # 初始化MCP服务的路径，默认为"server.py"
        self.server_script_path = server_script_path

    async def _call_mcp_tool(self, tool_name: str, **params) -> str:
        """调用MCP工具的通用方法"""
        server_params = MCPServerStdioParams(
            command="python",
            args=[self.server_script_path],  # 指定运行的服务器脚本
            env=None
        )

        try:
            async with mcp_session_context(server_params) as session:
                # 获取所有可用的工具
                tools = await session.list_tools()
                print(f"找到 {len(tools.tools)} 个工具:")

                # 显示所有可用工具
                for tool in tools.tools:
                    print(f"  - {tool.name}: {tool.description}")

                # 查找指定工具
                tool = next((t for t in tools.tools if t.name == tool_name), None)

                if not tool:
                    return f"错误: 未找到工具 '{tool_name}'"

                # 创建MCP工具实例并调用
                mcp_tool = MCPFunctionTool(server_params, tool)
                output = await mcp_tool.acall(**params)
                return output.output

        except Exception as e:
            return f"调用MCP工具 '{tool_name}' 时出错: {str(e)}"

    async def get_traffic_status(self, location: str) -> str:
        """调用交通状况MCP工具获取指定位置的交通拥堵情况"""
        return await self._call_mcp_tool("get_traffic_status", location=location)

    async def get_nearby_attractions(self, location: str) -> str:
        """调用景点推荐MCP工具获取指定位置附近的景点推荐"""
        return await self._call_mcp_tool("get_nearby_attractions", location=location)

    async def get_city_top_attractions(self, city: str) -> str:
        """调用城市知名景点MCP工具获取指定城市的知名景点"""
        return await self._call_mcp_tool("get_city_top_attractions", city=city)


async def main():
    # 初始化MCP客户端
    mcp_client = MCPClient(server_script_path="server.py")  # 这里传入服务器脚本路径

    # 测试获取交通状况
    print("\n=== 获取交通状况 ===")
    result = await mcp_client.get_traffic_status("华东师范大学")
    print(result)

    # 测试获取景点推荐
    print("\n=== 获取景点推荐 ===")
    result = await mcp_client.get_nearby_attractions("华东师范大学d")
    print(result)

    # 测试获取城市知名景点
    print("\n=== 获取城市知名景点 ===")
    result = await mcp_client.get_city_top_attractions("北京")
    print(result)


if __name__ == "__main__":
    # 运行异步主函数
    asyncio.run(main())
