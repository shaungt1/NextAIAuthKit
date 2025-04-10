# scripts/_cli_templates.py

# HTTP Route Template
ROUTE_TEMPLATE = '''from fastapi import APIRouter
from services.{module_name} import {module_name}_service

router = APIRouter(
    prefix="/{module_name}",
    tags=["{module_name_cap}"]
)

@router.get("/")
def get_{module_name}():
    """Get data from the {module_name} module."""
    return {module_name}_service.get()

@router.post("/")
def post_{module_name}(data: dict):
    """Create data in the {module_name} module."""
    return {module_name}_service.create(data)

@router.put("/{{item_id}}")
def put_{module_name}(item_id: str, data: dict):
    """Update data in the {module_name} module."""
    return {module_name}_service.update(item_id, data)

@router.delete("/{{item_id}}")
def delete_{module_name}(item_id: str):
    """Delete data from the {module_name} module."""
    return {module_name}_service.delete(item_id)
'''

# Service Template
SERVICE_TEMPLATE = '''import logging

logger = logging.getLogger(__name__)

class {module_name_cap}Service:
    """Service class for the {module_name} module."""

    def __init__(self):
        """Initialize the {module_name} service."""
        logger.info("Initializing {module_name_cap}Service")
        self.data = {{}}

    def get(self):
        """Retrieve data."""
        logger.info("Getting data for {module_name_cap}")
        return {{"message": "Data from {module_name}"}}

    def create(self, data: dict):
        """Create new data."""
        logger.info(f"Creating data: {{data}}")
        return {{"message": "Created in {module_name}", "data": data}}

    def update(self, item_id: str, data: dict):
        """Update existing data."""
        logger.info(f"Updating {{item_id}} with {{data}}")
        return {{"message": "Updated in {module_name}", "id": item_id, "data": data}}

    def delete(self, item_id: str):
        """Delete data."""
        logger.info(f"Deleting {{item_id}}")
        return {{"message": "Deleted from {module_name}", "id": item_id}}
'''

SCHEMA_TEMPLATE = '''from pydantic import BaseModel

class {module_name_cap}Request(BaseModel):
    """
    Request schema for the `{module_name}` module.

    Customize this schema with fields required for your specific use case.
    """
    {module_name}_request_example: str
    # Add more fields as needed, e.g.:
    # user_id: str
    # query: str

class {module_name_cap}Response(BaseModel):
    """
    Response schema for the `{module_name}` module.

    Customize this schema with fields expected in the response.
    """
    {module_name}_response_example: dict
    # Add more fields as needed, e.g.:
    # result: dict
'''

# Notes Template
NOTES_TEMPLATE = '''# {module_name_cap} Module Notes

## Overview
This module handles the {module_name} feature.

## Files Created
- Router: api/{module_name}_router.py
- Service: services/{module_name}/{module_name}_service.py
- Notes: services/{module_name}/{module_name}_notes.md
'''

# Test Template (Full Mode)
TEST_TEMPLATE = '''from services.{module_name}.{module_name}_service import process

def test_{module_name}_process():
    response = process()
    assert response == {{"message": "Response from {module_name}"}}
'''

# Example Data JSON (Full Mode)
EXAMPLE_DATA_JSON = '''{{
    "example_id": 1,
    "example_name": "{module_name_cap} Example",
    "description": "This is sample data for the {module_name_cap} module."
}}'''

# Changelog Entry Template
CHANGELOG_ENTRY = '''
## 🛠️ API Release: {module_name_cap} - **Release Date:** {release_date}  
**Feature Type:** New {api_type_cap} API Endpoint

### 🚀 New Endpoints
- `{method} /api/ws/{module_name}` – *Real-time WebSocket endpoint for {module_name} interactions* (WebSocket only)
- `POST /api/{module_name}` – *<Describe the new HTTP endpoint here>* (HTTP only)
- `GET /api/{module_name}/status` – *<Describe the status endpoint here>* (HTTP only)

### 📌 Notes
- Customize this entry with details about your {module_name} module’s purpose and functionality.
'''


# FullWebsocketRoute Template
# This template is used to generate a WebSocket route for the FastAPI application.
# FullWebsocketRoute Template
# This template is used to generate a WebSocket route for the FastAPI application.
WEBSOCKET_ROUTE_TEMPLATE = '''from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from pydantic import BaseModel, Field
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# ─────────────────────────────────────────────────────────────
# 📡 WebSocket Route: /ws/{module_route_name}
# ─────────────────────────────────────────────────────────────

@router.websocket("/ws/{module_route_name}")
async def websocket_{module_route_name}_endpoint(websocket: WebSocket):
    """
    Generic WebSocket endpoint for real-time interaction with the `{module_name_cap}` module.

    🌐 This endpoint:
    - Accepts JSON payloads over WebSocket.
    - Sends JSON-formatted responses back to the client.
    - Is completely self-contained and ready to extend.

    📌 Customize this logic for your specific module (e.g., notifications, chat, data streaming, etc.).
    """
    await websocket.accept()

    try:
        while True:
            # 🔄 Receive a JSON message from the client
            data = await websocket.receive_json()
            logger.info(f"Received: {{data}}")

            # ✅ Extract input from the generic example field
            user_input = data.get("{module_name}_request_example", "No input provided")

            # 🧠 Replace this with your module’s processing logic
            response = {{
                "role": "server",
                "content": f"Received input: {{user_input}}"
            }}

            # 🚀 Send the response back over WebSocket
            await websocket.send_json(response)

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected by client.")
    except Exception as e:
        logger.error(f"WebSocket error: {{str(e)}}")
        await websocket.close(code=1011, reason="Internal server error")

# ─────────────────────────────────────────────────────────────
# 📦 Model: WebSocket {module_name_cap} Payload (Generic Template)
# ─────────────────────────────────────────────────────────────

class WebSocket{module_name_cap}Request(BaseModel):
    """
    Generic WebSocket request payload schema for `{module_name}` module.

    🛠 Customize this schema with fields required for your specific use case.
    This version includes a single `*_request_example` field for Swagger preview only.
    """
    {module_name}_request_example: Optional[str] = Field(
        default=None,
        description="Example input payload structure. Replace with real fields needed by your WebSocket handler."
    )

    # 🔄 Optional: Add real fields here as needed for your module's input
    # e.g., message: str, action: str, etc.
    # Example (commented out):
    # action: Optional[str] = Field(
    #     default=None,
    #     description="Action to perform (e.g., 'send', 'update', 'delete')"
    # )

# ─────────────────────────────────────────────────────────────
# ⚠️ Error Model for Failed Responses
# ─────────────────────────────────────────────────────────────

class ErrorDetail(BaseModel):
    """
    Generic error response model used for describing structured API error messages.

    Returned by FastAPI when validation fails or server-side errors occur.
    """
    detail: str

# ─────────────────────────────────────────────────────────────
# 📖 Swagger Doc Route for WebSocket {module_name_cap} Payload
# ─────────────────────────────────────────────────────────────

@router.post(
    "/ws/{module_route_name}-info",
    tags=["{module_name_cap} WebSocket API"],
    summary="📘 WebSocket {module_name_cap} Schema & Usage Guide",
    description=\"""\"
🚀 **WebSocket `{module_name}` Payload Documentation**

This endpoint defines the schema expected by the real-time WebSocket interface at:

    `ws://localhost:8000/api/ws/{module_route_name}`

This schema is intended for Swagger documentation and client inspection only.

---

🧠 **What is `{module_name}`?**
Provide a short paragraph explaining what the module does.
For example: real-time notifications, live data streaming, interactive chat, etc.

---

⚠️ **Important Note**
This route **does NOT support real-time interaction** — it’s only used for exposing the expected request payload format. Use a WebSocket client to send messages to the actual endpoint.

---

✅ **How to Use This Schema**
1. Review the schema fields documented here.
2. Connect to `ws://localhost:8000/api/ws/{module_route_name}` via WebSocket.
3. Send a JSON payload matching this schema.
4. Receive structured or streaming responses based on your app logic.

---

### 🔐 Authentication (if required)
- Use headers like `Authorization: Bearer <token>`, or
- Include an `api_key` in the payload (if supported by your backend).
- Example (commented out in the WebSocket endpoint):
# api_key = os.getenv("YOUR_API_KEY")
# if not api_key:
#     await websocket.close(code=1011, reason="YOUR_API_KEY not set")

---

### 📡 WebSocket Endpoint for `{module_name_cap}`
- Endpoint: `ws://localhost:8000/api/ws/{module_route_name}`
- Accepts: JSON-formatted messages
- Returns: Real-time or streamed responses (define your own format)


### 🔧 WebSocket Error Codes
| Code  | Meaning                          | Details & Access                               | Usage/Action                                  |
|-------|----------------------------------|------------------------------------------------|-----------------------------------------------|
| 1011  | Internal server error            | Indicates an unexpected server-side issue (e.g., unhandled exception). Logged in server logs via `logger.error`. Accessible via the WebSocket close event’s `code` property. | Check server logs for the stack trace or error message (e.g., `reason` field). Restart or debug the server if persistent. |
| 1000  | Normal closure                   | The connection was closed intentionally by the client or server (e.g., via `websocket.close(1000)`). Seen in the client’s WebSocket `onclose` event. | No action needed—indicates a graceful shutdown. Ensure your app handles this cleanly (e.g., notify user). |
| 1006  | Abnormal disconnect              | Connection dropped unexpectedly (e.g., network failure, server crash). Not explicitly sent by the app; detected by the WebSocket client library. | Verify network stability or server uptime. Retry the connection after a delay (e.g., exponential backoff). |
| 4400  | Invalid payload                  | Client sent malformed JSON or data not matching the expected schema. Triggered by FastAPI/Pydantic validation; returned in the `reason` field. | Validate your JSON payload structure client-side before sending. Match it to the `WebSocket{module_name_cap}Request` schema. |
---
""",
    response_model=WebSocket{module_name_cap}Request,
    status_code=status.HTTP_200_OK,
    responses={{
        200: {{ "description": "Schema returned successfully (DO NOT USE FOR LIVE INTERACTION)" }},
        400: {{ "model": "ErrorDetail", "description": "Client Error – Invalid payload structure" }},
        422: {{ "model": "ErrorDetail", "description": "Validation Error – Payload mismatch" }},
        500: {{ "model": "ErrorDetail", "description": "Internal Server Error – Unexpected issue" }},
        503: {{ "model": "ErrorDetail", "description": "Service Unavailable – Backend not responding" }}
    }}
)
async def websocket_{module_route_name}_schema(example: WebSocket{module_name_cap}Request):
    """
    Returns back the provided payload — used only for schema documentation in Swagger.
    This is NOT the actual WebSocket handler.
    """
    return example
'''