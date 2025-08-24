import { useGame } from "@context/GameContext";

export default function DifficultySelect() {
  const { difficulty, setDifficulty } = useGame();

  return (
    <div className="difficulty-select">
      <p>Choose difficulty:</p>
      <label>
        <input
          type="radio"
          name="difficulty"
          value="easy"
          checked={difficulty === "easy"}
          onChange={() => setDifficulty("easy")}
        />
        Easy (10s)
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="difficulty"
          value="medium"
          checked={difficulty === "medium"}
          onChange={() => setDifficulty("medium")}
        />
        Medium (8s)
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="difficulty"
          value="hard"
          checked={difficulty === "hard"}
          onChange={() => setDifficulty("hard")}
        />
        Hard (5s)
      </label>
    </div>
  );
}
