FROM python:3.10-slim

WORKDIR /app

# OS 依存パッケージを先にインストール
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# requirements.txt をコピーしてインストール
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# アプリ本体をコピー
COPY ./app ./app

# Python パスに aivisspeech を追加
ENV PYTHONPATH=/app/aivisspeech:$PYTHONPATH

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
