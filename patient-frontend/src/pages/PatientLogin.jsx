import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function PatientLogin() {
  const [uniqueId, setUniqueId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (uniqueId.trim() !== "") {
      navigate("/dashboard"); // Redirect to patient dashboard after login
    }
  };

  const handleBiometricLogin = () => {
    alert("Biometric authentication coming soon!");
  };

  const goToMainMenu = () => {
    navigate("/menu"); // Redirect to Main Menu Page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-blue-600">
            Patient Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter Unique ID"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2 text-lg"
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-2" onClick={handleLogin}>
              Login with Unique ID
            </Button>
            <div className="text-center text-gray-500">or</div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-2" onClick={handleBiometricLogin}>
              Login with Biometrics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Menu Button (Bottom Right Corner) */}
      <button
        onClick={goToMainMenu}
        className="fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Main Menu
      </button>
    </div>
  );
}