import { useEffect, useState } from "react";
import "../Styles/Navbar.css";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const classList = document.documentElement.classList;
    classList.toggle("dark-theme", isDark);
    classList.toggle("light-theme", !isDark);
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
      }}
      onClick={() => setIsDark((prev) => !prev)}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
