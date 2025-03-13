import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Common concerns for the dropdown
const commonDiseases = [
  "Fever",
  "Cough & Cold",
  "Headache",
  "Stomach Pain",
  "Dental Issues",
  "Other",
];

export default function StepsPage() {
  const navigate = useNavigate();

  // Step index
  const [step, setStep] = useState(0);
  // Collected user data
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    reason: "",
    customReason: "",
  });
  // If patient data was saved, we get an ID
  const [patientId, setPatientId] = useState(null);

  // The multi-step questions
  const questions = [
    {
      key: "name",
      text: "What is your name?",
      type: "text",
      voicePrompt: "Please enter your name",
    },
    {
      key: "age",
      text: "How old are you?",
      type: "number",
      voicePrompt: "Please enter your age",
    },
    {
      key: "reason",
      text: "Select your concern",
      type: "dropdown",
      voicePrompt: "Please tell your concern",
    },
  ];

  // Voice prompt for each step
  useEffect(() => {
    const synth = window.speechSynthesis;

    const speakPrompt = () => {
      // Safety check if step changed quickly
      if (!questions[step]) return;

      const voices = synth.getVoices();
      // Attempt a Google English voice
      const selectedVoice = voices.find(
        (voice) => voice.name.includes("Google") && voice.lang.includes("en")
      );

      const utter = new SpeechSynthesisUtterance(questions[step].voicePrompt);
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 0.9; // Slightly slower for clarity

      // Stop any ongoing speech, then speak the prompt
      synth.cancel();
      synth.speak(utter);
    };

    // If voices might load late
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = speakPrompt;
    } else {
      speakPrompt();
    }
  }, [step, questions]);

  // "Next" button logic
  const handleNext = async () => {
    // If not on last question
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Submit data to backend
      try {
        const payload = { ...userData, age: Number(userData.age) };
        // Example endpoint
        const response = await axios.post(
          "https://bharat-telemed-patient-1.onrender.com/patients/",
          payload
        );
        setPatientId(response.data.id);
      } catch (error) {
        console.error("Error saving patient data", error);
        const errorMessage =
          error.response?.data?.detail || "Failed to save data.";
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  // "Reset" button
  const handleReset = () => {
    // Reset step & data
    setStep(0);
    setUserData({
      name: "",
      age: "",
      reason: "",
      customReason: "",
    });
    setPatientId(null);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-teal-50 p-6">
      {patientId ? (
        // After data is saved
        <div className="bg-white p-8 rounded-md shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-teal-800 mb-4">
            Patient ID: {patientId}
          </h2>
          <p className="text-gray-700 mb-6">
            Your patient record has been created successfully.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-teal-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all text-lg font-medium"
          >
            Go to Main Menu
          </button>
        </div>
      ) : (
        // During multi-step
        <div className="bg-white p-8 rounded-md shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-teal-800 mb-6">
            {questions[step].text}
          </h2>

          {questions[step].type !== "dropdown" ? (
            <input
              type={questions[step].type}
              value={userData[questions[step].key]}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  [questions[step].key]: e.target.value,
                })
              }
              className="w-full border-b-2 border-teal-300 focus:outline-none focus:border-teal-500 text-lg py-2 text-center mb-4"
            />
          ) : (
            <>
              <select
                value={userData.reason}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    reason: e.target.value,
                    customReason: "",
                  })
                }
                className="w-full border-b-2 border-teal-300 focus:outline-none focus:border-teal-500 text-lg py-2 text-center mb-4"
              >
                <option value="">Select an option</option>
                {commonDiseases.map((disease, idx) => (
                  <option key={idx} value={disease}>
                    {disease}
                  </option>
                ))}
              </select>
              {userData.reason === "Other" && (
                <input
                  type="text"
                  placeholder="Enter your condition"
                  value={userData.customReason}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      customReason: e.target.value,
                    })
                  }
                  className="w-full border-b-2 border-teal-300 focus:outline-none focus:border-teal-500 text-lg py-2 text-center"
                />
              )}
            </>
          )}

          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={handleNext}
              className="bg-teal-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all text-lg font-medium transform hover:scale-105"
            >
              Next
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="bg-gray-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-gray-600 transition-all text-lg font-medium transform hover:scale-105"
            >
              Skip
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all text-lg font-medium transform hover:scale-105"
            >
              Home
            </button>
          </div>
        </div>
      )}

      {/* Reset Button (Bottom Right) */}
      <button
        onClick={handleReset}
        className="absolute bottom-6 right-6 bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-800 transition-all text-lg font-medium transform hover:scale-105"
      >
        Reset
      </button>
    </div>
  );
}
