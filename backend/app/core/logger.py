import logging
import sys
from app.core.config import app_config

def setup_logger(name: str = "app") -> logging.Logger:
    
    logger = logging.getLogger(name)
    
    if logger.handlers:
        return logger
    
    
    logger.setLevel(logging.DEBUG if app_config.DEBUG else logging.INFO)
    
    # format
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger

# instantiate once
logger = setup_logger()

