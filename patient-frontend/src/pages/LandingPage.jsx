import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus, FaStethoscope } from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();

  // Whether to show the "Start" options pop-up
  const [showStartOptions, setShowStartOptions] = useState(false);

  // Handle "Start" button click
  const handleStart = () => {
    setShowStartOptions(true);
  };

  // Go to Patient Login
  const handlePatientLogin = () => {
    navigate("/patientlogin");
  };

  // Go to "steps" route for new patient registration
  const handleRegister = () => {
    navigate("/steps");
  };

  // Emergency button
  const handleEmergency = () => {
    navigate("/emergency");
  };

  // Reset button placeholder
  const handleReset = () => {
    alert("Reset functionality is not implemented yet.");
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-teal-50">
      {/* Title / Tagline */}
      <h1 className="text-4xl font-extrabold text-teal-800 mb-4 tracking-wide">
        Bharat-Telemed
      </h1>
      <p className="text-lg text-gray-700 mb-10">
        Your one-stop solution for Telemedicine
      </p>

      {/* "Start" Button */}
      {!showStartOptions && (
        <button
          onClick={handleStart}
          className="bg-green-600 text-white text-xl font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          Start
        </button>
      )}

      {/* Pop-up with two options: Patient Login & Register */}
      {showStartOptions && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-teal-700 mb-4 flex items-center justify-center gap-2">
              <FaStethoscope />
              How can we help you?
            </h2>
            <div className="flex flex-col gap-4">
              {/* Patient Login */}
              <button
                onClick={handlePatientLogin}
                className="bg-teal-600 text-white flex items-center justify-center gap-2 px-5 py-3 rounded-md font-medium hover:bg-teal-700 transition transform hover:scale-105"
              >
                <FaUser size={20} />
                Patient Login
              </button>
              {/* Register as New (goes to /steps) */}
              <button
                onClick={handleRegister}
                className="bg-green-600 text-white flex items-center justify-center gap-2 px-5 py-3 rounded-md font-medium hover:bg-green-700 transition transform hover:scale-105"
              >
                <FaUserPlus size={20} />
                Register as New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Button (Top Right) */}
      <button
        onClick={handleEmergency}
        className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition transform hover:scale-105"
      >
        🚨 Emergency
      </button>

      {/* Reset Button (Bottom Right) */}
      <button
        onClick={handleReset}
        className="absolute bottom-6 right-6 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition transform hover:scale-105"
      >
        Reset
      </button>
    </div>
  );
}
