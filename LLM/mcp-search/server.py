from mcp.server.fastmcp import FastMCP
import httpx
import os
import time
from typing import Optional, Dict
from dotenv import load_dotenv

# 初始化MCP服务器
mcp = FastMCP("web_search_server")
load_dotenv()


class SearchService:
    def __init__(self):
        # 只使用Serper API
        self.serper_api_key = os.getenv("SERPER_API_KEY")
        if not self.serper_api_key:
            print("警告: 未找到SERPER_API_KEY环境变量，搜索功能将不可用")

        self.cache = {}
        self.cache_timeout = 300  # 5分钟缓存

    async def _fetch_from_serper(self, query: str, num_results: int = 5) -> Optional[dict]:
        """使用Serper API进行搜索"""
        if not self.serper_api_key:
            return {"error": "未配置Serper API密钥"}

        try:
            url = "https://google.serper.dev/search"
            headers = {
                'X-API-KEY': self.serper_api_key,
                'Content-Type': 'application/json'
            }
            payload = {
                "q": query,
                "num": num_results
            }

            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                return response.json()

        except httpx.TimeoutException:
            print(f"搜索请求超时: {query}")
            return {"error": "搜索请求超时"}
        except Exception as e:
            print(f"搜索请求失败: {e}")
            return {"error": f"搜索请求失败: {str(e)}"}

    async def search_web(self, query: str, num_results: int = 5) -> Optional[dict]:
        """执行网络搜索并缓存结果"""
        now = time.time()
        cache_key = f"{query}_{num_results}"

        if cache_key in self.cache:
            cached = self.cache[cache_key]
            if now - cached["timestamp"] < self.cache_timeout:
                return cached["data"]

        data = await self._fetch_from_serper(query, num_results)

        if data is not None:
            self.cache[cache_key] = {"data": data, "timestamp": now}

        return data

    @staticmethod
    def format_search_results(search_data: dict, query: str) -> str:
        """格式化搜索结果为易读文本"""
        if not search_data:
            return f"无法获取关于'{query}'的搜索结果"

        # 检查是否有错误
        if "error" in search_data:
            return f"搜索出错: {search_data['error']}"

        # 处理Serper API格式
        if "organic" in search_data:
            results = search_data.get("organic", [])
            if not results:
                return f"没有找到关于'{query}'的相关结果"

            formatted = [f"关于'{query}'的搜索结果:"]
            for i, result in enumerate(results[:5], 1):
                title = result.get("title", "无标题")
                link = result.get("link", "无链接")
                snippet = result.get("snippet", "无摘要")

                formatted.append(f"{i}. {title}")
                formatted.append(f"   链接: {link}")
                formatted.append(f"   摘要: {snippet}")
                formatted.append("")  # 空行分隔

            return "\n".join(formatted)

        return f"无法解析关于'{query}'的搜索结果"

    @staticmethod
    def format_news_results(search_data: dict, query: str) -> str:
        """格式化新闻搜索结果"""
        if not search_data:
            return f"无法获取关于'{query}'的新闻结果"

        # 检查是否有错误
        if "error" in search_data:
            return f"搜索出错: {search_data['error']}"

        # 处理Serper API新闻格式
        if "news" in search_data:
            results = search_data.get("news", [])
            if not results:
                return f"没有找到关于'{query}'的相关新闻"

            formatted = [f"关于'{query}'的最新新闻:"]
            for i, result in enumerate(results[:5], 1):
                title = result.get("title", "无标题")
                link = result.get("link", "无链接")
                source = result.get("source", "未知来源")
                date = result.get("date", "未知日期")
                snippet = result.get("snippet", "无摘要")

                formatted.append(f"{i}. {title}")
                formatted.append(f"   来源: {source} | 日期: {date}")
                formatted.append(f"   链接: {link}")
                formatted.append(f"   摘要: {snippet}")
                formatted.append("")  # 空行分隔

            return "\n".join(formatted)

        return f"无法解析关于'{query}'的新闻结果"


# 创建搜索服务实例
search_service = SearchService()


@mcp.tool()
async def search_web(query: str, num_results: int = 5) -> str:
    """搜索网络获取相关信息"""
    data = await search_service.search_web(query, num_results)
    return search_service.format_search_results(data, query)


@mcp.tool()
async def search_news(query: str) -> str:
    """搜索最新新闻资讯"""
    # 对于新闻搜索，我们可以添加特定参数
    news_query = f"{query} 新闻"
    data = await search_service.search_web(news_query, 5)
    return search_service.format_news_results(data, query)


@mcp.tool()
async def search_scholar(query: str, num_results: int = 5) -> str:
    """搜索学术文献和研究成果"""
    # 对于学术搜索，我们可以添加特定参数
    scholar_query = f"{query} 学术研究 论文"
    data = await search_service.search_web(scholar_query, num_results)
    return search_service.format_search_results(data, query)


if __name__ == "__main__":
    print("联网搜索服务MCP服务器启动中...")
    mcp.run()