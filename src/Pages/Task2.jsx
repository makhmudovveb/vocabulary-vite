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
    explanation: "Clear position, well-developed ideas, good range of vocabulary, coherent structure. Minor issues in sentence variety may prevent higher band.",
    band: 7.5,
    words: ["advertising", "consumption", "manipulate", "impulsive buying", "economic growth", "informed choices", "demand", "businesses"],
  },
  {
    topic: "Some people think that the internet has brought people closer together by making communication easier. Others think that people and communities are becoming more isolated because they are using technology to communicate. Discuss both views and give your opinion",
    text: `The advent of the internet has revolutionized communication, leading to diverse opinions about its impact on social relationships. While some argue that it fosters closer connections, others believe it contributes to social isolation.

On one hand, the internet facilitates instant communication across the globe, allowing individuals to maintain relationships regardless of geographical barriers. Social media platforms, video calls, and messaging apps enable people to stay connected with family and friends, promoting a sense of community.

On the other hand, excessive reliance on digital communication can lead to physical isolation. Face-to-face interactions, which are crucial for building deep, meaningful relationships, may diminish as online communication becomes more prevalent. This can result in feelings of loneliness and a lack of genuine social bonds.

In my opinion, the internet is a tool that can either connect or isolate individuals, depending on how it is used. When balanced with offline interactions, it can enhance communication and strengthen relationships. However, overuse without real-world engagement may lead to social detachment.`,
    explanation: "Good task response, balanced discussion, appropriate academic vocabulary, clear conclusion. Could improve cohesion for higher band.",
    band: 7.5,
    words: ["internet", "communication", "social media", "messaging apps", "video calls", "social isolation", "face-to-face interactions", "meaningful relationships", "engagement"],
  },
  {
    topic: "Many people believe that environmental protection is the responsibility of governments, while others think that individuals should take responsibility for the environment. Discuss both views and give your opinion.",
    text: `The debate over who should bear the responsibility for environmental protection is ongoing. Some argue that governments should lead the charge, while others believe individuals play a crucial role.

Proponents of government responsibility contend that large-scale environmental issues require systemic change, which can only be achieved through legislation and policy enforcement. Governments have the authority to implement regulations, fund research, and promote sustainable practices on a national level.

Conversely, advocates for individual responsibility emphasize that collective action begins with personal choices. By adopting sustainable habits, such as reducing waste, conserving energy, and supporting eco-friendly products, individuals can contribute to environmental preservation.

In my view, both parties have vital roles to play. Governments must create and enforce policies that facilitate environmental protection, while individuals should make conscious decisions that align with sustainability. Only through a collaborative effort can meaningful progress be made in safeguarding our planet.`,
      explanation: "Addresses both views, well-organized, strong vocabulary related to environment, minor grammar or phrasing issues prevent band 8.",
      band: 7.5,
      words: ["environmental protection", "sustainability", "legislation", "policy enforcement", "eco-friendly products", "conserve energy", "reduce waste", "collective action"],
  }
];

const Task2 = () => {
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
        <BackButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Task2;
