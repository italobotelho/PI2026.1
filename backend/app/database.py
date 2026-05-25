from motor.motor_asyncio import AsyncIOMotorClient
import os

# Em produção, usaremos um arquivo .env. Por agora, colocamos a URL que você usou nos ETLs.
MONGO_URL = os.getenv(
    "MONGO_URL", 
    "mongodb+srv://isabelbaungartner_db_user:trabalhoPI@cluster0.a6z6ys0.mongodb.net/?appName=Cluster0"
)

# Inicializa o cliente assíncrono do MongoDB
client = AsyncIOMotorClient(MONGO_URL)

# Seleciona o banco de dados do projeto
db = client.siest_db

print("🔌 Cliente MongoDB (Motor) inicializado.")