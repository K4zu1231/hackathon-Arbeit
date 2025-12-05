// src/components/PomodoroTimer.tsx
import { useEffect, useState } from "react";

export default function PomodoroTimer() {
  const WORK_TIME = 25 * 60; // 25分
  const BREAK_TIME = 5 * 60; // 5分

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // モード切替
          const nextMode = mode === "work" ? "break" : "work";
          setMode(nextMode);
          return nextMode === "work" ? WORK_TIME : BREAK_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  const format = (sec: number) =>
    `${Math.floor(sec / 60).toString().padStart(2, "0")}:${(sec % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 10 }}>
      <h2>⏳ ポモドーロタイマー ({mode === "work" ? "作業" : "休憩"})</h2>
      <h1>{format(timeLeft)}</h1>

      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "ストップ" : "スタート"}
      </button>
      <button
        onClick={() => {
          setIsRunning(false);
          setTimeLeft(WORK_TIME);
          setMode("work");
        }}
        style={{ marginLeft: 10 }}
      >
        リセット
      </button>
    </div>
  );
}
