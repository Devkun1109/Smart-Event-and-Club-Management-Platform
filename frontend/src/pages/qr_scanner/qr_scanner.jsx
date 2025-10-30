import React, { useRef, useState, useEffect } from "react";
import "./qr_scanner.css";

const QRScanner = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [status, setStatus] = useState("");
  const [decodedData, setDecodedData] = useState("");

  // Auto-start camera when component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setStatus("❌ Unable to access camera");
      }
    };
    startCamera();

    // Clean up camera on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture image and send to backend
  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/png");
    setImageSrc(imgData);
    sendToBackend(imgData);
  };

  // Send captured image to Flask backend
  const sendToBackend = async (imgData) => {
    try {
      setStatus("Processing...");
      const response = await fetch("http://127.0.0.1:5000/decode_qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData }),
      });

      const res = await response.json();
      if (response.ok) {
        setDecodedData(res.data);
        setStatus("✅ " + res.message);
      } else {
        setDecodedData("");
        setStatus("❌ " + res.message);
      }
    } catch (err) {
      console.error("Error sending image:", err);
      setStatus("⚠️ Unable to reach server");
    }
  };

  return (
    <div className="scanner-container">
      <h2 className="scanner-title">QR Scanner</h2>

      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "320px",
            height: "240px",
            borderRadius: "10px",
            border: "2px solid #007bff",
          }}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button className="btn" onClick={captureImage}>
          📸 Capture QR
        </button>
      </div>

      {imageSrc && (
        <div className="preview">
          <h4>Captured Image:</h4>
          <img
            src={imageSrc}
            alt="Captured QR"
            style={{
              width: "200px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        </div>
      )}

      <div className="result-box">
        {decodedData && (
          <p>
            📜 Decoded Data: <strong>{decodedData}</strong>
          </p>
        )}
        <p className="status-text">{status}</p>
      </div>
    </div>
  );
};

export default QRScanner;
