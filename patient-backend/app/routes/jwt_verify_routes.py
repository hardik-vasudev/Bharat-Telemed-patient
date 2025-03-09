from fastapi import APIRouter, HTTPException, Query
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Retrieve MongoDB connection URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise HTTPException(status_code=500, detail="MONGO_URI not found")

# Initialize MongoDB client and connect to the database
client = MongoClient(MONGO_URI)
db = client["BharatTelemed"]  # Database for BharatTelemed platform
collection = db["patient_jwt"]  # Collection storing JWTs associated with conditions

# Create API router for handling JWT retrieval requests
router = APIRouter()

@router.get("/api/get-jwt")
def get_jwt(condition: str = Query(..., description="Condition for which JWT is required")):
    """
    Retrieve the JWT token associated with a specific medical condition.

    - **condition**: The condition for which JWT is needed.
    - **Returns**: A dictionary containing the JWT if found.
    - **Raises**:
        - 404 if no matching JWT is found.
    """
    doc = collection.find_one({"condition": condition})  # Search for the JWT in the database
    if doc and "jwt" in doc:
        return {"jwt": doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for the specified condition")

