// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Landing from "./Pages/LandingPage";
import Quiz from "./Pages/QuizPage";
import CueCard from "./Pages/CueCardPage";
import StatsPage from "./Pages/StatsPage";

function App() {
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
