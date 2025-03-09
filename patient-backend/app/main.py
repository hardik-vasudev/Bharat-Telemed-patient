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

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise Exception("MONGO_URI not found in .env")

try:
    client = MongoClient(MONGO_URI)
    # Log connection info (this forces a call to the server)
    print("Connected to MongoDB:", client.server_info())
except Exception as e:
    print("Failed to connect to MongoDB:", e)
    raise Exception("Failed to connect to MongoDB")

db = client["BharatTelemed"]
patients_collection = db["patients"]
jwt_collection = db["patient_jwt"]

# GROQ API configuration
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
    allow_origins=["*"],  # Update for production as needed
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
    customReason: str | None = None  # Optional field; requires Python 3.10+

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
    """
    Root endpoint to verify that the FastAPI server is running.
    """
    return {"message": "FastAPI server is running!"}

@app.post("/patients/")
async def create_patient(patient: Patient):
    """
    Create a new patient record.
    
    - Generates a short unique ID for the patient.
    - Inserts the patient data into the MongoDB 'patients' collection.
    - Returns the new patient ID and a success message.
    """
    try:
        patient_data = patient.dict()
        patient_data["patient_id"] = generate_short_id()
        patients_collection.insert_one(patient_data)
        return {"id": patient_data["patient_id"], "message": "Patient data inserted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    """
    Retrieve patient details by patient_id.
    
    - Searches the 'patients' collection for a matching patient_id.
    - Returns the patient details if found, else a 404 error.
    """
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient:
        patient["_id"] = str(patient["_id"])  # Convert MongoDB ObjectId to string for JSON serialization
        return patient
    else:
        raise HTTPException(status_code=404, detail="Patient not found")

@app.get("/api/get-jwt")
async def get_jwt(condition: str = Query(...)):
    """
    Fetch the JWT associated with a specific condition.
    
    - Accepts a 'condition' query parameter.
    - Searches the 'patient_jwt' collection for a document matching the condition.
    - Returns the JWT if found, else raises a 404 error.
    """
    jwt_doc = jwt_collection.find_one({"condition": condition})
    if jwt_doc and "jwt" in jwt_doc:
        return {"jwt": jwt_doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for condition")

@app.post("/api/chat/")
async def chat(request: ChatRequest):
    """
    Chat endpoint for the Groq-powered AI health assistant.
    
    - Receives a chat message from the client.
    - Sends the message along with a system prompt to the Groq API.
    - The system prompt instructs the AI to diagnose ailments and provide concise recovery plans.
    - The response is formatted in bullet points and includes a medical disclaimer.
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
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------
# Run the application locally
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
