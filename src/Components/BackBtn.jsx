import React from "react";
import { useNavigate } from "react-router-dom";



const BackButton = () => {
  const navigate = useNavigate();

  return (

    <div onClick={() => navigate("/")} style={{
      width: '7%', margin: "1rem", display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: "orange",
      color: "white",
      border: "none",
      padding: "4px 20px",
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
      fontWeight:"900",
    }}>
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