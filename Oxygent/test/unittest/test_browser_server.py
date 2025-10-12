"""
测试浏览器服务器模块

这个测试模块用于验证浏览器服务器模块的导入和基本功能是否正常工作。
"""

import importlib.util
import os
import sys
import unittest
from unittest.mock import MagicMock, patch


class TestBrowserServer(unittest.TestCase):
    """测试browser/server.py的导入和基本功能"""

    def test_server_imports(self):
        """测试server.py能否正确导入所有依赖"""
        # 获取server.py的绝对路径
        server_path = os.path.abspath(
            os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "mcp_servers/browser/server.py",
            )
        )

        # 检查文件是否存在
        self.assertTrue(
            os.path.exists(server_path), f"server.py文件不存在: {server_path}"
        )

        # 模拟FastMCP类，避免实际运行MCP服务器
        with patch("mcp.server.fastmcp.FastMCP") as mock_fastmcp:
            # 模拟mcp实例
            mock_mcp = MagicMock()
            mock_fastmcp.return_value = mock_mcp

            # 模拟playwright模块
            sys.modules["playwright"] = MagicMock()
            sys.modules["playwright.async_api"] = MagicMock()

            # 尝试导入模块
            try:
                spec = importlib.util.spec_from_file_location("server", server_path)
                if spec is None:
                    self.fail(f"无法为文件创建模块规范: {server_path}")
                server_module = importlib.util.module_from_spec(spec)
                if spec.loader is None:
                    self.fail(f"模块规范没有加载器: {server_path}")
                spec.loader.exec_module(server_module)

                # 检查关键函数是否存在
                self.assertTrue(
                    hasattr(server_module, "close_browser_sync"),
                    "close_browser_sync函数不存在",
                )

                # 检查是否成功导入了所有必要的函数
                required_functions = [
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
                    "_get_domain_from_url",
                ]

                for func in required_functions:
                    self.assertTrue(hasattr(server_module, func), f"{func}函数不存在")

            except Exception as e:
                self.fail(f"导入server.py时发生错误: {str(e)}")

            # 清理模拟模块
            if "playwright" in sys.modules:
                del sys.modules["playwright"]
            if "playwright.async_api" in sys.modules:
                del sys.modules["playwright.async_api"]

    def test_browser_demo_imports(self):
        """测试browser_demo.py能否正确导入所有依赖"""
        # 获取browser_demo.py的绝对路径
        demo_path = os.path.abspath(
            os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "examples/agents/browser_demo.py",
            )
        )

        # 检查文件是否存在
        self.assertTrue(
            os.path.exists(demo_path), f"browser_demo.py文件不存在: {demo_path}"
        )

        # 模拟必要的依赖
        with (
            patch("oxygent.MAS") as mock_mas,
            patch("oxygent.Config") as mock_config,
            patch("oxygent.oxy") as mock_oxy,
            patch("asyncio.run") as mock_run,
        ):
            # 模拟环境变量
            env_vars = {
                "DEFAULT_LLM_API_KEY": "test_api_key",
                "DEFAULT_LLM_BASE_URL": "https://test.api.com",
                "DEFAULT_LLM_MODEL_NAME": "test_model",
            }

            with patch.dict(os.environ, env_vars):
                # 尝试导入模块
                try:
                    spec = importlib.util.spec_from_file_location(
                        "browser_demo", demo_path
                    )
                    if spec is None:
                        self.fail(f"无法为文件创建模块规范: {demo_path}")
                    demo_module = importlib.util.module_from_spec(spec)
                    if spec.loader is None:
                        self.fail(f"模块规范没有加载器: {demo_path}")
                    spec.loader.exec_module(demo_module)

                    # 检查关键类是否存在
                    self.assertTrue(
                        hasattr(demo_module, "BrowserDemo"), "BrowserDemo类不存在"
                    )
                    self.assertTrue(hasattr(demo_module, "main"), "main函数不存在")

                    # 检查BrowserDemo类的关键方法
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "__init__"),
                        "__init__方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "run_demo"),
                        "run_demo方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "_create_oxy_space"),
                        "_create_oxy_space方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "_create_browser_tools"),
                        "_create_browser_tools方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "_create_http_llm"),
                        "_create_http_llm方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "_create_filesystem_tools"),
                        "_create_filesystem_tools方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "_create_browser_agent"),
                        "_create_browser_agent方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "_create_file_agent"),
                        "_create_file_agent方法不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module.BrowserDemo, "_create_master_agent"),
                        "_create_master_agent方法不存在",
                    )

                    # 测试load_config函数
                    self.assertTrue(
                        hasattr(demo_module, "load_config"), "load_config函数不存在"
                    )

                    # 测试系统提示词常量
                    self.assertTrue(
                        hasattr(demo_module, "MASTER_SYSTEM_PROMPT"),
                        "MASTER_SYSTEM_PROMPT常量不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module, "BROWSER_SYSTEM_PROMPT"),
                        "BROWSER_SYSTEM_PROMPT常量不存在",
                    )
                    self.assertTrue(
                        hasattr(demo_module, "FILE_SYSTEM_PROMPT"),
                        "FILE_SYSTEM_PROMPT常量不存在",
                    )

                except Exception as e:
                    self.fail(f"导入browser_demo.py时发生错误: {str(e)}")

    def test_browser_demo_initialization(self):
        """测试BrowserDemo类的初始化功能"""
        # 获取browser_demo.py的绝对路径
        demo_path = os.path.abspath(
            os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "examples/agents/browser_demo.py",
            )
        )

        # 模拟必要的依赖
        with (
            patch("oxygent.MAS") as mock_mas,
            patch("oxygent.Config") as mock_config,
            patch("oxygent.oxy") as mock_oxy,
        ):
            # 模拟环境变量
            env_vars = {
                "DEFAULT_LLM_API_KEY": "test_api_key",
                "DEFAULT_LLM_BASE_URL": "https://test.api.com",
                "DEFAULT_LLM_MODEL_NAME": "test_model",
            }

            with patch.dict(os.environ, env_vars):
                # 导入模块
                spec = importlib.util.spec_from_file_location("browser_demo", demo_path)
                if spec is None:
                    self.fail(f"无法为文件创建模块规范: {demo_path}")
                demo_module = importlib.util.module_from_spec(spec)
                if spec.loader is None:
                    self.fail(f"模块规范没有加载器: {demo_path}")
                spec.loader.exec_module(demo_module)

                # 模拟BrowserDemo类的方法
                with patch.object(
                    demo_module.BrowserDemo, "_create_oxy_space", return_value=[]
                ) as mock_create_oxy_space:
                    # 初始化BrowserDemo实例
                    try:
                        browser_demo = demo_module.BrowserDemo()

                        # 验证初始化是否成功
                        self.assertIsNotNone(browser_demo)
                        self.assertEqual(
                            browser_demo.config["DEFAULT_LLM_API_KEY"], "test_api_key"
                        )
                        self.assertEqual(
                            browser_demo.config["DEFAULT_LLM_BASE_URL"],
                            "https://test.api.com",
                        )
                        self.assertEqual(
                            browser_demo.config["DEFAULT_LLM_MODEL_NAME"], "test_model"
                        )

                        # 验证方法调用
                        mock_create_oxy_space.assert_called_once()
                        mock_config.set_agent_llm_model.assert_called_once_with(
                            "default_llm"
                        )

                    except Exception as e:
                        self.fail(f"初始化BrowserDemo实例时发生错误: {str(e)}")


if __name__ == "__main__":
    unittest.main()
