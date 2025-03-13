from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os
import re

# -------------------------------------------------------------------------
# Load environment variables
# -------------------------------------------------------------------------
load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise Exception("MONGO_URI not found in .env")

try:
    client = MongoClient(MONGO_URI)
    print("✅ Connected to MongoDB:", client.server_info())
except Exception as e:
    print("❌ Failed to connect to MongoDB:", e)
    raise Exception("Failed to connect to MongoDB")

db = client["BharatTelemed"]
patients_collection = db["patients"]

# GROQ API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise Exception("GROQ_API_KEY not found in .env")

groq_client = Groq(api_key=GROQ_API_KEY)

# -------------------------------------------------------------------------
# Initialize FastAPI application and middleware
# -------------------------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------------
# Data Models
# -------------------------------------------------------------------------
class Patient(BaseModel):
    name: str
    age: int
    reason: str
    customReason: str | None = None

class ChatRequest(BaseModel):
    message: str

# -------------------------------------------------------------------------
# Utility Functions
# -------------------------------------------------------------------------
def generate_short_id():
    """Generate a short unique hexadecimal ID for a patient."""
    return os.urandom(4).hex()

def find_patient_data_in_db(patient_id: str):
    """Retrieve patient data by patient_id from MongoDB."""
    patient = patients_collection.find_one({"patient_id": patient_id})
    if not patient:
        return None
    # Convert _id to string
    patient["_id"] = str(patient["_id"])
    return patient

def build_system_prompt(patient_data: dict | None = None):
    """
    Build a system prompt for Groq that:
      - Acts like a real doctor
      - Provides short, human-like responses
      - No bullet points, no asterisks
      - Respond in user's language if recognized
      - If patient_data is provided, mention it
    """
    base_prompt = (
        "You are JivanAI, an advanced AI Doctor. "
        "Speak like a real human doctor in a conversational tone. "
        "Never use bullet points or asterisks. "
        "If the user is speaking in Hindi, respond in Hindi. If in English, respond in English. "
        "Give short, direct medical advice. "
        "If the user provided a patient ID, reference their data if relevant. "
        "Avoid disclaimers and keep it succinct."
    )

    if patient_data:
        base_prompt += (
            f" The patient's name is {patient_data.get('name')}, age {patient_data.get('age')}. "
            f"Reason: {patient_data.get('reason', 'N/A')}. "
        )
    return base_prompt

def remove_bullets_and_asterisks(text: str) -> str:
    """Remove bullet points or asterisks from text."""
    return re.sub(r"[*•]", "", text)

# -------------------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------------------
@app.get("/")
def read_root():
    return {"message": "JivanAI Doctor backend running!"}

@app.post("/patients/")
async def create_patient(patient: Patient):
    """
    Create a new patient record with a short unique ID.
    """
    try:
        patient_data = patient.dict()
        patient_data["patient_id"] = generate_short_id()
        patients_collection.insert_one(patient_data)
        return {
            "id": patient_data["patient_id"],
            "message": "Patient data inserted successfully",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    """
    Retrieve patient details by patient_id.
    """
    patient = find_patient_data_in_db(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.post("/api/chat/")
async def chat(request: ChatRequest):
    """
    Main chat endpoint for JivanAI.
    - Detect if user provided "my patient id is X"
    - If so, retrieve data from DB & incorporate into system prompt
    - Instruct Groq to produce short, no bullet/asterisk responses
    """
    user_message = request.message
    patient_data = None

    lowered = user_message.lower()
    if "my patient id is" in lowered:
        try:
            pid = lowered.split("my patient id is")[1].strip().split()[0]
            found = find_patient_data_in_db(pid)
            if found:
                patient_data = found
        except:
            pass

    system_prompt = build_system_prompt(patient_data=patient_data)

    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ]
        )
        ai_text = response.choices[0].message.content
        ai_text = remove_bullets_and_asterisks(ai_text)
        return {"response": ai_text}
    except Exception as e:
        print("Groq error:", e)
        raise HTTPException(status_code=500, detail="Failed to get response from Groq AI")

# -------------------------------------------------------------------------
# Run the application (host, port determined by environment or fallback)
# -------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    # For local dev, default to port 8000; in deployment, read from PORT env
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
