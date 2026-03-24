# 🧬 SIEST - Sistema de Inteligência Epidemiológica e Socioespacial

> **Pipeline de Engenharia de Dados e modelagem preditiva para análise de surtos epidemiológicos, infraestrutura de saúde e alterações climáticas no município de Campinas-SP.**

## 📌 Sobre o Projeto
O **SIEST** é uma plataforma analítica baseada em Teoria dos Grafos desenhada para mapear e compreender o comportamento de doenças com forte correlação climática (Arboviroses e Doenças de Veiculação Hídrica). 

Através da ingestão de bases governamentais massivas e aplicação de Inteligência Territorial, o sistema permite monitorizar a sobrecarga da rede hospitalar e correlacionar a evolução de surtos com picos de temperatura e precipitação extrema.

### 🌍 Impacto Social e Alinhamento com a ONU
O projeto atende diretamente a três **Objetivos de Desenvolvimento Sustentável (ODS)**:
* 🏥 **ODS 3 (Saúde e Bem-Estar):** Combate a doenças tropicais negligenciadas (Dengue, Zika, Chikungunya, Leptospirose e Hepatites Virais) e desenvolvimento de capacidade de alerta precoce para a rede hospitalar.
* 🏙️ **ODS 11 (Cidades Sustentáveis):** Mapeamento de áreas urbanas vulneráveis a desastres naturais (enchentes) através da geolocalização de casos de doenças hídricas.
* 🌡️ **ODS 13 (Ação Climática):** Modelação matemática do impacto das alterações climáticas extremas na saúde pública local.

---

## 🏗️ Arquitetura de Dados (Medallion Architecture)
O pipeline de dados foi desenhado com foco na resiliência e otimização de memória, estruturado nas seguintes camadas:

* 🥉 **Camada Bronze (Raw):** Extração bruta do SINAN via FTP do DataSUS (`PySUS`). Implementação de processamento em lotes (*chunking*) para evitar estouro de memória (OOM), guardando os registos em formato colunar `.parquet` com compressão Snappy.
* 🥈 **Camada Silver (Processed):** Aplicação de *Strict Data Contracts*. Cruzamento espacial (*Left Join*) entre os casos de morbidade e o Cadastro Nacional de Estabelecimentos de Saúde (CNES), gerando uma matriz mestre de casos georreferenciados.
* 🥇 **Camada Gold (Analytics):** Consumo da matriz mestre para Análise Exploratória de Dados (EDA), modelagem de Grafos e ingestão em banco NoSQL (MongoDB).

---

## 📂 Estrutura do Repositório

```text
📦 PI2026.1
 ┣ 📜 01_ETL_Extracao_SINAN.ipynb       # Motor de extração PySUS e Chunking (Bronze)
 ┣ 📜 02_ETL_Geolocalizacao_CNES.ipynb  # Higienização e Cruzamento Espacial (Silver)
 ┣ 📜 03_EDA_e_MongoDB.ipynb            # Análise Exploratória e Carga no BD (Gold)
 ┣ 📜 cnes_estabelecimentos.csv         # Base territorial estática (Contrato de Dados)
 ┗ 📜 README.md                         # Documentação do projeto
