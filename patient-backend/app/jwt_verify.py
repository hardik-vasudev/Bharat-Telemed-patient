from fastapi import FastAPI, HTTPException, Query
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise HTTPException(status_code=500, detail="MONGO_URI not found in .env")

client = MongoClient(MONGO_URI)
db = client["BharatTelemed"]
collection = db["patient_jwt"]

app = FastAPI()

@app.get("/api/get-jwt")
def get_jwt(condition: str = Query(...)):
    """
    Fetch the JWT associated with the given condition.
    For example, if condition is 'diabetes', it returns the stored JWT for diabetes.
    """
    doc = collection.find_one({"condition": condition})
    if doc and "jwt" in doc:
        return {"jwt": doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for condition")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
