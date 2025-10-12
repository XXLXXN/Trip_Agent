"""Chat agent module for conversational interactions.

This module provides the ChatAgent class, which handles conversational AI interactions
by managing conversation memory, processing user queries, and coordinating with language
models to generate responses.
"""

from typing import Callable

from pydantic import Field, model_validator

from ...schemas.oxy import OxyRequest
from .chat_agent import ChatAgent


class RAGAgent(ChatAgent):
    """A conversational agent that manages chat interactions with language models."""

    knowledge_placeholder: str = Field("knowledge")

    func_retrieve_knowledge: Callable = Field(
        exclude=True, description="Retrieve knowledge function"
    )

    def __init__(self, **kwargs):
        """Initialize the RAG agent with appropriate prompt and parsing function."""
        super().__init__(**kwargs)

    @model_validator(mode="after")
    def set_default_prompt(self):
        if not self.prompt:
            self.prompt = (
                "You are a helpful assistant. You can refer to the following information to answer the questions.\n${"
                + self.knowledge_placeholder
                + "}"
            )
        return self

    async def _pre_process(self, oxy_request: OxyRequest) -> OxyRequest:
        oxy_request = await super()._pre_process(oxy_request)
        knowledge = await self.func_retrieve_knowledge(oxy_request)
        oxy_request.arguments[self.knowledge_placeholder] = knowledge
        return oxy_request
