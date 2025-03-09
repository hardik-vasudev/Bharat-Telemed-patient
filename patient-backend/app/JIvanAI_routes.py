from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise HTTPException(status_code=500, detail="GROQ_API_KEY not found")

groq_client = Groq(api_key=GROQ_API_KEY)

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/api/chat/")
async def chat(request: ChatRequest):
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
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
