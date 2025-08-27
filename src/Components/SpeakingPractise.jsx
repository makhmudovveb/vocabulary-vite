import React, { useState } from "react";
import questionsData from "../../public/data/IeltsQuestions.json";
import "../Styles/SpeakingIelts.css";
import QuestionSpeak from "./QuestionSpeak";

export default function SpeakingPractise({ goBack }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (selectedTopic) {
    return <QuestionSpeak topic={selectedTopic} goBack={() => setSelectedTopic(null)} />;
  }

  if (selectedPart) {
    return (
      <div className="speakingWrapper">
        <button className="backButton" onClick={() => setSelectedPart(null)}>← Back</button>
        <h2 className="sectionTitle">{selectedPart.toUpperCase()} Topics</h2>
        <div className="cardsWrapper">
          {questionsData[selectedPart].topics.map((topic, i) => (
            <div key={i} className="topicCard activeCard" onClick={() => setSelectedTopic(topic)}>
              <h3 className="topicTitle">{topic.title}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="speakingWrapper">
      <button className="backButton" onClick={goBack}>← Back</button>
      <h1 className="pageTitle">IELTS Parts</h1>
      <div className="cardsWrapper">
        <div className="partCard activeCard" onClick={() => setSelectedPart("part1")}>Part 1</div>
        <div className="partCard activeCard" onClick={() => setSelectedPart("part2")}>Part 2</div>
        <div className="partCard activeCard" onClick={() => setSelectedPart("part3")}>Part 3</div>
      </div>
    </div>
  );
}
