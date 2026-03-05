from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai.types.chat import ChatCompletionMessageParam
from contextlib import asynccontextmanager
from pydantic import BaseModel

from app.core.logger import logger
from app.api.services.chat_service import chat_service
from app.api.v1.api import api_router

   
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup: Initializing resources...")
    yield
    logger.info("Application shutdown: Cleaning up resources...")
    
    
app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {"server status:": "health"}


