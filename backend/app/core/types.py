
from pydantic import BaseModel
from typing import Literal

Role = Literal['user', 'assistant', 'tool', 'function']

class Message(BaseModel):
    id: str
    role: Role
    content: str