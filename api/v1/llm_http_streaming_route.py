# api/v1/llm_http_route.py

"""
📨 LLM HTTP Chat Completion Route

This module defines a RESTful POST endpoint for chat-based completions.
Each call to `/chat` initializes a fresh LLMBot instance and returns the
generated response as a streamed plain-text HTTP response.

Used for synchronous AI API integrations (e.g., form inputs, REST tools).
"""

import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from api.services.llm_http_streaming.llm_http_streaming_service import LLMBot
from api.config.logging import logger

router = APIRouter()


# ─────────────────────────────────────────────────────────────
# 📦 ChatRequest Schema
# Expected structure for /chat POST request payload
# ─────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    """
    ChatRequest defines the JSON body for /chat POST requests.

    Fields:
        - model_name: Which LLM to invoke (optional)
        - system_prompt: Prompt to prime the model (optional)
        - user_input: Required input from the user
        - temperature: Sampling temp (default 0.7)
        - top_p: Top-p nucleus sampling (default 0.9)
        - max_length: Max token limit (default 256)
        - frequency_penalty: Penalty to discourage repetition
        - conversation_id: Track multi-turn conversation (optional)
    """
    model_name: Optional[str] = None
    system_prompt: Optional[str] = None
    user_input: str
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9
    max_length: Optional[int] = 256
    frequency_penalty: Optional[float] = 0.0
    conversation_id: Optional[str] = None


# ─────────────────────────────────────────────────────────────
# 🧠 LLM Completion Endpoint
# Returns generated response as streamed plain text
# ─────────────────────────────────────────────────────────────

@router.post("/chat-window", summary="HTTP based Chat with an LLM", response_class=StreamingResponse, tags=["LLM Http API"])
async def chat_endpoint(request: ChatRequest):
    """
    Accepts a ChatRequest payload, invokes an LLM, and returns a streamed response.

    Returns:
        StreamingResponse (text/plain) – incremental LLM output
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY not set.")
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set in environment.")

    logger.info(f"🔁 Creating bot for model: {request.model_name or 'gpt-4o'}")

    bot = LLMBot(
        model_name=request.model_name or "gpt-4o",
        api_key=api_key,
        system_prompt=request.system_prompt,
        temperature=request.temperature,
        top_p=request.top_p,
        max_length=request.max_length,
        conversation_id=request.conversation_id,
    )

    async def stream_response():
        logger.debug("📤 Streaming LLM response...")
        async for chunk in bot.send_message(request.user_input):
            yield chunk.content

    return StreamingResponse(stream_response(), media_type="text/plain")
