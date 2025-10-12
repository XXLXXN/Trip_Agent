"""
浏览器核心功能

提供浏览器实例管理、页面管理和状态管理等核心功能
"""

import asyncio
import importlib

from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

# 加载.env文件中的环境变量
load_dotenv()

# Initialize FastMCP server instance
mcp = FastMCP()

# 全局变量，用于存储浏览器实例和页面
_browser = None
_context = None
_pages = {}  # 存储页面的字典，键为页面ID，值为页面对象
_current_page_id = None  # 当前活动页面的ID
_data_ready = False  # 标记数据是否已准备好
_operation_in_progress = False  # 标记操作是否正在进行中
_login_in_progress = {}  # 存储每个页面是否正在进行登录操作的字典
_original_urls = {}  # 存储每个页面的原始URL，用于登录后重新导航


# 辅助函数，用于获取和设置全局变量
def get_pages():
    global _pages
    return _pages


def get_current_page_id():
    global _current_page_id
    return _current_page_id


def set_current_page_id(page_id):
    global _current_page_id
    _current_page_id = page_id


def add_page_to_pages(page_id, page):
    global _pages
    _pages[page_id] = page


def remove_page_from_pages(page_id):
    global _pages
    if page_id in _pages:
        del _pages[page_id]
        return True
    return False


# 检查必要的依赖是否已安装
def check_dependencies():
    missing_deps = []

    # 检查playwright
    try:
        importlib.import_module("playwright")
    except ImportError:
        missing_deps.append("playwright")

    return missing_deps


async def _ensure_browser():
    """确保浏览器已启动"""
    global _browser, _context

    if _browser is None:
        try:
            print("浏览器实例不存在，创建新的浏览器实例...")
            # 动态导入playwright，避免启动时的导入错误
            playwright_module = importlib.import_module("playwright.async_api")
            async_playwright = playwright_module.async_playwright

            playwright = await async_playwright().start()
            _browser = await playwright.chromium.launch(headless=True)
            _context = await _browser.new_context()
            print("成功创建新的浏览器实例和上下文")

            # 设置全局请求拦截器，用于检测重定向到登录页面的情况
            await _context.route("**/*", lambda route: route.continue_())
            print("已设置全局请求拦截器")
        except ImportError:
            print("导入playwright失败，请安装playwright")
            raise ImportError(
                "请安装playwright: pip install playwright，然后运行: playwright install"
            )
        except Exception as e:
            print(f"启动浏览器时发生错误: {str(e)}")
            raise Exception(f"启动浏览器时发生错误: {str(e)}")
    else:
        print("复用现有浏览器实例")


async def _ensure_page():
    """确保至少有一个页面打开，并返回当前页面"""
    global _pages, _current_page_id

    await _ensure_browser()

    if not _pages or _current_page_id not in _pages:
        print("没有可用的页面或当前页面ID无效，创建新页面...")
        # 确保_context已初始化
        if _context is None:
            print("浏览器上下文未初始化，重新初始化浏览器...")
            await _ensure_browser()

        # 此时_context应该已经初始化，但为了类型检查，我们再次验证
        if _context is not None:
            try:
                page = await _context.new_page()
                page_id = f"page_{len(_pages) + 1}"
                _pages[page_id] = page
                _current_page_id = page_id
                print(f"成功创建新页面，ID: {page_id}")

                # 设置页面导航事件监听器
                success = await _setup_navigation_handler(page)
                if success:
                    print("成功设置页面导航事件监听器")
                else:
                    print("设置页面导航事件监听器失败，但页面仍可使用")
            except Exception as e:
                print(f"创建新页面时发生错误: {str(e)}")
                raise Exception(f"创建新页面时发生错误: {str(e)}")
        else:
            print("无法初始化浏览器上下文")
            raise Exception("无法初始化浏览器上下文")
    else:
        print(f"复用现有页面，ID: {_current_page_id}")

    return _pages[_current_page_id]


async def _set_operation_status(in_progress=True):
    """设置操作状态"""
    global _operation_in_progress, _data_ready
    _operation_in_progress = in_progress
    if in_progress:
        _data_ready = False


async def _verify_data_ready():
    """验证数据是否已准备好"""
    global _data_ready
    _data_ready = True
    return _data_ready


async def _check_login_required(page):
    """检查页面是否需要登录"""
    try:
        # 首先检查URL是否包含登录相关关键词
        current_url = page.url.lower()
        url_keywords = [
            "login",
            "signin",
            "sign-in",
            "auth",
            "passport",
            "账号",
            "登录",
        ]
        for keyword in url_keywords:
            if keyword in current_url:
                print(f"URL中包含登录关键词: {keyword}")
                return True

        # 检查常见的登录元素
        login_selectors = [
            "input[name='username']",
            "input[name='account']",
            "input[name='email']",
            "input[name='user']",
            "input[type='password']",
            "input[name='password']",
            ".login-form",
            ".signin-form",
            ".auth-form",
            "#username",
            "#account",
            "#email",
            "#user",
            "#password",
            ".login-btn",
            ".signin-btn",
            ".auth-btn",
            "#login-btn",
            "#signin-btn",
            "#formsubmitButton",
            "button[type='submit']",
        ]

        for selector in login_selectors:
            element = await page.query_selector(selector)
            if element:
                print(f"检测到登录元素: {selector}")
                return True

        # 检查页面文本中是否包含登录相关词语
        content = await page.content()
        login_keywords = [
            "登录",
            "登陆",
            "login",
            "sign in",
            "signin",
            "sign-in",
            "用户名",
            "账号",
            "邮箱",
            "username",
            "account",
            "email",
            "密码",
            "password",
            "验证码",
            "captcha",
            "verification",
            "忘记密码",
            "forgot password",
            "remember me",
            "记住我",
            "注册账号",
            "create account",
            "sign up",
            "注册",
        ]
        for keyword in login_keywords:
            if keyword.lower() in content.lower():
                print(f"页面内容包含登录关键词: {keyword}")
                return True

        return False
    except Exception as e:
        print(f"检查登录页面时发生错误: {str(e)}")
        return False


async def _close_browser():
    """关闭浏览器"""
    global \
        _browser, \
        _context, \
        _pages, \
        _current_page_id, \
        _data_ready, \
        _operation_in_progress, \
        _login_in_progress, \
        _original_urls

    if _browser:
        for page_id in list(_pages.keys()):
            if _pages[page_id]:
                await _pages[page_id].close()

        _pages = {}
        _current_page_id = None
        _data_ready = False
        _operation_in_progress = False
        _login_in_progress = {}  # 清理登录状态字典
        _original_urls = {}  # 清理原始URL字典

        if _context:
            await _context.close()

        await _browser.close()
        _browser = None
        _context = None


# 添加辅助函数来管理页面
def add_page(page, url="about:blank"):
    """添加新页面并设置为当前页面"""
    global _pages, _current_page_id

    page_id = f"page_{len(_pages) + 1}"
    _pages[page_id] = page
    _current_page_id = page_id

    return page_id


def remove_page(page_id):
    """移除指定页面"""
    global _pages, _current_page_id

    if page_id in _pages:
        # 注意：这里不再使用await关键字，调用者需要自己处理页面关闭
        # _pages[page_id].close() 需要在调用者中使用await关键字
        del _pages[page_id]

        # 如果关闭的是当前页面，则切换到另一个页面
        if page_id == _current_page_id:
            if _pages:
                _current_page_id = next(iter(_pages))
            else:
                _current_page_id = None

        return True

    return False


async def _setup_navigation_handler(page):
    """设置页面导航事件监听器，用于检测页面跳转到登录页面的情况"""
    global _login_in_progress

    # 初始化该页面的登录状态
    page_id = next((id for id, p in _pages.items() if p == page), None)
    if page_id:
        _login_in_progress[page_id] = False

    try:
        # 添加检查并处理登录的函数
        async def check_and_handle_login():
            # 这里是登录处理逻辑，暂时留空
            # 在login.py中实现具体的登录处理逻辑
            pass

        # 添加页面导航事件监听器
        async def handle_frame_navigated(frame):
            # 只处理主框架的导航
            if frame == page.main_frame:
                # 等待页面稳定
                await asyncio.sleep(1)
                await check_and_handle_login()

        # 添加页面加载完成事件监听器
        async def handle_load():
            await check_and_handle_login()

        # 设置请求拦截器，用于监控重定向
        async def handle_route(route):
            # 继续处理请求
            await route.continue_()

        # 监听页面导航和加载事件
        page.on("framenavigated", handle_frame_navigated)
        page.on("load", handle_load)

        # 设置请求拦截器
        await page.route("**/*", handle_route)

        return True
    except Exception as e:
        print(f"设置页面导航事件监听器时发生错误: {str(e)}")
        return False


# 创建一个同步函数来关闭浏览器
def close_browser_sync():
    global _operation_in_progress, _data_ready
    if _browser is not None:
        _operation_in_progress = False
        _data_ready = False
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(_close_browser())
        else:
            loop.run_until_complete(_close_browser())


# 注册退出处理函数
import atexit

atexit.register(close_browser_sync)


# 添加一个工具来检查操作状态
@mcp.tool(description="检查浏览器操作状态")
async def browser_check_status():
    """
    检查浏览器操作状态，确认数据是否已准备就绪
    """
    global _operation_in_progress, _data_ready

    try:
        if _browser is None:
            return {
                "browser_initialized": False,
                "operation_in_progress": False,
                "data_ready": False,
                "message": "浏览器尚未初始化",
            }

        return {
            "browser_initialized": True,
            "operation_in_progress": _operation_in_progress,
            "data_ready": _data_ready,
            "active_pages": len(_pages),
            "message": "数据已准备就绪"
            if _data_ready
            else "操作正在进行中，数据尚未准备就绪",
        }
    except Exception as e:
        return f"检查浏览器状态时发生错误: {str(e)}"
