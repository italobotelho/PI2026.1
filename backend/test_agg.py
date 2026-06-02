import asyncio
from app.database import db
import time

async def run():
    start = time.time()
    
    filtro = {"NOME_DOENCA": "DENGUE"}
    
    doc = await db.casos_geolocalizados.find_one()
    
    end = time.time()
    print(f"Time taken: {end - start:.2f} seconds")
    print(list(doc.keys()))

asyncio.run(run())
