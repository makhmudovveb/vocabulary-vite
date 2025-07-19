// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Landing from "./Pages/LandingPage";
import Quiz from "./Pages/QuizPage";
import CueCard from "./Pages/CueCardPage";
import StatsPage from "./Pages/StatsPage";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    const disableInputHelpers = () => {
      const inputs = document.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        input.setAttribute("autocomplete", "off");
        input.setAttribute("autocorrect", "off");
        input.setAttribute("autocapitalize", "off");
        input.setAttribute("spellcheck", "false");
      });
    };

    disableInputHelpers();
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/cuecard" element={<CueCard />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
