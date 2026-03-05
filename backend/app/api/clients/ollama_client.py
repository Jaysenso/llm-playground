from typing import AsyncIterator
from openai.types.chat import ChatCompletionMessageParam
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
        