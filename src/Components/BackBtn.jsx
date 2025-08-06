import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const BackButton = () => {
  const navigate = useNavigate();

  return (

    <div onClick={() => navigate("/")}  style={{ width:'3%', margin: "1rem", display:'flex', alignItemsContent : 'center', background: "orange",
  color: "white",
  border: "none",
  padding: "4px 20px",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer", }}>
      
<ArrowLeft size={32} strokeWidth={3} />
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