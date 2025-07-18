import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  // deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import { Auth } from "../Context/AuthContext";
import "../Styles/StatsPage.css";

const StatsPage = () => {
  const { currentUser, userData } = Auth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); // для блокировки UI при удалении

  useEffect(() => {
    if (!currentUser || !userData) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        let q;

        if (userData.role === "admin") {
          q = query(collection(db, "quizResults"));
        } else if (userData.role === "teacher") {
          q = query(
            collection(db, "quizResults"),
            where("teacher", "==", userData.fullName)
          );
        } else {
          q = query(
            collection(db, "quizResults"),
            where("uid", "==", currentUser.uid)
          );
        }

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

        setResults(data);
      } catch (err) {
        console.error("Ошибка при получении статистики:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser, userData]);

  // Удаление всех результатов
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
      setResults([]);
    } catch (err) {
      console.error("Ошибка при удалении всей статистики:", err);
      alert("Ошибка при удалении.");
    } finally {
      setDeleting(false);
    }
  };

  // Удаление статистики одного пользователя по uid
  const handleDeleteUserStats = async (uid) => {
    if (!uid) {
      alert("UID пользователя не найден");
      return;
    }
    if (!window.confirm("Удалить всю статистику этого пользователя?")) return;
    setDeleting(true);
    try {
      console.log("Удаляем статистику пользователя с UID:", uid);

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

      setResults((prev) => prev.filter((r) => r.uid !== uid));
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
      <h1 className="stats-title">📊 Statistics</h1>

      {userData.role === "admin" && (
        <button
          onClick={handleDeleteAll}
          disabled={deleting}
          style={{ marginBottom: "1rem", backgroundColor: "#e53e3e", color: "#fff", padding: "8px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Удалить всю статистику
        </button>
      )}

      {results.length === 0 ? (
        <p className="no-data">There is no data to display.</p>
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
            {results.map((res) => (
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
                      style={{ backgroundColor: "#dd6b20", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}
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
    </div>
  );
};

export default StatsPage;
