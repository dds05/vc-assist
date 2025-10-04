import faiss
import numpy as np

class VectorStore:
    def __init__(self, embeddings):
        self.dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(embeddings)

    def query(self, query_embedding, top_k=3):
        """
        Return top_k indices of similar embeddings
        """
        q_emb = np.array(query_embedding).reshape(1, -1)
        D, I = self.index.search(q_emb, top_k)
        return I[0]
