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
    <>
      <div className="cuecard_wrapper">
        <div className={`cuecard_card ${isFlipped ? "flipped" : ""}`} onClick={handleCardClick}>
          <div className="front">
            <div style={{ fontSize: "1.6em", fontWeight: "bold" }}>
              {capitalize(data.en)}
            </div>
            <div style={{ fontSize: "1.1em", color: "#555", margin: "40px 0" }}>
              {data.pron || ""}
            </div>
            <p style={{ fontSize: "15px", color: 'grey' }}>click to flip</p>


          </div>

          <div className="back">
            <p style={{margin :'2'}}> {capitalize(data.ru)}</p>
            <p style={{margin :'2'}}> {data.pron || "-"}</p>
            <p style={{margin :'2'}}> {data.desc || "-"}</p>
            <p style={{margin :'2'}}> <span>{data.example || "-"}</span></p>
            <button
              className="speak-btn"
              onClick={(e) => {
                e.stopPropagation();
                speak(data.example);
              }}
            >
              🔊 Прочитать пример
            </button>
            <p style={{ fontSize: "15px", color: 'grey' }}>click to flip</p>
          </div>
        </div>
      </div>
      {index > 0 && total > 0 && (
        <div className="total_words" style={{color :'grey', fontSize: '25px'}}>
          Word {index} of {total}
        </div>
      )}
    </>

  );
});

export default CueCard;
