import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WaitingScreen = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingJwt, setLoadingJwt] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


  const handleFetchPatientData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/patients/${patientId}`);
      setPatientData(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch patient data. Please check the Patient ID and try again.');
    }
  };

  const handleJoinTeleconsultation = async () => {
    if (!patientData) return;

    const condition =
      (patientData.reason && patientData.reason !== 'Other')
        ? patientData.reason
        : (patientData.customReason || 'General');

    try {
      setLoadingJwt(true);
      const response = await axios.get(`${BASE_URL}/api/get-jwt`, { params: { condition } });
      const jwt = response.data.jwt;
      setLoadingJwt(false);
      navigate('/teleconsultation', { state: { jwt, condition } });
    } catch (err) {
      setLoadingJwt(false);
      navigate('/teleconsultation', { state: { jwt: "", condition } }); // Redirect even if JWT fails
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {!patientData ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Waiting Room</h2>
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="border-2 border-gray-300 p-2 mb-4 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          />
          <button
            onClick={handleFetchPatientData}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all mb-4"
            disabled={loading}
          >
            {loading ? 'Fetching Data...' : 'Fetch Data'}
          </button>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </>
      ) : (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Patient Details</h2>
          <p className="mb-2"><strong>Name:</strong> {patientData.name}</p>
          <p className="mb-2"><strong>Age:</strong> {patientData.age}</p>
          <p className="mb-4"><strong>Concern:</strong> {patientData.reason}</p>
          <button
            onClick={handleJoinTeleconsultation}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            {loadingJwt ? 'Loading JWT...' : 'Join Teleconsultation'}
          </button>
        </div>
      )}
      <button
        onClick={() => navigate('/menu')}
        className="mt-6 bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all"
      >
        Main Menu
      </button>
    </div>
  );
};

export default WaitingScreen;
