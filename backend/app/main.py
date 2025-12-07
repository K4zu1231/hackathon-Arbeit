import cv2
import os
import mediapipe as mp
import numpy as np
import base64
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# ------------------------------------------------------
# FastAPI アプリ（★1回だけ）
# ------------------------------------------------------
app = FastAPI()

# CORS 許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------
# Mediapipe (顔向き判定)
# ------------------------------------------------------
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

down_start = None
threshold_time = 2
clients = []

def is_looking_down(landmarks):
    left_eye_top = landmarks[386].y
    left_eye_bottom = landmarks[374].y
    left_eye_center = (left_eye_top + left_eye_bottom) / 2
    iris_y = landmarks[468].y
    return iris_y > left_eye_center + 0.01

# ------------------------------------------------------
# WebSocket サーバー
# ------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    global down_start

    try:
        while True:
            data = await websocket.receive_text()

            img_bytes = base64.b64decode(data.split(",")[1])
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)

            looking_down = False

            if results.multi_face_landmarks:
                face_landmarks = results.multi_face_landmarks[0].landmark

                if is_looking_down(face_landmarks):
                    if down_start is None:
                        down_start = asyncio.get_event_loop().time()
                    elif asyncio.get_event_loop().time() - down_start > threshold_time:
                        looking_down = True
                else:
                    down_start = None
            else:
                down_start = None

            # 全クライアントに送る
            for ws in clients:
                try:
                    await ws.send_json({"show_teacher": looking_down})
                except:
                    pass

    except WebSocketDisconnect:
        clients.remove(websocket)

# ------------------------------------------------------
# Gemini Chat API
# ------------------------------------------------------
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    response = model.generate_content(req.message)
    return {"reply": response.text}

# ------------------------------------------------------
# Ping
# ------------------------------------------------------
@app.get("/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

# ------------------------------------------------------
# 実行
# ------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
