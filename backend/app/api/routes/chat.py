from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.api.services.chat_service import chat_service
from app.core.config import app_config
from app.core.types import Message

class ChatResponse(BaseModel):
    content: str
   
router = APIRouter(prefix="/chat", tags=['chat'])

@router.post("")
async def chat(request: list[Message]):
    
    return StreamingResponse(
            chat_service.stream_reply(messages=request),
            media_type="text/plain",
            headers={
                "X-Model-Name": app_config.MODEL_NAME,
                "X-Provider": app_config.PROVIDER,
            }
        )
