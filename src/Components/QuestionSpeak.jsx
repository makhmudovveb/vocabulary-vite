import React, { useState } from "react";
import "../Styles/SpeakingIelts.css";

export default function QuestionSpeak({ topic, goBack }) {
  const [activeSection, setActiveSection] = useState("questions");

  if (!topic) return <p>Choose theme</p>;

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
            {/* Иконка всегда сверху по центру */}
            <div className="sectionIcon">{sec.icon}</div>

            {/* Заголовок (под иконкой) */}
            <div className="sectionHeader">
              <span className="sectionLabel">{sec.label}</span>
            </div>

            {/* Контент */}
            {activeSection === sec.key ? (
              <div className="scrollContainer">
                <ul className="sectionList">
                  {sec.data.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ) : (
              <div className="sectionOverlay">Touch, to open</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
