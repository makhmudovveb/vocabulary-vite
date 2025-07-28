import React, { useEffect, useState } from "react";
import { useGame } from "@context/GameContext";
import { Platform } from "./Platform";

export function PlatformStack() {
  const { platformRows, choose } = useGame();
  const [rows, setRows] = useState([]);

  // добавляем новые ряды из стора в локальную “анимационную” очередь
  useEffect(() => {
    const last = platformRows[platformRows.length - 1];
    if (!last) return;
    if (rows.find((r) => r.id === last.id)) return;

    setRows((prev) => [...prev, { ...last, y: -100 }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformRows]);

  // двигаем вниз
  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev
          .map((r) => ({ ...r, y: r.y + 2 }))
          .filter((r) => r.y < 600)
      );
    }, 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="platform-stack">
      {rows.map((row) => {
        // актуальное состояние этого ряда из стора
        const stateData = platformRows.find((r) => r.id === row.id);
        const resolved = stateData?.resolved;
        const chosen = stateData?.chosenIndex ?? null;
        const correct = stateData?.correctIndex ?? null;

        return (
          <div key={row.id} className="platform-row" style={{ top: row.y }}>
            {row.options.map((o, idx) => {
              const isChosen = chosen === idx;
              const isCorrect = idx === correct;
              const disabled = !!resolved;
              return (
                <Platform
                  key={o.id}
                  text={o.text}
                  isChosen={isChosen}
                  isCorrect={isCorrect}
                  disabled={disabled}
                  onClick={() => choose(row.id, idx)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
