import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import { Auth } from "../Context/AuthContext";
import "../Styles/StatsPage.css";

const StatsPage = () => {
  const { currentUser, userData } = Auth();
  const [quizResults, setQuizResults] = useState([]);
  const [matchingResults, setMatchingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser || !userData) return;
  
    const fetchStats = async () => {
      setLoading(true);
      try {
        const quizQuery =
          userData.role === "admin"
            ? query(collection(db, "quizResults"))
            : userData.role === "teacher"
            ? query(collection(db, "quizResults"), where("teacher", "==", userData.fullName))
            : query(collection(db, "quizResults"), where("uid", "==", currentUser.uid));
  
        const matchingQuery =
          userData.role === "admin"
            ? query(collection(db, "matchingResults"))
            : userData.role === "teacher"
            ? query(collection(db, "matchingResults"), where("teacher", "==", userData.fullName))
            : query(collection(db, "matchingResults"), where("uid", "==", currentUser.uid));
  
        const [quizSnap, matchingSnap] = await Promise.all([
          getDocs(quizQuery),
          getDocs(matchingQuery),
        ]);
  
        const quizData = quizSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const matchingData = matchingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
        setQuizResults(
          quizData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        );
  
        setMatchingResults(
          matchingData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        );
      } catch (err) {
        console.error("Ошибка при получении статистики:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, [currentUser, userData]);

  const handleDeleteAll = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить ВСЮ статистику?")) return;
    setDeleting(true);
    try {
      const snapshot = await getDocs(collection(db, "quizResults"));
      const batch = writeBatch(db);

      snapshot.docs.forEach((docSnap) => {
        batch.delete(doc(db, "quizResults", docSnap.id));
      });

      await batch.commit();
      alert("Вся статистика удалена.");
      setQuizResults([]);
    } catch (err) {
      console.error("Ошибка при удалении всей статистики:", err);
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
      const q = query(collection(db, "quizResults"), where("uid", "==", uid));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        alert("Статистика для этого пользователя не найдена.");
        setDeleting(false);
        return;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.delete(doc(db, "quizResults", docSnap.id));
      });

      await batch.commit();
      alert("Статистика пользователя удалена.");
      setQuizResults((prev) => prev.filter((r) => r.uid !== uid));
    } catch (err) {
      console.error("Ошибка при удалении статистики пользователя:", err);
      alert("Ошибка при удалении.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Загрузка статистики...</p>;

  return (
    <div className="stats-container">
      <h1 className="stats-title">📊 Общая статистика</h1>

      {userData.role === "admin" && (
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

      {/* ======= QUIZ ======= */}
      <h2 className="stats-subtitle">📝 Quiz</h2>
      {quizResults.length === 0 ? (
        <p className="no-data">Нет данных по Quiz.</p>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              {userData.role !== "student" && <th>Имя</th>}
              <th>Level</th>
              <th>Unit</th>
              <th>Correct</th>
              <th>Incorrect</th>
              <th>Total</th>
              <th>Date</th>
              {userData.role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {quizResults.map((res) => (
              <tr key={res.id}>
                {userData.role !== "student" && <td>{res.userName || res.email}</td>}
                <td>{res.level}</td>
                <td>{res.unit}</td>
                <td className="correct">{res.correct}</td>
                <td className="incorrect">{res.incorrect}</td>
                <td>{res.total}</td>
                <td>{res.createdAt?.toDate().toLocaleString("ru-RU")}</td>
                {userData.role === "admin" && (
                  <td>
                    <button
                      onClick={() => handleDeleteUserStats(res.uid)}
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
                      Удалить пользователя
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ======= MATCHING GAME ======= */}
      <h2 className="stats-subtitle">🎯 Matching Game</h2>
{matchingResults.length === 0 ? (
  <p className="no-data">Нет данных по Matching.</p>
) : (
  <table className="stats-table">
    <thead>
      <tr>
        {userData.role !== "student" && <th>Имя</th>}
        <th>Level</th>
        <th>Unit</th>
        <th>Correct</th>
        <th>Incorrect</th>
        <th>Total</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {matchingResults.map((res) => {
        const incorrect = res.total - res.correctCount;
        return (
          <tr key={res.id}>
            {userData.role !== "student" && <td>{res.userName || res.email || "—"}</td>}
            <td>{res.level}</td>
            <td>{res.unit}</td>
            <td className="correct">{res.correctCount}</td>
            <td className="incorrect">{incorrect}</td>
            <td>{res.total}</td>
            <td>{res.createdAt?.toDate().toLocaleString("ru-RU")}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
)}
    </div>
  );
};

export default StatsPage;
