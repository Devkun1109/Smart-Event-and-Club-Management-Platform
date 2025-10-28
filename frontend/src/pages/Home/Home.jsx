import React from "react";
import "./Home.css";
import QRDisplay from "./qr_component/qr";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Hello World</h1>
      <p>This is your Flask + React QR code generator project 🚀</p>
      <QRDisplay />
    </div>
  );
};

export default Home;
