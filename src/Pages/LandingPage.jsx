import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";
import AuthModal from "../Components/AuthModal";
import "../styles/Landing.css";
import { BookOpen, Brain, Puzzle, Gamepad, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShowAuthModal(!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="landing-page">
      {showAuthModal && (
        <AuthModal onAuthSuccess={() => setShowAuthModal(false)} />
      )}

      <h1 className="landing-title">Welcome to Vocabulary Games!</h1>

      <div className="game-card-container">
        <Link to="/quiz" className="game-card active">
          <BookOpen size={48} />
          <h2>Quiz</h2>
        </Link>
        <Link to="/cuecard" className="game-card active">
          <Brain size={48} />
          <h2>Cue Card</h2>
        </Link>
        <div className="game-card coming-soon">
          <Layers size={48} />
          <h2>Practice Test</h2>
          <span>Coming soon</span>
        </div>
        <div className="game-card coming-soon">
          <Puzzle size={48} />
          <h2>Matching</h2>
          <span>Coming soon</span>
        </div>
        <div className="game-card coming-soon">
          <Gamepad size={48} />
          <h2>Game</h2>
          <span>Coming soon</span>
        </div>
      </div>
    </div>
  );
}
