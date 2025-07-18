import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";
import "../Styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const nameFromDisplay = user.displayName;
        if (nameFromDisplay) {
          setUserName(nameFromDisplay);
        } else {
          const [namePart] = user.email.split("@");
          const nameCapitalized = namePart
            .replace(".", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setUserName(nameCapitalized);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          📘 Vocabulary App
        </div>

        {/* Десктоп меню */}
        <div className="nav-actions">
          <span className="user-name">
            Hello: <strong className="user-name-bold">{userName}</strong>
          </span>
          <button className="nav-button" onClick={() => navigate("/stats")}>
            📊 Stats
          </button>
          <button className="nav-button logout" onClick={handleLogout}>
            🔓 Log Out
          </button>
        </div>

        {/* Гамбургер для мобил */}
        <div
          className="hamburger"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>

      {/* Сайдбар меню */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {window.innerWidth <= 400 && (
          <div className="sidebar-close-btn" onClick={closeSidebar}>
            ✖
          </div>
        )}
        <span className="user-name" style={{ marginBottom: "1rem" }}>
          Hello: <strong className="user-name-bold">{userName}</strong>
        </span>
        <button
          className="nav-button"
          onClick={() => {
            navigate("/stats");
            closeSidebar();
          }}
        >
          📊 Stats
        </button>
        <button
          className="nav-button logout"
          onClick={() => {
            handleLogout();
            closeSidebar();
          }}
        >
          🔓 Log Out
        </button>
      </div>

      {/* Фон-затемнение */}
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
}
