# Baby Guide AI

> Pediatric Q&A assistant grounded in AAP guidelines.
> Built by a mom of a 2 year old who was tired of unreliable Google results at 11pm.

## Status
Actively building — week by week in public.

## What's working
- Structured pediatric Q&A with age specific guidance
- FastAPI backend with /ask endpoint
- RAG pipeline over real AAP documents
- React frontend 
- Citation of exact AAP source for every answer 

## What it does
- Takes a pediatric question and your child's age
- Returns a structured answer with:
  - Plain English response
  - Age-specific guidance
  - When to call the doctor
  - Safe at home or not

## Try it yourself
```bash
git clone https://github.com/nihalakp/baby-guide-ai.git
cd baby-guide-ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Then open http://localhost:8000/docs to test the API interactively.

## Stack
Python · Anthropic Claude API · FastAPI · React (coming) · RAG/ChromaDB (coming)

## Why I built this
I'm a senior engineer returning from maternity leave, pivoting to LLM engineering.
My learning philosophy: build things you actually need, ship them publicly,
figure it out as you go.

Built it because I Googled "rashes around mouth after eating mango" at 10pm
and got 47 conflicting results. There has to be a better way.
