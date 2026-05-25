from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import dashboard # Importamos as rotas que acabámos de criar

app = FastAPI(
    title="API do SIEST",
    description="Backend de Dados Epidemiológicos e Climáticos (FastAPI + MongoDB)",
    version="1.0.0"
)

# Mantemos o CORS ativo para o Next.js não ser bloqueado
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ligamos o roteador do Dashboard à aplicação principal
app.include_router(dashboard.router)

@app.get("/")
async def rota_raiz():
    return {"status": "online", "mensagem": "O Backend do SIEST está a voar! 🚀"}