import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Landing from "./Pages/LandingPage";
import Quiz from "./Pages/QuizPage";
import CueCard from "./Pages/CueCardPage";
import StatsPage from "./Pages/StatsPage";
import Footer from "./Components/Footer";
import MatchingPage from "./Pages/MatchingPage";
import IELTSPage from "./Pages/IeltsPage";
import SpellingGamePage from "./Pages/SpellingGamePage";
import './index.css'

function App() {
  useEffect(() => {
    const disableFeatures = (el) => {
      if (!el) return; // защита от undefined
      el.setAttribute("autoComplete", "off");
      el.setAttribute("autoCorrect", "off");
      el.setAttribute("autoCapitalize", "off");
      el.setAttribute("spellCheck", "false");

      el.addEventListener("copy", (e) => e.preventDefault());
      el.addEventListener("paste", (e) => e.preventDefault());
      el.addEventListener("cut", (e) => e.preventDefault());
      el.addEventListener("contextmenu", (e) => e.preventDefault());
      el.style.userSelect = "none";
    };

    // Применяем ко всем текущим инпутам и textarea
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach(disableFeatures);

    // Чтобы срабатывало на новых полях (React-роуты, динамический рендеринг)
    const observer = new MutationObserver(() => {
      document.querySelectorAll("input, textarea").forEach(disableFeatures);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <Router>
      <Navbar />
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
        <Route path="/spelling-game" element={<SpellingGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
