from fastapi import APIRouter
from app.api.clients.factory import get_llm_client
from app.api.clients.base import LLMClient
from app.core.types import Message
from app.core.prompts import CHAT_SYSTEM
from typing import AsyncIterator

router = APIRouter(prefix="/chat", tags=['chat'])

class ChatService:
    
    def __init__(self, client: LLMClient | None = None):
        self.client = client or get_llm_client()
        
    async def stream_reply(
        self,
        messages: list[Message],
    ) -> AsyncIterator[str]:
        
        async for chunk in self.client.stream_completion(
            system_prompt=CHAT_SYSTEM,
            messages=messages,
        ):
            yield chunk
        
        
chat_service = ChatService()
        
        
        