import React from "react";
import { useNavigate } from "react-router-dom";

const LandingButtons = ({ onStart }) => {
  const navigate = useNavigate(); // Initialize navigation hook

  return (
    // Full-screen container for positioning buttons
    <div className="fixed inset-0 p-4 pointer-events-none">
      {/* Emergency Button (Top Right) */}
      <button
        onClick={() => navigate("/emergency")}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 pointer-events-auto"
      >
        🚨 Emergency ok
      </button>

      {/* Reset Button (Bottom Right) */}
      <button
        className="absolute bottom-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 pointer-events-auto"
      >
        Reset
      </button>

      {/* Start Button (Centered horizontally and now positioned lower to avoid overlapping the welcome text) */}
      <button
        onClick={onStart}
        className="absolute left-1/2 transform -translate-x-1/2 top-[85%] bg-green-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 pointer-events-auto"
      >
        ▶ Start
      </button>
    </div>
  );
};

export default LandingButtons;
