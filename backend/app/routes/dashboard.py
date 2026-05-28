from fastapi import APIRouter
from app.database import db

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/resumo")
async def get_resumo_kpis(doenca: str = None): # <-- Agora aceita a doença!
    """Retorna os KPIs gerais ou específicos da doença."""
    
    # 1. Filtro Case-Insensitive (resolve o problema de algumas doenças não funcionarem)
    filtro = {"doenca": {"$regex": f"^{doenca}$", "$options": "i"}} if doenca else {}

    resumo_clima = await db.agg_resumo_clima.find_one({}, {"_id": 0})

    if not doenca:
        # Se NÃO há filtro, devolvemos o resumo global do banco
        resumo_casos = await db.agg_resumo_casos.find_one({}, {"_id": 0})
    else:
        # Se HÁ filtro, calculamos o total na hora usando a agregação temporal!
        dados_temporais = await db.agg_casos_clima_por_mes.find(filtro, {"_id": 0}).to_list(length=None)
        
        total_casos_doenca = sum(item.get("total_casos", 0) for item in dados_temporais)
        
        # Construímos um resumo virtual para o Frontend não quebrar
        resumo_casos = {
            "total_casos": total_casos_doenca,
            "media_idade": "Var.", # Não temos a média exata por doença pré-calculada
            "total_hospitalizados": "N/A", # Depende da base completa
            "total_unidades": "N/A"
        }

    return {
        "casos": resumo_casos,
        "clima": resumo_clima
    }

@router.get("/temporal")
async def get_dados_temporais(doenca: str = None):
    # Aplicando o Regex Inteligente aqui também!
    filtro = {"doenca": {"$regex": f"^{doenca}$", "$options": "i"}} if doenca else {}
    dados = await db.agg_casos_clima_por_mes.find(filtro, {"_id": 0}).to_list(length=None)
    return dados

@router.get("/demografia")
async def get_dados_demograficos(doenca: str = None):
    filtro = {"doenca": {"$regex": f"^{doenca}$", "$options": "i"}} if doenca else {}
    
    faixa_etaria = await db.agg_casos_por_faixa_etaria.find(filtro, {"_id": 0}).to_list(length=None)
    sexo = await db.agg_casos_por_sexo.find(filtro, {"_id": 0}).to_list(length=None)
    letalidade = await db.agg_letalidade_doenca.find(filtro, {"_id": 0}).to_list(length=None)
    
    return {
        "faixa_etaria": faixa_etaria,
        "sexo": sexo,
        "letalidade": letalidade
    }

@router.get("/mapas/risco")
async def get_mapa_risco():
    features = await db.risco_inundacao.find({}, {"_id": 0}).to_list(length=None)
    return {"type": "FeatureCollection", "features": features}

@router.get("/mapas/vulnerabilidade")
async def get_mapa_vulnerabilidade():
    features = await db.vulnerabilidade_habitacional.find({}, {"_id": 0}).to_list(length=None)
    return {"type": "FeatureCollection", "features": features}

@router.get("/hospitais")
async def get_hospitais(doenca: str = None):
    filtro = {"doenca": {"$regex": f"^{doenca}$", "$options": "i"}} if doenca else {}
    dados = await db.agg_casos_por_hospital.find(filtro, {"_id": 0}).to_list(length=None)
    return dados

@router.get("/mapas/casos")
async def get_mapa_casos(doenca: str = None):
    filtro = {"doenca": {"$regex": f"^{doenca}$", "$options": "i"}} if doenca else {}
    dados = await db.agg_mapa_casos.find(filtro, {"_id": 0}).to_list(length=None)
    return dados