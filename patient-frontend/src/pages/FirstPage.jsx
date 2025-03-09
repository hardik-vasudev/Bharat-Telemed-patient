import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import KioskButton from "../components/KioskButton";
import EmergencyPage from "./EmergencyPage";

const FirstPage = () => {
  // State management for multi-step form
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  // Function to proceed to the next step
  const goNext = () => setStep(step + 1);

  // Function to skip directly to options
  const skipToOptions = () => setStep(4);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-6">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-blue-700">Welcome to Bharat Telemed</h1>

      {/* Step 1: Name Input */}
      {step === 1 && (
        <div className="mt-6 w-80">
          <TextInput label="Type Your Name:" value={name} onChange={(e) => setName(e.target.value)} />
          <KioskButton text="Next" onClick={goNext} color="green" />
          <KioskButton text="Skip" onClick={skipToOptions} color="gray" />
        </div>
      )}

      {/* Step 2: Age Input */}
      {step === 2 && (
        <div className="mt-6 w-80">
          <TextInput label="Enter Your Age:" value={age} onChange={(e) => setAge(e.target.value)} />
          <KioskButton text="Next" onClick={goNext} color="green" />
        </div>
      )}

      {/* Step 3: Reason for Visit */}
      {step === 3 && (
        <div className="mt-6 w-80">
          <TextInput label="What brings you here?" value={reason} onChange={(e) => setReason(e.target.value)} />
          <KioskButton text="Proceed" onClick={goNext} color="green" />
        </div>
      )}

      {/* Step 4: Service Options */}
      {step === 4 && (
        <div className="mt-6 w-80 grid grid-cols-2 gap-4">
          <KioskButton text="🩺 Teleconsultation" onClick={() => {}} />
          <KioskButton text="🤖 AI Doctor" onClick={() => {}} />
          <KioskButton text="💬 JivanAI Chatbot" onClick={() => {}} />
          <KioskButton text="🔑 Patient Login" onClick={() => {}} />
        </div>
      )}

      {/* Emergency Button */}
      <div className="mt-6">
        <KioskButton text="🚨 Emergency" onClick={() => navigate("/emergency")} color="red" />
      </div>
    </div>
  );
};

export default FirstPage;
