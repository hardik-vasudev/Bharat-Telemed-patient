import React, { useRef, useEffect, useState } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { MessageSquare, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

/**
 * PatientJitsiMeet Component
 *
 * This component integrates Jitsi Meet for telemedicine consultations.
 * - Fetches a JWT token from the backend based on the patient's condition.
 * - Initializes the Jitsi meeting room.
 * - Provides a button to toggle chat within the meeting.
 *
 * Features:
 * - Auto-fetches JWT token for authentication.
 * - Uses Jitsi's React SDK to embed the meeting.
 * - Handles navigation after the meeting ends.
 */

const PatientJitsiMeet = () => {
  const jitsiApiRef = useRef(null);  // Ref to store Jitsi API instance
  const navigate = useNavigate();
  const { state } = useLocation(); // Extracts state from navigation
  const { condition } = state || { condition: "General" }; // Default condition if not provided
  const [jwt, setJwt] = useState(state?.jwt || ""); // JWT token for authentication
// Fetch JWT token if not available
  useEffect(() => {
    if (!jwt) {
      // Fetch the JWT from backend based on the condition
      axios
        .get("http://127.0.0.1:8000/api/get-jwt", { params: { condition } })
        .then((response) => {
          setJwt(response.data.jwt);
        })
        .catch((error) => {
          console.error("Error fetching JWT:", error);
        });
    }
  }, [jwt, condition]);
// Debugging: Log JWT and condition updates
  useEffect(() => {
    console.log("PatientJitsiMeet - JWT:", jwt, "Condition:", condition);
  }, [jwt, condition]);
// Function to toggle chat visibility in Jitsi
  const toggleChat = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleChat");
    }
  };

  // Display a loading message while JWT is being fetched
  if (!jwt) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold">Loading teleconsultation...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <JaaSMeeting
        appId="vpaas-magic-cookie-c85c2e0743c543eca03932757a05a554"
        domain="8x8.vc"
        roomName="TelemedRoom"
        jwt={jwt}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: ["microphone", "camera", "tileview", "hangup"],
          MOBILE_APP_PROMO: false,
          VIDEO_LAYOUT_FIT: "both",
        }}
        userInfo={{ displayName: "Patient" }}
        onApiReady={(externalApi) => {
          jitsiApiRef.current = externalApi;
          externalApi.addEventListener("videoConferenceLeft", () => navigate("/menu"));
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.width = "100%";
          iframeRef.style.height = "100%";
          iframeRef.style.border = "none";
        }}
      />
      {/* Toggle Chat Button */}
      <button
        className="absolute bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:bg-green-700 transition"
        onClick={toggleChat}
      >
        <MessageSquare size={20} />
        <span>Toggle Chat</span>
      </button>
       {/* Patient Info Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
        <User size={24} className="text-gray-700" />
        <span className="text-gray-900 font-medium">Patient</span>
      </div>
    </div>
  );
};

export default PatientJitsiMeet;
