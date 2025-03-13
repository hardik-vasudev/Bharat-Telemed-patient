import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Child components
import Teleconsultations from "../components/Teleconsultations";
import PatientReports from "../components/PatientReports";
import Schemes from "../components/Schemes";
import JivanAI from "../pages/JivanAI"; // For local reference if needed

// Icons from lucide-react
import { User, Stethoscope, FileText, HeartPulse, BrainCircuit } from "lucide-react";

// Dummy data
const dummyData = {
  patient: {
    name: "Hardik Vasudev",
    age: 25,
    patientId: "22BAI71380",
    currentDoctor: "Dr. Sharma",
    lastConsultation: "2025-02-10 @ 11:00 AM (General Checkup)",
    upcomingTeleconsultation: {
      doctor: "Dr. Gupta",
      date: "2025-03-15 @ 10:00 AM",
      concern: "Diabetes Follow-up",
    },
    importantMessages: ["Take medication on time", "Blood test due in 3 days"],
  },
};

export default function PatientDetails() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("about");

  // Sidebar items
  const sidebarItems = [
    { key: "about", label: "About", icon: <User size={20} /> },
    { key: "teleconsultations", label: "Teleconsultations", icon: <Stethoscope size={20} /> },
    { key: "reports", label: "Reports", icon: <FileText size={20} /> },
    { key: "schemes", label: "Schemes", icon: <HeartPulse size={20} /> },
    // This one navigates externally to "/jivanai"
    { key: "jivanai", label: "JivanAI", icon: <BrainCircuit size={20} />, isExternal: true },
  ];

  const handleSidebarClick = (item) => {
    // If JivanAI, navigate to "/jivanai" route from App.js
    if (item.isExternal) {
      navigate("/jivanai");
    } else {
      setActiveSection(item.key);
    }
  };

  return (
    <div className="flex h-screen bg-green-50">
      {/* Fixed Sidebar */}
      <aside className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 bg-green-700 text-white text-xl font-bold text-center">
          Patient Dashboard
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-3">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSidebarClick(item)}
              className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition ${
                activeSection === item.key
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-green-200"
              }`}
            >
              {item.icon}
              <span className="text-lg font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Menu Button */}
        <div className="p-4">
          <button
            onClick={() => navigate("/menu")}
            className="w-full bg-gray-700 text-white py-3 rounded-md hover:bg-gray-800 text-lg"
          >
            Main Menu
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* ABOUT SECTION */}
          {activeSection === "about" && (
            <div className="bg-white rounded-md shadow p-6 border-l-4 border-green-700">
              <h2 className="text-2xl font-bold mb-4 text-green-800">Patient Details</h2>

              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Name:</strong> {dummyData.patient.name}
                </p>
                <p>
                  <strong>Age:</strong> {dummyData.patient.age}
                </p>
                <p>
                  <strong>Patient ID:</strong> {dummyData.patient.patientId}
                </p>
                <p>
                  <strong>Current Doctor:</strong> {dummyData.patient.currentDoctor}
                </p>
                <p>
                  <strong>Last Consultation:</strong> {dummyData.patient.lastConsultation}
                </p>
              </div>

              {/* Upcoming Teleconsultation */}
              {dummyData.patient.upcomingTeleconsultation && (
                <div className="bg-green-100 p-4 rounded-md mt-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Upcoming Teleconsultation
                  </h3>
                  <p className="text-gray-800">
                    <strong>Doctor:</strong> {dummyData.patient.upcomingTeleconsultation.doctor}
                  </p>
                  <p className="text-gray-800">
                    <strong>Date & Time:</strong> {dummyData.patient.upcomingTeleconsultation.date}
                  </p>
                  <p className="text-gray-800">
                    <strong>Concern:</strong> {dummyData.patient.upcomingTeleconsultation.concern}
                  </p>
                </div>
              )}

              {/* Important Messages */}
              {dummyData.patient.importantMessages?.length > 0 && (
                <div className="bg-green-100 p-4 rounded-md mt-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Important Messages
                  </h3>
                  {dummyData.patient.importantMessages.map((msg, idx) => (
                    <p key={idx} className="text-gray-800">
                      • {msg}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Teleconsultations Section */}
          {activeSection === "teleconsultations" && <Teleconsultations />}

          {/* Reports Section */}
          {activeSection === "reports" && <PatientReports />}

          {/* Schemes Section */}
          {activeSection === "schemes" && <Schemes />}

          {/* We do NOT render <JivanAI /> here because 
              the user navigates to "/jivanai" directly. */}
        </div>
      </main>
    </div>
  );
}
