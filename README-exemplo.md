# 🧩 8-Puzzle Solver: Inteligência Artificial Clássica em C

![C](https://img.shields.io/badge/language-C-blue.svg)
![AI](https://img.shields.io/badge/focus-Artificial%20Intelligence-orange.svg)
![Data Structures](https://img.shields.io/badge/core-Data%20Structures-green.svg)

Este projeto é um simulador e solucionador de alto desempenho para o jogo **8-puzzle** (Jogo dos Oito). Desenvolvido totalmente em linguagem C, o software utiliza algoritmos de **IA clássica (Busca Cega)** para explorar espaços de estados e encontrar sequências de movimentos ótimas para tabuleiros embaralhados.

Este trabalho faz parte do currículo de **Ciência de Dados e Inteligência Artificial** da **PUC-Campinas (2025)**.

---

## 🎮 Interface do Usuário

Abaixo, a interface interativa desenvolvida em C, com suporte a cores ANSI e navegação via teclado:

![Menu Principal](./assets/menu_principal.png)

---

## 🚀 Funcionalidades Principais

* **Lógica de IA Completa:** Implementação de algoritmos fundamentais para resolução de problemas de busca.
* **Modo Jogador:** Interface via terminal para resolução manual, permitindo testar a dificuldade do tabuleiro.
* **Modo Solver (IA):**
    * **Busca em Largura (BFS):** Garante o caminho mais curto até a solução (otimalidade).
    * **Busca em Profundidade Limitada Iterativa (IDDFS):** Eficiência de memória com completude, ideal para estados mais profundos.
* **Dashboard de Performance:** Ao finalizar uma busca, o programa exibe o tempo de execução exato e a quantidade de nós (estados) visitados.
* **Visualização Passo a Passo:** Sistema de "Replay" animado que reproduz a solução encontrada pela IA na tela do usuário.

---

### 🧠 Inteligência Artificial em Ação

O solver utiliza busca em espaço de estados para encontrar a solução ótima. Durante a busca, o sistema exibe métricas de performance em tempo real:

![IA Resolvendo](./assets/ia_solving.gif)

---

## 🧠 Conceitos Técnicos e Engenharia

O projeto foi construído focando em performance de baixo nível e controle rigoroso de memória:

* **Gerenciamento de Estados:** Cada configuração do tabuleiro é tratada como um nó em um grafo, onde as arestas são os movimentos possíveis (Cima, Baixo, Esquerda, Direita).
* **Estruturas de Dados Manuais:** Para evitar dependências externas e garantir eficiência, foram implementadas manualmente:
    * **Filas Dinâmicas (FIFO):** Suporte para a fronteira de busca do BFS.
    * **Pilhas Dinâmicas (LIFO):** Suporte para o IDDFS e reconstrução do caminho da solução.
* **Garantia de Solubilidade:** O sistema utiliza cálculos de **Paridade de Inversões** para garantir que todo tabuleiro gerado seja matematicamente possível de resolver, evitando loops infinitos.

---

## 🛠️ Estrutura do Código

A arquitetura está modularizada na pasta `src/`:

| Arquivo | Descrição |
| :--- | :--- |
| `main.c` | Ponto de entrada, interface de menus e loop principal. |
| `buscas.c / .h` | O "cérebro" do projeto; contém as lógicas de BFS e IDDFS. |
| `FuncoesGerais.c / .h` | Lógica do tabuleiro, verificação de paridade e utilitários de sistema. |
| `FILA.h / PILHA.h` | Implementações genéricas de estruturas de dados dinâmicas. |
| `TIPO.h` | Definição da estrutura `Estado`, essencial para o histórico de movimentos. |

---

## 💻 Como Compilar e Executar

Certifique-se de ter o **GCC** (ou qualquer compilador C99+) instalado.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/italobotelho/8-puzzle-solver-ai.git
    ```

2.  **Compilação (Universal):**
    ```bash
    gcc *.c -o puzzle_solver
    ```

3.  **Execução:**
    * **Windows:** `.\puzzle_solver.exe`
    * **Linux/macOS:** `./puzzle_solver`

---

## 📊 Resultados e Performance

Em testes realizados, o algoritmo **BFS** encontrou soluções de 15 passos em menos de 1 segundo, explorando milhares de nós por segundo. Para problemas que exigem mais de 20 passos, o **IDDFS** demonstrou maior estabilidade de memória, evitando o transbordamento do Heap.

> **Nota:** A complexidade do 8-puzzle é de $9!/2 = 181.440$ estados possíveis. Este software é capaz de navegar por esse espaço de forma eficiente.

---

## 🎓 Autor e Créditos

Desenvolvido por **Ítalo Botelho** e colegas como projeto acadêmico na **PUC-Campinas**.
Focado na intersecção entre algoritmos de baixo nível e Inteligência Artificial.
