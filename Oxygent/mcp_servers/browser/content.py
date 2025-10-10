"""
浏览器内容提取和截图功能

提供捕获页面的可访问性快照和截取页面截图等功能
"""

import os
import uuid
from datetime import datetime

from pydantic import Field

from .core import (
    _ensure_page,
    _set_operation_status,
    _verify_data_ready,
    check_dependencies,
    mcp,
)


@mcp.tool(description="捕获页面的可访问性快照")
async def browser_snapshot():
    """
    捕获页面的可访问性快照，包括页面标题、URL和内容
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()

        # 获取页面信息
        title = await page.title()
        url = page.url

        # 获取页面内容
        content = await page.content()

        # 提取页面文本
        text = await page.evaluate("""() => {
            return document.body.innerText;
        }""")

        # 如果文本太长，截取前2000个字符
        if len(text) > 2000:
            text = text[:2000] + "...(内容已截断)"

        snapshot = {"title": title, "url": url, "text": text, "data_complete": True}

        await _verify_data_ready()
        await _set_operation_status(False)
        return str(snapshot)
    except Exception as e:
        await _set_operation_status(False)
        return f"捕获页面快照时发生错误: {str(e)}"


@mcp.tool(description="截取页面截图")
async def browser_take_screenshot(
    path: str = Field(
        default="", description="保存截图的路径，如果为空则保存到cache_dir目录"
    ),
    full_page: bool = Field(
        default=False, description="是否截取整个页面，而不仅仅是可见区域"
    ),
):
    """
    截取当前页面的截图，保存为文件并返回文件路径

    如果未指定路径，将自动保存到项目根目录下的cache_dir目录中
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()

        # 等待页面稳定
        import asyncio

        await asyncio.sleep(0.5)

        # 截取截图
        screenshot_bytes = await page.screenshot(full_page=full_page)

        # 计算图片大小（用于信息展示）
        size_mb = len(screenshot_bytes) / (1024 * 1024)

        # 确定保存路径
        save_path = path
        if not save_path:
            # 创建cache_dir目录（如果不存在）
            cache_dir = os.path.join(os.getcwd(), "../", "cache_dir")
            os.makedirs(cache_dir, exist_ok=True)

            # 创建screenshot子目录（如果不存在）
            screenshot_dir = os.path.join(cache_dir, "screenshot")
            os.makedirs(screenshot_dir, exist_ok=True)

            # 生成唯一的文件名
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            filename = f"{timestamp}_{unique_id}.png"

            # 完整的保存路径
            save_path = os.path.join(screenshot_dir, filename)
        else:
            # 确保目录存在
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)

        # 保存截图到文件
        with open(save_path, "wb") as f:
            f.write(screenshot_bytes)

        await _verify_data_ready()
        await _set_operation_status(False)
        return {"path": save_path, "size_mb": round(size_mb, 2)}
    except Exception as e:
        await _set_operation_status(False)
        return f"截取页面截图时发生错误: {str(e)}"
