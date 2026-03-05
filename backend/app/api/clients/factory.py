from app.api.clients import OpenRouterClient, OllamaClient
from app.api.clients.base import LLMClient
from app.core.config import app_config


def get_llm_client() -> LLMClient:
    match app_config.PROVIDER:
        case "openrouter":
            return OpenRouterClient()
        case "ollama":
            return OllamaClient()
        case _:
            raise ValueError(f"Unknown provider: {app_config.PROVIDER}")


