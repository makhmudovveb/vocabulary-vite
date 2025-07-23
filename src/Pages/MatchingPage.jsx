import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import "../Styles/Matching.css";
import BackBtn from '../Components/BackBtn'

const LEVELS = ["elementary", "pre-intermediate", "intermediate", "upper-intermediate", "ielts"];
const UNITS = Array.from({ length: 10 }, (_, i) => i + 1);
const DEFAULT_WORD_LIMIT = 5;
const DEFAULT_TIME = 60;

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const MatchingPage = () => {
  const [level, setLevel] = useState("");
  const [unit, setUnit] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [ruWords, setRuWords] = useState([]);
  const [enWords, setEnWords] = useState([]);
  const [descWords, setDescWords] = useState([]);

  const [selected, setSelected] = useState({ ru: null, en: null, desc: null });
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [timerStarted, setTimerStarted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (timerStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameStarted) {
      setError("Время вышло!");
      handleCheck();
    }
  }, [timeLeft, timerStarted]);

  const handleStart = async () => {
    if (!level || !unit) {
      setError("Выберите уровень и юнит");
      return;
    }
    try {
      setError("");
      const filePath = `/data/${level}/unit${unit}.json`;
      const response = await axios.get(filePath);
      const selectedWords = shuffle(response.data).slice(0, DEFAULT_WORD_LIMIT);

      setWords(selectedWords);
      setRuWords(shuffle(selectedWords.map((w) => ({ value: w.ru, key: w.en }))));
      setEnWords(shuffle(selectedWords.map((w) => ({ value: w.en, key: w.en }))));
      setDescWords(shuffle(selectedWords.map((w) => ({ value: w.desc, key: w.en }))));
      setGameStarted(true);
      setTimerStarted(true);
      setSelected({ ru: null, en: null, desc: null });
      setGroups([]);
      setChecked(false);
      setCorrectCount(0);
      setTimeLeft(DEFAULT_TIME);
    } catch (err) {
      setError("Не удалось загрузить данные.");
    }
  };

  useEffect(() => {
    const { ru, en, desc } = selected;
    if (ru && en && desc) {
      if (
        groups.find(
          (g) =>
            g.ru.value === ru.value ||
            g.en.value === en.value ||
            g.desc.value === desc.value
        )
      ) {
        setError("Эти слова уже использованы в другой паре.");
      } else {
        setGroups((prev) => [...prev, { ru, en, desc }]);
        setSelected({ ru: null, en: null, desc: null });
        setError("");
      }
    }
  }, [selected]);

  const handleClick = (type, item) => {
    if (checked || timeLeft === 0) return; // блокировка после проверки или истечения времени
    if (selected[type]?.value === item.value) {
      setSelected((prev) => ({ ...prev, [type]: null }));
    } else {
      setSelected((prev) => ({ ...prev, [type]: item }));
    }
  };

  const handleCheck = () => {
    if (groups.length !== DEFAULT_WORD_LIMIT) {
      setError("Создайте все пары перед проверкой.");
      return;
    }
    let correct = 0;
    for (let group of groups) {
      if (group.ru.key === group.en.key && group.en.key === group.desc.key) {
        correct++;
      }
    }
    setCorrectCount(correct);
    setChecked(true);
    setTimerStarted(false);
    setError("");
  };

  const saveResult = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("Пользователь не авторизован.");
        return;
      }

      await addDoc(collection(db, "matchingResults"), {
        uid: user.uid,
        level,
        unit,
        correctCount,
        total: DEFAULT_WORD_LIMIT,
        createdAt: serverTimestamp(),
      });

      navigate("/stats");
    } catch (err) {
      setError("Ошибка при сохранении результата: " + err.message);
    }
  };

  const resetGame = () => {
    setLevel("");
    setUnit("");
    setWords([]);
    setRuWords([]);
    setEnWords([]);
    setDescWords([]);
    setGroups([]);
    setSelected({ ru: null, en: null, desc: null });
    setGameStarted(false);
    setChecked(false);
    setCorrectCount(0);
    setTimeLeft(DEFAULT_TIME);
    setTimerStarted(false);
    setError("");
  };

  return (
    <>
    <BackBtn />
    <div className="matching-wrapper">
      {!gameStarted ? (
        <div className="matching-setup">
          <h2>Matching Game</h2>
          <select onChange={(e) => setLevel(e.target.value)} value={level}>
            <option value="">Select Level</option>
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          <select onChange={(e) => setUnit(e.target.value)} value={unit}>
            <option value="">Select Unit</option>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                Unit {u}
              </option>
            ))}
          </select>
          <button onClick={handleStart} disabled={!level || !unit}>
            Start Game
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="matching-game">
          <div className="timer">Time left: {timeLeft}s</div>
          <div className="columns">
            <div>
              <h3>Russian</h3>
              {ruWords.map((item, idx) => (
                <div
                  key={item.value + idx}
                  className={`card ${
                    selected.ru?.value === item.value ? "selected" : ""
                  } ${
                    groups.some((g) => g.ru.value === item.value) ? "used" : ""
                  } ${groups.length === DEFAULT_WORD_LIMIT ? "finalized" : ""}`}
                  onClick={() => handleClick("ru", item)}
                >
                  {item.value}
                </div>
              ))}
            </div>
            <div>
              <h3>English</h3>
              {enWords.map((item, idx) => (
                <div
                  key={item.value + idx}
                  className={`card ${
                    selected.en?.value === item.value ? "selected" : ""
                  } ${
                    groups.some((g) => g.en.value === item.value) ? "used" : ""
                  } ${groups.length === DEFAULT_WORD_LIMIT ? "finalized" : ""}`}
                  onClick={() => handleClick("en", item)}
                >
                  {item.value}
                </div>
              ))}
            </div>
            <div>
              <h3>Description</h3>
              {descWords.map((item, idx) => (
                <div
                  key={item.value + idx}
                  className={`card ${
                    selected.desc?.value === item.value ? "selected" : ""
                  } ${
                    groups.some((g) => g.desc.value === item.value) ? "used" : ""
                  } ${groups.length === DEFAULT_WORD_LIMIT ? "finalized" : ""}`}
                  onClick={() => handleClick("desc", item)}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>

          <div className="control-buttons">
            {!checked && groups.length === DEFAULT_WORD_LIMIT && (
              <button onClick={handleCheck}>Проверить результат</button>
            )}

            {checked && (
              <div className="result-box">
                <h3>
                  Правильных ответов: {correctCount} из {DEFAULT_WORD_LIMIT}
                </h3>
                <button onClick={saveResult}>
                  Сохранить и перейти на статистику
                </button>
                <button onClick={resetGame}>Не сохранять и на главную</button>
              </div>
            )}
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default MatchingPage;
