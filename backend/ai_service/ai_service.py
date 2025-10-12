from fastapi import FastAPI
from pydantic import BaseModel
import os

from .embeddings import Embeddings
from .vector_store import VectorStore
from .llm_service import LLMService

# ----------------------
# Initialize
# ----------------------
app = FastAPI()

DATA_DIR = os.path.join(os.getcwd(), "data_files")
TOP_K = 2

# Load text files
documents = []
texts = []
for fname in os.listdir(DATA_DIR):
    if fname.endswith(".txt"):
        text = open(os.path.join(DATA_DIR, fname), "r", encoding="utf-8").read()
        documents.append({"filename": fname, "text": text})
        texts.append(text)

# Initialize modules
embedding_module = Embeddings()
vector_module = VectorStore(embedding_module.encode(texts))
llm_module = LLMService()

# ----------------------
# Request model
# ----------------------
class Query(BaseModel):
    question: str
    top_k: int = TOP_K

@app.post("/ask")
def ask(query: Query):
    # Embed query
    query_emb = embedding_module.encode([query.question])[0]

    # Search vector store
    top_indices = vector_module.query(query_emb, query.top_k)
    context_texts = [documents[i]["text"] for i in top_indices]
    source_files = [documents[i]["filename"] for i in top_indices]

    # Call LLM
    answer = llm_module.answer_question(query.question, context_texts)

    return {
        "result": answer
    }
