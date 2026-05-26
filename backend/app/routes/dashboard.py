from fastapi import APIRouter
from app.database import db

# Criamos um "roteador" para organizar os nossos endpoints
router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/resumo")
async def get_resumo_kpis():
    """Retorna os KPIs gerais (Casos e Clima) para o topo do Dashboard."""
    resumo_casos = await db.agg_resumo_casos.find_one({}, {"_id": 0})
    resumo_clima = await db.agg_resumo_clima.find_one({}, {"_id": 0})
    
    return {
        "casos": resumo_casos,
        "clima": resumo_clima
    }

@router.get("/temporal")
async def get_dados_temporais(doenca: str = None):
    """
    Retorna a evolução temporal (meses/anos). 
    Se a query 'doenca' for passada (ex: ?doenca=DENGUE), filtra os dados.
    """
    filtro = {"doenca": doenca.upper()} if doenca else {}
    
    # O .to_list() transforma o cursor do MongoDB numa lista Python
    dados = await db.agg_casos_clima_por_mes.find(filtro, {"_id": 0}).to_list(length=None)
    return dados

@router.get("/demografia")
async def get_dados_demograficos(doenca: str = None):
    """Retorna dados de Sexo, Idade e Letalidade para os gráficos de pizza/barras."""
    filtro = {"doenca": doenca.upper()} if doenca else {}
    
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
    """Retorna os polígonos de risco de inundação em formato GeoJSON (padrão de mapas)."""
    # Procura todos os polígonos, excluindo o ObjectId interno do MongoDB
    features = await db.risco_inundacao.find({}, {"_id": 0}).to_list(length=None)
    
    # O Leaflet exige que os dados cheguem empacotados numa "FeatureCollection"
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/mapas/vulnerabilidade")
async def get_mapa_vulnerabilidade():
    """Retorna os polígonos de vulnerabilidade habitacional em formato GeoJSON."""
    features = await db.vulnerabilidade_habitacional.find({}, {"_id": 0}).to_list(length=None)
    
    return {
        "type": "FeatureCollection",
        "features": features
    }