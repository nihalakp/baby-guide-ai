# Baby Guide AI

> Pediatric Q&A assistant grounded in real AAP and CDC guidelines.
> Built by a mom of a 2 year old who was tired of unreliable Google results at 11pm.

**Live demo: https://baby-guide-ai.vercel.app**

## Status
Live and working end to end.

## What it does
- Takes a pediatric question and your child's age
- Searches real CDC/AAP documents using semantic search
- Returns a structured, cited answer:
  - Plain English response
  - Age-specific guidance
  - When to call the doctor
  - Safe at home or not
  - The exact source the answer came from
- Says "I don't know" instead of guessing when the documents don't cover something
  
**Current knowledge base covers:** Fever, Childhood Vaccinations, and Common Rashes. Built to be easily extended — adding a new topic just means dropping a CDC/AAP PDF into the `docs/` folder and rerunning the ingestion pipeline.

## How it works
1. Your question gets converted into a vector embedding (OpenAI text-embedding-3-small)
2. ChromaDB searches real CDC/AAP documents for the most relevant chunks
3. Those chunks are passed to Claude as context
4. Claude answers only from the retrieved chunks, never from memory
5. The answer is returned with a citation showing exactly where it came from

## Stack
**Backend:** Python, FastAPI, LangChain, ChromaDB, OpenAI embeddings API, Anthropic Claude API
**Frontend:** React
**Deployment:** Render (backend), Vercel (frontend)

## Architecture notes
Originally used a local sentence-transformers model for embeddings. Switched to OpenAI's hosted embeddings API after hitting Render's 512MB free tier memory limit — the local model alone needed 300-500MB just to load. The hosted API approach uses near-zero server memory and costs about $0.02 per million tokens, which is a fraction of a cent for this project's knowledge base.

## Try it yourself

**Use the live app:**
https://baby-guide-ai.vercel.app

**Or run it locally:**
```bash
git clone https://github.com/nihalakp/baby-guide-ai.git
cd baby-guide-ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python load_docs.py
uvicorn main:app --reload
```
Then open http://localhost:8000/docs to test the API directly, or run the frontend separately from the `frontend/` folder with `npm install && npm start`.

## Why I built this
I'm a senior engineer on a maternity break, using the time to pivot into LLM engineering. My approach has mostly been: pick something I actually need, build it, and figure out the gaps as I go rather than working through tutorials in order.

This one started because my toddler got a rash after eating mango, and I did what every parent does in the middle of the night: opened Google and fell into a spiral of forty different opinions, half of them contradicting the other half, none of which I actually trusted. I just wanted one answer I could believe.
