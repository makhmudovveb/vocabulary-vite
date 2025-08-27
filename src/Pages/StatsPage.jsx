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

const PRIORITY_TEACHERS = ["Bexzod Mahmudov"];

const StatsPage = () => {
  const { currentUser, userData } = Auth();
  const [quizResults, setQuizResults] = useState([]);
  const [matchingResults, setMatchingResults] = useState([]);
  const [usersMap, setUsersMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // --- утилиты для дат ---
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

  // --- загрузка ---
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      if (!currentUser || !userData) {
        setLoading(false);
        return;
      }
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const uMap = new Map();
        usersSnap.docs.forEach((d) => {
          const data = d.data();
          const key = data.uid || d.id;
          uMap.set(key, { id: d.id, ...data });
        });
        if (!mounted) return;
        setUsersMap(uMap);

        const isStudent = userData.role === "student";
        const quizQueryRef = isStudent
          ? query(collection(db, "quizResults"), where("uid", "==", currentUser.uid))
          : collection(db, "quizResults");
        const matchQueryRef = isStudent
          ? query(collection(db, "matchingResults"), where("uid", "==", currentUser.uid))
          : collection(db, "matchingResults");

        const [quizSnap, matchingSnap] = await Promise.all([
          getDocs(quizQueryRef),
          getDocs(matchQueryRef),
        ]);

        const quizData = quizSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const matchingData = matchingSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        quizData.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt));
        matchingData.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt));

        if (!mounted) return;
        setQuizResults(quizData);
        setMatchingResults(matchingData);
      } catch (err) {
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => (mounted = false);
  }, [currentUser, userData]);

  function pluralizeStudents(count) {
    const lastDigit = count % 10;
    const lastTwo = count % 100;

    if (lastTwo >= 11 && lastTwo <= 14) return "students";
    if (lastDigit === 1) return "student";
    if (lastDigit >= 2 && lastDigit <= 4) return "students";
    return "students";
  }
  // --- группировка ---
  const groupedByTeacher = useMemo(() => {
    const teacherMap = new Map();
    const add = (r, kind) => {
      const uid = r.uid || "unknown";
      const studentName =
        r.userName ||
        r.email ||
        usersMap.get(uid)?.fullName ||
        usersMap.get(uid)?.name ||
        uid;

      let teacherName = r.teacher || "Teacher";
      if (!teacherMap.has(teacherName)) teacherMap.set(teacherName, new Map());
      const students = teacherMap.get(teacherName);

      if (!students.has(uid)) {
        students.set(uid, {
          uid,
          name: studentName,
          teacher: teacherName,
          quiz: [],
          matching: [],
        });
      }
      students.get(uid)[kind].push(r);
    };

    quizResults.forEach((r) => add(r, "quiz"));
    matchingResults.forEach((r) => add(r, "matching"));

    const arr = Array.from(teacherMap.entries()).map(([teacher, studentsMap]) => ({
      teacher,
      students: Array.from(studentsMap.values()),
    }));

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

  // --- удаление ---
  const handleDeleteUserStats = async (uid) => {
    if (!window.confirm("Delete all statistics for this user?")) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);

      const snap1 = await getDocs(query(collection(db, "quizResults"), where("uid", "==", uid)));
      snap1.docs.forEach((d) => batch.delete(doc(db, "quizResults", d.id)));

      const snap2 = await getDocs(query(collection(db, "matchingResults"), where("uid", "==", uid)));
      snap2.docs.forEach((d) => batch.delete(doc(db, "matchingResults", d.id)));

      // 👇 вот этого у тебя не было
      await batch.commit();

      // локально обновляем стейт
      setQuizResults((prev) => prev.filter((r) => r.uid !== uid));
      setMatchingResults((prev) => prev.filter((r) => r.uid !== uid));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // --- UI ---
  if (loading) return <p>Loading...</p>;

  return (
    <div className="stats-container">
      <h1 className="stats-title">📊 Statistics</h1>
      {error && <div className="error">Error: {error}</div>}

      {userData?.role === "student" ? (
        <div>
          <h2 className="stats-subtitle">📝 Quiz</h2>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Unit</th>
                <th>✅ Correct</th>
                <th>❌ Incorrect</th>
                <th>📊 Total words</th>
                <th>📅 Date</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.map((r) => (
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

          <h2 className="stats-subtitle">🎯 Matching</h2>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Unit</th>
                <th>✅ Correct</th>
                <th>❌ Incorrect</th>
                <th>📊 Total words</th>
                <th>📅 Date</th>
              </tr>
            </thead>
            <tbody>
              {matchingResults.map((r) => (
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
        </div>
      ) : selectedTeacher ? (
        <div>
          <button onClick={() => setSelectedTeacher(null)} style={{ marginBottom: "1rem" }}>
            ← Back to teachers
          </button>
          <h2 className="teacher-header">👩‍🏫 {selectedTeacher.teacher}</h2>
          {selectedTeacher.students.map((s) => (
            <div key={s.uid} className="student-block">
              <h3>{s.name}</h3>
              {userData?.role === "admin" && (
                <button
                  onClick={() => handleDeleteUserStats(s.uid)}
                  disabled={deleting}
                  className="delete-btn"
                >
                  Delete statistics
                </button>
              )}

              <h4>📝 Quiz</h4>
              {s.quiz.length === 0 ? (
                <p className="no-data">No data</p>
              ) : (
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Unit</th>
                      <th>✅ Correct</th>
                      <th>❌ Incorrect</th>
                      <th>📊 Total words</th>
                      <th>📅 Date</th>
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

              <h4>🎯 Matching</h4>
              {s.matching.length === 0 ? (
                <p className="no-data">No data</p>
              ) : (
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Unit</th>
                      <th>✅ Correct</th>
                      <th>❌ Incorrect</th>
                      <th>📊 Total words</th>
                      <th>📅 Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.matching.map((r) => (
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
            </div>
          ))}
        </div>
      ) : ( 
        <div className="teacher-grid asd">
          {groupedByTeacher.map((group) => (
            <div
              key={group.teacher}
              className="teacher-card"
              onClick={() => setSelectedTeacher(group)}
            >
              <h3>{group.teacher}</h3>
              <p>
                👥 {group.students.length} {pluralizeStudents(group.students.length)}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsPage;
