// src/pages/TestPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/TestPage.css";

export default function TestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleOpenSection = (section) => {
    navigate(`/ielts/practise/${id}/${section}`);
  };

  return (
    <div className="test-container">
      <h1 className="test-title">IELTS {id.replace("-", " ").toUpperCase()}</h1>
      <p className="test-subtitle">
        Выберите секцию для прохождения.
      </p>

      <div className="test-sections">
        <button onClick={() => handleOpenSection("listening")} className="test-section">
          Listening
        </button>
        <button onClick={() => handleOpenSection("reading")} className="test-section">
          Reading
        </button>
        <button onClick={() => handleOpenSection("writing")} className="test-section">
          Writing
        </button>
        <button onClick={() => handleOpenSection("speaking")} className="test-section">
          Speaking
        </button>
      </div>
    </div>
  );
}
