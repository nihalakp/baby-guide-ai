from sentence_transformers import SentenceTransformer
import chromadb
import anthropic
from dotenv import load_dotenv

load_dotenv()

# Load the same model used to embed the documents
model = SentenceTransformer('all-MiniLM-L6-v2')

# Connect to your existing ChromaDB
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_collection("pediatric_guidelines")

# Anthropic client
anthropic_client = anthropic.Anthropic()


def answer_question(question: str, child_age: str) -> dict:
    """
    Full RAG pipeline:
    1. Search ChromaDB for relevant chunks
    2. Pass chunks to Claude as context
    3. Claude answers ONLY from those chunks
    4. Returns answer with source citation
    """

    # Step 1 — embed the question and search ChromaDB
    question_embedding = model.encode([question])
    results = collection.query(
        query_embeddings=question_embedding.tolist(),
        n_results=3
    )

    # Step 2 — build context from retrieved chunks
    chunks = results['documents'][0]
    context = "\n\n".join([f"Source chunk {i+1}:\n{chunk}" 
                           for i, chunk in enumerate(chunks)])

    # Step 3 — send context + question to Claude
    prompt = f"""You are a pediatric health assistant helping a parent of a {child_age} old child.

Use ONLY the following source chunks to answer the question. 
Do not use any outside knowledge. If the answer is not in the chunks, say so clearly.

{context}

Parent's question: {question}

Respond in this exact JSON format:
{{
    "answer": "clear, simple answer based only on the sources above",
    "age_relevance": "how this applies to a {child_age} old specifically",
    "when_to_call_doctor": "warning signs from the sources",
    "safe_at_home": true or false,
    "source": "summarize which source chunk had the answer"
}}"""

    response = anthropic_client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    # Step 4 — parse and return
    import json
    raw = response.content[0].text
    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
    clean = clean.strip()

    result = json.loads(clean)
    result['chunks_used'] = chunks
    return result


def display_answer(result: dict) -> None:
    print("\n" + "="*50)
    print(f"ANSWER: {result['answer']}")
    print(f"\nFOR YOUR AGE GROUP: {result['age_relevance']}")
    print(f"\nCALL DOCTOR IF: {result['when_to_call_doctor']}")
    print(f"\nSafe at home: {'Yes' if result['safe_at_home'] else 'No — seek care'}")
    print(f"\nSource: {result['source']}")
    print("="*50)


if __name__ == "__main__":
    child_age = input("Your child's age (e.g. '2 years'): ")
    question = input("Your question: ")
    print("\nSearching documents and generating answer...")
    result = answer_question(question, child_age)
    display_answer(result)