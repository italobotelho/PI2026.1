# 📚 Análise de Indicadores Educacionais (IMRS - Minas Gerais)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-%23ffffff.svg?style=for-the-badge&logo=Matplotlib&logoColor=black)

Este projeto consiste em uma **Análise Exploratória de Dados (EDA)** focada na dimensão educacional do **Índice Mineiro de Responsabilidade Social 2020 (IMRS)**. Utilizando bases de dados da Fundação João Pinheiro, o estudo identifica disparidades socioeducacionais entre as mesorregiões de Minas Gerais, aplicando técnicas de estatística descritiva e visualização de dados.

---

## 🎯 Objetivos da Análise

O estudo foi estruturado para responder a perguntas críticas sobre o cenário educacional mineiro:
* **Métricas de Alfabetização:** Analisar a taxa de analfabetismo na população adulta (25 anos ou mais).
* **Fluxo Escolar:** Avaliar a proporção de escolarização no ensino fundamental e médio.
* **Disparidade Regional:** Quantificar a diferença de indicadores entre regiões com diferentes perfis socioeconômicos (ex: Norte vs. Sul de Minas).
* **Detecção de Outliers:** Identificar municípios com resultados significativamente fora da curva média regional.

---

## 🔍 Metodologia e Processamento (ETL)

A análise segue um pipeline rigoroso de Ciência de Dados:

1.  **Extração:** Carregamento de dados estruturados provenientes do repositório oficial do IMRS.
2.  **Limpeza e Transformação:** Tratamento de valores ausentes, filtragem por mesorregiões e normalização de nomes de colunas utilizando a biblioteca `Pandas`.
3.  **Análise Estatística:** Cálculo de medidas de tendência central (média, mediana) e dispersão (desvio padrão e variância).
4.  **Visualização:** Geração de gráficos de distribuição e comparação para validação de hipóteses.

---

## 📊 Principais Insights e Visualizações

### 1. Perfil de Alfabetização
A análise revelou que a taxa média de analfabetismo no estado para o grupo estudado é de **16.97%**, apresentando uma alta variabilidade entre os municípios, o que reflete desigualdades regionais históricas.

![Histograma de Alfabetização](./assets/histograma_analfabetismo.png)

### 2. Comparativo Regional (Norte vs. Sul)
A utilização de **Boxplots** permitiu visualizar que, embora existam municípios de alto desempenho em ambas as regiões, as métricas de conclusão do ensino básico apresentam variações estatisticamente significantes dependendo da localização geográfica.

![Boxplot Comparativo](./assets/boxplot_regioes.png)

---

## 📂 Estrutura do Repositório

Para garantir a organização e portabilidade do projeto, o repositório segue a estrutura abaixo:

```text
imrs_educacao_2020/
├── assets/          # Gráficos e capturas de tela gerados
├── data/            # Bases de dados utilizadas na análise
├── docs/            # Relatório técnico detalhado (PDF)
├── notebooks/       # Jupyter Notebook com o código-fonte (Python)
└── README.md        # Documentação principal
```

---

## 🚀 Como Acessar e Executar

1.  **Visualização Online:** Você pode visualizar o código e os gráficos diretamente pelo GitHub abrindo o arquivo ```notebooks/notebook.ipynb```.
2.  **Execução Local:**
    * Clone o repositório.
    * Instale as dependências: ```pip install pandas matplotlib seaborn```.
    * Execute o Jupyter Notebook para reproduzir as análises.
3.  **Relatório Completo:** O detalhamento teórico e as conclusões da pesquisa estão disponíveis em ```docs/relatorio.pdf```.

---

## 🎓 Sobre o Autor
Projeto desenvolvido por **Ítalo Botelho** e colegas como parte das atividades acadêmicas de Ciência de Dados e Inteligência Artificial na **PUC-Campinas (2025).**
