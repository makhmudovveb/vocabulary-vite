import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";
import "../Styles/Navbar.css";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // проверяем Firebase auth
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
      } else {
        // если нет firebase-пользователя, проверяем localStorage
        const guestData = localStorage.getItem("guestUser");
        if (guestData) {
          const parsed = JSON.parse(guestData);
          setUserName(parsed.fullName || "Guest Mode");
        } else {
          setUserName(""); // вообще никого
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // чистим firebase
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
    // чистим guest mode
    localStorage.removeItem("guestUser");
    setUserName("");
    navigate("/");
    window.location.reload(); // чтобы Navbar сразу подхватил
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          <img
            src="/images/logoblack-removebg-preview.png"
            alt="Logo"
            className="nav-logo-img"
          />{" "}
          MKI school
        </div>

        {/* Десктоп меню */}
        <div className="nav-actions">
          <span className="user-name">
            Hello: <strong className="user-name-bold">{userName}</strong>
          </span>
          <ThemeToggle />
          <button className="nav-button" onClick={() => navigate("/stats")}>
            📊 Stats
          </button>
          <button className="nav-button nav_logout" onClick={handleLogout}>
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
            ⟵
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
        <ThemeToggle />
      </div>

      {/* Фон-затемнение */}
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
}
