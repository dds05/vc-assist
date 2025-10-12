from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json
import re

class LLMService:
    def __init__(self, model_name="Qwen/Qwen2-1.5B-Instruct", device=None):
        self.device = device if device else ("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Loading {model_name} on {self.device}...")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name, 
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
        ).to(self.device)

    def answer_question(self, question, context_texts):

        # --- Role-based messages ---
        tokenizer = self.tokenizer
        model = self.model

        prompt = f"""
Compare the following companies and generate a JSON with this exact structure:
{{
  "investment_recommendation": ""   #Mandatory: Include reasoning about the recommended company ONLY here based on data.,
  "companies": [
    {{
      "company_name": "",
      "revenue": "",
      "ebitda": "",
      "pe_ratio": "",
      "roa": ""
    }}
  ],
 
}}

Context:
{context_texts}

Instructions:
- Respond ONLY in JSON. Do NOT include explanations, notes, or commentary outside the JSON.
- Return only in single structure.
- Values should be in string ONLY.
- Include all reasoning about the recommended company **only inside the "investment_recommendation" field**.
- If a value is missing, use null.
- Do NOT write anything before or after the JSON.
"""

        messages = [
            {"role": "system", "content": "You compare the companies and provide a final investment_recommendation"},
            {"role": "user", "content": prompt}
        ]
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

        generated_ids = model.generate(
            **model_inputs,
            max_new_tokens=512
        )
        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]
        response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
        clean_response = response.strip().removeprefix("```json").removesuffix("```").strip()
        data =  json.loads(clean_response)
        if not isinstance(data, list):
            data = [data]
        return data