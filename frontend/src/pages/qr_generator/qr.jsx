import React, { useState } from "react";
import "./qr.css"; // optional styling file

const QRGenerator = () => {
  const [input, setInput] = useState("");
  const [qrSrc, setQrSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const generateQR = async () => {
    if (!input.trim()) {
      setStatus("⚠️ Please enter some text or link.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input }),
      });

      if (!response.ok) throw new Error("Failed to generate QR");

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setQrSrc(imgUrl);
      setStatus("✅ QR Code generated successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error generating QR. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-container">
      <h2 className="qr-title">QR Code Generator</h2>

      <div className="qr-input-section">
        <input
          type="text"
          placeholder="Enter text or URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="qr-input"
        />
        <button onClick={generateQR} className="qr-button" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {status && <p className="qr-status">{status}</p>}

      {qrSrc && (
        <div className="qr-display">
          <img src={qrSrc} alt="QR Code" className="qr-image" />
          <a href={qrSrc} download="qr_code.png" className="download-btn">
            Download QR
          </a>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
