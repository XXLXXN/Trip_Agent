"""
MCP Server for Browser Operations

这个文件是浏览器操作MCP服务器的入口点。
它导入所有的浏览器工具模块，并提供一个运行MCP服务器的入口点。
"""

import atexit
import asyncio
import sys
import os

# 尝试使用相对导入（当作为包的一部分导入时）
try:
    from .core import mcp, _browser, _close_browser, browser_check_status
    from .navigation import (
        browser_navigate,
        browser_navigate_back,
        browser_navigate_forward
    )
    from .interaction import (
        browser_click,
        browser_hover,
        browser_type
    )
    from .content import (
        browser_snapshot,
        browser_take_screenshot
    )
    from .tabs import (
        browser_tab_list,
        browser_tab_new,
        browser_tab_close
    )
    from .login import (
        browser_auto_login
    )
    from .search import (
        browser_search
    )
except ImportError:
    # 当作为主模块运行时，使用绝对导入
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
    from mcp_servers.browser.core import mcp, _browser, _close_browser, browser_check_status
    from mcp_servers.browser.navigation import (
        browser_navigate,
        browser_navigate_back,
        browser_navigate_forward
    )
    from mcp_servers.browser.interaction import (
        browser_click,
        browser_hover,
        browser_type
    )
    from mcp_servers.browser.content import (
        browser_snapshot,
        browser_take_screenshot
    )
    from mcp_servers.browser.tabs import (
        browser_tab_list,
        browser_tab_new,
        browser_tab_close
    )
    from mcp_servers.browser.login import (
        browser_auto_login
    )
    from mcp_servers.browser.search import (
        browser_search
    )
    # 从utils.py导入_get_domain_from_url
    from mcp_servers.browser.utils import (
        _get_domain_from_url
    )


# 创建一个同步函数来关闭浏览器
def close_browser_sync():
    if _browser is not None:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(_close_browser())
        else:
            loop.run_until_complete(_close_browser())


# 注册退出处理函数
atexit.register(close_browser_sync)


# Entry point: run the MCP server when script is executed directly
if __name__ == "__main__":
    print("启动浏览器操作MCP服务器...")
    print("可用工具:")
    print("- browser_navigate: 导航到指定URL并获取页面内容")
    print("- browser_navigate_back: 返回上一页")
    print("- browser_navigate_forward: 前进到下一页")
    print("- browser_click: 点击元素")
    print("- browser_hover: 悬停在元素上")
    print("- browser_type: 在元素中输入文本")
    print("- browser_snapshot: 捕获页面的可访问性快照")
    print("- browser_take_screenshot: 截取页面截图")
    print("- browser_tab_list: 列出所有浏览器标签")
    print("- browser_tab_new: 打开新标签")
    print("- browser_tab_close: 关闭标签")
    print("- browser_auto_login: 自动登录到指定网站")
    print("- browser_search: 执行网络搜索并返回搜索结果及页面内容")
    print("- browser_check_status: 检查浏览器操作状态")
    mcp.run()