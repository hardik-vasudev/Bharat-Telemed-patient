import React, { useRef, useEffect, useState } from "react";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PatientJitsiMeet = () => {
  const jitsiApiRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { condition } = state || { condition: "General" };
  const [jwt, setJwt] = useState(state?.jwt || "");

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

  useEffect(() => {
    console.log("PatientJitsiMeet - JWT:", jwt, "Condition:", condition);
  }, [jwt, condition]);

  if (!jwt) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold">Loading teleconsultation...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Container with enforced minimum dimensions for desktop layout */}
      <div className="absolute inset-0 min-w-[1200px] min-h-[800px]">
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
            TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"],
            MOBILE_APP_PROMO: false,
            VIDEO_LAYOUT_FIT: "both",
          }}
          userInfo={{ displayName: "Patient" }}
          onApiReady={(externalApi) => {
            jitsiApiRef.current = externalApi;
            externalApi.addEventListener("videoConferenceLeft", () =>
              navigate("/menu")
            );
          }}
          getIFrameRef={(iframeRef) => {
            // Force the iframe to fill the container
            iframeRef.style.width = "100%";
            iframeRef.style.height = "100%";
            iframeRef.style.border = "none";
          }}
        />
      </div>

      {/* Single Request Assistance Button overlaid at the bottom center */}
      <div className="absolute bottom-6 w-full flex justify-center">
        <button
          onClick={() => console.log("Request Assistance clicked")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Request Assistance
        </button>
      </div>
    </div>
  );
};

export default PatientJitsiMeet;
