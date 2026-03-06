from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam
from typing import AsyncIterator, cast

from app.core.config import settings, app_config
from app.core.types import Message
from app.api.clients.base import LLMClient


class OpenRouterClient(LLMClient):
    def __init__(self):
        self.client = AsyncOpenAI(
            base_url=settings.OPENROUTER_BASE_URL,
            api_key=settings.OPENROUTER_API_KEY,
        )
        self.model_name = app_config.MODEL_NAME 
    
    async def stream_completion(
        self,
        system_prompt: str,
        messages: list[Message],
    ) ->  AsyncIterator[str]:  
        try:
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=cast(list[ChatCompletionMessageParam],           
                    [
                        {'role': 'system', 'content': system_prompt},
                        *[{'role': m.role, 'content': m.content} for m in messages]
                    ]),
                stream=True
            )

            async for chunk in response:
                if not chunk.choices:
                    continue
            
                content = chunk.choices[0].delta.content
                if content is not None:
                    yield content
                    
        except RuntimeError as e:
            raise RuntimeError(f"Ollama stream completion failed: {e}") from e

            
        
