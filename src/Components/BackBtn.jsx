import React from "react";
import { useNavigate } from "react-router-dom";



const BackButton = () => {
  const navigate = useNavigate();

  return (

    <div onClick={() => navigate("/")} style={{
      width: '10%', margin: "1rem", display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: "orange",
      color: "white",
      border: "none",
      padding: "4px 20px",
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
    }}>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill='white'
        width="24px"
        height='24px'
        viewBox="0 0 24 24"

      >
        <path d="M3 9.5l9-7 9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
      </svg>back home
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