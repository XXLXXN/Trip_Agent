"""
浏览器导航功能

提供页面导航、前进和后退等功能
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
from .utils import _get_domain_from_url


@mcp.tool(description="导航到指定URL并获取页面内容")
async def browser_navigate(
    url: str = Field(description="要导航到的网页URL"),
    wait_until: str = Field(
        default="load",
        description="等待页面加载的条件，可选值: 'load', 'domcontentloaded', 'networkidle'",
    ),
    extract_content: bool = Field(default=True, description="是否提取页面内容"),
):
    """
    导航到指定的URL，等待页面加载完成，并自动提取页面主要内容
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()

        # 验证wait_until参数
        valid_wait_options = ["load", "domcontentloaded", "networkidle"]
        if wait_until not in valid_wait_options:
            wait_until = "load"

        # 保存原始请求的URL
        original_request_url = url

        # 导航到URL
        response = await page.goto(url, wait_until=wait_until)

        # 等待页面稳定
        await asyncio.sleep(1)

        # 获取页面ID
        from .core import _login_in_progress, _original_urls, _pages

        page_id = next((id for id, p in _pages.items() if p == page), None)

        # 检测是否发生了重定向
        current_url = page.url
        if current_url != original_request_url:
            print(f"检测到页面重定向: {original_request_url} -> {current_url}")

            # 判断重定向后的页面是否是登录页面
            from .core import _check_login_required

            is_login_page = await _check_login_required(page)
            if is_login_page:
                print("重定向后的页面是登录页面，尝试自动登录...")

                # 保存原始请求的URL（用于登录后重新导航）
                if page_id:
                    _original_urls[page_id] = original_request_url
                    print(f"保存原始请求URL: {original_request_url}")
        else:
            # 如果没有重定向，也保存原始URL
            if page_id:
                _original_urls[page_id] = url

        # 获取当前页面的域名
        current_domain = await _get_domain_from_url(page.url)

        # 检查页面是否需要登录（不再限制只检查配置的域名）
        if page_id and not _login_in_progress.get(page_id, False):
            # 再次检查当前页面是否是登录页面（可能在重定向检测时已经检查过，但为了确保，这里再检查一次）
            from .core import _check_login_required

            if await _check_login_required(page):
                print("检测到需要登录，尝试自动登录...")

                # 标记该页面正在处理登录
                _login_in_progress[page_id] = True

                try:
                    # 优先使用域名特定配置进行登录
                    login_success = False
                    from .login import (
                        LOGIN_DOMAIN_CONFIGS,
                        _auto_login_jd,
                        _auto_login_with_config,
                        _detect_2fa_required,
                        _handle_2fa_authentication,
                    )

                    if current_domain in LOGIN_DOMAIN_CONFIGS:
                        print(f"使用域名 {current_domain} 的特定配置进行登录")
                        login_success = await _auto_login_jd(page)
                    else:
                        # 尝试通用登录方法
                        print("使用通用登录方法")
                        login_success = await _auto_login_with_config(page)

                    if login_success:
                        print("自动登录成功")
                        # 等待页面加载完成
                        await asyncio.sleep(2)

                        # 检查是否需要二次认证
                        needs_2fa = await _detect_2fa_required(page)
                        if needs_2fa:
                            print("检测到需要二次认证")
                            # 处理二次认证
                            auth_result = await _handle_2fa_authentication(
                                page, wait_for_2fa=True
                            )
                            print(f"二次认证处理结果: {auth_result}")

                        # 检查登录后页面是否自动重定向到了其他页面
                        login_redirect_url = page.url
                        if login_redirect_url != current_url:
                            print(f"登录后页面自动重定向到: {login_redirect_url}")

                        # 如果有原始URL，则重新导航到该URL
                        if (
                            page_id in _original_urls
                            and _original_urls[page_id] != page.url
                        ):
                            original_url = _original_urls[page_id]
                            print(f"重新导航到原始URL: {original_url}")
                            try:
                                await page.goto(original_url, wait_until="load")
                                # 等待页面加载完成
                                await asyncio.sleep(2)

                                # 检查导航后的URL，可能会有进一步的重定向
                                final_url = page.url
                                if final_url != original_url:
                                    print(f"导航到原始URL后被重定向到: {final_url}")

                                # 验证是否成功导航（即使有重定向也可能是成功的）
                                if (
                                    final_url == original_url
                                    or final_url.startswith(original_url)
                                    or not await _check_login_required(page)
                                ):
                                    print(f"成功访问目标页面: {final_url}")
                                    # 清除原始URL
                                    del _original_urls[page_id]
                                else:
                                    print(
                                        "导航到原始URL后页面仍然需要登录，可能需要不同的登录方式"
                                    )

                                    # 检查重定向后的页面是否仍然需要登录
                                    if await _check_login_required(page):
                                        print("尝试对重定向后的页面进行登录...")
                                        # 尝试对重定向后的页面进行登录
                                        redirect_domain = await _get_domain_from_url(
                                            final_url
                                        )
                                        second_login_success = False

                                        if redirect_domain in LOGIN_DOMAIN_CONFIGS:
                                            print(
                                                f"使用域名 {redirect_domain} 的特定配置进行登录"
                                            )
                                            second_login_success = await _auto_login_jd(
                                                page
                                            )
                                        else:
                                            print("使用通用登录方法")
                                            second_login_success = (
                                                await _auto_login_with_config(page)
                                            )

                                        if second_login_success:
                                            print("重定向页面登录成功")
                                            # 清除原始URL，因为已经成功登录
                                            if page_id in _original_urls:
                                                del _original_urls[page_id]
                                        else:
                                            print("重定向页面登录失败")
                                    else:
                                        print("重定向后的页面不需要登录，继续访问")
                                        # 清除原始URL，因为已经成功访问
                                        if page_id in _original_urls:
                                            del _original_urls[page_id]
                            except Exception as e:
                                print(
                                    f"导航到原始URL时发生错误: {str(e)}，保留原始URL记录"
                                )
                    else:
                        print("自动登录失败")
                finally:
                    # 无论登录成功与否，都标记登录处理完成
                    _login_in_progress[page_id] = False

        # 检查页面是否需要二次认证（无论是否已经登录）
        from .login import _detect_2fa_required, _handle_2fa_authentication

        needs_2fa = await _detect_2fa_required(page)
        auth_result = None
        if needs_2fa:
            print("导航后检测到需要二次认证")
            # 处理二次认证
            auth_result = await _handle_2fa_authentication(page, wait_for_2fa=True)
            print(f"二次认证处理结果: {auth_result}")

            # 检查二次认证状态
            auth_status = auth_result.get("status", "")
            if auth_status == "pending_2fa":
                print("需要用户完成二次认证，已保存截图")
                # 等待一段时间，让用户有机会查看截图
                await asyncio.sleep(2)
            elif auth_status == "success":
                print("二次认证处理成功")
                # 等待页面可能的变化
                await asyncio.sleep(2)
            else:
                print(f"二次认证处理状态: {auth_status}")

        # 获取页面信息
        page_info = {}
        if extract_content:
            # 获取页面标题
            page_info["title"] = await page.title()

            # 获取页面URL（可能因重定向而改变）
            page_info["url"] = page.url

            # 提取页面主要内容
            try:
                # 提取页面文本内容
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
                    page_info["content"] = page_text[:3000] + "...(内容已截断)"
                else:
                    page_info["content"] = page_text

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
                page_info["metadata"] = {}
                for key in important_meta:
                    if key in meta_data:
                        page_info["metadata"][key] = meta_data[key]

                # 提取页面上的主要链接
                links = await page.evaluate("""() => {
                    const mainLinks = [];
                    const links = document.querySelectorAll('a');
                    
                    // 只获取前10个重要链接
                    let count = 0;
                    for (const link of links) {
                        if (count >= 10) break;
                        
                        const href = link.getAttribute('href');
                        const text = link.innerText.trim();
                        
                        // 过滤掉空链接和无文本链接
                        if (href && text && href !== '#' && !href.startsWith('javascript:')) {
                            mainLinks.push({ text, href });
                            count++;
                        }
                    }
                    
                    return mainLinks;
                }""")

                page_info["main_links"] = links

            except Exception as content_error:
                page_info["content_error"] = (
                    f"提取页面内容时发生错误: {str(content_error)}"
                )

        await _verify_data_ready()

        if response:
            result = {
                "status": "success",
                "status_code": response.status,
                "url": url,
                "final_url": page.url,
                "message": f"成功导航到 {url}，状态码: {response.status}，数据已准备就绪",
            }

            # 如果提取了页面内容，则添加到结果中
            if extract_content and page_info:
                result["page_info"] = page_info

            # 如果检测到并处理了二次认证，添加到结果中
            if needs_2fa:
                result["two_factor_auth"] = True
                # 安全地获取auth_result变量
                auth_result_var = locals().get("auth_result", None)
                if auth_result_var and isinstance(auth_result_var, dict):
                    result["two_factor_auth_status"] = auth_result_var.get(
                        "status", "unknown"
                    )
                    result["two_factor_auth_message"] = auth_result_var.get(
                        "message", ""
                    )
                    if "screenshot_path" in auth_result_var:
                        result["auth_screenshot_path"] = auth_result_var.get(
                            "screenshot_path", ""
                        )
                    if "action_required" in auth_result_var:
                        result["action_required"] = auth_result_var.get(
                            "action_required", ""
                        )

            await _set_operation_status(False)
            return result
        else:
            await _set_operation_status(False)
            return {
                "status": "error",
                "url": url,
                "message": f"导航到 {url} 失败，未收到响应",
            }
    except Exception as e:
        await _set_operation_status(False)
        return {
            "status": "error",
            "url": url,
            "message": f"导航到 {url} 时发生错误: {str(e)}",
        }


@mcp.tool(description="返回上一页")
async def browser_navigate_back():
    """
    返回浏览器历史记录中的上一页
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()
        await page.go_back()

        # 等待页面稳定
        await asyncio.sleep(1)
        await _verify_data_ready()

        await _set_operation_status(False)
        return "成功返回上一页，数据已准备就绪"
    except Exception as e:
        await _set_operation_status(False)
        return f"返回上一页时发生错误: {str(e)}"


@mcp.tool(description="前进到下一页")
async def browser_navigate_forward():
    """
    前进到浏览器历史记录中的下一页
    """
    # 检查依赖
    missing_deps = check_dependencies()
    if missing_deps:
        return f"缺少必要的库: {', '.join(missing_deps)}。请使用pip安装: pip install {' '.join(missing_deps)}"

    try:
        await _set_operation_status(True)
        page = await _ensure_page()
        await page.go_forward()

        # 等待页面稳定
        await asyncio.sleep(1)
        await _verify_data_ready()

        await _set_operation_status(False)
        return "成功前进到下一页，数据已准备就绪"
    except Exception as e:
        await _set_operation_status(False)
        return f"前进到下一页时发生错误: {str(e)}"
