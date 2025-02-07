import os
import asyncio 
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .genai_streaming_controller import LLMBot

# MAIN FASTAPI APP MAIN.PY

app = FastAPI()

# Allow frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
class ChatRequest(BaseModel):
    """
    ChatRequest defines the schema for incoming JSON data. The user can optionally provide a
    system_prompt (plain text or file path) and must provide a user_input (plain text or file path).
    """
    """
    ChatRequest schema for incoming JSON data.
    """
    system_prompt: Optional[str] = None
    user_input: str
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9
    max_length: Optional[int] = 256
    frequency_penalty: Optional[float] = 0.0
    conversation_id: Optional[str] = None

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Each POST to /chat creates a new LLMBot instance with the provided system_prompt (if any).
    Then it sends the user_input to the bot, awaits the AI response, and returns the response
    as plain text in JSON. 
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set in environment.")

    # Create the bot with the system prompt (if present).
    bot = LLMBot(
        api_key=api_key,
        system_prompt=request.system_prompt,
        temperature=request.temperature,
        top_p=request.top_p,
        max_length=request.max_length,
        conversation_id=request.conversation_id
    )

    
    async def stream_response():
        async for chunk in bot.send_message(request.user_input):
            yield chunk.content  # Stream chunks directly as they arrive

    return StreamingResponse(stream_response(), media_type="text/plain")