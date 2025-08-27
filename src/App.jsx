import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Landing from "./Pages/LandingPage";
import Quiz from "./Pages/QuizPage";
import CueCard from "./Pages/CueCardPage";
import StatsPage from "./Pages/StatsPage";
import Footer from "./Components/Footer";
import MatchingPage from "./Pages/MatchingPage";
import IELTSPage from "./Pages/IeltsPage";
import SpellingGamePage from "./Pages/SpellingGamePage";
import Ielts_practise from "./Pages/Ielts_practise";
import './index.css'
import TestPage from "./Pages/TestPage";
import Reading from "./Pages/IELTS TEST PART/Reading";
import TypingVar from "./Pages/TypingVar";
import Task1 from "./Pages/Task1";
import Task2 from "./Pages/Task2";
import SpeakingMain from "./Pages/SpeakingMain";

function ListeningPage() {
  return <h2>Listening Mock</h2>;
}

function WritingPage() {
  return <h2>Writing Mock</h2>;
}
function Speaking() {
  return <h2>Speaking Mock</h2>;
}


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
    <>
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
        <Route path="/ielts/practise" element={<Ielts_practise />} />
        <Route path="/ielts/practise/:id" element={<TestPage />} />
        <Route path="/typing" element={<TypingVar />} />
        <Route path="/typing/task1" element={<Task1 />} />
        <Route path="/typing/task2" element={<Task2 />} />
        <Route path="/speaking" element={<SpeakingMain />} />
        <Route path="/typing/task2" element={<Task2 />} />




        <Route path="/ielts/practise/:id/listening" element={<ListeningPage />} />
        <Route path="/ielts/practise/:id/reading" element={<Reading />} />
        <Route path="/ielts/practise/:id/writing" element={<WritingPage />} />
        <Route path="/ielts/practise/:id/speaking" element={<Speaking />} />
      </Routes>
    </>
  );
}

export default App;
