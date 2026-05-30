import os
from pymongo import MongoClient
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("⚠️ ERRO: Variável MONGO_URL não encontrada.")

print("Conectando ao MongoDB...")
client = MongoClient(MONGO_URL)
db = client.siest_db

def salvar_agregacao(nome_colecao_origem, pipeline, nome_colecao_destino):
    print(f"Executando agregação para {nome_colecao_destino}...")
    resultado = list(db[nome_colecao_origem].aggregate(pipeline))
    
    db[nome_colecao_destino].delete_many({})
    
    if resultado:
        db[nome_colecao_destino].insert_many(resultado)
        
    print(f"SUCESSO: {nome_colecao_destino}: {len(resultado)} documentos salvos.\n")

print("--------------------------------------------------")

pipeline_casos_por_idade = [
    {
        "$addFields": {
            "idade_real": {
                "$let": {
                    "vars": {
                        "idade_num": {
                            "$convert": {
                                "input": "$NU_IDADE_N",
                                "to": "double",
                                "onError": None,
                                "onNull": None
                            }
                        }
                    },
                    "in": {
                        "$cond": [
                            {"$eq": ["$$idade_num", None]},
                            None,
                            {"$cond": [
                                {"$gte": ["$$idade_num", 4000]},
                                {"$mod": ["$$idade_num", 1000]},
                                0
                            ]}
                        ]
                    }
                }
            }
        }
    },
    {
        "$match": {
            "idade_real": {"$ne": None}
        }
    },
    {
        "$group": {
            "_id": {
                "idade": "$idade_real",
                "doenca": "$NOME_DOENCA"
            },
            "total_casos": {"$sum": 1}
        }
    },
    {
        "$project": {
            "_id": 0,
            "idade": "$_id.idade",
            "doenca": "$_id.doenca",
            "total_casos": 1
        }
    },
    {"$sort": {"idade": 1}}
]

salvar_agregacao("casos_geolocalizados", pipeline_casos_por_idade, "agg_casos_por_idade")

print("CONCLUIDO: Agregação de idades exatas concluída!")
