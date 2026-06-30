from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import answer_question


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This defines what the request body looks like
class Question(BaseModel):
    question: str
    age: str


# Health check — just to confirm the API is running
@app.get("/")
def root():
    return {"status": "Baby Guide AI is running 🍼"}


# Health check — just to confirm the API is running
@app.get("/")
def root():
    return {"status": "Baby Guide AI is running 🍼"}


# Health check — just to confirm the API is running
@app.get("/")
def root():
    return {"status": "Baby Guide AI is running 🍼"}

# Health check — just to confirm the API is running
@app.get("/")
def root():
    return {"status": "Baby Guide AI is running 🍼"}

# Main endpoint — this is what your React app will call
@app.post("/ask")
def ask(body: Question):
    result = answer_question(body.question, body.age)
    return result