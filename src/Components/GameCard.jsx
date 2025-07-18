// src/components/GameCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function GameCard({ title, image, description, link, disabled }) {
  const navigate = useNavigate();

  return (
    <div
      className={`game-card ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && navigate(link)}
    >
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
