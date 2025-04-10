# api/v1/llm_ws_streaming_route.py

"""
WebSocket route for real-time chat with a language model in FastAPI.
Defines the `/v1/ws/chat` endpoint for streaming interactions with an LLMBot instance.

Each WebSocket connection initializes a new LLMBot and maintains a streaming chat loop.
Expects JSON input from clients and streams JSON responses back.

Expected JSON Input:
{
    "user_input": "Your question here",        # Required: The user's message
    "model_name": "gpt-4o",                   # Optional: Model name (default: gpt-4o)
    "system_prompt": "You are a helpful assistant...",  # Optional: System prompt
    "temperature": 0.7,                       # Optional: Sampling temperature (default: 0.7)
    "top_p": 0.9,                            # Optional: Top-p sampling value (default: 0.9)
    "max_length": 256,                        # Optional: Max response length in tokens (default: 256)
    "conversation_id": "abc123"              # Optional: Unique identifier for conversation tracking
}

Response Format (streamed JSON chunks):
{
    "role": "ai",
    "content": "partial message content"
}
"""

import os
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from pydantic import BaseModel, Field
from typing import Optional
from api.services.llm_ws_streaming.llm_ws_streaming_service import LLMBot
from api.config.logging import logger  # Use your logging system

router = APIRouter()

"""
Schema for incoming JSON data to the WebSocket endpoint.
Defines the structure of messages sent by clients to configure the LLMBot and provide input.

LLM Properties:
model_name: Optional[str] = None
system_prompt: Optional[str] = None
user_input: str
temperature: Optional[float] = 0.7
top_p: Optional[float] = 0.9
max_length: Optional[int] = 256
frequency_penalty: Optional[float] = 0.0
conversation_id: Optional[str] = None
"""
@router.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat with an AI bot.

    Initializes an LLMBot instance per connection and streams responses to the client.
    Handles incoming JSON messages, processes them, and sends back incremental chunks.

    Args:
        websocket (WebSocket): The WebSocket connection object.

    Notes:
        - Path: /v1/ws/chat (prefixed by router).
        - Closes with code 1011 if OPENAI_API_KEY is missing or an error occurs.
        - Logs connection events using api/config/logging.py.
    """
    await websocket.accept()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        await websocket.close(code=1011, reason="OPENAI_API_KEY not set in environment.")
        return

    bot = None

    try:
        while True:
            # Receive message from the client
            data = await websocket.receive_json()

            # Extract user input and optional parameters from the received data
            user_input = data.get("user_input")
            model_name = data.get("model_name", "gpt-4o")
            system_prompt = data.get("system_prompt")
            temperature = data.get("temperature", 0.7)
            top_p = data.get("top_p", 0.9)
            max_length = data.get("max_length", 256)
            conversation_id = data.get("conversation_id")

            # Create the bot instance if not already created
            if bot is None:
                bot = LLMBot(
                    model_name=model_name,
                    api_key=api_key,
                    system_prompt=system_prompt,
                    temperature=temperature,
                    top_p=top_p,
                    max_length=max_length,
                    conversation_id=conversation_id,
                )

            # Stream the AI response back to the client
            async for chunk in bot.send_message(user_input):
                await websocket.send_json({"role": "ai", "content": chunk.content})

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed.")  # Updated from print
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")  # Updated logging
        await websocket.close(code=1011, reason=str(e))




# ─────────────────────────────────────────────────────────────
# 📦 Model: WebSocket Chat Payload (Text-NLP focused)
# ─────────────────────────────────────────────────────────────

class WebSocketChatRequest(BaseModel):
    model_name: Optional[str] = Field(
        default="gpt-4o",
        description="Name of the LLM backend (e.g. 'gpt-4o', 'claude-3', 'mistral', 'gemini-pro', etc.)"
    )
    system_prompt: Optional[str] = Field(
        default=None,
        description="Optional system-level instruction to guide model behavior (e.g. 'You are a helpful assistant.')"
    )
    user_input: str = Field(
        ...,
        description="The main user message sent to the LLM (required)."
    )
    temperature: Optional[float] = Field(
        default=0.7,
        description="Sampling temperature for generation randomness (0.0 = deterministic, 1.0 = diverse)."
    )
    top_p: Optional[float] = Field(
        default=0.9,
        description="Top-p (nucleus) sampling value to control output diversity."
    )
    max_length: Optional[int] = Field(
        default=256,
        description="Maximum number of tokens to generate in a single response."
    )
    frequency_penalty: Optional[float] = Field(
        default=0.0,
        description="Penalize repeated tokens to reduce redundancy (OpenAI-style)."
    )
    conversation_id: Optional[str] = Field(
        default=None,
        description="Optional conversation ID to support multi-turn context or memory (external tracking)."
    )


# ─────────────────────────────────────────────────────────────
# ⚠️ Error Model for Failed Responses
# ─────────────────────────────────────────────────────────────

class ErrorDetail(BaseModel):
    detail: str


# ─────────────────────────────────────────────────────────────
# 📖 Swagger Doc Route for WebSocket Chat Payload
#    - Returns schema
#    - Explains WS-only use
#    - Prevents accidental misuse
# ─────────────────────────────────────────────────────────────

@router.post(
    "/ws/chat-info",
    tags=["LLM WebSocket"],
    summary="📘 WebSocket Chat Schema & Usage Guide (NLP LLMs)",
    description="""
🚀 **WebSocket LLM Chat Payload Reference**

This endpoint documents the required and optional fields for connecting to the real-time WebSocket endpoint:
ws://<host>:<port>/v1/ws/chat

This endpoint models **OpenAI-style chat completions**, used across LLM providers like:

- OpenAI (`gpt-3.5-turbo`, `gpt-4o`)
- Anthropic (`claude-3`)
- Google (`gemini-pro`)
- Mistral, Cohere, Azure OpenAI, etc.

🧠 This chat format supports real-time **streaming text completions**, **text-in / text-out** workflows, and is compatible with browser or tool-based WebSocket clients.

---

⚠️ **Warning**: This endpoint is **not callable for live chat**. It exists for **documentation purposes only**.

- This is a standard `POST` endpoint to expose payload schema in Swagger.
- Clients must **not call this for chat** — use the WebSocket endpoint instead.
- Calling this returns back the payload for inspection and validation.

---

✅ **Correct Usage Flow**:
1. Inspect this schema to understand all supported parameters.
2. Use a WebSocket client (e.g. `wscat`, browser, Postman, or frontend) to connect to `/v1/ws/chat`.
3. Send this schema as a JSON object over the socket.
4. Receive a stream of `{ role: "ai", content: "..." }` messages.

---

### 🔐 **Authentication**

- Requires environment variable: `OPENAI_API_KEY`
- Optional runtime override: `api_key` can be passed in payload (if backend allows)

---

### ⚠️ **This is NOT the chat endpoint.**
- This route is **for documentation, Swagger visibility, and schema exposure**.
- **Do NOT POST** user messages here — use a **WebSocket client** to connect to the actual `/ws/chat` route.

---

### 📡 **WebSocket Chat Endpoint**
- `ws://localhost:8000/v1/ws/chat`
- Accepts JSON payload (see schema below)
- Streams LLM-generated responses

### 💬 **Expected Payload**

- `user_input`: Required user message (text)
- `model_name`: LLM backend (e.g. `gpt-4o`, `claude-3`, `gemini`)
- `system_prompt`: Instructional prompt to steer the model
- `temperature`, `top_p`: Sampling controls
- `max_length`: Response length limit
- `frequency_penalty`: Penalizes repetitive outputs
- `conversation_id`: For conversation/thread tracking

📦 **Request Payload Fields**:

```json
{
  "model_name": "gpt-4o",
  "system_prompt": "You are a helpful assistant.",
  "user_input": "Hello, who won the game yesterday?",
  "temperature": 0.7,
  "top_p": 0.9,
  "max_length": 256,
  "frequency_penalty": 0.0,
  "conversation_id": "1234-session",
  "api_key": "sk-..."  // optional
}

```


---

### 🔧 WebSocket Error Codes
| Code  | Meaning                          | Details & Access                               | Usage/Action                                  |
|-------|----------------------------------|------------------------------------------------|-----------------------------------------------|
| 1011  | Internal server error            | Indicates an unexpected server-side issue (e.g., unhandled exception). Logged in server logs via `logger.error`. Accessible via the WebSocket close event’s `code` property. | Check server logs for the stack trace or error message (e.g., `reason` field). Restart or debug the server if persistent. |
| 1000  | Normal closure                   | The connection was closed intentionally by the client or server (e.g., via `websocket.close(1000)`). Seen in the client’s WebSocket `onclose` event. | No action needed—indicates a graceful shutdown. Ensure your app handles this cleanly (e.g., notify user). |
| 1006  | Abnormal disconnect              | Connection dropped unexpectedly (e.g., network failure, server crash). Not explicitly sent by the app; detected by the WebSocket client library. | Verify network stability or server uptime. Retry the connection after a delay (e.g., exponential backoff). |
| 4400  | Invalid payload                  | Client sent malformed JSON or data not matching the expected schema. Triggered by FastAPI/Pydantic validation; returned in the `reason` field. | Validate your JSON payload structure client-side before sending. Match it to the `WebSocket{module_name_cap}Request` schema. |
🧪 **This docuemntation is for testing, not invocation.**

""",
    response_model=WebSocketChatRequest,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Schema returned successfully (DO NOT USE FOR LIVE CHAT)."},
        400: {"model": ErrorDetail, "description": "Client Error – Invalid example structure."},
        422: {"model": ErrorDetail, "description": "Validation Error – Payload mismatch."},
        500: {"model": ErrorDetail, "description": "Internal Server Error – Unexpected backend issue."},
        503: {"model": ErrorDetail, "description": "Service Unavailable – LLM backend not responding."}
    }
)
async def websocket_chat_schema(example: WebSocketChatRequest):
    """
    Returns back the provided payload — used only for schema doc generation in Swagger.
    This is NOT the actual WebSocket handler.
    """
    return example





