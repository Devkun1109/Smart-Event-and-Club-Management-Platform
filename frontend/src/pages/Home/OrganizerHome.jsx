// src/components/home/OrganizerHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const OrganizerHome = () => {
  const navigate = useNavigate();
  const goToCreateEvent = () => navigate("/create_event");
  const goToQRScanner = () => navigate("/qr_scanner");
  const goToViewStudents = () => navigate("/view_students");

  return (
    <div className="home-button-container">
      <h2>📅 Organizer Dashboard</h2>

      <button className="home-btn organizer-btn" onClick={goToCreateEvent}>
        🗓️ Create Event
      </button>

      <button className="home-btn organizer-btn" onClick={goToQRScanner}>
        🔍 Scan QR Code
      </button>

      <button className="home-btn organizer-btn" onClick={goToViewStudents}>
        👥 View Registered Students
      </button>
    </div>
  );
};
export default OrganizerHome;
