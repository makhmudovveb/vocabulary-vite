import React from "react";
import { useGame } from "@context/GameContext";
import { HUD } from "./HUD";
import { PlatformStack } from "./PlatformStack";
import BackButton from "../BackBtn";

export function Game() {
  const { phase, start, reset, score, bestScore, level, setLevel } = useGame();

  const isLevelSelected =
    level === "elementary" ||
    level === "pre-intermediate" ||
    level === "intermediate" ||
    level === "upper-intermediate" ||
    level === "ielts";

  if (phase === "menu") {
    return (
      <>
        <div className="test-mode-banner">Page works in TEST MODE</div>
        <BackButton />
        <div className="game-container">
          <h1>Spelling Run</h1>
          <label className="level-select">
            Choose level:&nbsp;
            <br />
            <br />
            <select
              value={level || ""}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled hidden>
                -- Choose level --
              </option>
              <option value="elementary">Elementary</option>
              <option value="pre-intermediate">Pre-Intermediate</option>
              <option value="intermediate">Intermediate</option>
              <option value="upper-intermediate">Upper-Intermediate</option>
              <option value="ielts">IELTS</option>
            </select>
          </label>
          <button onClick={start} className="btn" disabled={!isLevelSelected}>
            Start
          </button>
        </div>
      </>
    );
  }

  if (phase === "gameOver") {
    const isRecord = score >= bestScore;
    return (
      <>
        <div className="test-mode-banner">Page works in TEST MODE</div>
        <BackButton />
        <div className="game-container">
          <h1>Game over</h1>
          <p>Your score: {score}</p>
          <p>Record: {bestScore}</p>
          {isRecord && <p>🎉 New record!</p>}
          <button onClick={reset} className="btn">
            Сыграть ещё
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="test-mode-banner">Page works in TEST MODE</div>
      <div className="game-container">
        <HUD />
        <div className="board">
          <PlatformStack />
        </div>
      </div>
    </>
  );
}
