import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StepsPage from "./pages/StepsPage";
import MainMenu from "./pages/MainMenu";
import PatientTeleConsultationPage from "./pages/PatientTeleConsultationPage";
import PatientLogin from "./pages/PatientLogin";
import EmergencyPage from "./pages/EmergencyPage";
import WaitingScreen from "./pages/WaitingScreen";
import JivanAI from "./pages/JivanAI";
import PatientJitsiMeet from "./components/PatientJitsiMeet";

// The main layout for patient details (with a sidebar, "About" section, etc.)
import PatientDetails from "./pages/PatientDetails";

// Nested components that will load inside PatientDetails
import PatientReports from "./components/PatientReports";
import Teleconsultations from "./components/Teleconsultations";
import Schemes from "./components/Schemes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public/Standalone Routes */}
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/steps" element={<StepsPage />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/teleconsultation" element={<PatientTeleConsultationPage />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/waiting" element={<WaitingScreen />} />
        <Route path="/jivanai" element={<JivanAI />} />

        {/* Patient Details as a Parent Route */}
        <Route path="/patient-details" element={<PatientDetails />}>
          {/* Nested child routes under /patient-details */}
          <Route path="reports" element={<PatientReports />} />
          <Route path="teleconsultations" element={<Teleconsultations />} />
          <Route path="schemes" element={<Schemes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
