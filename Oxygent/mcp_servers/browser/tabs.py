"""
浏览器标签页管理功能

提供列出所有浏览器标签、打开新标签和关闭标签等功能
"""

import asyncio

from pydantic import Field

from .core import (
    _context,
    _ensure_browser,
    _set_operation_status,
    _verify_data_ready,
    add_page_to_pages,
    check_dependencies,
    get_current_page_id,
    get_pages,
    mcp,
    remove_page_from_pages,
    set_current_page_id,
)


@mcp.tool(description="列出所有浏览器标签")
async def browser_tab_list():
    """
    列出所有打开的浏览器标签
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        await _ensure_browser()

        pages = get_pages()
        current_page_id = get_current_page_id()

        if not pages:
            await _set_operation_status(False)
            return "没有打开的标签"

        tabs = []
        for page_id, page in pages.items():
            try:
                title = await page.title()
                url = page.url
                is_current = page_id == current_page_id

                tabs.append(
                    {
                        "id": page_id,
                        "title": title,
                        "url": url,
                        "is_current": is_current,
                    }
                )
            except:
                # 页面可能已关闭
                pass

        await _verify_data_ready()
        await _set_operation_status(False)
        return str(tabs)
    except Exception as e:
        await _set_operation_status(False)
        return f"列出浏览器标签时发生错误: {str(e)}"


@mcp.tool(description="打开新标签")
async def browser_tab_new(
    url: str = Field(default="about:blank", description="在新标签中打开的URL"),
):
    """
    打开一个新的浏览器标签
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        await _ensure_browser()

        # 确保_context已初始化
        if _context is None:
            await _ensure_browser()

        # 此时_context应该已经初始化，但为了类型检查，我们再次验证
        if _context is not None:
            # 创建新页面
            page = await _context.new_page()

            # 添加页面到全局字典
            pages = get_pages()
            page_id = f"page_{len(pages) + 1}"
            add_page_to_pages(page_id, page)
            set_current_page_id(page_id)

            # 如果提供了URL，则导航到该URL
            if url != "about:blank":
                await page.goto(url)
                # 等待页面加载
                await asyncio.sleep(1)

            await _verify_data_ready()
            await _set_operation_status(False)
            return f"已打开新标签，ID: {page_id}，数据已准备就绪"
        else:
            raise Exception("无法初始化浏览器上下文")
    except Exception as e:
        await _set_operation_status(False)
        return f"打开新标签时发生错误: {str(e)}"


@mcp.tool(description="关闭标签")
async def browser_tab_close(
    page_id: str = Field(
        default="", description="要关闭的标签ID，如果为空则关闭当前标签"
    ),
):
    """
    关闭指定的浏览器标签
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        await _ensure_browser()

        pages = get_pages()
        current_page_id = get_current_page_id()

        if not pages:
            await _set_operation_status(False)
            return "没有打开的标签可关闭"

        # 确定要关闭的页面ID
        target_page_id = page_id if page_id and page_id in pages else current_page_id

        if target_page_id not in pages:
            await _set_operation_status(False)
            return f"找不到ID为 {target_page_id} 的标签"

        # 关闭页面
        await pages[target_page_id].close()

        # 移除页面
        success = remove_page_from_pages(target_page_id)

        # 如果关闭的是当前页面，则切换到另一个页面
        if target_page_id == current_page_id:
            pages = get_pages()  # 重新获取页面字典，因为它可能已经被修改
            if pages:
                set_current_page_id(next(iter(pages)))
            else:
                set_current_page_id(None)

        await _verify_data_ready()
        await _set_operation_status(False)

        if success:
            return f"已关闭标签，ID: {target_page_id}，操作已完成"
        else:
            return f"关闭标签失败，ID: {target_page_id}"
    except Exception as e:
        await _set_operation_status(False)
        return f"关闭标签时发生错误: {str(e)}"
