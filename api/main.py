import os
import asyncio 
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from genai_controller import LLMBot

# MAIN FASTAPI APP MAIN.PY

app = FastAPI()

class ChatRequest(BaseModel):
    """
    ChatRequest defines the schema for incoming JSON data. The user can optionally provide a
    system_prompt (plain text or file path) and must provide a user_input (plain text or file path).
    """
    system_prompt: Optional[str] = None
    user_input: str

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
    bot = LLMBot(api_key=api_key, system_prompt=request.system_prompt)
    
    # Send the user input and retrieve the response.
    response = await bot.send_message(request.user_input)
    
    # Return the language model's response as a JSON object.
    return {"response": response}
