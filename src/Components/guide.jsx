// src/components/Instructions.jsx
import React, { useState, useEffect } from "react";
import instructionsData from "./instructions.json";
import "./guide.css";

const Instructions = ({ game }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (game && instructionsData[game]) {
      setText(instructionsData[game]);
    } else {
      setText("NO INSTRUCTIONS AVAILABLE.");
    }
  }, [game]);

  const openModal = () => setVisible(true);
  const closeModal = () => {
    const modal = document.querySelector(".instruction-modal");
    if (modal) {
      modal.classList.add("closing");
      setTimeout(() => setVisible(false), 400); // ждем конца анимации
    } else {
      setVisible(false);
    }
  };

  return (
    <div className="instruction-container">
      {/* Иконка i в кружке */}
      <button className="instruction-icon" onClick={openModal}>
        i
      </button>

      {/* Модалка */}
      {visible && (
        <div className="instruction-modal" onClick={closeModal}>
          <div
            className="instruction-content"
            onClick={(e) => e.stopPropagation()} // чтобы клик по контенту не закрывал модалку
          >
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
            {/* Разбиваем текст на абзацы по \n\n */}
            {text.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;
