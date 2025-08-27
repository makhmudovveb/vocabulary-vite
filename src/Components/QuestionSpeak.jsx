import React, { useState } from "react";
import "../Styles/SpeakingIelts.css";

export default function QuestionSpeak({ topic, goBack }) {
  const [activeSection, setActiveSection] = useState("questions");

  if (!topic) return <p>Выберите тему</p>;

  const sections = [
    { key: "questions", label: "Questions", data: topic.questions || [] },
    { key: "ideas", label: "Ideas", data: topic.ideas || [] },
    { key: "vocab", label: "Vocabulary", data: topic.vocab || [] },
  ];

  return (
    <div className="speakingWrapper practicePage">
      <button className="backButton" onClick={goBack}>← Back</button>
      <h1 className="topicTitle">{topic.title}</h1>

      <div className="sectionsWrapper">
        {sections.map((sec) => (
          <div
            key={sec.key}
            className={`sectionCard ${activeSection === sec.key ? "activeSection" : "inactiveSection"}`}
            onClick={() => setActiveSection(sec.key)}
          >
            {activeSection === sec.key ? (
              <div className="scrollContainer">
                <ul className="sectionList">
                  {sec.data.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ) : (
              <div className="sectionOverlay">{sec.label} — Нажми, чтобы открыть</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
