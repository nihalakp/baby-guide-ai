from sentence_transformers import SentenceTransformer
import chromadb

# Load a pre-trained embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Some sample pediatric facts — pretend these are chunks from AAP documents
documents = [
                    "Fever in children under 3 months requires immediate medical attention if temperature exceeds 100.4°F",
                    "For children aged 2-3 years, normal sleep is 11-14 hours including naps",
                    "Mango allergies in toddlers can cause rashes around the mouth due to urushiol in the skin",
                    "Children should not have honey before age 1 due to risk of infant botulism",
                    "Signs of dehydration in toddlers include dry mouth, no tears when crying, and fewer wet diapers",
                    "AAP recommends no screen time for children under 18-24 months except video chatting",
]

# Step 1 — convert documents to embeddings (numbers)
print("Converting documents to embeddings...")
embeddings = model.encode(documents)
print(f"Done! Each document is now {len(embeddings[0])} numbers")

# Step 2 — store them in ChromaDB
print("\nStoring in vector database...")
client = chromadb.Client()
collection = client.create_collection("pediatric_facts")

collection.add(
    documents=documents,
    embeddings=embeddings.tolist(),
    ids=[f"doc_{i}" for i in range(len(documents))]
)
print("Stored!")

# Step 3 — search with a question
question = "how much should my 2 year old sleep"
print(f"\nSearching for: '{question}'")

question_embedding = model.encode([question])
results = collection.query(
    query_embeddings=question_embedding.tolist(),
    n_results=1
)

print("\nMost relevant facts found:")
for i, doc in enumerate(results['documents'][0]):
    print(f"\n{i+1}. {doc}")