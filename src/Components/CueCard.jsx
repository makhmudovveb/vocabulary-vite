import React, { useState, forwardRef, useImperativeHandle } from "react";
import '../Styles/CueCard.css';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const CueCard = forwardRef(({ data, index = 1, total = 1 }, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  useImperativeHandle(ref, () => ({
    flipCard: () => {
      setIsFlipped((prev) => !prev);
    },
    resetFlip: () => {
      setIsFlipped(false);
    }
 }));

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="cuecard_wrapper">
      <div className={`cuecard_card ${isFlipped ? "flipped" : ""}`} onClick={handleCardClick}>
        
        <div className="front">
          <div style={{ fontSize: "1.6em", fontWeight: "bold" }}>
            {capitalize(data.en)}
          </div>
          <div style={{ fontSize: "1.1em", color: "#555", margin: "40px 0" }}>
            {data.pron || ""}
          </div>
          {index > 0 && total > 0 && (
            <div className="card-counter">
              Word {index} of {total}
            </div>
          )}
        </div>

        <div className="back">
          <p><strong>Translation:</strong> {capitalize(data.ru)}</p>
          <p><strong>Pronunciation:</strong> {data.pron || "-"}</p>
          <p><strong>Description:</strong> {data.desc || "-"}</p>
          <p><strong>Example:</strong> <span>{data.example || "-"}</span></p>
          <button
            className="speak-btn"
            onClick={(e) => {
              e.stopPropagation();
              speak(data.example);
            }}
          >
            🔊 Прочитать пример
          </button>
        </div>
      </div>
    </div>
  );
});

export default CueCard;
