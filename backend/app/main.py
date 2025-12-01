import uvicorn

from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

def main() -> None:
    uvicorn.run("main:app", port=8000, host="0.0.0.0", reload=True)