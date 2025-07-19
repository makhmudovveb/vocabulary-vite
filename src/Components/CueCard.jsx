// src/Components/CueCard.jsx
import React from "react";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const CueCard = ({ data, index = 1, total = 1 }) => {
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="card-wrapper">
      <div className="card" id="card">
        <div className="front" id="cardFront">
          <div style={{ fontSize: "1.6em", fontWeight: "bold"}}>
            {capitalize(data.en)}
          </div>
          <div style={{ fontSize: "1.1em", color: "#555", margin: '40px 0'   }}>
            {data.pron || ""}
          </div>
          {index > 0 && total > 0 && (
            <div className="card-counter">
              Word {index} of {total}
            </div>
          )}
        </div>
        <div className="back" id="cardBack">
          <p><strong>Translation:</strong> {capitalize(data.ru)}</p>
          <p><strong>Pronunciation:</strong> {data.pron || "-"}</p>
          <p><strong>Description:</strong> {data.desc || "-"}</p>
          <p><strong>Example:</strong> <span>{data.example || "-"}</span></p>
          <button className="speak-btn" onClick={() => speak(data.example)}>
            🔊 Прочитать пример
          </button>
        </div>
      </div>
    </div>
  );
};

export default CueCard;
