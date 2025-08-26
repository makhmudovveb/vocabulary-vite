import React from "react";
import { useNavigate } from "react-router-dom";
import './AuthModal.css'


const BackButton = () => {
  const navigate = useNavigate();

  return (

    <div onClick={() => navigate("/")} className="back_btn">
    ⟵
      Back home
    </div>
  );
};

export default BackButton;


// <button
// style={{
//   background: "orange",
//   color: "white",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "8px",
//   fontSize: "1rem",
//   cursor: "pointer",
//   fontWeight: '900',
// }}