from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Retrieve API key for Groq from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise HTTPException(status_code=500, detail="GROQ_API_KEY not found")

# Initialize Groq client with the API key
groq_client = Groq(api_key=GROQ_API_KEY)

# Create API router for handling chat requests
router = APIRouter()

# Define the request model for chat input
class ChatRequest(BaseModel):
    message: str  # User's message for the AI assistant

@router.post("/api/chat/")
async def chat(request: ChatRequest):
    """
    Handles chat requests by sending user messages to the JivanAI assistant.
    
    The AI responds with symptom-based advice in bullet points, ensuring 
    responses are concise (under 60 words) and include a disclaimer.
    """
    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are JivanAI, an advanced AI health assistant. Your specialty is diagnosing common ailments based on symptoms and providing clear, concise recovery plans. "
                        "Respond in bullet points, keeping the response under 60 words. Always include this disclaimer: 'This advice is informational only and should not replace professional medical consultation.'"
                    )
                },
                {"role": "user", "content": request.message}
            ]
        )
        # Return the AI-generated response
        return {"response": response.choices[0].message.content}
    except Exception as e:
        # Handle API errors gracefully
        raise HTTPException(status_code=500, detail=str(e))
