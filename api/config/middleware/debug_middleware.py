# api/config/middleware/debug_middleware.py

"""
Debug middleware for FastAPI.
Lightweight, async-safe middleware for debugging, registered via middleware_loader.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import FastAPI, Request, Response
from typing import Callable

class TemplateMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Pre-processing (e.g., log request start)
        response = await call_next(request)
        # Post-processing (e.g., log response)
        return response

def register_middleware(app: FastAPI):
    """Registers the TemplateMiddleware with the FastAPI app."""
    app.add_middleware(TemplateMiddleware)