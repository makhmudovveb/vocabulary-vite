import React from "react";
import { GameProvider } from "@context/GameContext";
import { Game } from "@components/game/Game";
import "../Styles/game.css";

export default function SpellingGamePage() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
