// StatsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import { Auth } from "../Context/AuthContext";
import "../Styles/StatsPage.css";

const PRIORITY_TEACHERS = ["Bexzod Mahmudov"]; // можно расширять

const StatsPage = () => {
  const { currentUser, userData } = Auth(); // у тебя так
  const [quizResults, setQuizResults] = useState([]);
  const [matchingResults, setMatchingResults] = useState([]);
  const [usersMap, setUsersMap] = useState(new Map()); // uid -> user doc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [openMap, setOpenMap] = useState({});

  // --- утилиты для даты ---
  const toMs = (val) => {
    if (!val) return 0;
    if (typeof val === "string" || typeof val === "number") {
      const t = new Date(val).getTime();
      return isNaN(t) ? 0 : t;
    }
    if (val?.seconds) return val.seconds * 1000;
    if (typeof val?.toDate === "function") return val.toDate().getTime();
    return 0;
  };
  const formatDate = (val) => {
    const ms = toMs(val);
    return ms ? new Date(ms).toLocaleString("ru-RU") : "—";
  };

  // --- загрузка данных ---
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);

      if (!currentUser || !userData) {
        setLoading(false);
        setError("Пользователь ещё не загружен (currentUser / userData отсутствует)");
        return;
      }

      try {
        // пробуем загрузить users (необязательно — может не дать права)
        try {
          const usersSnap = await getDocs(collection(db, "users"));
          const uMap = new Map();
          usersSnap.docs.forEach((d) => {
            const data = d.data();
            // используем поле uid, если есть; иначе id
            const key = data.uid || d.id;
            uMap.set(key, { id: d.id, ...data });
          });
          if (!mounted) return;
          setUsersMap(uMap);
          console.debug("[StatsPage] users loaded:", uMap.size);
        } catch (uErr) {
          // нет прав на users — это не фатально, но помечаем
          console.warn("[StatsPage] can't read users collection:", uErr);
          if (!mounted) return;
          setUsersMap(new Map());
        }

        const isStudent = userData.role === "student";

        // quiz query
        const quizQueryRef = isStudent
          ? query(collection(db, "quizResults"), where("uid", "==", currentUser.uid))
          : collection(db, "quizResults");

        // matching query
        const matchQueryRef = isStudent
          ? query(collection(db, "matchingResults"), where("uid", "==", currentUser.uid))
          : collection(db, "matchingResults");

        const [quizSnap, matchingSnap] = await Promise.all([
          getDocs(quizQueryRef),
          getDocs(matchQueryRef),
        ]);

        const quizData = quizSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const matchingData = matchingSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // сортируем по дате (новые сверху)
        quizData.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt));
        matchingData.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt));

        if (!mounted) return;
        setQuizResults(quizData);
        setMatchingResults(matchingData);

        console.debug(
          "[StatsPage] loaded quiz/matching counts:",
          quizData.length,
          matchingData.length
        );
      } catch (err) {
        console.error("[StatsPage] Ошибка при получении статистики:", err);
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [currentUser, userData]);

  // --- группировка: teacher -> students ---
  const groupedByTeacher = useMemo(() => {
    const teacherMap = new Map(); // teacherName -> Map(uid -> studentObj)
    const add = (r, kind) => {
      const uid = r.uid || "unknown";
      // имя ученика
      const studentName = r.userName || r.userName || r.email || (usersMap.get(uid) && (usersMap.get(uid).fullName || usersMap.get(uid).name)) || uid;

      // определяем имя учителя: prefer r.teacher; если нет, и пользователь с uid является учителем в usersMap -> подставляем его имя
      let teacherName = r.teacher;
      let isTeacherRecord = false;
      if (!teacherName) {
        const u = usersMap.get(uid);
        if (u && u.role === "teacher") {
          teacherName = u.fullName || u.name || studentName;
          isTeacherRecord = true;
        } else {
          teacherName = "Teacher";
        }
      }
      if (!teacherMap.has(teacherName)) teacherMap.set(teacherName, new Map());
      const students = teacherMap.get(teacherName);
      if (!students.has(uid)) {
        students.set(uid, {
          uid,
          name: studentName,
          teacher: teacherName,
          isTeacher: isTeacherRecord,
          quiz: [],
          matching: [],
        });
      }
      students.get(uid)[kind].push(r);
    };

    quizResults.forEach((r) => add(r, "quiz"));
    matchingResults.forEach((r) => add(r, "matching"));

    // преобразуем в массив с сортировкой: сначала приоритетные учителя, затем остальные по имени
    const arr = Array.from(teacherMap.entries()).map(([teacher, studentsMap]) => ({
      teacher,
      students: Array.from(studentsMap.values()).sort((a, b) => a.name.localeCompare(b.name, "ru")),
    }));

    // сортируем учителей по приоритету, затем по имени
    arr.sort((a, b) => {
      const aPri = PRIORITY_TEACHERS.indexOf(a.teacher);
      const bPri = PRIORITY_TEACHERS.indexOf(b.teacher);
      if (aPri !== -1 || bPri !== -1) {
        if (aPri === -1) return 1;
        if (bPri === -1) return -1;
        return aPri - bPri;
      }
      return a.teacher.localeCompare(b.teacher, "ru");
    });

    return arr;
  }, [quizResults, matchingResults, usersMap]);

  // --- удаления ---
  const handleDeleteAll = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить ВСЮ статистику?")) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      const q1 = await getDocs(collection(db, "quizResults"));
      q1.docs.forEach((d) => batch.delete(doc(db, "quizResults", d.id)));
      const q2 = await getDocs(collection(db, "matchingResults"));
      q2.docs.forEach((d) => batch.delete(doc(db, "matchingResults", d.id)));
      await batch.commit();
      setQuizResults([]);
      setMatchingResults([]);
      console.debug("[StatsPage] all deleted");
      alert("Вся статистика удалена.");
    } catch (err) {
      console.error("[StatsPage] Ошибка при удалении всех:", err);
      setError(err.message || String(err));
      alert("Ошибка при удалении.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteUserStats = async (uid) => {
    if (!uid) return alert("UID пользователя не найден");
    if (!window.confirm("Удалить всю статистику этого пользователя?")) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      const q1 = query(collection(db, "quizResults"), where("uid", "==", uid));
      const snap1 = await getDocs(q1);
      snap1.docs.forEach((d) => batch.delete(doc(db, "quizResults", d.id)));

      const q2 = query(collection(db, "matchingResults"), where("uid", "==", uid));
      const snap2 = await getDocs(q2);
      snap2.docs.forEach((d) => batch.delete(doc(db, "matchingResults", d.id)));

      await batch.commit();
      setQuizResults((prev) => prev.filter((r) => r.uid !== uid));
      setMatchingResults((prev) => prev.filter((r) => r.uid !== uid));
      console.debug("[StatsPage] deleted stats for", uid);
      alert("Статистика пользователя удалена.");
    } catch (err) {
      console.error("[StatsPage] Ошибка при удалении пользователя:", err);
      setError(err.message || String(err));
      alert("Ошибка при удалении.");
    } finally {
      setDeleting(false);
    }
  };

  const toggle = (key) => setOpenMap((s) => ({ ...s, [key]: !s[key] }));

  // --- UI ---
  if (loading) return <p>Загрузка статистики...</p>;

  return (
    <div className="stats-container">
      <h1 className="stats-title">📊 Статистика</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          Ошибка: {error}
          <div style={{ fontSize: 12, marginTop: 6 }}>
            Перезагрузите сайт
          </div>
        </div>
      )}

      {/* Админ: удалить всё */}
      {userData?.role === "admin" && (
        <button
          onClick={handleDeleteAll}
          disabled={deleting}
          style={{
            marginBottom: "1rem",
            backgroundColor: "#e53e3e",
            color: "#fff",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Удалить всю статистику
        </button>
      )}

      {/* Если студент — показываем только свои таблицы (как раньше) */}
      {userData?.role === "student" ? (
        <div>
          <h2 className="stats-subtitle">📝 Quiz</h2>
          {quizResults.length === 0 ? (
            <p className="no-data">Нет данных по Quiz.</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Unit</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Level"><span className="value">{r.level}</span></td>
                    <td data-label="Unit"><span className="value">{r.unit}</span></td>
                    <td data-label="Correct"><span className="value">{r.correct}</span></td>
                    <td data-label="Incorrect"><span className="value">{r.incorrect}</span></td>
                    <td data-label="Total"><span className="value">{r.total}</span></td>
                    <td data-label="Date"><span className="value">{formatDate(r.createdAt)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="stats-subtitle">🎯 Matching</h2>
          {matchingResults.length === 0 ? (
            <p className="no-data">Нет данных по Matching.</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Unit</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {matchingResults.map((r) => {
                  const correct = r.correct ?? r.correctCount ?? 0;
                  const incorrect = (r.total ?? 0) - correct;
                  return (
                    <tr key={r.id}>
                      <td data-label="Level"><span className="value">{r.level}</span></td>
                      <td data-label="Unit"><span className="value">{r.unit}</span></td>
                      <td data-label="Correct"><span className="value">{correct}</span></td>
                      <td data-label="Incorrect"><span className="value">{incorrect}</span></td>
                      <td data-label="Total"><span className="value">{r.total}</span></td>
                      <td data-label="Date"><span className="value">{formatDate(r.createdAt)}</span></td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          )}
        </div>
      ) : (
        // teacher / admin: группировка по учителю -> ученики
        <div className="accordion">
          {groupedByTeacher.map((group) => (
            <div key={group.teacher} className="teacher-block">
              <h1 className="teacher-header">👩‍🏫 {group.teacher}</h1>

              {group.students.map((s) => (
                <div key={s.uid} className="accordion-item">
                  <button
                    className={`accordion-header ${openMap[s.uid] ? "open" : ""}`}
                    onClick={() => toggle(s.uid)}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {s.name}
                    </span>
                    <span style={{ marginLeft: 8, color: s.isTeacher ? "#c00" : "#666" }}>
                      — {s.teacher} {s.isTeacher ? "(Учитель)" : ""}
                    </span>
                    <span className="arrow">▾</span>
                  </button>

                  <div className={`accordion-content ${openMap[s.uid] ? "show" : ""}`}>
                    {userData?.role === "admin" && (
                      <div style={{ marginBottom: 12 }}>
                        <button
                          onClick={() => handleDeleteUserStats(s.uid)}
                          disabled={deleting}
                          style={{
                            backgroundColor: "#dd6b20",
                            color: "#fff",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Удалить всю статистику пользователя
                        </button>
                      </div>
                    )}

                    <h2 className="stats-subtitle">📝 Quiz</h2>
                    {s.quiz.length === 0 ? (
                      <p className="no-data">Нет данных по Quiz.</p>
                    ) : (
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th>Level</th>
                            <th>Unit</th>
                            <th>Correct</th>
                            <th>Incorrect</th>
                            <th>Total</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.quiz.map((r) => (
                            <tr key={r.id}>
                              <td>{r.level}</td>
                              <td>{r.unit}</td>
                              <td>{r.correct}</td>
                              <td>{r.incorrect}</td>
                              <td>{r.total}</td>
                              <td>{formatDate(r.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    <h2 className="stats-subtitle">🎯 Matching</h2>
                    {s.matching.length === 0 ? (
                      <p className="no-data">Нет данных по Matching.</p>
                    ) : (
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th>Level</th>
                            <th>Unit</th>
                            <th>Correct</th>
                            <th>Incorrect</th>
                            <th>Total</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.matching.map((r) => {
                            const correct = r.correct ?? r.correctCount ?? 0;
                            const incorrect = (r.total ?? 0) - correct;
                            return (
                              <tr key={r.id}>
                                <td>{r.level}</td>
                                <td>{r.unit}</td>
                                <td>{correct}</td>
                                <td>{incorrect}</td>
                                <td>{r.total}</td>
                                <td>{formatDate(r.createdAt)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsPage;
