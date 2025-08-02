import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../Styles/QuizPage.css";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";
import { Auth } from "../Context/AuthContext";
import BackBtn from "../Components/BackBtn";
import  ProgressBar  from "../Components/ProgressBar";

const QuizPage = () => {
  const { currentUser, userData } = Auth(); 
  const inputRef = useRef(null);
  const [skipEnabled, setSkipEnabled] = useState(false);
  const [level, setLevel] = useState("");
  const [unit, setUnit] = useState("");
  const [words, setWords] = useState([]);
  const [quizWords, setQuizWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timer, setTimer] = useState(20);
  const [buttonsDisabled, setButtonsDisabled] = useState(false); // Новое состояние
  const navigate = useNavigate();

  useEffect(() => {
    if (quizStarted && !quizFinished && inputRef.current) {
      inputRef.current.focus();

      setSkipEnabled(false);
      const skipTimer = setTimeout(() => setSkipEnabled(true), 3000);
      return () => clearTimeout(skipTimer);
    }
  }, [currentIndex, quizStarted]);
  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSkip(); // если время вышло — пропуск
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // очистка таймера при смене вопроса
  }, [currentIndex, quizStarted, quizFinished]);

  useEffect(() => {
    if (level && unit) {
      axios
        .get(`/data/${level}/unit${unit}.json`)
        .then((res) => {
          setWords(res.data);
        })
        .catch((err) => {
          console.error("Ошибка загрузки слов:", err);
        });
    }
  }, [level, unit]);

  const startQuiz = () => {
    const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 30);
    setQuizWords(shuffled);
    setQuizStarted(true);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setQuizFinished(false);
    setInputValue("");
    setFeedback("");
    setTimer(20);
  };

  const goToNext = () => {
    if (currentIndex + 1 < quizWords.length) {
      setCurrentIndex((prev) => prev + 1);
      setInputValue("");
      setFeedback("");
      setTimer(20); // сбрасываем таймер при переходе
    } else {
      setQuizFinished(true);
      setQuizStarted(false);
    }
    setButtonsDisabled(false);
  };

  const handleSubmit = () => {
    if (buttonsDisabled) return;
    setButtonsDisabled(true);

    const currentWord = quizWords[currentIndex];
    const isCorrect =
      inputValue.trim().toLowerCase() === currentWord.en.trim().toLowerCase();

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setIncorrectCount((prev) => prev + 1);
      setFeedback(`❌ Incorrect! Correct answer: ${currentWord.en}`);
    }

    setTimeout(goToNext, 1000);
  };

  const handleSkip = () => {
    if (buttonsDisabled || !skipEnabled) return;
    setButtonsDisabled(true);

    setIncorrectCount((prev) => prev + 1);
    setFeedback(`❌ Skipped! Correct answer: ${quizWords[currentIndex].en}`);
    setTimeout(goToNext, 1000);
  };

  const handleSaveResult = async () => {
    if (!currentUser) {
      alert("Пожалуйста, войдите в аккаунт.");
      return;
    }
    if (!userData) {
      alert("Данные пользователя ещё загружаются. Пожалуйста, подождите.");
      return;
    }
  
    try {
      await addDoc(collection(db, "quizResults"), {
        uid: currentUser.uid,
        email: currentUser.email || "unknown",
        userName: userData.fullName || "",   // <- теперь безопасно
        correct: correctCount,
        incorrect: incorrectCount,
        total: quizWords.length,
        level,
        unit,
        teacher: userData.teacher || "",  // или teacherSelect, как у тебя
        createdAt: Timestamp.now(),
      });
  
      alert("📥 Результат сохранён!");
      navigate("/stats");
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      alert("❌ Не удалось сохранить результат.");
    }
  };

  return (
<>
<BackBtn/>


    <div className="quiz-container">
      <h1>Vocabulary Quiz</h1>
      {/* <div className="question-counter">
        Question {currentIndex + 1} of {quizWords.length}
      </div> */}

      {!quizStarted && !quizFinished && (
        <>
          <div className="selector">
            <select disabledvalue={level}  value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="" disabled hidden>-- Select Level --</option>
              <option value="elementary">Elementary</option>
              <option value="pre-intermediate">Pre-Intermediate</option>
              <option value="intermediate">Intermediate</option>
              <option value="upper-intermediate">Upper-Intermediate</option>
              <option value="ielts">IELTS</option>
            </select>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option disabled hidden value="">-- Select Unit --</option>
              {[...Array(11).keys()].map((u) => (
                <option key={u} value={u}>
                  {u === 0 ? "Intro" : u}
                </option>
              ))}
            </select>
            <button onClick={startQuiz} disabled={!level || !unit}>
              Start Quiz
            </button>
          </div>

          {words.length > 0 && (
            <div className="word-table">
              <h2>Words from selected Unit</h2>
              <table>
                <thead>
                  <tr>
                    <th>Russian</th>
                    <th>English</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((w, i) => (
                    <tr key={i}>
                      <td>{w.ru}</td>
                      <td>{w.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {quizStarted && !quizFinished && (
        <div className="quiz-modal">
          <div className="quiz-header">
            <div className="question-counter">
            <ProgressBar current={currentIndex + 1} total={quizWords.length} />
            </div>
            <div className="timer">⏳ {timer}s</div>
          </div>
          <div className="word-display">
            Translate:{" "}
            <strong className="word_trn">{quizWords[currentIndex].ru}</strong>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type the English word..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              inputValue.trim() &&
              !buttonsDisabled &&
              handleSubmit()
            }
          />

          <div className="feedback">{feedback}</div>
          <div className="actions">
            <button
              onClick={handleSubmit}
              disabled={inputValue.trim().length === 0 || buttonsDisabled}
            >
              Submit
            </button>
            <button
              onClick={handleSkip}
              className="skip-btn"
              disabled={!skipEnabled || buttonsDisabled}
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {quizFinished && (
        <div className="result-modal">
          <h2>Quiz Completed!</h2>
          <p>✅ Correct: {correctCount}</p>
          <p>❌ Incorrect: {incorrectCount}</p>
          <div className="result-actions">
            <button onClick={handleSaveResult}>Save Result</button>
            <button
              onClick={() => {
                // Просто перезапуск квиза (уровень и юнит сохраняем)
                setQuizFinished(false);
                setQuizStarted(false);
                setInputValue("");
                setQuizWords([]);
                setCurrentIndex(0);
                setCorrectCount(0);
                setIncorrectCount(0);
                setFeedback("");
                setTimer(20);
              }}
            >
              Don't Save
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default QuizPage;
