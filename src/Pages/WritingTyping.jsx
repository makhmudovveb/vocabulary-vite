import React, { useState, useEffect, useRef } from "react";
import "../Styles/WritingTyping.css";
import BackButton from "../Components/BackBtn";

const essays = [
  {
    topic: "Some people believe that advertising has a negative impact on society by encouraging people to buy things they do not need. To what extent do you agree or disagree?",
    text: `Advertising is a pervasive force in modern society, often promoting products that consumers may not necessarily need. While some argue that advertising fosters unnecessary consumption, I believe it serves a vital role in informing the public and driving economic growth.

On one hand, critics contend that advertising manipulates individuals into purchasing items based on desire rather than necessity. For instance, advertisements often portray idealized lifestyles, leading consumers to believe that owning certain products will enhance their lives. This can result in impulsive buying decisions and financial strain.

Conversely, advertising provides valuable information about new products and services, enabling consumers to make informed choices. It also supports businesses, particularly small enterprises, by promoting their offerings to a broader audience. Moreover, advertising contributes to economic development by stimulating demand and creating jobs in various sectors.

In conclusion, while advertising can influence consumer behavior, it also plays an essential role in the economy and in keeping the public informed. Therefore, I believe its benefits outweigh the potential drawbacks when approached responsibly.`,
    words: [
      "advertising",
      "consumption",
      "manipulate",
      "impulsive buying",
      "economic growth",
      "informed choices",
      "demand",
      "businesses",
    ],
    band: 7.5,
    explanation: "Clear position, well-developed ideas, good range of vocabulary, coherent structure. Minor issues in sentence variety may prevent higher band."
  },
  // ...добавь остальные эссе здесь
];

const WritingMock = () => {
  const [selectedEssay, setSelectedEssay] = useState({});
  const [userInput, setUserInput] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const random = essays[Math.floor(Math.random() * essays.length)];
    setSelectedEssay(random);
    setUserInput("");
  }, []);

  // Фокус на textarea
  useEffect(() => {
    textareaRef.current?.focus();
  }, [selectedEssay]);

  // Секундомер
  useEffect(() => {
    if (!timerRunning) return;
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  // Автостарт при любом нажатии клавиши
  useEffect(() => {
    const handleKeyDown = () => {
      if (!timerRunning && selectedEssay.text) setTimerRunning(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timerRunning, selectedEssay]);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    // Проверяем конец текста
    if (value.length >= selectedEssay.text.length) {
      setTimerRunning(false);
      clearInterval(intervalRef.current);
    }

    // Слова и ошибки
    const wordsTyped = value.trim().split(/\s+/).filter(Boolean).length;
    setTotalWords(wordsTyped);

    let err = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== (selectedEssay.text[i] || "")) err++;
    }
    setErrors(err);

    const minutes = seconds / 60;
    setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0);
  };

  const handleFinish = () => {
    setTimerRunning(false);
    clearInterval(intervalRef.current);
    setShowAnalysis(true);
  };

  const handleReset = () => {
    const random = essays[Math.floor(Math.random() * essays.length)];
    setSelectedEssay(random);
    setUserInput("");
    setSeconds(0);
    setWpm(0);
    setErrors(0);
    setTotalWords(0);
    setShowAnalysis(false);
    setTimerRunning(false);
    clearInterval(intervalRef.current);
  };

  const essayChars = selectedEssay.text ? selectedEssay.text.split("") : [];

  return (
    <div className="writing-mock-wrapper">
      <div className="writing-topbar">
        <span>Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span>
        <span>WPM: {wpm}</span>
        <span>Total Words: {totalWords}</span>
        <span>Errors: {errors}</span>
        <button onClick={handleFinish} className="btn-finish">Finish</button>
        <button onClick={handleReset} className="btn-reset">New Essay</button>
        <BackButton className="backBtn"/>
      </div>

      <div className="writing-container">
        <div className="essay-topic-box">
          <h3>Topic</h3>
          <p>{selectedEssay.topic}</p>
        </div>

        <div className="essay-box"
          onKeyDown={(e) => {
            if (e.ctrlKey && e.code === 'KeyA') e.preventDefault();
          }}
          onDoubleClick={(e) => e.preventDefault()} // блокируем выделение двойным кликом
          onMouseDown={(e) => e.preventDefault()}   // блокируем выделение мышкой
        >
          <div className="essay-text-overlay">
            {essayChars.map((char, idx) => {
              let color = "grey";
              if (userInput[idx]) color = userInput[idx] === char ? "black" : "red";
              return (
                <span key={idx} className={idx === userInput.length ? "current-caret" : ""} style={{ color }}>
                  {char}
                </span>
              );
            })}
          </div>
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleChange}
            style={{
              color: "transparent",
              background: "transparent",
              caretColor: "transparent",
            }}
          />
        </div>
      </div>

      {showAnalysis && (
        <div className="analysis-modal">
          <div className="analysis-content">
            <button className="close-btn" onClick={() => setShowAnalysis(false)}>×</button>
            <h2>Essay Analysis & Results</h2>
            <div className="analysis-grid">
              <div className="analysis-left">
                <h3>Topic</h3>
                <p>{selectedEssay.topic}</p>
                <h3>Band Score</h3>
                <p>{selectedEssay.band}</p>
                <h3>Explanation</h3>
                <p>{selectedEssay.explanation}</p>
                <h3>New Words</h3>
                <ul>{selectedEssay.words?.map((w, i) => <li key={i}>{w}</li>)}</ul>
                <h3>Statistics</h3>
                <p>Words typed: {totalWords}</p>
                <p>Errors: {errors}</p>
                <p>WPM: {wpm}</p>
                <p>Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</p>
              </div>
              <div className="analysis-right">
                <h3>Your Essay</h3>
                <p>{selectedEssay.text}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingMock;
