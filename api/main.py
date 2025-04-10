# main.py

"""
Main entry point for the FastAPI application.
Sets up the app with basic configurations and automatically registers routes from api/v1/.
No endpoints are defined here; all routes are handled by route_loader.py.
Uses hardcoded CORS middleware as per original design.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from api.config.settings import (
    APP_NAME, APP_VERSION, APP_DESCRIPTION, HOST, PORT, RELOAD, WORKERS, DEBUG,
    ENABLE_API_DOCS, DOCS_URL, REDOC_URL, OPENAPI_URL, CONTACT, OPENAPI_SERVER_NAME
)
from api.config.logging import logger
from api.config.route_loader import register_v1_routes

# Define lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {APP_NAME} v{APP_VERSION} on {HOST}:{PORT} with reload={RELOAD}, workers={WORKERS}")
    yield
    logger.info(f"Shutting down {APP_NAME}")


# Initialize the FastAPI app with settings
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    debug=DEBUG,
    docs_url=DOCS_URL if ENABLE_API_DOCS else None,
    redoc_url=REDOC_URL if ENABLE_API_DOCS else None,
    openapi_url=OPENAPI_URL if ENABLE_API_DOCS else None,
    contact=CONTACT,
    lifespan=lifespan,
    servers=[{"url": f"http://{HOST}:{PORT}", "description": OPENAPI_SERVER_NAME}]
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("Fast API WebSocket connection established!")
    await websocket.close()

# List all WebSocket routes
# websocket_routes = [route for route in app.router.routes if isinstance(route, WebSocketRoute)]

# for ws_route in websocket_routes:
#     print(f"WebSocket route: {ws_route.path}")


# Hardcoded CORS middleware (as in your original)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Apply route registration only (no other configs for now)
register_v1_routes(app)  # Automatically registers all routes from api/v1/, including llm_ws_route.py

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Booting server with config: host={HOST}, port={PORT}, reload={RELOAD}, workers={WORKERS}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=RELOAD, workers=WORKERS)