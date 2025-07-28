import React from "react";
import { motion } from "framer-motion";

export function Platform({ text, onClick, disabled, isChosen, isCorrect }) {
  let className = "platform";
  let animate = { y: 0, opacity: 1 };

  if (disabled && isChosen && isCorrect) {
    className += " platform--correct";
    animate = { scale: 0.9, opacity: 0 };
  } else if (disabled && isChosen && !isCorrect) {
    className += " platform--wrong";
    animate = { y: 200, opacity: 0, rotate: 10 };
  } else if (disabled) {
    animate = { opacity: 0.3 };
  }

  return (
    <motion.button
      className={className}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      animate={animate}
      transition={{ duration: 0.4 }}
    >
      {text}
    </motion.button>
  );
}
