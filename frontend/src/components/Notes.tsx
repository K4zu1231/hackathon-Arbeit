// src/components/Notes.tsx
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<string>("study_notes", "");

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 10 }}>
      <h2>📝 学習メモ</h2>
      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="気づき・メモを書こう"
      />
    </div>
  );
}
