from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

# -----------------------------------------------------------------------------
# Load environment variables
# -----------------------------------------------------------------------------
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
jwt_collection = db["patient_jwt"]

# GROQ API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise Exception("GROQ_API_KEY not found in .env")
groq_client = Groq(api_key=GROQ_API_KEY)

# -----------------------------------------------------------------------------
# Initialize FastAPI application and middleware
# -----------------------------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Data Models
# -----------------------------------------------------------------------------
class Patient(BaseModel):
    name: str
    age: int
    reason: str
    customReason: str | None = None

class ChatRequest(BaseModel):
    message: str

# -----------------------------------------------------------------------------
# Utility Functions
# -----------------------------------------------------------------------------
def generate_short_id():
    """Generate a short unique hexadecimal ID for a patient."""
    return os.urandom(4).hex()

# -----------------------------------------------------------------------------
# API Endpoints
# -----------------------------------------------------------------------------
@app.get("/")
def read_root():
    return {"message": "FastAPI server is running!"}

@app.post("/patients/")
async def create_patient(patient: Patient):
    try:
        patient_data = patient.dict()
        patient_data["patient_id"] = generate_short_id()
        patients_collection.insert_one(patient_data)
        return {"id": patient_data["patient_id"], "message": "Patient data inserted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient:
        patient["_id"] = str(patient["_id"])  # Convert ObjectId to string for JSON response
        print(f"✅ Found Patient Data for ID {patient_id}: {patient}")
        return patient
    else:
        print(f"❌ No Patient Data Found for ID {patient_id}")
        raise HTTPException(status_code=404, detail="Patient not found")

@app.get("/api/get-jwt")
async def get_jwt(condition: str = Query(...)):
    jwt_doc = jwt_collection.find_one({"condition": condition})
    if jwt_doc and "jwt" in jwt_doc:
        return {"jwt": jwt_doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for condition")

@app.post("/api/chat/")
async def chat(request: ChatRequest):
    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "Provide concise medical advice in bullet points."},
                {"role": "user", "content": request.message}
            ]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------
# Run the application locally
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
