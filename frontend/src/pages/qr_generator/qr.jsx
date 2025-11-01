import React, { useState } from "react";
import "./qr.css"; // optional styling file

const QRGenerator = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [qrSrc, setQrSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const events = [
    "Tech Fest 2025",
    "Music Night",
    "Hackathon",
    "Art Exhibition",
    "Sports Meet",
  ];

  // Step 1: Mark as registered (but don't generate QR yet)
  const handleRegister = (eventName) => {
    setRegisteredEvents((prev) => ({
      ...prev,
      [eventName]: "registered",
    }));
    setStatus(`✅ You have registered for ${eventName}. Click 'Show QR Code' to view your pass.`);
  };

  // Step 2: Generate QR when "Show QR Code" is clicked
  const generateQR = async (eventName) => {
    setSelectedEvent(eventName);
    setLoading(true);
    setStatus(`🎟 Generating QR for ${eventName}...`);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: eventName }),
      });

      if (!response.ok) throw new Error("Failed to generate QR");

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setQrSrc(imgUrl);
      setStatus(`✅ QR Code for ${eventName} generated successfully!`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error generating QR. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-container">
      <h2 className="qr-title">🎫 Event Registration</h2>

      {!qrSrc && (
        <div className="event-buttons">
          <p className="event-subtitle">Select an event to register:</p>

          {events.map((event) => (
            <div key={event} style={{ marginBottom: "10px" }}>
              {registeredEvents[event] === "registered" ? (
                <button
                  className="event-btn show-btn"
                  onClick={() => generateQR(event)}
                  disabled={loading}
                >
                  {loading && selectedEvent === event
                    ? "Generating..."
                    : `Show QR Code for ${event}`}
                </button>
              ) : (
                <button
                  className="event-btn register-btn"
                  onClick={() => handleRegister(event)}
                >
                  Register for {event}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {status && <p className="qr-status">{status}</p>}

      {qrSrc && (
        <div className="qr-display">
          <h3>{selectedEvent}</h3>
          <img src={qrSrc} alt="QR Code" className="qr-image" />
          <a
            href={qrSrc}
            download={`${selectedEvent}_QR.png`}
            className="download-btn"
          >
            ⬇️ Download QR
          </a>
          <br />
          <button
            className="back-btn"
            onClick={() => {
              setQrSrc(null);
              setSelectedEvent("");
              setStatus("");
            }}
          >
            🔙 Back to Events
          </button>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
