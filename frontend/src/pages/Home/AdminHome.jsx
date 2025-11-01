import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setAdminName(parsedUser.name || parsedUser.email || "Admin");
    }
  }, []);

  const goToAdminPanel = () => navigate("/admin_dashboard");
  const goToClubManagement = () => navigate("/club");
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-home-container">
      <h1 className="admin-home-title">🧭 Admin Dashboard</h1>
      <p className="admin-welcome">Welcome back, <strong>{adminName}</strong> 👋</p>

      <div className="admin-buttons">
        <button className="home-btn admin-btn" onClick={goToAdminPanel}>
          ⚙️ Manage Events
        </button>

        <button className="home-btn club-btn" onClick={goToClubManagement}>
          🏫 Club Management
        </button>

        <button className="home-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
