# api/config/route_loader.py

"""
Dynamic Route Loader for FastAPI.
Automatically registers all routes from api/v1/ folder ending in _route.py.
Ensures zero-config, self-contained services with auto-generated OpenAPI docs and WebSocket support.
"""

import os
import importlib
from fastapi import FastAPI, APIRouter
from api.config.logging import logger

V1_PATH = os.path.join(os.path.dirname(__file__), "..", "v1")

def register_v1_routes(app: FastAPI):
    """
    Registers all v1 routes from api/v1/ folder with minimal latency.
    Auto-discovers *_route.py files and includes their routers under /v1 prefix.
    Supports both HTTP and WebSocket endpoints defined in APIRouter instances.

    Args:
        app (FastAPI): The FastAPI application instance to register routes with.

    Notes:
        - Logs each registered router and warns if no router is found.
        - WebSocket endpoints (e.g., @router.websocket) are automatically included via router.include_router.
    """
    router = APIRouter(prefix="/v1")
    
    for file in os.listdir(V1_PATH):
        if file.endswith("_route.py"):
            name = file[:-3]  # Remove .py
            module_path = f"api.v1.{name}"
            try:
                module = importlib.import_module(module_path)
                if hasattr(module, "router"):
                    # Check for WebSocket routes (for debugging)
                    if any(hasattr(getattr(module.router, attr), "websocket") for attr in dir(module.router)):
                        logger.info(f"🔌 Detected WebSocket routes in {name}")
                    router.include_router(module.router)
                    logger.info(f"✅ Route registered: {name}")
                else:
                    logger.warning(f"⚠️ No 'router' in {name}")
            except Exception as e:
                logger.error(f"❌ Failed to load route {name}: {e}")

    app.include_router(router)