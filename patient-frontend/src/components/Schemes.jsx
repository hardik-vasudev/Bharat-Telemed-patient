import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../components/ui/dialog";
import { BadgeCheck, FileText } from "lucide-react"; // Icons

export default function Schemes() {
  const [activeTab, setActiveTab] = useState("assigned");

  // Assigned schemes data
  const assignedSchemes = [
    {
      id: 1,
      name: "Ayushman Bharat",
      assignedDate: "12 Jan 2024",
      creditsLeft: "₹2.5 Lakhs",
      expiry: "12 Jan 2025",
    },
    {
      id: 2,
      name: "Janani Suraksha",
      assignedDate: "5 Feb 2023",
      creditsLeft: "₹20,000",
      expiry: "5 Feb 2024",
    },
  ];

  // Available schemes to request
  const availableSchemes = [
    {
      id: 3,
      name: "Senior Citizen Health Card",
      benefits: "Free medicines & check-ups",
      eligibility: "Above 60 years",
    },
    {
      id: 4,
      name: "PM Kisan Scheme",
      benefits: "₹6000 per year for farmers",
      eligibility: "Small & marginal farmers",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Government Health Schemes
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <Button
          className={`mx-2 px-6 py-2 text-lg ${
            activeTab === "assigned"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("assigned")}
        >
          Assigned Schemes
        </Button>
        <Button
          className={`mx-2 px-6 py-2 text-lg ${
            activeTab === "request"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("request")}
        >
          Request for Schemes
        </Button>
      </div>

      {/* Assigned Schemes Section */}
      {activeTab === "assigned" && (
        <div className="grid md:grid-cols-2 gap-6">
          {assignedSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="p-5 shadow-lg border border-green-400 bg-white rounded-lg"
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold text-green-800">
                  {scheme.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 text-white">
                      Check Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                    <DialogTitle className="text-green-700 text-xl font-bold">
                      {scheme.name}
                    </DialogTitle>
                    <p className="mt-2">
                      <strong>Assigned On:</strong> {scheme.assignedDate}
                    </p>
                    <p>
                      <strong>Credits Left:</strong> {scheme.creditsLeft}
                    </p>
                    <p>
                      <strong>Expiry Date:</strong> {scheme.expiry}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => window.print()}
                        className="bg-gray-700 text-white flex items-center gap-2"
                      >
                        <FileText size={18} />
                        Print Details
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request for Schemes Section */}
      {activeTab === "request" && (
        <div className="grid md:grid-cols-2 gap-6">
          {availableSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="p-5 shadow-lg border border-blue-400 bg-white rounded-lg"
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold text-blue-800">
                  {scheme.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-gray-700">
                  <strong>Benefits:</strong> {scheme.benefits}
                </p>
                <p className="mb-2 text-gray-700">
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </p>

                {/* ✅ Stylish "Eligible" badge instead of a basic checkbox */}
                <div className="flex items-center mt-4">
                  <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    <BadgeCheck size={18} className="mr-2" />
                    You are eligible
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="bg-blue-600 text-white">Apply Now</Button>
                  <Button
                    onClick={() => window.print()}
                    className="bg-gray-700 text-white flex items-center gap-2"
                  >
                    <FileText size={18} />
                    Print Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
