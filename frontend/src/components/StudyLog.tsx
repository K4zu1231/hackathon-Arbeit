// src/components/StudyLog.tsx
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";

type Log = {
  id: string;
  date: string;
  minutes: number;
};

export default function StudyLog() {
  const [logs, setLogs] = useLocalStorage<Log[]>("study_logs", []);
  const [minutes, setMinutes] = useState(0);

  const addLog = () => {
    if (!minutes || minutes <= 0) return;

    const log: Log = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString(),
      minutes,
    };

    setLogs([...logs, log]);
    setMinutes(0);
  };

  const total = logs.reduce((acc, l) => acc + l.minutes, 0);

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 10 }}>
      <h2>📘 勉強記録</h2>

      <input
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
        placeholder="今日の勉強時間（分）"
      />
      <button onClick={addLog} style={{ marginLeft: 10 }}>
        追加
      </button>

      <h3>📊 合計学習時間: {total} 分</h3>

      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.date}: {log.minutes} 分
          </li>
        ))}
      </ul>
    </div>
  );
}
