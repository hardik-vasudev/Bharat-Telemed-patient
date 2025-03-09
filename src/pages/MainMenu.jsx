import React from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaUserMd, FaFileMedical, FaUser, FaHome } from "react-icons/fa";

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, label: "Teleconsultation", icon: <FaVideo size={50} />, route: "/waiting", bgColor: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
    { id: 2, label: "AI Doctor", icon: <FaUserMd size={50} />, route: "/jivanai", bgColor: "bg-purple-500", hoverColor: "hover:bg-purple-600" },
    { id: 3, label: "Test reports", icon: <FaFileMedical size={50} />, route: "/testreports", bgColor: "bg-yellow-500", hoverColor: "hover:bg-yellow-600" },
    { id: 4, label: "Patient Login", icon: <FaUser size={50} />, route: "/patientlogin", bgColor: "bg-red-500", hoverColor: "hover:bg-red-600" },
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 relative">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-10 tracking-wide shadow-md">Bharat-Telemed Kiosk</h1>
      <div className="grid grid-cols-2 gap-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl transition-transform transform hover:scale-110 duration-300 text-white ${item.bgColor} ${item.hoverColor}`}
          >
            {item.icon}
            <span className="mt-4 text-xl font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate("/")}
        className="absolute bottom-6 left-6 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 text-lg flex items-center gap-2"
      >
        <FaHome size={20} /> Home
      </button>
    </div>
  );
};

export default MainMenu;
