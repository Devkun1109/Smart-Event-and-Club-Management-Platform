import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const goToQRScanner = () => navigate("/qr_scanner");
  const goToQRGenerator = () => navigate("/qr_generator");

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Smart QR System</h1>
      <p className="home-subtitle">
        A modern <strong>Flask + React</strong> project for generating and scanning QR codes 🚀
      </p>

      <div className="home-button-container">
        <button className="home-btn scanner-btn" onClick={goToQRScanner}>
          🔍 Go to QR Scanner
        </button>

        <button className="home-btn generator-btn" onClick={goToQRGenerator}>
          ⚙️ Go to QR Generator
        </button>
      </div>
    </div>
  );
};

export default Home;
