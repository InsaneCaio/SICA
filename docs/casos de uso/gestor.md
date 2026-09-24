# Casos de Uso - Gestor

Este diagrama representa as interações do gestor com o sistema de agendamento.

## Casos de uso

* Analisar desempenho financeiro
* Gerar relatório financeiro
* Analisar previsão financeira
* Gerenciar assinatura
* Monitorar sistema
* Gerenciar usuário administrativo
* Gerenciar alerta

---

## Diagrama
```mermaid
flowchart LR
    G[Gestor]

    subgraph Sistema de Agendamento
        UC1((Analisar desempenho financeiro))
        UC3((Analisar previsão financeira))
        UC4((Gerenciar assinatura))
        UC6((Gerenciar usuário administrativo))
        UC7((Visualizar alertas))

        UC1_1((Visualizar receita total))
        UC1_2((Visualizar despesa total))
        UC1_3((Consultar lucro/prejuízo))
        UC1_4((Comparar desempenho entre períodos))

        UC3_1((Previsão de receita mensal))
        UC3_2((Previsão de despesa))

        UC7_1((Alerta de falha))
        UC7_2((Alerta financeiro))
    end

    G --> UC1
    G --> UC3
    G --> UC4
    G --> UC6
    G --> UC7

    UC1_1 -.->|extend| UC1
    UC1_2 -.->|extend| UC1
    UC1_3 -.->|extend| UC1
    UC1_4 -.->|extend| UC1

    UC3_1 -.->|extend| UC3
    UC3_2 -.->|extend| UC3

    UC7_1 -.->|extend| UC7
    UC7_2 -.->|extend| UC7
```
