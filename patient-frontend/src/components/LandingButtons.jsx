import React from "react";
import { useNavigate } from "react-router-dom";
/**
 * LandingButtons Component
 *
 * A UI component for the landing page that includes:
 * - An "Emergency" button (top-right) that navigates to the emergency page.
 * - A "Reset" button (bottom-right) for resetting the system (functionality not defined yet).
 * - A "Start" button (centered) to initiate the main process.
 *
 * Props:
 * @param {function} onStart - Callback function triggered when the "Start" button is clicked.
 */
const LandingButtons = ({ onStart }) => {
  const navigate = useNavigate(); // Initialize navigation hook

  return (
    <div className="fixed w-full h-full flex justify-between p-4">
     {/* Emergency Button (Top Right) - Navigates to the Emergency page */}
      <button
        onClick={() => navigate("/emergency")} // Navigate to Emergency page
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700"
      >
        🚨 Emergency
      </button>

      {/* Reset Button (Bottom Right) - Placeholder for reset functionality */}
      <button className="absolute bottom-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700">
        Reset
      </button>

      {/* Start Button (Centered) - Triggers the onStart function */}
      <div className="w-full h-full flex flex-col items-center justify-center">
        <button
          onClick={onStart}
          className="bg-green-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 mt-10"
        >
          ▶ Start
        </button>
      </div>
    </div>
  );
};

export default LandingButtons;
