import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { generateWordOptions, loadWords, uid } from "./utils";

const GameContext = createContext(null);

const initialState = {
  phase: "menu",
  score: 0,
  bestScore: 0,
  lives: 3,
  platformRows: [],
  words: [],
  level: "",
  timer: 5,
  lifeLost: false,
};

function spawnRow(words) {
  if (!words || words.length === 0) return null;
  const w = words[Math.floor(Math.random() * words.length)].en.toLowerCase();
  const options = generateWordOptions(w);
  const correctIndex = options.indexOf(w);
  return {
    id: uid(),
    options: options.map((t) => ({ id: uid(), text: t })),
    correctIndex,
    chosenIndex: null,
    resolved: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "MISS": {
      const lives = state.lives - 1;
      return {
        ...state,
        lives,
        lifeLost: true,
        phase: lives <= 0 ? "gameOver" : state.phase,
      };
    }
    case "SET_LEVEL":
      return { ...state, level: action.payload };

    case "SET_WORDS":
      return { ...state, words: action.payload };

    case "LOAD_BEST":
      return { ...state, bestScore: action.payload ?? 0 };

    case "START": {
      const first = spawnRow(state.words);
      return {
        ...state,
        phase: "playing",
        score: 0,
        lives: 3,
        platformRows: first ? [first] : [],
        timer: 5,
        lifeLost: false,
      };
    }

    case "SPAWN_ROW": {
      const row = spawnRow(state.words);
      if (!row) return state;
      return { ...state, platformRows: [...state.platformRows, row] };
    }

    case "TICK":
      return { ...state, timer: state.timer - 1 };

    case "RESET_TIMER":
      return { ...state, timer: 5 };

    case "CHOOSE": {
      const { rowId, optionIndex } = action.payload;
      const updated = state.platformRows.map((r) => {
        if (r.id !== rowId) return r;
        if (r.resolved) return r;
        return { ...r, chosenIndex: optionIndex, resolved: true };
      });

      const row = updated.find((r) => r.id === rowId);
      const isCorrect = row && row.correctIndex === optionIndex;

      if (isCorrect) {
        const newScore = state.score + 1;
        const newBest = Math.max(state.bestScore, newScore);
        localStorage.setItem("spelling_best_score", String(newBest));
        return {
          ...state,
          platformRows: updated,
          score: newScore,
          bestScore: newBest,
        };
      } else {
        const lives = state.lives - 1;
        return {
          ...state,
          platformRows: updated,
          lives,
          lifeLost: true,
          phase: lives <= 0 ? "gameOver" : state.phase,
        };
      }
    }

    case "CLEAR_LIFE_LOST":
      return { ...state, lifeLost: false };

    case "RESET":
      return {
        ...initialState,
        words: state.words,
        bestScore: state.bestScore,
        level: state.level,
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLevel = (level) => dispatch({ type: "SET_LEVEL", payload: level });

  const loadLevelWords = useCallback(async (level) => {
    const words = await loadWords(level);
    dispatch({ type: "SET_WORDS", payload: words });
  }, []);

  // загрузка bestScore при инициализации
  useEffect(() => {
    const best = parseInt(localStorage.getItem("spelling_best_score")) || 0;
    dispatch({ type: "LOAD_BEST", payload: best });
  }, []);

  const start = useCallback(() => {
    loadLevelWords(state.level).then(() => {
      dispatch({ type: "START" });
    });
  }, [state.level, loadLevelWords]);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const choose = useCallback((rowId, optionIndex) => {
    dispatch({ type: "CHOOSE", payload: { rowId, optionIndex } });
  }, []);

  // Таймер + спавн строк
  useEffect(() => {
    if (state.phase !== "playing") return;
    const interval = setInterval(() => {
      if (state.timer <= 1) {
        // Проверяем, есть ли нерешённая строка (пользователь не выбрал вариант)
        const lastRow = state.platformRows[state.platformRows.length - 1];
        if (lastRow && !lastRow.resolved) {
          dispatch({ type: "MISS" });
        }
        dispatch({ type: "SPAWN_ROW" });
        dispatch({ type: "RESET_TIMER" });
      } else {
        dispatch({ type: "TICK" });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.phase, state.timer, state.platformRows]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        start,
        reset,
        choose,
        setLevel,
        dispatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
