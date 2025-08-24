// src/Pages/IELTSPage.jsx

import React from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck, FileText } from "lucide-react";
import "../Styles/Landing.css"; // можно переиспользовать стили
import BackBtn from '../Components/BackBtn'

export default function IELTSPage() {
  return (
    <>
    <div className="landing-page">
      <h1 className="landing-title">IELTS Preparation</h1>

      <div className="game-card-container">
        <Link to="/ielts/practise" className="game-card coming-soon">
          <FileText size={48} />
          <h2>Practise Test</h2>
          <p>Coming soon</p>
        </Link>
        <Link to="/ielts/quiz" className="game-card coming-soon">
          <BookOpenCheck size={48} />
          <h2>Quiz</h2>
          <p>Coming soon</p>

        </Link>
      </div>
    <BackBtn/>
    </div>
    </>
  );
}
