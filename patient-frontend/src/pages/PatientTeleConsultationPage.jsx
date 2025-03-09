import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JitsiMeetComponent from "../components/PatientJitsiMeet";

const PatientTeleConsultationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract JWT token and patient condition from navigation state (default to "General" if missing)
  const { jwt, condition } = location.state || { jwt: "", condition: "General" };

  // Navigate back to the main menu
  const goToMainMenu = () => {
    navigate("/menu");
  };

  // Display loading message if JWT is not available (prevents rendering Jitsi without authentication)
  if (!jwt) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold">Loading teleconsultation...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      {/* Embed Jitsi video call, occupying the full screen */}
      <div className="w-full h-full">
        <JitsiMeetComponent jwt={jwt} condition={condition} />
      </div>

      {/* Floating button to return to the main menu */}
      <button
        onClick={goToMainMenu}
        className="fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Main Menu
      </button>
    </div>
  );
};

export default PatientTeleConsultationPage;

