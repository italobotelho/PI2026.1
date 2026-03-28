# 🧬 SIEST - Sistema de Inteligência Epidemiológica e Socioespacial

![Status](https://img.shields.io/badge/Status-Camada_Bronze_Concluída-success)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Geopandas](https://img.shields.io/badge/GeoPandas-Espacial-green)
![Instituição](https://img.shields.io/badge/PUC--Campinas-Ciência_de_Dados_e_IA-maroon)

## 📌 Sobre o Projeto
O **SIEST** é um projeto académico do curso de Ciência de Dados e Inteligência Artificial da PUC-Campinas. O sistema mapeia e cruza focos de doenças hídricas e arboviroses (como Dengue e Leptospirose) com gatilhos climáticos e áreas de vulnerabilidade urbana.

Este repositório contém os **Pipelines de Engenharia de Dados (ETL)** responsáveis por extrair, limpar e cruzar os dados brutos governamentais, construindo o *Data Lake* (Camada Bronze) do projeto.

---

## 🏗️ Arquitetura de Engenharia de Dados (A Tríade ODS)

A fase de extração e ingestão de dados (ETL) foi desenhada para garantir alta fidelidade, granularidade espacial e resiliência contra instabilidades de APIs governamentais. O *Data Lake* primário foi estruturado em três eixos analíticos fundamentais:

**1. Eixo Epidemiológico (O Fenômeno - ODS 3: Saúde e Bem-Estar)**
* **Fontes:** DataSUS (SINAN e CNES).
* **Metodologia:** Extração de microdados históricos (2014-2026) de notificações de Dengue, Zika, Chikungunya, Leptospirose e Hepatites Virais, alinhando-se diretamente à Meta 3.3 da ONU. Os dados foram cruzados com o CNES para obtenção das coordenadas geográficas (Lat/Long) dos centros de atendimento.

**2. Eixo Climático (O Gatilho Ambientalista - ODS 13: Ação Climática)**
* **Fonte:** API REST Mosqlimate.
* **Metodologia:** Requisições paginadas filtradas pelo geocódigo do IBGE (3509502), extraindo medições diárias de precipitação total, humidade e temperaturas.

**3. Eixo Socioespacial e Saneamento (A Vulnerabilidade - ODS 6: Água e Saneamento)**
* **Fonte:** Web GIS Portal Geoambiental (Prefeitura de Campinas).
* **Metodologia:** Extração direta de metadados vetoriais (*Shapefiles*) do banco PostGIS municipal e conversão para matrizes geográficas (EPSG:4326). Camadas processadas: Núcleos Urbanos (SEHAB) e Risco de Inundação (CPRM/IPT).

---

## 🚀 Como Executar o Projeto (Guia Rápido)

Para reproduzir o *Data Lake* na sua máquina ou no Google Colab, siga os passos abaixo rigorosamente na ordem apresentada.

### 1. Pré-requisitos e Instalação do Ambiente
Certifique-se de ter o Python 3.10+ instalado. 

Primeiro, crie um ficheiro chamado `requirements.txt` na raiz do projeto com o seguinte conteúdo:
```text
# Dependências do Projeto SIEST - Engenharia e Ciência de Dados
pandas>=2.0.0
geopandas>=0.13.0
PySUS>=0.11.0
mosqlient>=0.2.0
requests>=2.31.0
tqdm>=4.65.0
matplotlib>=3.7.0
shapely>=2.0.0
fiona>=1.9.0
pyarrow>=12.0.0
```

De seguida, instale as dependências via terminal:
```bash
pip install -r requirements.txt
```

### 2. Ordem de Execução dos Notebooks (ETL)

A arquitetura foi dividida em 4 esteiras independentes. Execute os Jupyter Notebooks na seguinte ordem:

#### 🟢 Passo 1: `01_ETL_Extracao_SINAN.ipynb`
* **Objetivo:** Extrair microdados históricos (2014-2026) de morbidade via FTP do DataSUS.
* **Ação:** Apenas execute todas as células. O script lida automaticamente com paginação e limpeza de memória (anti-OOM).
* **Saída:** Ficheiros `.parquet` particionados na pasta `dados_sinan_parquet/`.

#### 🟡 Passo 2: `02_ETL_Geolocalizacao_CNES.ipynb`
* **Objetivo:** Cruzar os casos do SINAN com as coordenadas (Lat/Long) dos hospitais.
* **⚠️ Requisito Manual:** Devido a instabilidades no FTP governamental, é necessário descarregar o ficheiro estático `cnes_estabelecimentos.csv` a partir do **Portal de Dados Abertos** (pesquisando pela base do Cadastro Nacional de Estabelecimentos de Saúde - CNES) e colocá-lo na raiz do projeto antes da execução.
* **Saída:** Ficheiro mestre `siest_casos_geolocalizados.parquet` (Camada Silver inicial).

#### 🔵 Passo 3: `03_ETL_Clima_Mosqlimate.ipynb`
* **Objetivo:** Extrair histórico diário de chuvas e temperaturas de Campinas.
* **⚠️ Requisito Manual:** É necessário gerar uma API Key gratuita no site [Mosqlimate.org](https://mosqlimate.org/) e inseri-la na variável `API_KEY` do código.
* **Saída:** Ficheiro `clima_campinas_2014_2026.parquet`.

#### 🔴 Passo 4: `04_ETL_Saneamento_IBGE.ipynb`
* **Objetivo:** Converter mapas de risco de inundação e vulnerabilidade habitacional (Saneamento).
* **⚠️ Requisito Manual:** Devido a firewalls governamentais, descarregue os *Shapefiles* brutos do [Portal Geoambiental de Campinas](https://geoambiental.campinas.sp.gov.br/) e coloque-os na raiz do projeto (certifique-se de incluir os ficheiros `.shp`, `.dbf`, `.shx` e `.prj`).
* **Saída:** Matrizes geoespaciais em formato GeoParquet (`vulnerabilidade_habitacional_campinas.parquet` e `risco_inundacao_campinas.parquet`).

---

## 🗺️ Como Consumir os Dados

### A. Ler a Base de Doenças Georreferenciadas
Contém todos os casos cruzados com a Latitude e Longitude da Unidade de Saúde.
```python
import pandas as pd

df_casos = pd.read_parquet('dados_processados_cnes_sinan_parquet/siest_casos_geolocalizados.parquet')
display(df_casos.head())
```

### B. Ler a Série Histórica Climática
Dados diários de temperatura e precipitação prontos para análise de séries temporais.
```python
import pandas as pd

df_clima = pd.read_parquet('dados_clima_parquet/clima_campinas_2014_2026.parquet')
display(df_clima.head())
```

### C. Ler os Mapas de Risco e Saneamento
**Atenção:** Como as bases possuem geometria (polígonos), use obrigatoriamente o `geopandas`. O Sistema de Coordenadas (CRS) já está padronizado em Lat/Long (EPSG:4326).
```python
import geopandas as gpd
import matplotlib.pyplot as plt

gdf_vuln = gpd.read_parquet('dados_saneamento_parquet/vulnerabilidade_habitacional_campinas.parquet')
gdf_inund = gpd.read_parquet('dados_saneamento_parquet/risco_inundacao_campinas.parquet')

# Plotar os núcleos urbanos sem saneamento adequado
gdf_vuln.plot(color='darkred', alpha=0.7)
plt.title('Áreas de Vulnerabilidade - Campinas')
plt.show()
```

---

## 🛠️ Tecnologias Utilizadas
* **Linguagem:** Python 3.10+
* **Extração:** PySUS, Requests
* **Manipulação Tabular:** Pandas, PyArrow
* **Inteligência Espacial:** GeoPandas, Shapely, Fiona
