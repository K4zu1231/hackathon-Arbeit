# backend/app/main.py
import cv2
import mediapipe as mp
import numpy as np
import base64
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn

app = FastAPI()

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

down_start = None
threshold_time = 2  # 2秒下向きでトリガー
clients = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    global down_start
    try:
        while True:
            data = await websocket.receive_text()
            # 画像をデコード
            img_bytes = base64.b64decode(data.split(",")[1])
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)

            down = False
            if results.multi_face_landmarks:
                face_landmarks = results.multi_face_landmarks[0]
                nose_tip = face_landmarks.landmark[1]
                if nose_tip.y > 0.6:
                    if down_start is None:
                        down_start = asyncio.get_event_loop().time()
                    elif asyncio.get_event_loop().time() - down_start > threshold_time:
                        down = True
                else:
                    down_start = None
            else:
                down_start = None

            # 結果を送信
            for ws in clients:
                try:
                    await ws.send_json({"show_teacher": down})
                except:
                    pass

    except WebSocketDisconnect:
        clients.remove(websocket)

@app.get("/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
