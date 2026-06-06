import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

async def main():
    client = AsyncIOMotorClient('mongodb+srv://isabelbaungartner_db_user:TRABALHOpi2026.1@cluster0.a6z6ys0.mongodb.net/?appName=Cluster0')
    db = client.siest_db
    doc = await db.casos_geolocalizados.find_one({'NOME_DOENCA': 'HEPA'})
    print({k: v for k, v in doc.items() if 'DT' in k or 'SIN' in k} if doc else None)

if __name__ == "__main__":
    asyncio.run(main())
