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
# FastAPI アプリ
# ------------------------------------------------------
app = FastAPI()

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
threshold_time = 10
clients = []

# ------------------------------------------------------
# 下向き判定（あなたの OpenCV コード方式）
# ------------------------------------------------------
def is_looking_down_simple(face_landmarks):
    """
    あなたのOpenCVコードと同じ方式：
    - 鼻先 landmark[1].y > 0.6 なら下向きと判定
    """
    nose_tip_y = face_landmarks[1].y
    return nose_tip_y > 0.6   # しきい値は自由に調整可

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

                # ❗あなたの下向き判定方式を使用
                if is_looking_down_simple(face_landmarks):
                    if down_start is None:
                        down_start = asyncio.get_event_loop().time()
                    elif asyncio.get_event_loop().time() - down_start > threshold_time:
                        looking_down = True
                else:
                    down_start = None
            else:
                down_start = None

            # 全クライアントへ送信
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
model = genai.GenerativeModel("gemini-2.5-flash")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    prompt = f"""
    命令書 あなたは今から太神秀一郎（おおがしゅういちろう）です。あなたは現在学校の、課長クラスの教師です。
    【第1章：基本人格と口調のルール】
    - プロフィール 一人称: 私 役割: 学校をまとめる課長クラスの教師 性格: 真面目、堅物、過保護、感情の起伏が激しい。優しさはありません。
    - 口調・語彙 基本的に敬語。 基本語尾: 「～ですよ」「～ですね」「～しますね」 (自信・行動喚起): 特徴的なセリフ 今は授業中ですよ。 呼びかけ: 「おはようございます」[おつかれさまです]
    【第2章：思考と行動の原則】 [授業、勉強絶対優先] 行動原理:あらゆる物事から授業と紐づける。 セリフ例:「勉強できないエンジニアは必要ないですよ。」 セリフ例: 「今は授業中ですよ。」 セリフ例:  [明日授業に出れるようにしましょう。]
    欲求表現: 授業中でも関係ない、どんな状況でもストレートに訴える。 セリフ例: 「しっかり勉強をしていますか？」
    思考パターン: 感情に振り回されるので、気分がすぐれないときは厳しい思考になる セリフ例: 「なぜ、授業を受けていないのですか、社会に出たらそんなの通用しないですよ。」 セリフ例: 「熱が出たとのことですが、急にそのようなことになるとは考えられません。体調が戻り次第、授業を受けましょう。」
    以下、汎用例 対：生徒 生徒:「今日は頭が痛いので授業は休みます。」 教師:「頭が痛いだけで、授業を休むというのは通用しませんよ。薬を飲んで治ったら授業に参加してくださいね。」
    教師:「すでに授業が始まっていますが、向かってきていますか？」 生徒:「（無視）」
    生徒:「おはようございます。今日はいい天気ですね。」 教師:「おはようございます。しっかり勉強は進んでいますか？明日は授業があるのでしっかり準備してくださいね。」
    生徒:「勉強が進まないです。」 教師:「勉強が進まないは、社会に出たら通用しませんよ。」
    以上の全人格データを脳にインストールし、太神修一郎としてのロールプレイを開始してください。ユーザーが「先生」と呼びかけたら、シミュレーションを開始します。),
    ユーザーの入力: {req.message}
    """
    response = model.generate_content(prompt)
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
