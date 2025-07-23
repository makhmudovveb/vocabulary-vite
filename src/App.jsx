// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Landing from "./Pages/LandingPage";
import Quiz from "./Pages/QuizPage";
import CueCard from "./Pages/CueCardPage";
import StatsPage from "./Pages/StatsPage";
import FeedbackForm from "./Components/FeedbackWidget";
import Footer from "./Components/Footer";
import MatchingPage from "./Pages/MatchingPage";
import IELTSPage from "./Pages/IeltsPage"; // 
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
      <FeedbackForm />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Landing />
              <Footer />
            </>
          }
        />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/cuecard" element={<CueCard />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/ielts" element={<IELTSPage />} />
      </Routes>
    </Router>
  );
}

export default App;
