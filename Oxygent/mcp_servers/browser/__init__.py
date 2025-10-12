"""
MCP Server for Browser Operations

This package provides browser automation tools that can be invoked by an agent.
It includes tools for navigating web pages, interacting with elements,
capturing screenshots, managing browser tabs, and automatic login capabilities
using the Playwright framework.
"""

from .content import browser_snapshot, browser_take_screenshot
from .core import browser_check_status, check_dependencies, mcp
from .interaction import browser_click, browser_hover, browser_type
from .login import browser_auto_login
from .navigation import (
    browser_navigate,
    browser_navigate_back,
    browser_navigate_forward,
)
from .search import browser_search
from .tabs import browser_tab_close, browser_tab_list, browser_tab_new

# 导出所有工具函数，方便导入
__all__ = [
    "mcp",
    "check_dependencies",
    "browser_navigate",
    "browser_navigate_back",
    "browser_navigate_forward",
    "browser_click",
    "browser_hover",
    "browser_type",
    "browser_snapshot",
    "browser_take_screenshot",
    "browser_tab_list",
    "browser_tab_new",
    "browser_tab_close",
    "browser_auto_login",
    "browser_search",
    "browser_check_status",
]
