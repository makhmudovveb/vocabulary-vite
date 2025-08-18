import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import "../Styles/Matching.css";
import BackBtn from "../Components/BackBtn";
import Guide from '../Components/guide';

const LEVELS = [
  "elementary",
  "pre-intermediate",
  "intermediate",
  "upper-intermediate",
];
const UNITS = ["Intro", ...Array.from({ length: 9 }, (_, i) => i + 1)];

const DEFAULT_WORD_LIMIT = 5;
// const DEFAULT_TIME = 60;

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
  const [allWords, setAllWords] = useState([]); // все слова из файла
  const [usedKeys, setUsedKeys] = useState([]); // какие слова уже были

  const navigate = useNavigate();

  const handleStart = async () => {
    if (!level || !unit) {
      setError("Choose level and unit");
      return;
    }
    try {
      setError("");
      const filePath =
        unit === "Intro"
          ? `/data/${level}/unit0.json`
          : `/data/${level}/unit${unit}.json`;

      const response = await axios.get(filePath);
      const all = shuffle(response.data);

      const selected = all.slice(0, DEFAULT_WORD_LIMIT);
      const selectedKeys = selected.map((w) => w.en);

      setAllWords(all);
      setUsedKeys(selectedKeys);
      setWords(selected);
      setRuWords(shuffle(selected.map((w) => ({ value: w.ru, key: w.en }))));
      setEnWords(shuffle(selected.map((w) => ({ value: w.en, key: w.en }))));
      setDescWords(
        shuffle(selected.map((w) => ({ value: w.desc, key: w.en })))
      );
      setGameStarted(true);
      setSelected({ ru: null, en: null, desc: null });
      setGroups([]);
      setChecked(false);
      setCorrectCount(0);
    } catch (err) {
      setError("Не удалось загрузить данные.");
    }
  };
  const handleLoadMore = () => {
    const remaining = allWords.filter((w) => !usedKeys.includes(w.en));
    if (remaining.length < DEFAULT_WORD_LIMIT) {
      setError("Недостаточно новых слов для загрузки.");
      return;
    }

    const nextWords = shuffle(remaining).slice(0, DEFAULT_WORD_LIMIT);
    const nextKeys = nextWords.map((w) => w.en);

    setWords(nextWords);
    setUsedKeys((prev) => [...prev, ...nextKeys]);
    setRuWords(shuffle(nextWords.map((w) => ({ value: w.ru, key: w.en }))));
    setEnWords(shuffle(nextWords.map((w) => ({ value: w.en, key: w.en }))));
    setDescWords(shuffle(nextWords.map((w) => ({ value: w.desc, key: w.en }))));
    setGroups([]);
    setChecked(false);
    setSelected({ ru: null, en: null, desc: null });
    setError("");
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
    if (selected[type]?.value === item.value) {
      setSelected((prev) => ({ ...prev, [type]: null }));
    } else {
      setSelected((prev) => ({ ...prev, [type]: item }));
    }
  };

  const handleCheck = () => {
    const total = words.length;
    if (groups.length !== total) {
      setError("Соедините все пары.");
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
    setError("");
  };

  const saveResult = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("User is not registered!");
        return;
      }

      await addDoc(collection(db, "matchingResults"), {
        uid: user.uid,
        level,
        unit,
        correctCount,
        total: usedKeys.length,
        createdAt: serverTimestamp(),
      });

      navigate("/stats");
    } catch (err) {
      setError("Error during the save: " + err.message);
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
    setError("");
  };

  return (
    <>
      {/* <div className="test-mode-banner">Page works in TEST MODE</div> */}
      <Guide game={"matching"} />

      <div className="matching-wrapper">
        {!gameStarted ? (
          <div className="matching-setup">
            <h2>Matching Game</h2>
            <select onChange={(e) => setLevel(e.target.value)} value={level}>
              <option value="" disabled hidden>
                -- Select Level --
              </option>
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <select onChange={(e) => setUnit(e.target.value)} value={unit}>
              <option disabled hidden value="">
                -- Select Unit --
              </option>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u === "Intro" ? "Intro" : ` ${u}`}
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
            {/* <div className="timer">Time left: {timeLeft}s</div> */}
            <div className="columns">
              <div>
                <h3 className="title_of_word">Russian</h3>
                {ruWords.map((item, idx) => (
                  <div
                    key={item.value + idx}
                    className={`card ${
                      selected.ru?.value === item.value ? "selected" : ""
                    } ${
                      groups.some((g) => g.ru.value === item.value)
                        ? "used disabled"
                        : ""
                    } ${
                      groups.length === DEFAULT_WORD_LIMIT ? "finalized" : ""
                    }`}
                    onClick={() => handleClick("ru", item)}
                  >
                    {item.value}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="title_of_word">English</h3>
                {enWords.map((item, idx) => (
                  <div
                    key={item.value + idx}
                    className={`card ${
                      selected.en?.value === item.value ? "selected" : ""
                    } ${
                      groups.some((g) => g.en.value === item.value)
                        ? "used"
                        : ""
                    } ${
                      groups.length === DEFAULT_WORD_LIMIT ? "finalized" : ""
                    }`}
                    onClick={() => handleClick("en", item)}
                  >
                    {item.value}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="title_of_word">Description</h3>
                {descWords.map((item, idx) => (
                  <div
                    key={item.value + idx}
                    className={`card ${
                      selected.desc?.value === item.value ? "selected" : ""
                    } ${
                      groups.some((g) => g.desc.value === item.value)
                        ? "used"
                        : ""
                    } ${
                      groups.length === DEFAULT_WORD_LIMIT ? "finalized" : ""
                    }`}
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
                  <button onClick={handleLoadMore}>Загрузить ещё слова</button>
                </div>
              )}
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        )}
      </div>
      <div className="backbtn">
      <BackBtn />
      </div>
    </>
  );
};

export default MatchingPage;
