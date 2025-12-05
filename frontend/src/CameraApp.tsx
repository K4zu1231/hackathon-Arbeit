import { useEffect, useRef, useState } from "react";

export default function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showTeacher, setShowTeacher] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;

    // Webカメラ取得
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });

    // WebSocket接続
    ws = new WebSocket("ws://localhost:8000/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setShowTeacher(data.show_teacher);
    };

    const sendFrame = () => {
      if (!videoRef.current || !ws || ws.readyState !== WebSocket.OPEN) {
        return requestAnimationFrame(sendFrame);
      }

      const video = videoRef.current;

      // ▶ 必須: まだメタデータ読み込み前は送らない
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        return requestAnimationFrame(sendFrame);
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      const imgData = canvas.toDataURL("image/jpeg");

      // 送信前にデータが空じゃないかチェック（重要）
      if (imgData.length > 100) ws.send(imgData);

      requestAnimationFrame(sendFrame);
    };

    // ▶ loadedmetadata を使う（videoWidth が設定された瞬間）
    videoRef.current!.addEventListener("loadedmetadata", () => {
      sendFrame();
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", background: "black" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />

      {showTeacher && (
        <img
          src="/teacher.png"
          alt="teacher"
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            width: 200,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
