import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WaitingScreen() {
  // Replace this with your actual backend URL
  const BACKEND_URL = "https://bharat-telemed-patient-1.onrender.com";

  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingJwt, setLoadingJwt] = useState(false);

  const navigate = useNavigate();

  // 1. Fetch Patient Data from the Backend
  const handleFetchPatientData = async () => {
    try {
      setLoading(true);
      setError("");
      console.log(`🔍 Fetching data for patient ID: ${patientId}`);

      const response = await axios.get(`${BACKEND_URL}/patients/${patientId}`);
      console.log("✅ Patient Data Received:", response.data);

      setPatientData(response.data);
    } catch (err) {
      console.error("❌ Error fetching patient data:", err);
      setError(
        "Failed to fetch patient data. Please check the Patient ID and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Join Teleconsultation by Fetching JWT
  const handleJoinTeleconsultation = async () => {
    if (!patientData) return;

    // Determine condition from the patient's data
    const condition =
      patientData.reason && patientData.reason !== "Other"
        ? patientData.reason
        : patientData.customReason || "General";

    try {
      setLoadingJwt(true);
      console.log(`🔍 Fetching JWT for condition: ${condition}`);

      const response = await axios.get(`${BACKEND_URL}/api/get-jwt`, {
        params: { condition },
      });

      const jwt = response.data.jwt;
      console.log("✅ JWT Received:", jwt);

      // Navigate to teleconsultation with JWT & condition
      navigate("/teleconsultation", { state: { jwt, condition } });
    } catch (err) {
      console.error("❌ Error fetching JWT:", err);
      // Even if JWT fails, still navigate to teleconsultation
      navigate("/teleconsultation", { state: { jwt: "", condition } });
    } finally {
      setLoadingJwt(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-50 p-4">
      {!patientData ? (
        <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-teal-700">Waiting Room</h2>

          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="border-2 border-gray-300 p-2 mb-4 rounded w-full text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            onClick={handleFetchPatientData}
            className="bg-teal-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all w-full mb-2"
            disabled={loading}
          >
            {loading ? "Fetching Data..." : "Fetch Data"}
          </button>

          {error && (
            <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>
          )}
        </div>
      ) : (
        <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md text-left">
          <h2 className="text-2xl font-bold mb-4 text-teal-700">
            Patient Details
          </h2>
          <div className="space-y-2 text-gray-700 mb-4">
            <p>
              <strong>Name:</strong> {patientData.name}
            </p>
            <p>
              <strong>Age:</strong> {patientData.age}
            </p>
            <p>
              <strong>Concern:</strong> {patientData.reason}
            </p>
          </div>
          <button
            onClick={handleJoinTeleconsultation}
            className="bg-teal-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all"
            disabled={loadingJwt}
          >
            {loadingJwt ? "Loading JWT..." : "Join Teleconsultation"}
          </button>
        </div>
      )}

      <button
        onClick={() => navigate("/menu")}
        className="mt-6 bg-gray-700 text-white px-5 py-2 rounded-md shadow-md hover:bg-gray-800 transition-all"
      >
        Main Menu
      </button>
    </div>
  );
}
