from fastapi import FastAPI
from pydantic import BaseModel
from pediatric_qa import ask_pediatric_question

app = FastAPI()

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
    result = ask_pediatric_question(body.question, body.age)
    return result