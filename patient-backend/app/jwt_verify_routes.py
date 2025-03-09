from fastapi import APIRouter, HTTPException, Query
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise HTTPException(status_code=500, detail="MONGO_URI not found")

client = MongoClient(MONGO_URI)
db = client["BharatTelemed"]
collection = db["patient_jwt"]

router = APIRouter()

@router.get("/api/get-jwt")
def get_jwt(condition: str = Query(...)):
    """
    Fetch the JWT associated with the given condition.
    """
    doc = collection.find_one({"condition": condition})
    if doc and "jwt" in doc:
        return {"jwt": doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for condition")
