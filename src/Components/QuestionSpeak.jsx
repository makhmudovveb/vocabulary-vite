import React, { useState } from "react";
import "../Styles/SpeakingIelts.css";

export default function QuestionSpeak({ topic, goBack }) {
  const [activeSection, setActiveSection] = useState("questions");

  if (!topic) return <p>Выберите тему</p>;

  const sections = [
    { key: "questions", label: "Questions", icon: "❓", data: topic.questions || [] },
    { key: "ideas", label: "Ideas", icon: "💡", data: topic.ideas || [] },
    { key: "vocab", label: "Vocabulary", icon: "📝", data: topic.vocab || [] },
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
            <div className="sectionHeader">
              <span className="sectionLabel">{sec.label}</span>
            </div>
              <span className="sectionIcon">{sec.icon}</span>
            {activeSection === sec.key ? (
              <div className="scrollContainer">
                <ul className="sectionList">
                  {sec.data.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ) : (
              <div className="sectionOverlay">Нажми, чтобы открыть</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
  