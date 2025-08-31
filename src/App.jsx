import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AuthModal from "./Components/AuthModal";
import Landing from "./Pages/LandingPage";
import Footer from "./Components/Footer";
import Quiz from "./Pages/QuizPage";
import StatsPage from "./Pages/StatsPage";
import CueCard from "./Pages/CueCardPage";
import MatchingPage from "./Pages/MatchingPage";
import IELTSPage from "./Pages/IeltsPage";
import SpellingGamePage from "./Pages/SpellingGamePage";
import Ielts_practise from "./Pages/Ielts_practise";
import TestPage from "./Pages/TestPage";
import Reading from "./Pages/IELTS TEST PART/Reading";
import TypingVar from "./Pages/TypingVar";
import Task1 from "./Pages/Task1";
import Task2 from "./Pages/Task2";
import SpeakingMain from "./Pages/SpeakingMain";
import "./index.css";

function ListeningPage() { return <h2>Listening Mock</h2>; }
function WritingPage() { return <h2>Writing Mock</h2>; }
function Speaking() { return <h2>Speaking Mock</h2>; }

function App() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || { email: "guest@example.com" }
  );

  const handleAuthSuccess = () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || { email: "guest@example.com" };
    setUser(storedUser);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      <Navbar user={user} setUser={setUser} setShowModal={setShowModal} />
      <Routes>
        <Route path="/" element={<><Landing /><Footer /></>} />
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
        <Route path="/ielts/practise/:id/listening" element={<ListeningPage />} />
        <Route path="/ielts/practise/:id/reading" element={<Reading />} />
        <Route path="/ielts/practise/:id/writing" element={<WritingPage />} />
        <Route path="/ielts/practise/:id/speaking" element={<Speaking />} />
      </Routes>
    </>
  );
}

export default App;
  