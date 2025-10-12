"""
浏览器交互功能

提供页面元素的点击、悬停和输入文本等交互操作
"""

import asyncio

from pydantic import Field

from .core import (
    _ensure_page,
    _set_operation_status,
    _verify_data_ready,
    check_dependencies,
    mcp,
)


@mcp.tool(description="点击元素")
async def browser_click(
    selector: str = Field(description="要点击的元素的CSS选择器"),
    timeout: int = Field(default=5000, description="等待元素出现的超时时间(毫秒)"),
):
    """
    点击页面上的元素
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()

        # 等待元素出现
        await page.wait_for_selector(selector, timeout=timeout)

        # 点击元素
        await page.click(selector)

        # 等待可能的页面变化
        await asyncio.sleep(1)
        await _verify_data_ready()

        await _set_operation_status(False)
        return f"成功点击元素: {selector}，数据已准备就绪"
    except Exception as e:
        await _set_operation_status(False)
        return f"点击元素 {selector} 时发生错误: {str(e)}"


@mcp.tool(description="悬停在元素上")
async def browser_hover(
    selector: str = Field(description="要悬停的元素的CSS选择器"),
    timeout: int = Field(default=5000, description="等待元素出现的超时时间(毫秒)"),
):
    """
    将鼠标悬停在页面上的元素上
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()

        # 等待元素出现
        await page.wait_for_selector(selector, timeout=timeout)

        # 悬停在元素上
        await page.hover(selector)

        # 等待可能的页面变化（如悬停菜单出现）
        await asyncio.sleep(0.5)
        await _verify_data_ready()

        await _set_operation_status(False)
        return f"成功悬停在元素上: {selector}，数据已准备就绪"
    except Exception as e:
        await _set_operation_status(False)
        return f"悬停在元素 {selector} 上时发生错误: {str(e)}"


@mcp.tool(description="在元素中输入文本")
async def browser_type(
    selector: str = Field(description="要输入文本的元素的CSS选择器"),
    text: str = Field(description="要输入的文本"),
    timeout: int = Field(default=5000, description="等待元素出现的超时时间(毫秒)"),
):
    """
    在页面上的元素中输入文本
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()

        # 等待元素出现
        await page.wait_for_selector(selector, timeout=timeout)

        # 清除现有文本
        await page.fill(selector, "")

        # 输入文本
        await page.type(selector, text)
        await _verify_data_ready()

        await _set_operation_status(False)
        return f"成功在元素 {selector} 中输入文本，数据已准备就绪"
    except Exception as e:
        await _set_operation_status(False)
        return f"在元素 {selector} 中输入文本时发生错误: {str(e)}"
