"""Streamable-HTTP MCP client implementation."""

import logging
from typing import Any, List

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from pydantic import AnyUrl, Field

from ...utils.common_utils import build_url
from .base_mcp_client import BaseMCPClient

logger = logging.getLogger(__name__)


class StreamableMCPClient(BaseMCPClient):
    """MCP client implementation using Streamable-HTTP transport."""

    server_url: AnyUrl = Field("")
    middlewares: List[Any] = Field(
        default_factory=list, description="Client-side MCP middlewares"
    )

    async def init(self, is_fetch_tools=True) -> None:
        """Initialize the HTTP streaming connection to the MCP server."""
        try:
            if not self.is_dynamic_headers and self.is_keep_alive:
                self._http_transport = await self._exit_stack.enter_async_context(
                    streamablehttp_client(
                        build_url(self.server_url), headers=self.headers
                    )
                )
                read, write, _ = self._http_transport

                self._session = await self._exit_stack.enter_async_context(
                    ClientSession(read, write)
                )

                for mw in self.middlewares:
                    if hasattr(self._session, "add_middleware"):
                        self._session.add_middleware(mw)
                    else:
                        logger.warning("middleware %s is ignored", mw)

                await self._session.initialize()
                if is_fetch_tools:
                    await self.list_tools()
            else:
                async with streamablehttp_client(
                    build_url(self.server_url), headers=self.headers
                ) as (
                    read,
                    write,
                    _,
                ):
                    async with ClientSession(read, write) as session:
                        await session.initialize()
                        tools_response = await session.list_tools()
                        self.add_tools(tools_response)
        except Exception as e:
            logger.error("Error initializing server %s: %s", self.name, e)
            await self.cleanup()
            raise Exception(f"Server {self.name} error") from e

    async def call_tool(self, tool_name, arguments, headers=None):
        async with streamablehttp_client(
            build_url(self.server_url), headers=headers
        ) as (
            read,
            write,
            _,
        ):
            async with ClientSession(read, write) as session:
                await session.initialize()
                return await session.call_tool(tool_name, arguments)
