# api/config/middleware_loader.py

"""
Dynamic middleware loader for FastAPI.
Automatically detects and registers middleware from api/config/middleware/ folder.
Uses ENABLED_MIDDLEWARES list to toggle; empty list enables all for zero-config.
"""

import os
import importlib
from fastapi import FastAPI
from api.config.logging import logger
from api.config.settings import ENABLED_MIDDLEWARES

MIDDLEWARE_FOLDER = "api/config/middleware"

def load_custom_middlewares(app: FastAPI):
    """
    Registers all middleware from api/config/middleware/ ending in _middleware.py.
    If ENABLED_MIDDLEWARES is empty, enables all; otherwise, only listed ones.
    """
    enabled_set = set(ENABLED_MIDDLEWARES) if ENABLED_MIDDLEWARES else None  # None = enable all

    for file in os.listdir(MIDDLEWARE_FOLDER):
        if file.endswith("_middleware.py") and not file.startswith("__"):
            name = file[:-3]  # Remove .py
            if enabled_set is None or name in enabled_set:  # Load all or only enabled
                module_path = f"api.config.middleware.{name}"
                try:
                    module = importlib.import_module(module_path)
                    if hasattr(module, "register_middleware"):
                        module.register_middleware(app)
                        logger.info(f"✅ Middleware loaded: {name}")
                    else:
                        logger.warning(f"⚠️ {name} has no register_middleware()")
                except Exception as e:
                    logger.error(f"❌ Failed to load middleware {name}: {e}")