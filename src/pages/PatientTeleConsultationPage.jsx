import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JitsiMeetComponent from "../components/PatientJitsiMeet";
import { FaChevronLeft, FaChevronRight, FaQuestionCircle, FaPrint } from "react-icons/fa";

const PatientTeleConsultationPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRequestingHelp, setIsRequestingHelp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve JWT and condition from navigation state (from WaitingScreen)
  const { jwt, condition } = location.state || { jwt: "", condition: "General" };

  const goToMainMenu = () => {
    navigate("/menu");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 p-4">
      {/* Left Side: Jitsi Video Call (85% default, 60% when expanded) */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "w-[60%]" : "w-[85%]"
        } h-full flex items-center justify-center p-4`}
      >
        <div className="w-full h-full bg-gray-100 shadow-md rounded-xl overflow-hidden">
          {/* Pass JWT and condition to the PatientJitsiMeet component via location state or props */}
          <JitsiMeetComponent jwt={jwt} condition={condition} />
        </div>
      </div>

      {/* Right Side: Patient's Panel (Collapsible) */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "w-[40%]" : "w-[15%]"
        } h-full p-6 bg-white shadow-lg rounded-xl flex flex-col items-center space-y-6`}
      >
        {/* Expand/Collapse Button */}
        <button
          className="p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
        </button>

        {/* Collapsed View: Doctor Information */}
        {!isExpanded && (
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-700">Dr. Aryan Sharma</h3>
            <p className="text-gray-600 text-sm">Dentist</p>
            <p className="text-gray-500 text-xs">Experience: 10+ years</p>
          </div>
        )}

        {/* Expanded View: Assistance and Prescription */}
        {isExpanded && (
          <>
            <h2 className="text-2xl font-bold text-gray-700">Need Help?</h2>
            <p className="text-gray-600 text-center">
              If you need assistance, click below to notify the doctor.
            </p>
            <button
              onClick={() => setIsRequestingHelp(true)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-md transition ${
                isRequestingHelp ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              } text-white`}
              disabled={isRequestingHelp}
            >
              <FaQuestionCircle size={20} />
              <span>{isRequestingHelp ? "Help Requested" : "Request Assistance"}</span>
            </button>
            {isRequestingHelp && (
              <p className="text-gray-700 mt-4">Your request has been sent to the doctor.</p>
            )}
            <div className="w-full bg-gray-100 p-4 rounded-md shadow-md text-center">
              <h3 className="text-lg font-bold text-gray-700">Prescription</h3>
              <p className="text-gray-600">Medicine: Paracetamol 500mg</p>
              <p className="text-gray-600">Dosage: Twice a day</p>
              <button className="mt-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
                <FaPrint size={20} className="mr-2" /> Print Prescription
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Menu Button (Bottom Right Corner) */}
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
