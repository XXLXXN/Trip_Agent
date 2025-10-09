"""
浏览器搜索功能

提供网络搜索功能，支持Google、Bing和百度搜索引擎
"""

import asyncio
from typing import Literal
from urllib.parse import quote

from pydantic import Field

from .core import (
    _ensure_page,
    _set_operation_status,
    _verify_data_ready,
    check_dependencies,
    mcp,
)


@mcp.tool(description="执行网络搜索并返回搜索结果及页面内容")
async def browser_search(
    query: str = Field(description="搜索查询"),
    search_engine: Literal["google", "bing", "baidu"] = Field(
        default="bing", description="搜索引擎，支持google、bing或baidu"
    ),
    num_results: int = Field(default=5, description="返回的搜索结果数量，最大10个"),
    timeout: int = Field(default=30, description="搜索操作的超时时间(秒)"),
    extract_page_content: bool = Field(
        default=True, description="是否提取页面主要内容，用于二次确认"
    ),
):
    """
    使用指定的搜索引擎执行网络搜索，并返回结构化的搜索结果及页面主要内容
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    # 限制结果数量在合理范围内
    if num_results < 1:
        num_results = 1
    elif num_results > 10:
        num_results = 10

    # 初始化结果变量
    results = []
    partial_results = False
    error_message = None

    await _set_operation_status(True)

    try:
        # 确保浏览器已启动
        page = await _ensure_page()

        # 编码搜索查询
        encoded_query = quote(query)

        # 根据选择的搜索引擎构建URL
        search_urls = {
            "google": f"https://www.google.com/search?q={encoded_query}",
            "bing": f"https://www.bing.com/search?q={encoded_query}",
            "baidu": f"https://www.baidu.com/s?wd={encoded_query}",
        }

        # 获取搜索URL
        search_url = search_urls.get(search_engine.lower(), search_urls["bing"])

        # 使用超时机制导航到搜索页面
        try:
            navigation_task = page.goto(search_url, wait_until="networkidle")
            await asyncio.wait_for(navigation_task, timeout=timeout)
        except asyncio.TimeoutError:
            # 如果导航超时，尝试继续处理已加载的内容
            error_message = f"导航到搜索页面超时(>{timeout}秒)，尝试处理已加载的内容"

        # 等待页面加载完成，但设置超时
        try:
            await asyncio.wait_for(asyncio.sleep(2), timeout=3)
        except asyncio.TimeoutError:
            # 如果等待超时，继续处理
            pass

        # 根据不同的搜索引擎提取搜索结果，使用超时机制
        try:
            if search_engine.lower() == "google":
                # 提取Google搜索结果
                evaluation_task = page.evaluate(
                    """(numResults) => {
                    const searchResults = [];
                    const resultElements = document.querySelectorAll('div[data-sokoban-container]');
                    
                    for (let i = 0; i < resultElements.length && searchResults.length < numResults; i++) {
                        const element = resultElements[i];
                        
                        // 尝试提取标题和链接
                        const titleElement = element.querySelector('h3');
                        if (!titleElement) continue;
                        
                        const linkElement = element.querySelector('a');
                        if (!linkElement) continue;
                        
                        const title = titleElement.innerText.trim();
                        const link = linkElement.href;
                        
                        // 尝试提取摘要
                        let snippet = '';
                        const snippetElement = element.querySelector('div[style*="webkit-line-clamp"]') ||
                                              element.querySelector('div[data-content-feature="1"]');
                        if (snippetElement) {
                            snippet = snippetElement.innerText.trim();
                        }
                        
                        if (title && link) {
                            searchResults.push({ title, link, snippet });
                        }
                    }
                    
                    return searchResults;
                }""",
                    num_results,
                )
                results = await asyncio.wait_for(evaluation_task, timeout=timeout / 2)

            elif search_engine.lower() == "bing":
                # 提取Bing搜索结果
                evaluation_task = page.evaluate(
                    """(numResults) => {
                    const searchResults = [];
                    const resultElements = document.querySelectorAll('#b_results > li.b_algo');
                    
                    for (let i = 0; i < resultElements.length && searchResults.length < numResults; i++) {
                        const element = resultElements[i];
                        
                        // 提取标题和链接
                        const titleElement = element.querySelector('h2 a');
                        if (!titleElement) continue;
                        
                        const title = titleElement.innerText.trim();
                        const link = titleElement.href;
                        
                        // 提取摘要
                        let snippet = '';
                        const snippetElement = element.querySelector('.b_caption p');
                        if (snippetElement) {
                            snippet = snippetElement.innerText.trim();
                        }
                        
                        if (title && link) {
                            searchResults.push({ title, link, snippet });
                        }
                    }
                    
                    return searchResults;
                }""",
                    num_results,
                )
                results = await asyncio.wait_for(evaluation_task, timeout=timeout / 2)

            elif search_engine.lower() == "baidu":
                # 提取百度搜索结果
                evaluation_task = page.evaluate(
                    """(numResults) => {
                    const searchResults = [];
                    const resultElements = document.querySelectorAll('.result');
                    
                    for (let i = 0; i < resultElements.length && searchResults.length < numResults; i++) {
                        const element = resultElements[i];
                        
                        // 提取标题和链接
                        const titleElement = element.querySelector('h3 a');
                        if (!titleElement) continue;
                        
                        const title = titleElement.innerText.trim();
                        const link = titleElement.href;
                        
                        // 提取摘要
                        let snippet = '';
                        const snippetElement = element.querySelector('.c-abstract');
                        if (snippetElement) {
                            snippet = snippetElement.innerText.trim();
                        }
                        
                        if (title && link) {
                            searchResults.push({ title, link, snippet });
                        }
                    }
                    
                    return searchResults;
                }""",
                    num_results,
                )
                results = await asyncio.wait_for(evaluation_task, timeout=timeout / 2)
        except asyncio.TimeoutError:
            # 如果提取结果超时，记录错误并尝试使用通用提取方法
            error_message = f"提取搜索结果超时(>{timeout / 2}秒)，尝试使用通用提取方法"
            partial_results = True

        # 如果没有找到结果或者提取超时，尝试通用提取方法
        if not results or len(results) == 0:
            try:
                evaluation_task = page.evaluate(
                    """(numResults) => {
                    const searchResults = [];
                    // 尝试查找所有可能的搜索结果元素
                    const allLinks = Array.from(document.querySelectorAll('a'));
                    
                    // 过滤可能的搜索结果链接
                    const resultLinks = allLinks.filter(link => {
                        // 链接应该有href属性
                        if (!link.href) return false;
                        
                        // 链接应该不是导航链接
                        if (link.href.includes('search?') ||
                            link.href.includes('javascript:') ||
                            link.href.includes('#')) return false;
                        
                        // 链接应该有文本内容
                        if (!link.innerText.trim()) return false;
                        
                        // 链接文本不应太短
                        if (link.innerText.trim().length < 15) return false;
                        
                        return true;
                    });
                    
                    // 提取搜索结果
                    for (let i = 0; i < resultLinks.length && searchResults.length < numResults; i++) {
                        const link = resultLinks[i];
                        const title = link.innerText.trim();
                        const url = link.href;
                        
                        // 尝试找到摘要（链接附近的文本）
                        let snippet = '';
                        const parent = link.parentElement;
                        if (parent) {
                            const siblings = Array.from(parent.childNodes);
                            for (const sibling of siblings) {
                                if (sibling !== link && sibling.textContent) {
                                    const text = sibling.textContent.trim();
                                    if (text.length > 20) {
                                        snippet = text;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        searchResults.push({ title, link: url, snippet });
                    }
                    
                    return searchResults;
                }""",
                    num_results,
                )
                results = await asyncio.wait_for(evaluation_task, timeout=timeout / 3)
            except asyncio.TimeoutError:
                # 如果通用提取方法也超时，记录错误
                if error_message:
                    error_message += "，通用提取方法也超时"
                else:
                    error_message = f"通用提取方法超时(>{timeout / 3}秒)"

        # 构建搜索结果摘要
        summary = f'搜索查询: "{query}"\n'
        summary += f"搜索引擎: {search_engine}\n"

        if error_message:
            summary += f"警告: {error_message}\n"

        if partial_results:
            summary += "注意: 由于超时，可能只返回部分结果\n"

        summary += f"找到 {len(results)} 个结果\n\n"

        for i, result in enumerate(results):
            summary += f"{i + 1}. {result.get('title', '无标题')}\n"
            summary += f"   链接: {result.get('link', '无链接')}\n"
            snippet = result.get("snippet", "")
            if snippet:
                if len(snippet) > 100:
                    snippet = snippet[:100] + "..."
                summary += f"   摘要: {snippet}\n"
            summary += "\n"

        # 提取页面主要内容（如果需要）
        page_content = {}
        if extract_page_content:
            try:
                # 获取页面标题
                page_content["title"] = await page.title()

                # 获取页面URL
                page_content["url"] = page.url

                # 提取页面主要内容
                page_text = await page.evaluate("""() => {
                    // 尝试获取主要内容区域
                    const mainContent = document.querySelector('main') ||
                                        document.querySelector('article') ||
                                        document.querySelector('#content') ||
                                        document.querySelector('.content') ||
                                        document.body;
                    
                    // 如果找到主要内容区域，则返回其文本
                    if (mainContent) {
                        return mainContent.innerText;
                    }
                    
                    // 否则返回页面所有文本
                    return document.body.innerText;
                }""")

                # 如果文本太长，截取前3000个字符
                if len(page_text) > 3000:
                    page_content["content"] = page_text[:3000] + "...(内容已截断)"
                else:
                    page_content["content"] = page_text

                # 提取页面元数据
                meta_data = await page.evaluate("""() => {
                    const metadata = {};
                    
                    // 获取所有meta标签
                    const metaTags = document.querySelectorAll('meta');
                    for (const meta of metaTags) {
                        const name = meta.getAttribute('name') || meta.getAttribute('property');
                        const content = meta.getAttribute('content');
                        if (name && content) {
                            metadata[name] = content;
                        }
                    }
                    
                    return metadata;
                }""")

                # 提取重要的元数据
                important_meta = [
                    "description",
                    "keywords",
                    "og:title",
                    "og:description",
                ]
                page_content["metadata"] = {}
                for key in important_meta:
                    if key in meta_data:
                        page_content["metadata"][key] = meta_data[key]

            except Exception as content_error:
                page_content["content_error"] = (
                    f"提取页面内容时发生错误: {str(content_error)}"
                )

        response = {
            "query": query,
            "search_engine": search_engine,
            "results": results,
            "summary": summary,
        }

        if extract_page_content and page_content:
            response["page_content"] = page_content

        if error_message:
            response["error"] = error_message
            response["partial_results"] = partial_results

        await _verify_data_ready()
        await _set_operation_status(False)
        return response
    except Exception as e:
        # 捕获所有其他异常
        error_msg = f"执行网络搜索时发生错误: {str(e)}"

        # 如果有部分结果，尝试返回
        if results and len(results) > 0:
            summary = f'搜索查询: "{query}"\n'
            summary += f"搜索引擎: {search_engine}\n"
            summary += f"警告: {error_msg}，返回部分结果\n"
            summary += f"找到 {len(results)} 个结果\n\n"

            for i, result in enumerate(results):
                summary += f"{i + 1}. {result.get('title', '无标题')}\n"
                summary += f"   链接: {result.get('link', '无链接')}\n"
                snippet = result.get("snippet", "")
                if snippet:
                    if len(snippet) > 100:
                        snippet = snippet[:100] + "..."
                    summary += f"   摘要: {snippet}\n"
                summary += "\n"

            result = {
                "query": query,
                "search_engine": search_engine,
                "results": results,
                "summary": summary,
                "error": error_msg,
                "partial_results": True,
            }

            # 在异常处理中，我们不尝试提取页面内容，因为页面可能已经不可用
            # 只添加一个说明，表明由于错误无法提取页面内容
            if extract_page_content:
                result["content_error"] = "由于发生错误，无法提取页面内容"

            await _set_operation_status(False)
            return result
        else:
            await _set_operation_status(False)
            return error_msg
