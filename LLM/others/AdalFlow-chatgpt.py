from adalflow.core import Generator
from adalflow.components.model_client.openai_client import OpenAIClient
from dotenv import load_dotenv
load_dotenv()


llm = Generator(
    model_client=OpenAIClient(),
    model_kwargs={
        "model": "gpt-4o-mini",
    }
)

prompt_kwargs = {"input_str": "What is LLM?"}

response = llm(prompt_kwargs=prompt_kwargs)  # or llm.call in eval and llm.forward in training
print(response)
