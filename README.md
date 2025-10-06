## frontend
Nextjs application that holds the complete user interface.

Steps to run :-
```
npm run frontend:dev
```

## backend
Gin application that handles all the business logic

Steps to run :-
```
npm run backend:dev
```

#### Microservices

1. backend/ai_service : Responsible for → embeddings, vector search , generating a detailed report via LLM

   Steps to run **ai_service**:-
  - At root level i.e. backend/ → `source venv/bin/activate`
  
  - uvicorn ai_service.ai_service:app --host 0.0.0.0 --port 8000


Test Vector Search in Postman :


```
curl --location 'http://localhost:8000/ask' \
--header 'Content-Type: application/json' \
--data '{"question": "What is the revenue of LinkedIn?", "top_k": 1}'

```

#### Notes: https://docs.google.com/document/d/1Mhy6H-YXZWRVe7OVvnG59r2KsiKKhqLkML1mWWLBavA/edit?usp=sharing