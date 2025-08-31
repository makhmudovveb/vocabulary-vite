import { useEffect, useState } from "react";
import "../Styles/Navbar.css";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // читаем из localStorage при первой загрузке
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    const classList = document.documentElement.classList;

    if (isDark) {
      classList.add("dark-theme");
      classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      classList.add("light-theme");
      classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      style={{
        backgroundColor: "var(--bg-color)",
        border: "none",
        padding: "6px 12px",
        color: "var(--text-color)",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.95rem",
        transition: "background-color 0.2s ease",
        height:"32px"
      }}
      onClick={() => setIsDark((prev) => !prev)}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
