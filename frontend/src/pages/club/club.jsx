import React, { useState } from "react";
import "./club.css";

const Club = () => {
  const [clubData, setClubData] = useState({
    clubName: "",
    email: "",
    password: "",
    description: "",
    category: "Cultural",
    coordinator: "",
    contact: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData({ ...clubData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/clubs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clubData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Club registration failed");

      setMessage("🎉 Club registered successfully!");
      setClubData({
        clubName: "",
        email: "",
        password: "",
        description: "",
        category: "Cultural",
        coordinator: "",
        contact: "",
      });
    } catch (err) {
      setMessage('${err.message}');
    }
  };

  return (
    <div className="club-container">
      <div className="club-card">
        <h2>🏫 Register a New Club</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="clubName"
            placeholder="Club Name"
            value={clubData.clubName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Club Email"
            value={clubData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Club Password"
            value={clubData.password}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Club Description"
            value={clubData.description}
            onChange={handleChange}
            rows="4"
            required
          />
          <select
            name="category"
            value={clubData.category}
            onChange={handleChange}
          >
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Sports">Sports</option>
            <option value="Social">Social</option>
          </select>
          <input
            type="text"
            name="coordinator"
            placeholder="Faculty Coordinator"
            value={clubData.coordinator}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={clubData.contact}
            onChange={handleChange}
          />

          <button type="submit" className="btn">Register Club</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Club;