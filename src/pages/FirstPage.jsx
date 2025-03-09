import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import KioskButton from "../components/KioskButton";
import EmergencyPage from "./EmergencyPage";

const FirstPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const goNext = () => setStep(step + 1);
  const skipToOptions = () => setStep(4);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to Bharat Telemed Ok </h1>

      {step === 1 && (
        <div className="mt-6 w-80">
          <TextInput label="Type Your Name:" value={name} onChange={(e) => setName(e.target.value)} />
          <KioskButton text="Next" onClick={goNext} color="green" />
          <KioskButton text="Skip" onClick={skipToOptions} color="gray" />
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 w-80">
          <TextInput label="Enter Your Age:" value={age} onChange={(e) => setAge(e.target.value)} />
          <KioskButton text="Next" onClick={goNext} color="green" />
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 w-80">
          <TextInput label="What brings you here?" value={reason} onChange={(e) => setReason(e.target.value)} />
          <KioskButton text="Proceed" onClick={goNext} color="green" />
        </div>
      )}

      {step === 4 && (
        <div className="mt-6 w-80 grid grid-cols-2 gap-4">
          <KioskButton text="🩺 Teleconsultation" onClick={() => {}} />
          <KioskButton text="🤖 AI Doctor" onClick={() => {}} />
          <KioskButton text="💬 JivanAI Chatbot" onClick={() => {}} />
          <KioskButton text="🔑 Patient Login" onClick={() => {}} />
        </div>
      )}

      <div className="mt-6">
        <KioskButton text="🚨 Emergency" onClick={() => navigate("/emergency")} color="red" />
      </div>
    </div>
  );
};

export default FirstPage;
