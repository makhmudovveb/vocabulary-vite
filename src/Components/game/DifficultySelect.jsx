import { useGame } from "@context/GameContext";
import './DifficultySelect.css'
export default function DifficultySelect() {
  const { difficulty, setDifficulty } = useGame();

  const levels = [
    { id: "easy", label: "Easy", time: 8, color: "#34d399" },
    { id: "medium", label: "Medium", time: 5, color: "#fbbf24" },
    { id: "hard", label: "Hard", time: 3, color: "#f87171" },
  ];

  return (
    <div className="difficulty-select-container">
      <p className="difficulty-title">Choose Difficulty</p>
      <div className="difficulty-levels">
        {levels.map((lvl) => (
          <div
            key={lvl.id}
            className={`difficulty-card ${difficulty === lvl.id ? "active" : ""}`}
            style={{ borderColor: lvl.color }}
            onClick={() => setDifficulty(lvl.id)}
          >
            <span className="difficulty-label">{lvl.label}</span>
            <span className="difficulty-time">{lvl.time}s</span>
          </div>
        ))}
      </div>
    </div>
  );
}
