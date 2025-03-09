import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StepsPage from "./pages/StepsPage";
import MainMenu from "./pages/MainMenu";
import PatientTeleConsultationPage from "./pages/PatientTeleConsultationPage";
import PatientLogin from "./pages/PatientLogin";
import EmergencyPage from "./pages/EmergencyPage"; // Import Emergency Page
import WaitingScreen from "./pages/WaitingScreen"; // Import Waiting Screen
import JivanAI from "./pages/JivanAI"; // Import JivanAI chatbot
import PatientJitsiMeet from "./components/PatientJitsiMeet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/steps" element={<StepsPage />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/teleconsultation" element={<PatientTeleConsultationPage />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/emergency" element={<EmergencyPage />} /> {/* Emergency Route */}
        <Route path="/waiting" element={<WaitingScreen />} /> {/* Waiting Screen Route */}
        <Route path="/jivanai" element={<JivanAI />} /> {/* JivanAI Chatbot Route */}
      </Routes>
    </Router>
  );
}

export default App;