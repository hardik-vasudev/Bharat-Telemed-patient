import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  BrainCircuit,
  FileCheck2,
  UserCheck,
  Home,
} from "lucide-react";

export default function MainMenu() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      label: "Teleconsultation",
      icon: <Video size={40} />,
      route: "/waiting",
      bgColor: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600",
    },
    {
      id: 2,
      label: "AI Doctor",
      icon: <BrainCircuit size={40} />, // replaced Robot with BrainCircuit
      route: "/jivanai",
      bgColor: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      id: 3,
      label: "Test Reports",
      icon: <FileCheck2 size={40} />,
      route: "/reports",
      bgColor: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
    },
    {
      id: 4,
      label: "Patient Login",
      icon: <UserCheck size={40} />,
      route: "/patientlogin",
      bgColor: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
    },
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white relative">
      <h1 className="text-5xl font-extrabold text-gray-800 my-10 tracking-wide">
        Bharat-Telemed Kiosk
      </h1>

      <div className="grid grid-cols-2 gap-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center justify-center w-48 h-48 p-6 rounded-2xl shadow-xl text-white transition-transform transform hover:scale-105 duration-300 ${item.bgColor} ${item.hoverColor}`}
          >
            {item.icon}
            <span className="mt-3 text-xl font-semibold text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute bottom-6 left-6 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 text-lg flex items-center gap-2"
      >
        <Home size={20} />
        Home
      </button>
    </div>
  );
}
