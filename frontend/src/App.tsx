import { Routes, Route, Link } from "react-router-dom";
import Notes from "./components/Notes";
import PomodoroTimer from "./components/PomodoroTimer";
import StudyLog from "./components/StudyLog";
import CameraApp from "./CameraApp";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
            <h1>📚 勉強管理ツール</h1>

            <PomodoroTimer />
            <StudyLog />
            <Notes />

            {/* カメラページへのリンク */}
            <Link
              to="/camera"
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              🎥 AI先生カメラを開く
            </Link>
          </div>
        }
      />

      {/* カメラ画面 */}
      <Route path="/camera" element={<CameraApp />} />
    </Routes>
  );
}
