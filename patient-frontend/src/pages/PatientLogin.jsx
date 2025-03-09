import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const commonDiseases = [
  "Fever",
  "Cough & Cold",
  "Headache",
  "Stomach Pain",
  "Dental Issues",
  "Other",
];

const StepsPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    reason: "",
    customReason: "",
  });
  const [patientId, setPatientId] = useState(null);

  const questions = [
    { key: "name", text: "What is your name?", type: "text", voicePrompt: "Please enter your name" },
    { key: "age", text: "How old are you?", type: "number", voicePrompt: "Please enter your age" },
    { key: "reason", text: "Select your concern", type: "dropdown", voicePrompt: "Please tell your concern" },
  ];

  useEffect(() => {
    const synth = window.speechSynthesis;

    const speakPrompt = () => {
      const voices = synth.getVoices();
      const selectedVoice = voices.find(
        (voice) => voice.name.includes("Google") && voice.lang.includes("en")
      );

      const utter = new SpeechSynthesisUtterance(questions[step].voicePrompt);
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 0.9;
      synth.cancel();
      synth.speak(utter);
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = speakPrompt;
    } else {
      speakPrompt();
    }
  }, [step]);

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const payload = { ...userData, age: Number(userData.age) };
        const response = await axios.post(
          "https://bharat-telemed-patient-1.onrender.com/patients/",
          payload
        );
        setPatientId(response.data.id);
      } catch (error) {
        console.error("Error saving patient data", error);
        const errorMessage = error.response?.data?.detail || "Failed to save data.";
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleReset = () => {
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
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {patientId ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient ID: {patientId}</h2>
          <button
            onClick={() => navigate("/menu")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Go to Main Menu
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {questions[step].text}
          </h2>
          {questions[step].type !== "dropdown" ? (
            <input
              type={questions[step].type}
              value={userData[questions[step].key]}
              onChange={(e) =>
                setUserData({ ...userData, [questions[step].key]: e.target.value })
              }
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 text-lg py-2 text-center"
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
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 text-lg py-2 text-center"
              >
                <option value="">Select an option</option>
                {commonDiseases.map((disease, index) => (
                  <option key={index} value={disease}>{disease}</option>
                ))}
              </select>
              {userData.reason === "Other" && (
                <input
                  type="text"
                  placeholder="Enter your condition"
                  value={userData.customReason}
                  onChange={(e) =>
                    setUserData({ ...userData, customReason: e.target.value })
                  }
                  className="w-full border-b-2 border-gray-400 mt-3 focus:outline-none focus:border-blue-500 text-lg py-2 text-center"
                />
              )}
            </>
          )}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Next
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all"
            >
              Skip
            </button>
          </div>
          <button
            onClick={handleReset}
            className="absolute bottom-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default StepsPage;
