import "../Styles/ProgressBar.css";

const ProgressBar = ({ current, total }) => {
  const progress = Math.round((current / total) * 100);

  return (
    <div className="progress-container">
      <div className="progress-line">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
        <span className="progress-text">
          {current} / {total}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar; 