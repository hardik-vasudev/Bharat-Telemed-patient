import React, { useRef, useEffect, useState } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { MessageSquare, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PatientJitsiMeet = () => {
  const jitsiApiRef = useRef(null); // Ref to store Jitsi API instance
  const navigate = useNavigate();
  const { state } = useLocation();
  const { condition } = state || { condition: "General" };
  const [jwt, setJwt] = useState(state?.jwt || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // Fetch JWT token if not available
  useEffect(() => {
    const fetchJwt = async () => {
      if (!jwt) {
        setLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/api/get-jwt`, { params: { condition } });
          setJwt(response.data.jwt);
        } catch (err) {
          console.error("Error fetching JWT:", err);
          setError("Failed to load consultation room. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJwt();
  }, [jwt, condition]);

  // Debugging: Log JWT and condition updates
  useEffect(() => {
    console.log("PatientJitsiMeet - JWT:", jwt, "Condition:", condition);
  }, [jwt, condition]);

  // Function to toggle chat visibility in Jitsi
  const toggleChat = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("toggleChat");
    } else {
      setError("Chat feature is unavailable. Try reloading the page.");
    }
  };

  // Display error or loading message
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold">Loading teleconsultation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <JaaSMeeting
        appId="vpaas-magic-cookie-c85c2e0743c543eca03932757a05a554"
        domain="8x8.vc"
        roomName={`BharatTelemed-${condition}`}
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
