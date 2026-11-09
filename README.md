# Baby Guide AI

> Pediatric Q&A assistant grounded in real AAP and CDC guidelines.
> Built by a mom of a 2 year old who was tired of unreliable Google results at 11pm.

**Live demo: https://baby-guide-ai.vercel.app**

[Baby Guide AI](assets/screenshot.png)

The first request after a quiet spell can take up to a minute while the free-tier backend wakes up.

## Status
Live and working end to end.

## What it does
- Takes a pediatric question and your child's age
- Searches real CDC/AAP documents using semantic search
- Returns a structured, cited answer:
  - Plain English response
  - Age-specific guidance
  - When to call the doctor
  - The source passages the answer came from
- Says "I don't know" instead of guessing when the documents don't cover something
- Keeps your past questions in your browser only, never on a server

**Current knowledge base covers:** Fever, Childhood Vaccinations, and Common Rashes. Built to be easily extended — adding a new topic just means dropping a CDC/AAP PDF into the `docs/` folder and rerunning the ingestion pipeline.

## How it works
1. Your question gets converted into a vector embedding (OpenAI text-embedding-3-small)
2. ChromaDB searches real CDC/AAP documents for the most relevant chunks
3. Those chunks are passed to Claude as context
4. Claude is instructed to answer only from the retrieved chunks, not from memory
5. The answer is returned with the source passages it came from

## Evaluation (preliminary)
I wrote a 25-question test, with Claude's help, to check three behaviors: answering correctly when the documents cover a question, declining when they don't, and escalating on safety-critical questions. `run_eval.py` runs it against the app and scores the results. These are first-pass results that I'm re-grading and expanding:

| Group | Questions | Passed |
|---|---|---|
| Answerable from the documents | 9 | 9 |
| Not covered, should decline | 9 | 9 |
| Safety-critical | 4 | 4 |
| Adversarial or vague | 3 | 2 |

The one miss: asked "Is it normal?" with no context, the app assumed the question was about fever and answered confidently. It should have asked what the parent meant.

It's a small set, run once per question, and not reviewed by a clinician, so it's a smoke test, not a benchmark.

```bash
python run_eval.py run baseline     # writes eval_results_baseline.csv
# open the CSV and fill in verdict (PASS/FAIL), failure_type and notes
python run_eval.py score baseline   # prints the metrics
```

## Limitations
- It only knows what is in its documents. Anything else gets a polite decline.
- It does not diagnose and is not a substitute for your pediatrician.
- There is no dedicated emergency detection. The interface shows a 911 notice, but the app can't be relied on to recognize an emergency.
- Each question is answered on its own, with no follow-up conversation.

## Stack
**Backend:** Python, FastAPI, LangChain, ChromaDB, OpenAI embeddings API, Anthropic Claude API
**Frontend:** React
**Deployment:** Render (backend), Vercel (frontend)

## Architecture notes
Originally used a local sentence-transformers model for embeddings. Switched to OpenAI's hosted embeddings API after hitting Render's 512MB free tier memory limit — the local model alone needed 300-500MB just to load. The hosted API approach uses near-zero server memory and costs about $0.02 per million tokens, which is a fraction of a cent for this project's knowledge base.

## How it was built
I scoped the product, made the architecture decisions, debugged and deployed it, and decided how to evaluate it. I used Claude as a coding assistant throughout: much of the code was drafted with it, then run, debugged, and integrated by me. The frontend started as a design prototype on Emergent, and the final React code was written with Claude.

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
```
Create a `.env` file with your keys:
```
ANTHROPIC_API_KEY=your-key
OPENAI_API_KEY=your-key
```
Then build the vector database and start the API:
```bash
python load_docs.py
uvicorn main:app --reload
```
Open http://localhost:8000/docs to test the API directly, or run the frontend from the `frontend/` folder with `npm install && npm start`. It talks to http://localhost:8000 by default, and you can point it elsewhere with `REACT_APP_API_URL`.

## Why I built this
I'm a senior engineer on a maternity break, using the time to pivot into LLM engineering. My approach has mostly been: pick something I actually need, build it, and figure out the gaps as I go rather than working through tutorials in order.

This one started because my toddler got a rash after eating mango, and I did what every parent does in the middle of the night: opened Google and fell into a spiral of forty different opinions, half of them contradicting the other half, none of which I actually trusted. I just wanted one answer I could believe.
