from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from openai import OpenAI
from dotenv import load_dotenv
import chromadb
import os

load_dotenv()
openai_client = OpenAI()

# Step 1 — Load all PDFs from the docs folder
print("Loading PDFs...")
all_pages = []

for filename in os.listdir("docs"):
    if filename.endswith(".pdf"):
        print(f"  Loading {filename}...")
        loader = PyPDFLoader(f"docs/{filename}")
        pages = loader.load()
        all_pages.extend(pages)
        print(f"  Got {len(pages)} pages")

print(f"\nTotal pages loaded: {len(all_pages)}")

# Step 2 — Split into chunks
print("\nSplitting into chunks...")
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = splitter.split_documents(all_pages)
print(f"Created {len(chunks)} chunks")

# Step 3 — Embed the chunks
print("\nEmbedding chunks (this may take a minute)...")
texts = [chunk.page_content for chunk in chunks] 
def get_embeddings_batch(texts):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [item.embedding for item in response.data]

embeddings = get_embeddings_batch(texts)
print("Done embedding!")

# Step 4 — Store in ChromaDB (fresh start)
print("\nStoring in ChromaDB...")
client = chromadb.PersistentClient(path="./chroma_db") 

# Delete old collection if it exists so we start fresh
try:
    client.delete_collection("pediatric_guidelines")
    print("Cleared old collection")
except:
    pass

collection = client.create_collection("pediatric_guidelines") 
collection.add(
    documents=texts,
    embeddings=embeddings,
    ids=[f"chunk_{i}" for i in range(len(texts))]
)
print(f"Stored {len(texts)} chunks in ChromaDB!")

# Step 5 — Test with two questions
print("\n--- Testing ---")
questions = [
    "what vaccines does my toddler need",
    "my baby has a fever what should I do"
]

for question in questions:
    print(f"\nQuestion: {question}")
    question_embedding = model.encode([question])
    results = collection.query(
        query_embeddings=question_embedding,
        n_results=2
    )
    print("Answer chunks:")
    for i, doc in enumerate(results['documents'][0]):
        print(f"\n{i+1}. {doc[:300]}...")