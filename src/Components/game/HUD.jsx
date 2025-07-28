import React, { useEffect } from "react";
import { useGame } from "@context/GameContext";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function HUD() {
  const { score, bestScore, lives, lifeLost, dispatch, timer } = useGame();

  useEffect(() => {
    if (lifeLost) {
      const t = setTimeout(() => {
        dispatch({ type: "CLEAR_LIFE_LOST" });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [lifeLost, dispatch]);

  return (
    <div className="hud">
      <div className="hud-score">Score: {score}</div>
      <div className="hud-best">Best: {bestScore}</div>

      <div className="hud-lives">
        {Array.from({ length: 3 }, (_, i) => {
          const broken = lifeLost && i === lives; // “сломанное” — потеряли текущую
          const active = i < lives;
          return (
            <motion.div
              key={i}
              className={`heart ${active ? "active" : "inactive"}`}
              animate={
                broken
                  ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }
                  : { rotate: 0, scale: 1 }
              }
              transition={{ duration: 0.6 }}
            >
              <Heart
                size={24}
                fill={active ? "#ef4444" : "transparent"}
                color="#ef4444"
              />
              {broken && (
                <motion.span
                  className="heart-broken"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  💔
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="timer-game">
        <div
          className="timer-bar"
          style={{ width: `${(timer / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
