import React from "react";
import { motion } from "framer-motion";
import { useGame } from "@context/GameContext";

export function Player() {
  const { jumping, playerIndex } = useGame();
  const xPositions = [100, 250, 400];
  const x = xPositions[playerIndex] || 250;

  return (
    <motion.div
      className="player"
      animate={{ x, y: jumping ? -100 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 12 }}
      style={{ bottom: 0 }}
    >
      🧍
    </motion.div>
  );
}
