import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 1500); // redirect to login
      } else {
        setMessage(data.error || data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: "8px", padding: "8px" }}
      />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "8px", padding: "8px" }}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "8px", padding: "8px" }}
      />
      <br />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ margin: "8px", padding: "8px" }}
      >
        <option value="student">Student</option>
        <option value="organizer">Organizer</option>
        <option value="admin">Admin</option>
      </select>
      <br />

      <button onClick={handleSignup} style={{ marginTop: "10px" }}>
        Signup
      </button>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default Signup;
