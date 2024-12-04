import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ValidationError, validator
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Ajouter CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Liste des origines autorisées
    allow_credentials=True,
    allow_methods=["*"],  # Autoriser toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Autoriser tous les en-têtes
)

class ChatMessage(BaseModel):
    role: str
    message: str

class ChatHistory(BaseModel):
    history: list[ChatMessage]

    @validator("history")
    def validate_history(cls, history):
        for i, msg in enumerate(history):
            if i > 0 and msg.role == history[i-1].role:
                raise ValueError("Invalid chat history: consecutive messages from the same role.")
        return history

@app.post("/chat")
async def chat_endpoint(history: ChatHistory):

    if not history.history or len(history.history) < 1:
        raise HTTPException(status_code=400, detail="History cannot be empty")

    if history.history[-1].role != "user":
        raise HTTPException(status_code=400, detail="Last message must be from the user.")

    user_message = history.history[-1].message.lower()
    if "help" in user_message:
        reply = "I'm here to assist you! What do you need help with?"
    elif "account" in user_message:
        reply = "I see you're asking about your account. How can I help you with that?"
    elif "hello" in user_message:
        reply = "Hello, how can I help you ?"
    else:
        replies = [
            "This is a static reply from the agent.",
            "I am here! What can I do for you?",
            "Could you tell me more about what you need?",
        ]
        reply = random.choice(replies)

    return {"reply": reply}
