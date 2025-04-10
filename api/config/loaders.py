# api/config/loaders.py

"""
🧱 Middleware & Documentation Loader

This module applies internal middleware and API documentation settings
to the FastAPI application instance.

Settings are pulled from `settings.py` and are fully overrideable via `.env`.

Includes:
- CORS middleware configuration
- GZIP compression
- Browser WebTransport detection fallback
- OpenAPI docs setup (Swagger & ReDoc)
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from api.config.logging import logger
from api.config.settings import (
    ENABLE_CORS, CORS_ALLOW_ORIGINS, CORS_ALLOW_CREDENTIALS, CORS_ALLOW_METHODS, CORS_ALLOW_HEADERS,
    ENABLE_GZIP, GZIP_MINIMUM_SIZE, ENABLE_WEBTRANSPORT_DETECTION,
    ENABLE_API_DOCS, APP_NAME, APP_DESCRIPTION, APP_VERSION, DOCS_URL, REDOC_URL, OPENAPI_URL
)


# ─────────────────────────────────────────────────────────────
# 🧩 apply_middlewares
# Attaches system-level middleware to the FastAPI app.
# Driven entirely by settings.py
# ─────────────────────────────────────────────────────────────

def apply_middlewares(app: FastAPI) -> FastAPI:
    """
    Apply middleware to the FastAPI app based on runtime configuration.
    Includes:
    - CORS
    - GZIP Compression
    - WebTransport fallback logic (browser detection)
    """

    # ─── CORS Middleware ────────────────────────────────
    if ENABLE_CORS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=CORS_ALLOW_ORIGINS,
            allow_credentials=CORS_ALLOW_CREDENTIALS,
            allow_methods=CORS_ALLOW_METHODS,
            allow_headers=CORS_ALLOW_HEADERS
        )
        logger.debug("✅ CORS middleware enabled")

    # ─── GZIP Middleware ────────────────────────────────
    if ENABLE_GZIP:
        app.add_middleware(GZipMiddleware, minimum_size=GZIP_MINIMUM_SIZE)
        logger.debug("✅ GZIP middleware enabled")

    # ─── Browser Transport Detection ─────────────────────
    if ENABLE_WEBTRANSPORT_DETECTION:
        @app.middleware("http")
        async def detect_browser_transport(request: Request, call_next):
            user_agent = request.headers.get("user-agent", "").lower()
            if "safari" in user_agent and "chrome" not in user_agent:
                request.scope["use_ws"] = True
            else:
                request.scope["use_webtransport"] = True
            return await call_next(request)
        logger.debug("✅ Browser transport detection middleware enabled")

    return app


# ─────────────────────────────────────────────────────────────
# 📘 apply_api_docs
# Configures OpenAPI doc routes and app metadata.
# Driven by values in settings.py
# ─────────────────────────────────────────────────────────────

def apply_api_docs(app: FastAPI) -> FastAPI:
    """
    Apply OpenAPI documentation settings to the FastAPI app.

    Customizes:
    - app.title
    - app.description
    - app.version
    - docs URLs for Swagger UI, ReDoc, and OpenAPI schema
    """

    app.title = APP_NAME
    app.description = APP_DESCRIPTION
    app.version = APP_VERSION

    if ENABLE_API_DOCS:
        app.docs_url = DOCS_URL
        app.redoc_url = REDOC_URL
        app.openapi_url = OPENAPI_URL
        logger.debug("📘 Docs enabled")
    else:
        app.docs_url = None
        app.redoc_url = None
        app.openapi_url = None
        logger.debug("📕 Docs disabled")

    return app
