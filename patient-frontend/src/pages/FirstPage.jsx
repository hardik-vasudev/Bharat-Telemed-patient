import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-50 p-6">
      {/* Title / Branding */}
      <h1 className="text-4xl font-extrabold text-teal-800 mb-4 tracking-wide">
        Bharat-Telemed
      </h1>
      <p className="text-gray-700 text-lg mb-10">
        Your one-stop solution for Telemedicine
      </p>

      {/* Kiosk Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-md">
        {/* Patient Login */}
        <button
          onClick={() => navigate("/patientlogin")}
          className="bg-teal-600 text-white rounded-xl py-4 shadow-md text-xl font-semibold hover:bg-teal-700 transition transform hover:scale-105"
        >
          Patient Login
        </button>

        {/* Register as New */}
        <button
          onClick={() => navigate("/register")}
          className="bg-green-600 text-white rounded-xl py-4 shadow-md text-xl font-semibold hover:bg-green-700 transition transform hover:scale-105"
        >
          Register as New
        </button>
      </div>

      {/* Emergency Button */}
      <button
        onClick={() => navigate("/emergency")}
        className="mt-10 bg-red-600 text-white rounded-xl py-3 px-8 shadow-md text-lg font-semibold hover:bg-red-700 transition transform hover:scale-105"
      >
        Emergency
      </button>
    </div>
  );
}
