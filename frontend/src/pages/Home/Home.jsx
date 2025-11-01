// src/components/home/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentHome from "./StudentHome";
import OrganizerHome from "./OrganizerHome";
import AdminHome from "./AdminHome";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserRole(parsedUser.role);
      setUserEmail(parsedUser.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderRolePage = () => {
    switch (userRole) {
      case "student":
        return <StudentHome />;
      case "organizer":
        return <OrganizerHome />;
      case "admin":
        return <AdminHome />;
      default:
        return <p>Please log in to continue.</p>;
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Smart Event Platform</h1>
      {userEmail && <p className="home-user">Logged in as: {userEmail}</p>}

      <div className="home-content">{renderRolePage()}</div>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default Home;
