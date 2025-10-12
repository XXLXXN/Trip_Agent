"""Chat agent module for conversational interactions.

This module provides the ChatAgent class, which handles conversational AI interactions
by managing conversation memory, processing user queries, and coordinating with language
models to generate responses.
"""

from pydantic import model_validator

from ...schemas import Memory, Message, OxyRequest, OxyResponse
from .local_agent import LocalAgent


class ChatAgent(LocalAgent):
    """A conversational agent that manages chat interactions with language models."""

    def __init__(self, **kwargs):
        """Initialize the Chat agent with appropriate prompt and parsing function."""
        super().__init__(**kwargs)

    @model_validator(mode="after")
    def set_default_prompt(self):
        if not self.prompt:
            self.prompt = "You are a helpful assistant."
        return self

    async def _execute(self, oxy_request: OxyRequest) -> OxyResponse:
        """Execute a chat interaction with the language model.

        Args:
            oxy_request (OxyRequest): The request object containing the user's
                query, conversation history, and any additional parameters.

        Returns:
            OxyResponse: The response from the language model containing the
                generated answer to the user's query.
        """

        temp_memory = Memory()
        temp_memory.add_message(
            Message.system_message(self._build_instruction(oxy_request.arguments))
        )

        # Load short-term memory (recent conversation history)
        temp_memory.add_messages(
            Message.dict_list_to_messages(oxy_request.get_short_memory())
        )

        # Add the current user query to continue the multi-turn conversation
        temp_memory.add_message(Message.user_message(oxy_request.get_query()))

        # Prepare arguments for the language model call
        arguments = {
            "messages": temp_memory.to_dict_list(
                short_memory_size=self.short_memory_size
            )
        }
        llm_params = oxy_request.arguments.get("llm_params", dict())
        arguments.update(llm_params)

        return await oxy_request.call(callee=self.llm_model, arguments=arguments)
