import React, { useState } from "react";
import CueCard from "../Components/CueCard";
import "../../public/images/logo.ico";
import "../Styles/CueCard.css";
import BackBtn from '../Components/BackBtn';

const CueCardPage = () => {
  const [level, setLevel] = useState("");
  const [unit, setUnit] = useState("");
  const [cardsData, setCardsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLoad = async () => {
    if (!level || !unit) {
      alert("Please select level and unit");
      return;
    }

    const path = `/data/${level}/unit${unit}.json`;

    try {
      const res = await fetch(path);
      const data = await res.json();

      const filtered = data
        .filter(w => w.en && w.ru)
        .map(w => ({
          en: w.en,
          ru: w.ru,
          pron: w.pron || "",
          desc: w.desc || "",
          example: w.example || "",
        }));

      setCardsData(filtered); // убрали shuffle
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load data", err);
      alert("Error loading words");
    }
  };

  return (
<>
<BackBtn />

<div className="cuecards-container">
      <h1>Cue Cards</h1>

      <div className="selectors">
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="" disabled hidden>-- Select level --</option>
          <option value="elementary">Elementary</option>
          <option value="pre-intermediate">Pre-Intermediate</option>
          <option value="intermediate">Intermediate</option>
          <option value="upper-intermediate">Upper-Intermediate</option>
          <option value="ielts">IELTS</option>
        </select>

        <select value={unit} onChange={e => setUnit(e.target.value)}>
          <option value="" disabled hidden>-- Select unit --</option>
          {[...Array(11).keys()].map(i => (
            <option key={i} value={i}>{i === 0 ? "Introduction" : `Unit ${i}`}</option>
          ))}
        </select>

        <button onClick={handleLoad}>Load Words</button>
      </div>

      {cardsData.length > 0 && (
        <>
          <CueCard
            data={cardsData[currentIndex]}
            index={currentIndex + 1}
            total={cardsData.length}
          />
          <div className="card-nav">
            <button
              onClick={() =>
                setCurrentIndex((currentIndex - 1 + cardsData.length) % cardsData.length)
              }
              disabled={currentIndex === 0}
            >
              ← Prev
            </button>

            <button
              id="flipCard"
              onClick={() => {
                document.getElementById("card").classList.toggle("flipped");
              }}
            >
              Flip
            </button>

            <button
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % cardsData.length)
              }
              disabled={currentIndex === cardsData.length - 1}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  </>
  );
};

export default CueCardPage;
