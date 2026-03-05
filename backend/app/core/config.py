from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv
from pathlib import Path
import yaml

load_dotenv()

# load yaml
ROOT_DIR = Path(__file__).parents[2]

with open(ROOT_DIR / "config.yaml") as f:
    yaml_config = yaml.safe_load(f)
    
class Settings(BaseSettings):

    # External services
    OPENROUTER_BASE_URL: str = Field(...,description="Openrouter Base URL String")
    OPENROUTER_API_KEY: str = Field(...,description="Openrouter API key")

# config from yaml
class AppConfig:
    DEBUG: bool = yaml_config["app"]["debug"]
    ENVIRONMENT: str = yaml_config["app"]["environment"]
    PROVIDER: str = yaml_config["app"]["provider"]
    MAX_TOKENS: int = yaml_config["model"]["max_tokens"]
    TEMPERATURE: float = yaml_config["model"]["temperature"]

    @property
    def MODEL_NAME(self) -> str:
        return yaml_config["providers"][self.PROVIDER]["model_name"]
    
settings = Settings() #type: ignore
app_config = AppConfig()