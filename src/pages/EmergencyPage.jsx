import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KioskButton from "../components/KioskButton";
import EmergencyReset from "../components/EmergencyReset";

const EmergencyPage = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [age, setAge] = useState("");

  const emergencyIssues = [
    "Heart Attack Symptoms",
    "Severe Injury",
    "Breathing Difficulty",
    "Unconsciousness",
    "High Fever & Seizures",
  ];

  const handleProceed = () => {
    if (selectedIssue && age) {
      navigate("/WaitingScreen"); // ✅ FIX: Redirect properly to WaitingScreen
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-6">
      {/* Emergency Header */}
      <h1 className="text-4xl font-bold text-red-700 mb-4">🚨 Emergency Assistance</h1>
      <p className="text-lg text-gray-800">Select your emergency issue and proceed.</p>

      <div className="flex w-full max-w-4xl mt-6 gap-6">
        {/* Left Section: Emergency Issues */}
        <div className="flex flex-col w-1/2 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Select an Emergency:</h2>
          <div className="grid grid-cols-1 gap-3">
            {emergencyIssues.map((issue, index) => (
              <KioskButton
                key={index}
                text={issue}
                onClick={() => setSelectedIssue(issue)}
                color={selectedIssue === issue ? "red" : "gray"}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Consultation Options */}
        <div className="flex flex-col w-1/2 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Proceed with Assistance:</h2>
          
          {/* Age Input */}
          <div className="mb-4">
            <p className="text-gray-700">Enter Your Age:</p>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded-lg mt-2 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter Age"
            />
          </div>

          {/* Buttons in Parallel */}
          <div className="grid grid-cols-2 gap-4">
            {/* 🔹 Fixed Navigation & Improved Buttons */}
            <button
              onClick={() => navigate("/waiting")}
              className="flex items-center justify-center bg-[#0F9D58] text-white px-4 py-3 rounded-lg shadow-lg hover:bg-[#0C7D44] transition-all duration-300"
            >
              🏥 Consult with Doctor
            </button>
            <button
              onClick={() => navigate("/aidoctor")}
              className="flex items-center justify-center bg-[#4285F4] text-white px-4 py-3 rounded-lg shadow-lg hover:bg-[#2B6CD2] transition-all duration-300"
            >
              🤖 AI Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Reset Button at Bottom */}
      <div className="mt-6">
        <EmergencyReset onReset={() => navigate("/")} />
      </div>
    </div>
  );
};

export default EmergencyPage;
