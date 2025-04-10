# api/config/environments.py

"""
Environment configuration schema for the FastAPI application.
Defines settings that can be overridden via .env or environment variables.
Can be driven by settings.py if imported, with minimal defaults.
"""

import os
from typing import Literal, Optional, Dict
from pydantic_settings import BaseSettings, Field

# ----------------------------------------------------------------------------
# Dynamic .env File Selector
# ----------------------------------------------------------------------------
# Supports .env, .env-fastapi, or custom files via ENV_FILE.

def get_env_file():
    return os.getenv("ENV_FILE", ".env")

# ----------------------------------------------------------------------------
# Base Configuration Schema
# ----------------------------------------------------------------------------
# Shared settings schema with minimal defaults, overridable via .env or settings.py.

class BaseConfig(BaseSettings):
    # Application Info
    app_name: str = Field(env="APP_NAME")  # Required unless set in settings.py
    app_version: str = Field(env="APP_VERSION")  # Required unless set in settings.py
    environment: Literal["local", "production"] = Field(default="local", env="ENVIRONMENT")

    # Debugging & Logging
    debug: bool = Field(default=False, env="DEBUG")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")

    # API Server Options
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    reload: bool = Field(default=False, env="RELOAD")
    workers: int = Field(default=1, env="WORKERS")

    # FastAPI Documentation
    enable_api_docs: bool = Field(default=True, env="ENABLE_API_DOCS")
    docs_url: Optional[str] = Field(default="/docs", env="DOCS_URL")
    redoc_url: Optional[str] = Field(default="/redoc", env="REDOC_URL")
    openapi_url: Optional[str] = Field(default="/openapi.json", env="OPENAPI_URL")

    # Contact Metadata
    contact: Dict[str, str] = Field(
        default_factory=lambda: {
            "name": os.getenv("CONTACT_NAME", "NextAI Dev Team"),
            "email": os.getenv("CONTACT_EMAIL", "infor@project.ai")
        },
        env="CONTACT"
    )

    class Config:
        env_file = get_env_file()
        env_file_encoding = "utf-8"
        case_sensitive = False

# ----------------------------------------------------------------------------
# Local Environment Configuration
# ----------------------------------------------------------------------------
# Minimal overrides, relies on .env or settings.py.

class LocalConfig(BaseConfig):
    environment: Literal["local"] = "local"

# ----------------------------------------------------------------------------
# Production Environment Configuration
# ----------------------------------------------------------------------------
# Minimal overrides, relies on .env or settings.py.

class ProductionConfig(BaseConfig):
    environment: Literal["production"] = "production"
