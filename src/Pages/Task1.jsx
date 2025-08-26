import React, { useState, useEffect, useRef } from "react";
import "../Styles/WritingTyping.css";
import BackButton from "../Components/BackBtn";

const essays = [
  {
    topic: "The chart below shows the expenditure of two countries onconsumer goods in 2010.",
    text: `The chart illustrates the amount of money spent on five consumer goods (cars, computers, books, perfume and cameras) in France and the UK in 2010. Units are measured in pounds sterling.

Overall, the UK spent more money on consumer goods than France in the period given. Both the British and the French spent most of their money on cars whereas the least amount of money was spent on perfume in the UK compared to cameras in France. Furthermore, the most significant difference in expenditure between the two countries was on cameras.

In terms of cars, people in the UK spent about £450,000 on this as opposed to the French at £400,000. Similarly, the British expenditure was higher on books than the French (around £400,000 and £300,000 respectively). In the UK, expenditure on cameras (just over £350,000) was over double that of France, which was only £150,000.

On the other hand, the amount of money paid out on the remaining goods was higher in France. Above £350,000 was spent by the French on computers which was slightly more than the British who spent exactly £350,000. Neither of the countries spent much on perfume which accounted for £200,000 of expenditure in France but under £150,000 in the UK`,
    explanation: "This report clearly presents an overview with key features highlighted. Accurate data is used to support statements. A range of complex sentences and vocabulary is used flexibly, making the report easy to follow while showing language complexity.",
    band: 9,
    words: ["expenditure", "consumer goods", "respectively", "significant", "illustrates", "overall", "amount", "support", "highlighted", "flexibly"],
    image: "/taskImages/firstSample.png" // путь к твоей картинке
  },
  {
    topic: "The bar chart below shows the hours per week that teenagers spend doing certain activities in Chester from 2002 to 2007.",
    text: `The bar chart illustrates how many hours adolescents in Chester spent on seven activities each week between 2002 and 2007.
    
Overall, the most popular activity over the period given was watching TV, whereas bowling was the least favourite. Going to pubs or discos, watching TV, and shopping all showed an increase in the number of hours teenagers spent on these activities. The other pursuits showed a decrease in hours, except watching DVDs which fluctuated.
    
Teenagers spent 25 hours on watching television in 2002 which increased to almost 40 hours in the final year. Both going to pubs and discos, and shopping more than doubled in hours from over 5 to 15 or slightly above.
    
While teenagers occupied 10 hours doing homework in 2002, this figure dropped to just over 5 in 2007. Playing sport fell more dramatically from 10 hours to around 3 hours. Bowling was under 5 hours throughout the entire period declining by about 4 hours in total. The number of hours teenagers dedicated to watching DVDs was only 10 hours in first and final years, but reached a peak of over 15 hours in 2004 and 2005.`,
    explanation: "The report clearly presents an overview with key trends highlighted. Data is accurately used to support statements. The sentences are varied and a range of vocabulary is applied, showing good control of complex structures. Minor improvements in cohesion or more precise linking could make it band 9.",
    band: 8,
    words: ["adolescents", "activity", "overall", "favourite", "increase", "decrease", "fluctuated", "doubled", "occupied", "dedicated"],
    image: "/taskImages/secondSample.png" // путь к твоей картинке
  },
  {
    topic: "The graph below shows the consumption of three kinds of spreads between 1981 and 2007.",
    text: `The line graph illustrates the amount of three kinds of spreads (margarine, butter, and low fat and reduced spreads) which were consumed from 1981 to 2007. Units are measured in grams.

Overall, the consumption of margarine and butter decreased over the period given, while for low fat and reduced spreads, it rose. At the start of the period, butter was the most popular spread. Margarine was the most widely consumed in the middle of the period but, by the end, low fat and reduced spreads was most popular.
  
With regards to the amount of butter used, it began at around 140 grams and then peaked at 160 grams in 1986 before falling dramatically to about 50 grams in the last year. Likewise, approximately 90 grams of margarine was eaten in the first year, after which the figure fluctuated slightly and dropped to a low of 40 grams in 2007.

On the other hand, the consumption of low fat and reduced spreads only started in 1996 at about 10 grams. This figure, which reached a high of just over 80 grams five years later, fell slightly in the final years to approximately 70 grams in 2007.`,

    explanation: "The report presents a clear overall trend and uses data accurately to support points. Key features are highlighted and complex sentences are used effectively. Some minor improvements in cohesion or more precise linking could make it band 9. Vocabulary is appropriate and varied.",
    band: 8.5,
    words: ["consumption", "overall", "period", "fluctuated", "dramatically", "approximately", "peaked", "declined", "figure", "popular"],
    image: "/taskImages/thirdSample.png" // путь к твоей картинке
  }
];

const Task1 = () => {
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
          {/* Добавляем изображение */}
          {selectedEssay.image && (
            <div className="essay-image">
              <img src={selectedEssay.image} alt="Essay visual" />
            </div>
          )}
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

export default Task1;
