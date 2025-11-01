// src/components/home/StudentHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();

  const goToRegister = () => navigate("/qr_generator");

  return (
    <div className="home-button-container">
      <h2>🎓 Student Dashboard</h2>
      <button className="home-btn student-btn" onClick={goToRegister}>
        📝 Go to Register
      </button>
    </div>
  );
};

export default StudentHome;
