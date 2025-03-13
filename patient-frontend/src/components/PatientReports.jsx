import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Stethoscope, FileText, X } from "lucide-react";

// Sample Prescriptions Data
const allPrescriptions = [
  {
    id: 1,
    doctor: "Dr. Smith",
    concern: "Hypertension",
    date: "2025-03-01",
    pdfUrl: "https://example.com/hypertension-prescription.pdf",
  },
  {
    id: 2,
    doctor: "Dr. Gupta",
    concern: "Diabetes",
    date: "2025-01-20",
    pdfUrl: "https://example.com/diabetes-prescription.pdf",
  },
];

// Sample Reports Data
const allReports = [
  {
    id: 101,
    name: "Blood Test",
    date: "2025-03-01",
    pdfUrl: "https://example.com/bloodtest.pdf",
    message: "Fasting was required, please follow up with doctor.",
  },
  {
    id: 102,
    name: "X-Ray",
    date: "2025-02-20",
    pdfUrl: "https://example.com/xray.pdf",
    message: "Minor fracture, recommended rest for 2 weeks.",
  },
];

function getDayOfWeek(dateString) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dateObj = new Date(dateString);
  return days[dateObj.getDay()] || "";
}

export default function PatientReports() {
  const [activeTab, setActiveTab] = useState("prescriptions"); // "prescriptions" or "reports"
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // "all", "30days", "6months"
  const [showModal, setShowModal] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);

  // Convert date filter to a JS Date limit
  const dateLimit = useMemo(() => {
    const now = new Date();
    if (dateFilter === "30days") {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === "6months") {
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    }
    return null;
  }, [dateFilter]);

  // Filter logic for Prescriptions
  const filteredPrescriptions = useMemo(() => {
    return allPrescriptions.filter((p) => {
      const combinedText = `${p.doctor} ${p.concern}`.toLowerCase();
      const matchesSearch = combinedText.includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (!dateLimit) return true;
      return new Date(p.date) >= dateLimit;
    });
  }, [searchTerm, dateLimit]);

  // Filter logic for Reports
  const filteredReports = useMemo(() => {
    return allReports.filter((r) => {
      const combinedText = `${r.name} ${r.message}`.toLowerCase();
      const matchesSearch = combinedText.includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (!dateLimit) return true;
      return new Date(r.date) >= dateLimit;
    });
  }, [searchTerm, dateLimit]);

  // Open PDF viewer
  const viewPDF = (pdfUrl) => {
    setSelectedPDF(pdfUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPDF(null);
    setShowModal(false);
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Patient Prescriptions & Reports
      </h1>

      {/* Tabs for Prescriptions / Reports */}
      <div className="flex justify-center mb-4">
        <Button
          className={`mx-2 px-6 py-2 text-lg ${
            activeTab === "prescriptions"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("prescriptions")}
        >
          Prescriptions
        </Button>
        <Button
          className={`mx-2 px-6 py-2 text-lg ${
            activeTab === "reports"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          Test Reports
        </Button>
      </div>

      {/* Search & Date Filter */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <input
          type="text"
          placeholder={`Search ${activeTab === "prescriptions" ? "prescriptions" : "reports"}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
        />

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="all">All Time</option>
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
        </select>
      </div>

      {/* Prescriptions Tab */}
      {activeTab === "prescriptions" && (
        <Card className="bg-white shadow-lg border-l-4 border-green-500">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl font-semibold text-green-700 flex items-center gap-2">
              <Stethoscope size={24} />
              Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {filteredPrescriptions.length === 0 ? (
              <p className="text-gray-600">No matching prescriptions found.</p>
            ) : (
              filteredPrescriptions.map((pres) => {
                const dayOfWeek = getDayOfWeek(pres.date);
                return (
                  <div key={pres.id} className="border-b py-3 flex items-center justify-between">
                    <div className="text-gray-700 space-y-1">
                      <p className="font-bold">
                        {pres.doctor} - {pres.concern}
                      </p>
                      <p>
                        <strong>Date:</strong> {pres.date} ({dayOfWeek})
                      </p>
                    </div>
                    <Button
                      onClick={() => viewPDF(pres.pdfUrl)}
                      className="bg-green-600 text-white"
                    >
                      View PDF
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Reports Tab */}
      {activeTab === "reports" && (
        <Card className="bg-white shadow-lg border-l-4 border-blue-500">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
              <FileText size={24} />
              Test Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {filteredReports.length === 0 ? (
              <p className="text-gray-600">No matching reports found.</p>
            ) : (
              filteredReports.map((report) => {
                const dayOfWeek = getDayOfWeek(report.date);
                return (
                  <div key={report.id} className="border-b py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-700 space-y-1">
                        <p className="font-bold">{report.name}</p>
                        <p>
                          <strong>Date:</strong> {report.date} ({dayOfWeek})
                        </p>
                      </div>
                      <Button
                        onClick={() => viewPDF(report.pdfUrl)}
                        className="bg-blue-600 text-white"
                      >
                        View PDF
                      </Button>
                    </div>
                    {/* Custom message */}
                    {report.message && (
                      <p className="mt-1 text-sm text-blue-700 italic">
                        {report.message}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      {/* PDF Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-3 text-green-700">PDF Viewer</h2>
            <p className="text-green-600 underline">
              <a href={selectedReport} target="_blank" rel="noopener noreferrer">
                Open PDF
              </a>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
