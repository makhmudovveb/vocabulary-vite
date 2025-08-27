import React, { useState } from "react";
import "../Styles/SpeakingMain.css";
import SpeakingPractice from "../Components/SpeakingPractise";
import BackButton from "../Components/BackBtn";

export default function SpeakingMain() {
  const [view, setView] = useState("main");

  if (view === "ielts") {
    return <SpeakingPractice goBack={() => setView("main")} />;
  }

  return (
    <div className="speaking-container">
      <h1 className="speaking-title">Speaking Practice</h1>
      <div className="cards-wrapper">
        <div className="card card-active" onClick={() => setView("ielts")}>
          <div className="card-content">
            <h2 className="card-title">IELTS</h2>
          </div>
        </div>

        <div className="card card-coming-soon">
          <div className="card-content">
            <h2 className="card-title">Own Practice</h2>
            <span className="card-label">Coming Soon</span>
          </div>
        </div>
      </div>
      <BackButton/>
    </div>
  );
}
