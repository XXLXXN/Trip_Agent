"""
浏览器工具辅助函数

提供状态检查和通用工具函数
"""

from urllib.parse import urlparse


async def _get_domain_from_url(url):
    """从URL中提取域名"""
    try:
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()
        return domain
    except:
        return ""


# 函数已移至core.py文件
