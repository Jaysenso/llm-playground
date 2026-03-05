from abc import ABC, abstractmethod
from typing import AsyncIterator
from app.core.types import Message

class LLMClient(ABC):
    @abstractmethod
    def stream_completion(
        self,
        system_prompt: str,
        messages: list[Message],
    ) -> AsyncIterator[str]:
        ...
