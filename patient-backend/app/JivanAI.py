from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat/")
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
