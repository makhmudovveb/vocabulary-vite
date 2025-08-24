import React, { useEffect, useState } from "react";
import { useGame } from "@context/GameContext";
import { Platform } from "./Platform";

export function PlatformStack() {
  const { platformRows, choose, maxTime } = useGame(); // <-- добавили maxTime
  const [rows, setRows] = useState([]);

  const containerHeight = 600; // высота падения в px
  const fps = 60; // частота обновления кадров

  // добавляем новые ряды из стора в локальную очередь
  useEffect(() => {
    const last = platformRows[platformRows.length - 1];
    if (!last) return;
    if (rows.find((r) => r.id === last.id)) return;

    setRows((prev) => [...prev, { ...last, y: -100 }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformRows]);

  // двигаем вниз с учетом maxTime
  useEffect(() => {
    const step = containerHeight / (maxTime * fps); // px за кадр
    const id = setInterval(() => {
      setRows((prev) =>
        prev
          .map((r) => ({ ...r, y: r.y + step }))
          .filter((r) => r.y < containerHeight)
      );
    }, 1000 / fps); // ~60 FPS

    return () => clearInterval(id);
  }, [maxTime]);

  return (
    <div className="platform-stack" style={{ position: "relative", height: containerHeight }}>
      {rows.map((row) => {
        const stateData = platformRows.find((r) => r.id === row.id);
        const resolved = stateData?.resolved;
        const chosen = stateData?.chosenIndex ?? null;
        const correct = stateData?.correctIndex ?? null;

        return (
          <div key={row.id} className="platform-row" style={{ position: "absolute", top: row.y }}>
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