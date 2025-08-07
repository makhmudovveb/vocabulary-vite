// src/components/Instructions.jsx
import React, { useState, useEffect, useRef } from "react";
import instructionsData from "./instructions.json";
import "../Styles/instructions.css";

const Instructions = ({ game }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (game && instructionsData[game]) {
      setText(instructionsData[game]);
    } else {
      setText("No instructions available.");
    }
  }, [game]);

  const toggleInstructions = () => {
    setVisible(prev => {
      const newState = !prev;
      if (newState) {
        // Если открыли панель, запускаем таймер на автозакрытие
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setVisible(false);
        }, 15000);
      } else {
        // Если закрыли вручную — очищаем таймер
        if (timerRef.current) clearTimeout(timerRef.current);
      }
      return newState;
    });
  };

  return (
    <div className="instruction-container">
      <button className="instruction-toggle" onClick={toggleInstructions}>
        i
      </button>
      <div className={`instruction-panel ${visible ? "show" : ""}`}>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Instructions;
