import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";
import AuthModal from "../Components/AuthModal";
import "../Styles/Landing.css";
import "../Styles/NewFeatures.css";

import { BookOpen, Brain, Puzzle, Gamepad, Info } from "lucide-react";
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
      <Link to="/quiz" className="game-card coming-soon ">
          <Info  size={48} />
          <h2>Instructions</h2>
        </Link>
        <Link to="/quiz" className="game-card active ">
          <BookOpen size={48} />
          <h2>Quiz</h2>
        </Link>
        <Link to="/cuecard" className="game-card active ">
          <Brain size={48} />
          <h2>Cue Card</h2>
          {/* <h2 className="new-badge">New !</h2> */}
        </Link>

        <Link to="/matching" className="game-card active ">
          <Puzzle size={48} />
          <h2>Matching</h2>
          {/* <h2 className="new-badge">NEW !</h2> */}
        </Link>

        <div className="game-card coming-soon status-new-feature">
          <Gamepad size={48} />
          <h2>Game</h2>
          <span>Coming soon</span>
        </div>
        <Link to="/ielts" className="game-card active status-new-feature">
          <h2>IELTS</h2>
          <span>Coming soon</span>
        </Link>
        
      </div>
    </div>
  );
}
