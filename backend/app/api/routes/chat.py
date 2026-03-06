from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.api.services.chat_service import chat_service
from app.core.config import app_config
from app.core.types import Message

class ChatResponse(BaseModel):
    content: str

router = APIRouter(prefix="/chat", tags=['chat'])

@router.post("")
async def chat(http_request: Request, request: list[Message]):

    async def stream_with_disconnect_check():
        async for chunk in chat_service.stream_reply(messages=request):
            if await http_request.is_disconnected():
                break
            yield chunk

    return StreamingResponse(
            stream_with_disconnect_check(),
            media_type="text/plain",
            headers={
                "X-Model-Name": app_config.MODEL_NAME,
                "X-Provider": app_config.PROVIDER,
            }
        )
