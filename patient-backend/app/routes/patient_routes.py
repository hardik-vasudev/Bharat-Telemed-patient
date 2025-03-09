from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Retrieve MongoDB connection URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise HTTPException(status_code=500, detail="MONGO_URI not found")  # Handle missing database URI

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["BharatTelemed"]  # Database for storing telemedicine-related data
patients_collection = db["patients"]  # Collection to store patient information

# Initialize API router
router = APIRouter()

# Define the data model for a patient
class Patient(BaseModel):
    name: str
    age: int
    reason: str
    customReason: str | None = None  # Optional field for custom consultation reasons

# Function to generate a unique short ID for each patient
def generate_short_id():
    return os.urandom(4).hex()  # Generates a random 8-character hexadecimal string

@router.post("/patients/")
async def create_patient(patient: Patient):
    """
    Inserts a new patient record into the database.

    - **Request Body**: Patient object containing name, age, reason, and optional custom reason.
    - **Returns**: Generated patient ID and a success message.
    - **Raises**:
        - 500 error if database insertion fails.
    """
    try:
        patient_data = patient.dict()  # Convert Pydantic model to dictionary
        patient_data["patient_id"] = generate_short_id()  # Assign a unique ID
        patients_collection.insert_one(patient_data)  # Insert data into MongoDB
        return {"id": patient_data["patient_id"], "message": "Patient data inserted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")  # Handle insertion errors

@router.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    """
    Retrieves patient data by patient ID.

    - **Path Parameter**: `patient_id` - Unique identifier assigned during insertion.
    - **Returns**: Patient data if 
