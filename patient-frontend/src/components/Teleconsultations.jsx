import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Stethoscope, Video, CalendarDays, ClipboardList } from "lucide-react";

// Example data (replace with real data or props/context)
const teleData = {
  upcoming: [
    { id: 1, doctor: "Dr. Sharma", date: "2025-03-15 @ 10:00 AM", concern: "General Checkup" },
    { id: 2, doctor: "Dr. Gupta", date: "2025-03-18 @ 2:00 PM", concern: "ENT Follow-up" },
  ],
  past: [
    { id: 3, doctor: "Dr. Singh", date: "2025-03-01 @ 11:00 AM", concern: "Ortho Follow-up" },
  ],
};

export default function Teleconsultations() {
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "past"

  // Extract data based on activeTab
  const consults = activeTab === "upcoming" ? teleData.upcoming : teleData.past;

  return (
    <section className="bg-green-50 p-6 rounded-md shadow border-l-4 border-green-700">
      {/* Section Heading */}
      <div className="flex items-center gap-3 mb-6">
        <Stethoscope size={30} className="text-green-800" />
        <h1 className="text-2xl font-bold text-green-800">Teleconsultations</h1>
      </div>

      {/* Tabs for Upcoming / Past */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-2 text-lg ${
            activeTab === "upcoming"
              ? "bg-green-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-green-200"
          }`}
        >
          Upcoming
        </Button>
        <Button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-2 text-lg ${
            activeTab === "past"
              ? "bg-green-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-green-200"
          }`}
        >
          Past
        </Button>
      </div>

      {/* Content */}
      {consults.length === 0 ? (
        <p className="text-gray-700">No {activeTab} consultations found.</p>
      ) : (
        consults.map((consult) => (
          <Card key={consult.id} className="mb-4 bg-white shadow-md">
            <CardHeader className="p-4 flex items-center gap-2 border-b border-gray-200">
              {activeTab === "upcoming" ? (
                <Video size={20} className="text-green-600" />
              ) : (
                <ClipboardList size={20} className="text-green-600" />
              )}
              <CardTitle className="text-xl font-semibold text-green-700">
                {activeTab === "upcoming" ? "Scheduled Consultation" : "Past Consultation"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="text-gray-800">
                <strong>Doctor:</strong> {consult.doctor}
              </div>
              <div className="text-gray-800 flex items-center gap-2">
                <CalendarDays size={18} className="text-green-500" />
                <span>
                  <strong>Date & Time:</strong> {consult.date}
                </span>
              </div>
              <div className="text-gray-800">
                <strong>Concern:</strong> {consult.concern}
              </div>

              {/* Action Buttons */}
              <div className="mt-3">
                {activeTab === "upcoming" ? (
                  <Button className="bg-green-700 text-white px-5 py-2 hover:bg-green-800">
                    Join Now
                  </Button>
                ) : (
                  <Button className="bg-gray-600 text-white px-5 py-2 hover:bg-gray-700">
                    View Summary
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </section>
  );
}
