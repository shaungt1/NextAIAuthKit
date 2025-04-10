# api/config/settings.py

"""
Central configuration module for the FastAPI application, styled like Django's settings.py.
Settings can be manually defined here or overridden via .env/.env-fastapi using os.getenv().
Manual assignments (e.g., APP_NAME = "New AI App") take precedence over .env defaults.
"""

import os

# ----------------------------------------------------------------------------
# Dynamic .env File Selector
# ----------------------------------------------------------------------------
# Allows using .env, .env-fastapi, or another file specified by ENV_FILE.

ENV_FILE = os.getenv("ENV_FILE", ".env")  # Can be .env-fastapi or custom

# ----------------------------------------------------------------------------
# Application Identity and Metadata
# ----------------------------------------------------------------------------
# Define core app settings manually here; .env overrides defaults if not set.

# Custom server name for OpenAPI docs to replace "default"
OPENAPI_SERVER_NAME = "AI API Service Server"
OPENAPI_SERVER_NAME = os.getenv("OPENAPI_SERVER_NAME", OPENAPI_SERVER_NAME)

APP_NAME = "FastAPI AI Service"
APP_NAME = os.getenv("APP_NAME", APP_NAME)

APP_VERSION = "0.1.0"
APP_VERSION = os.getenv("APP_VERSION", APP_VERSION)

APP_DESCRIPTION = "Streaming inference w/ real-time agents"
APP_DESCRIPTION = os.getenv("APP_DESCRIPTION", APP_DESCRIPTION)

CONTACT = {"name": "AI API Team", "email": "support@yourcompany.com"}
CONTACT_ENV = os.getenv("CONTACT", None)
if CONTACT_ENV:
    import json
    CONTACT = json.loads(CONTACT_ENV)

# ----------------------------------------------------------------------------
# Server Runtime Configuration
# ----------------------------------------------------------------------------
# Settings for running the FastAPI server via Uvicorn.

HOST = "0.0.0.0"
HOST = os.getenv("HOST", HOST)

PORT = 8000
PORT = int(os.getenv("PORT", str(PORT)))

RELOAD = False
RELOAD = os.getenv("RELOAD", str(RELOAD)).lower() == "true"

WORKERS = 1
WORKERS = int(os.getenv("WORKERS", str(WORKERS)))

DEBUG = False
DEBUG = os.getenv("DEBUG", str(DEBUG)).lower() == "true"

# ----------------------------------------------------------------------------
# Logging Configuration (for logging.py)
# ----------------------------------------------------------------------------
# Controls logging verbosity.

LOG_LEVEL = "INFO"
LOG_LEVEL = os.getenv("LOG_LEVEL", LOG_LEVEL)

# ----------------------------------------------------------------------------
# Middleware Configuration (for loaders.py and middleware_loader.py)
# ----------------------------------------------------------------------------
# Toggles and options for built-in middlewares and custom middleware list.

ENABLE_CORS = True
ENABLE_CORS = os.getenv("ENABLE_CORS", str(ENABLE_CORS)).lower() == "true"

CORS_ALLOW_ORIGINS = ["*"]
CORS_ALLOW_ORIGINS = os.getenv("CORS_ALLOW_ORIGINS", ",".join(CORS_ALLOW_ORIGINS)).split(",")

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", str(CORS_ALLOW_CREDENTIALS)).lower() == "true"

CORS_ALLOW_METHODS = ["*"]
CORS_ALLOW_METHODS = os.getenv("CORS_ALLOW_METHODS", ",".join(CORS_ALLOW_METHODS)).split(",")

CORS_ALLOW_HEADERS = ["*"]
CORS_ALLOW_HEADERS = os.getenv("CORS_ALLOW_HEADERS", ",".join(CORS_ALLOW_HEADERS)).split(",")

ENABLE_GZIP = True
ENABLE_GZIP = os.getenv("ENABLE_GZIP", str(ENABLE_GZIP)).lower() == "true"

GZIP_MINIMUM_SIZE = 1000
GZIP_MINIMUM_SIZE = int(os.getenv("GZIP_MINIMUM_SIZE", str(GZIP_MINIMUM_SIZE)))

ENABLE_WEBTRANSPORT_DETECTION = True
ENABLE_WEBTRANSPORT_DETECTION = os.getenv("ENABLE_WEBTRANSPORT_DETECTION", str(ENABLE_WEBTRANSPORT_DETECTION)).lower() == "true"

ENABLED_MIDDLEWARES = []  # Empty = enable all middleware in api/config/middleware/
ENABLED_MIDDLEWARES = os.getenv("ENABLED_MIDDLEWARES", ",".join(ENABLED_MIDDLEWARES)).split(",")

# ----------------------------------------------------------------------------
# API Documentation Configuration (for loaders.py)
# ----------------------------------------------------------------------------
# Controls FastAPI OpenAPI documentation endpoints and customization.

ENABLE_API_DOCS = True
ENABLE_API_DOCS = os.getenv("ENABLE_API_DOCS", str(ENABLE_API_DOCS)).lower() == "true"

DOCS_URL = "/docs" if ENABLE_API_DOCS else None
DOCS_URL = os.getenv("DOCS_URL", DOCS_URL)

REDOC_URL = "/redoc" if ENABLE_API_DOCS else None
REDOC_URL = os.getenv("REDOC_URL", REDOC_URL)

OPENAPI_URL = "/openapi.json" if ENABLE_API_DOCS else None
OPENAPI_URL = os.getenv("OPENAPI_URL", OPENAPI_URL)

SWAGGER_JS_URL = None
SWAGGER_JS_URL = os.getenv("SWAGGER_JS_URL", SWAGGER_JS_URL)

SWAGGER_CSS_URL = None
SWAGGER_CSS_URL = os.getenv("SWAGGER_CSS_URL", SWAGGER_CSS_URL)

REDOC_JS_URL = None
REDOC_JS_URL = os.getenv("REDOC_JS_URL", REDOC_JS_URL)

FAVICON_URL = None
FAVICON_URL = os.getenv("FAVICON_URL", FAVICON_URL)

SWAGGER_UI_PARAMETERS = None
SWAGGER_UI_PARAMETERS_ENV = os.getenv("SWAGGER_UI_PARAMETERS", None)
if SWAGGER_UI_PARAMETERS_ENV:
    import json
    SWAGGER_UI_PARAMETERS = json.loads(SWAGGER_UI_PARAMETERS_ENV)

# ----------------------------------------------------------------------------
# Exception Handlers Configuration (for handlers.py)
# ----------------------------------------------------------------------------
# Toggle for enabling/disabling custom exception handlers.

USE_CUSTOM_EXCEPTION_HANDLERS = True
USE_CUSTOM_EXCEPTION_HANDLERS = os.getenv("USE_CUSTOM_EXCEPTION_HANDLERS", str(USE_CUSTOM_EXCEPTION_HANDLERS)).lower() == "true"

# ----------------------------------------------------------------------------
# AI Services Configuration (for ai_services.py)
# ----------------------------------------------------------------------------
# Controls AI service availability and selection.

ENABLE_AI_SERVICES = True
ENABLE_AI_SERVICES = os.getenv("ENABLE_AI_SERVICES", str(ENABLE_AI_SERVICES)).lower() == "true"

SELECTED_AI_PROVIDER = None  # None = all providers; set to "OpenAI" to limit
SELECTED_AI_PROVIDER = os.getenv("SELECTED_AI_PROVIDER", SELECTED_AI_PROVIDER)

SELECTED_AI_MODEL = None  # None = all models; set to "gpt-4o" to limit
SELECTED_AI_MODEL = os.getenv("SELECTED_AI_MODEL", SELECTED_AI_MODEL)

# Example manual overrides:
# LOG_LEVEL = "DEBUG"  # Forces DEBUG logging
# ENABLE_CORS = False  # Disables CORS
# ENABLE_AI_SERVICES = False  # Disables AI services