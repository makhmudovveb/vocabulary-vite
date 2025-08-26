import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../Styles/TypingVar.css'
export default function TypingVar() {
  return (
    <div className="typingvar">
      <div className="task_game-card-container">
        <Link to="/typing/task1" className="task_game-card status-new-feature">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" /></svg>
          <h2>Task 1 Samples</h2>
          <h2>In test mode</h2>
        </Link>
        <Link to="/typing/task2" className="task_game-card status-new-feature">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" /></svg>
          <h2>Task 2 Samples</h2>
          <h2>In test mode</h2>
        </Link>
      </div>
    </div>
  );
}
