import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WaitingScreen = () => {
  // Replace this with your actual backend URL
  const BACKEND_URL = "https://bharat-telemed-patient-1.onrender.com";

  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingJwt, setLoadingJwt] = useState(false);

  const navigate = useNavigate();

  // 1. Fetch Patient Data from the Backend
  const handleFetchPatientData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(`🔍 Fetching data for patient ID: ${patientId}`);

      const response = await axios.get(`${BACKEND_URL}/patients/${patientId}`);
      console.log("✅ Patient Data Received:", response.data);

      setPatientData(response.data);
    } catch (err) {
      console.error("❌ Error fetching patient data:", err);
      setError('Failed to fetch patient data. Please check the Patient ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Join Teleconsultation by Fetching JWT
  const handleJoinTeleconsultation = async () => {
    if (!patientData) return;

    // Determine condition from the patient's data
    const condition =
      (patientData.reason && patientData.reason !== 'Other')
        ? patientData.reason
        : (patientData.customReason || 'General');

    try {
      setLoadingJwt(true);
      console.log(`🔍 Fetching JWT for condition: ${condition}`);

      const response = await axios.get(`${BACKEND_URL}/api/get-jwt`, {
        params: { condition }
      });

      const jwt = response.data.jwt;
      console.log("✅ JWT Received:", jwt);

      // Navigate to teleconsultation with JWT & condition
      navigate('/teleconsultation', { state: { jwt, condition } });
    } catch (err) {
      console.error("❌ Error fetching JWT:", err);
      // Even if JWT fails, still navigate to teleconsultation
      navigate('/teleconsultation', { state: { jwt: "", condition } });
    } finally {
      setLoadingJwt(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {/* If no patient data yet, show fetch UI */}
      {!patientData ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Waiting Room</h2>
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="border-2 border-gray-300 p-2 mb-4 rounded w-64 text-center"
          />
          <button
            onClick={handleFetchPatientData}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
            disabled={loading}
          >
            {loading ? 'Fetching Data...' : 'Fetch Data'}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Patient Details</h2>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Age:</strong> {patientData.age}</p>
          <p><strong>Concern:</strong> {patientData.reason}</p>
          <button
            onClick={handleJoinTeleconsultation}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700"
          >
            {loadingJwt ? 'Loading JWT...' : 'Join Teleconsultation'}
          </button>
        </div>
      )}
      {/* Main Menu Button */}
      <button
        onClick={() => navigate('/menu')}
        className="mt-6 bg-gray-500 text-white px-5 py-2 rounded-lg"
      >
        Main Menu
      </button>
    </div>
  );
};

export default WaitingScreen;
