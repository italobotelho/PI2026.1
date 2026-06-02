import asyncio
from pymongo import AsyncMongoClient

async def main():
    client = AsyncMongoClient('mongodb://localhost:27017')
    db = client['epidemiologia_db']
    doc = await db.casos_geolocalizados.find_one()
    print([k for k in doc.keys()])
asyncio.run(main())
