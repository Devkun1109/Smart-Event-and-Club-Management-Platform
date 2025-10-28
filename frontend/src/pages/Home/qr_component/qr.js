import React, { useState } from "react";

const QRDisplay = () => {
  const [input, setInput] = useState("");
  const [qrSrc, setQrSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!input.trim()) {
      alert("Please enter some text or link");
      return;
    }

    setLoading(true);
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
    } catch (err) {
      console.error(err);
      alert("Error generating QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>QR Code Generator</h2>
      <input
        type="text"
        placeholder="Enter text or URL"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", width: "250px", marginRight: "10px" }}
      />
      <button onClick={generateQR} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>
      {qrSrc && (
        <div style={{ marginTop: "20px" }}>
          <img src={qrSrc} alt="QR Code" width="200" />
        </div>
      )}
    </div>
  );
};

export default QRDisplay;
