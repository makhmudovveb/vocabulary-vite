import React, { useState } from "react";
import axios from "axios";
import { Auth } from "../Context/AuthContext";
import { PenLine } from "lucide-react";

const SendFeedback = () => {
  const { currentUser, userData } = Auth();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus("Please enter your message.");
      return;
    }

    try {
      const res = await axios.post("/api/feedback", {
        fullName: userData?.fullName || "Not specified",
        email: currentUser?.email || "Unknown",
        teacher: userData?.teacher || "Not selected",
        message,
      });

      if (res.data.success) {
        setStatus("Thank you for your feedback!");
        setMessage("");
      } else {
        setStatus("Failed to send feedback. Please try again later.");
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("Failed to send feedback. Please try again later.");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          backgroundColor: "orange",
          color: "white",
          border: "none",
          borderRadius: "50px",
          padding: "10px 20px",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <PenLine size={20} /> &nbsp; {showForm ? "Close" : ""}
      </button>

      {/* Feedback Form */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            background: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          <h3>Your Feedback</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Write your feedback..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                resize: "none",
                boxSizing :"border-box"
              }}
            />
            <button
              type="submit"
              style={{
                marginTop: "10px",
                width: "100%",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                padding: "8px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
          {status && (
            <p style={{ marginTop: "10px", fontSize: "14px" }}>{status}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SendFeedback;
