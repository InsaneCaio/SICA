# Casos de Uso - Gestor

Este diagrama representa as interações do gestor com o sistema de agendamento.

## Casos de uso

* Analisar desempenho financeiro
* Gerar relatórios financeiros
* Analisar previsões financeiras
* Gerenciar assinaturas
* Monitorar sistema
* Gerenciar usuários administrativos
* Gerenciar alertas

---

## Diagrama
```mermaid
flowchart LR
    G[Gestor]

    subgraph Sistema de Agendamento

        %% Casos principais
        UC1((Analisar desempenho financeiro))
        UC2((Gerar relatórios financeiros))
        UC3((Analisar previsões financeiras))
        UC4((Gerenciar assinaturas))
        UC5((Monitorar sistema))
        UC6((Gerenciar usuários administrativos))
        UC7((Gerenciar alertas))

        %% Subcasos - Financeiro
        UC1_1((Visualizar receita total))
        UC1_2((Visualizar despesas totais))
        UC1_3((Consultar lucro/prejuízo))
        UC1_4((Comparar desempenho entre períodos))

        %% Subcasos - Previsões
        UC3_1((Previsão de receita mensal))
        UC3_2((Previsão de despesas))

        %% Subcasos - Assinaturas
        UC4_1((Visualizar assinaturas ativas))
        UC4_2((Consultar detalhes de pagamento))
        UC4_3((Alterar plano de assinatura))
        UC4_4((Cancelar assinatura))
        UC4_5((Reativar assinatura))

        %% Subcasos - Monitoramento
        UC5_1((Visualizar logs de atividades))

        %% Subcasos - Alertas
        UC7_1((Alertas de falhas))
        UC7_2((Alertas de atrasos))
        UC7_3((Alertas financeiros))

    end

    %% Ligações com ator
    G --> UC1
    G --> UC2
    G --> UC3
    G --> UC4
    G --> UC5
    G --> UC6
    G --> UC7

    %% <<include>> (obrigatórios)
    UC1 -.->|<<include>>| UC1_1
    UC1 -.->|<<include>>| UC1_2
    UC1 -.->|<<include>>| UC1_3
    UC1 -.->|<<include>>| UC1_4

    UC3 -.->|<<include>>| UC3_1
    UC3 -.->|<<include>>| UC3_2

    UC4 -.->|<<include>>| UC4_1
    UC4 -.->|<<include>>| UC4_2

    UC5 -.->|<<include>>| UC5_1

    %% <<extend>> (opcionais / condicionais)

    %% Relatórios só acontecem se o gestor quiser exportar
    UC2 -.->|<<extend>>| UC1

    %% Alterações de assinatura são ações específicas
    UC4_3 -.->|<<extend>>| UC4
    UC4_4 -.->|<<extend>>| UC4
    UC4_5 -.->|<<extend>>| UC4

    %% Alertas são eventos que "disparam" no monitoramento
    UC7 -.->|<<extend>>| UC5

    %% Tipos de alertas (variações)
    UC7_1 -.->|<<extend>>| UC7
    UC7_2 -.->|<<extend>>| UC7
    UC7_3 -.->|<<extend>>| UC7
```
