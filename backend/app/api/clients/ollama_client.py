from typing import AsyncIterator
from ollama import chat

from app.core.types import Message
from app.api.clients.base import LLMClient
from app.core.config import app_config


class OllamaClient(LLMClient):

    async def stream_completion(
        self,
        system_prompt:str,  
        messages: list[Message]
        ) -> AsyncIterator[str]:
        try:
            stream = chat(
                model=app_config.MODEL_NAME,
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    *[{'role': m.role, 'content': m.content}
                            for m in messages]
                    ],
                think=False,
                stream=True
            )

            for chunk in stream:
                yield chunk['message']['content']
        except Exception as e:
            raise RuntimeError(f"Ollama stream completion failed: {e}") from e