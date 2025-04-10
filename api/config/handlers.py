# api/config/handlers.py

"""
Exception handler registration for FastAPI application.
Defines custom handlers for specific exceptions and generic fallbacks.
Togglable via settings.py to enable/disable custom exception handling.
"""

from fastapi import FastAPI, Request, WebSocketException, status
from fastapi.responses import JSONResponse
from .logging import logger  # Logger instance configured by LOG_LEVEL in settings.py
from .settings import USE_CUSTOM_EXCEPTION_HANDLERS  # Toggle for custom handlers
from .exceptions import UnauthorizedException, NotFoundException  # Custom exceptions

def apply_exception_handlers(app: FastAPI):
    """
    Registers exception handlers to the FastAPI application.

    Handlers are applied only if USE_CUSTOM_EXCEPTION_HANDLERS is True in settings.py.
    Includes specific handlers for UnauthorizedException, NotFoundException,
    WebSocketException, and a generic Exception fallback.

    Args:
        app (FastAPI): The FastAPI application instance to register handlers with.

    Returns:
        FastAPI: The modified FastAPI app with handlers applied (or unchanged if disabled).

    Notes:
        - Uses logger from logging.py for error and debug logging.
        - Custom exceptions are defined in exceptions.py and imported here.
        - Handler responses are JSON-formatted with appropriate status codes.
    """
    if USE_CUSTOM_EXCEPTION_HANDLERS:
        # Handler for UnauthorizedException (HTTP 401)
        @app.exception_handler(UnauthorizedException)
        async def unauthorized_handler(request: Request, exc: UnauthorizedException):
            """
            Handles UnauthorizedException, returning a 401 JSON response.

            Args:
                request (Request): The incoming request that triggered the exception.
                exc (UnauthorizedException): The exception instance with detail message.

            Returns:
                JSONResponse: A 401 response with the error detail.
            """
            logger.error(f"❌ Unauthorized: {str(exc)}")
            return JSONResponse(
                status_code=exc.status_code,
                content={"error": exc.detail}
            )

        # Handler for NotFoundException (HTTP 404)
        @app.exception_handler(NotFoundException)
        async def not_found_handler(request: Request, exc: NotFoundException):
            """
            Handles NotFoundException, returning a 404 JSON response.

            Args:
                request (Request): The incoming request that triggered the exception.
                exc (NotFoundException): The exception instance with detail message.

            Returns:
                JSONResponse: A 404 response with the error detail.
            """
            logger.error(f"❌ Not Found: {str(exc)}")
            return JSONResponse(
                status_code=exc.status_code,
                content={"error": exc.detail}
            )

        # Generic handler for uncaught exceptions (HTTP 500)
        @app.exception_handler(Exception)
        async def general_handler(request: Request, exc: Exception):
            """
            Handles any uncaught Exception, returning a 500 JSON response.

            Args:
                request (Request): The incoming request that triggered the exception.
                exc (Exception): The generic exception instance.

            Returns:
                JSONResponse: A 500 response with the error message.
            """
            logger.exception("🔥 Unhandled Exception")  # Logs full stack trace
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"error": str(exc)}
            )

        # Handler for WebSocketException (WebSocket 1011)
        @app.exception_handler(WebSocketException)
        async def websocket_handler(request: Request, exc: WebSocketException):
            """
            Handles WebSocketException, returning a 1011 JSON response.

            Args:
                request (Request): The incoming request that triggered the exception.
                exc (WebSocketException): The WebSocket exception instance.

            Returns:
                JSONResponse: A 1011 response with the error message.
            """
            logger.error(f"❌ WebSocket Exception: {str(exc)}")
            return JSONResponse(
                status_code=status.WS_1011_INTERNAL_ERROR,
                content={"error": "WebSocket failed"}
            )

        logger.debug("✅ Custom exception handlers ready")  # Log successful setup
    else:
        logger.debug("⚠️ Custom exception handlers disabled")  # Log when disabled

    return app