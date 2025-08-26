import { useNavigate } from "react-router-dom";
import "../Styles/Ielts_practise.css";
import BackButton from "../Components/BackBtn";

const tests = [
  { id: "cam19-1", title: "Cambridge 19 - Test 1" },
  { id: "cam19-2", title: "Cambridge 19 - Test 2" },
  { id: "cam19-3", title: "Cambridge 19 - Test 3" },
  { id: "cam19-4", title: "Cambridge 19 - Test 4" },
];

export default function PracticePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="practice-container ">
        <h1 className="practice-title">IELTS Practice Tests</h1>
        <div className="practice-list coming-soon">
          {tests.map((test) => (
            <button
              key={test.id}
              onClick={() => navigate(`/ielts/practise/${test.id}`)}
              className="practice-item"
            >
              {test.title}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"flex", justifyContent:"center",}}>
      <BackButton />
      </div>
    </>
  );
}
