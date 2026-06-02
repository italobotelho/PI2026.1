import asyncio
import os
import traceback
from pymongo import AsyncMongoClient
from dotenv import load_dotenv

load_dotenv()

async def main():
    try:
        client = AsyncMongoClient(os.getenv("MONGO_URL"))
        db = client.siest_db
        pipeline = [{"$limit": 1}]
        # This is where it probably fails
        cursor = await db.agg_cubo_casos.aggregate(pipeline)
        resultados = await cursor.to_list(length=1)
        print("Aggregate Success:", len(resultados))

        find_cursor = db.agg_cubo_casos.find({"ano": 2024})
        find_resultados = await find_cursor.to_list(length=1)
        print("Find Success:", len(find_resultados))
    except Exception as e:
        with open("error.txt", "w") as f:
            f.write(traceback.format_exc())
            
asyncio.run(main())
