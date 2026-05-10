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

        %% Casos principais
        UC1((Analisar desempenho financeiro))
        UC2((Gerar relatório financeiro))
        UC3((Analisar previsão financeira))
        UC4((Vizualizar assinatura))
        UC5((Monitorar sistema))
        UC6((Gerenciar usuário administrativo))
        UC7((Visualizar alerta))

        %% Subcasos - Financeiro
        UC1_1((Visualizar receita total))
        UC1_2((Visualizar despesa total))
        UC1_3((Consultar lucro/prejuízo))
        UC1_4((Comparar desempenho entre períodos))

        %% Subcasos - Previsões
        UC3_1((Previsão de receita mensal))
        UC3_2((Previsão de despesa))

        %% Subcasos - Assinaturas
        UC4_2((Consultar detalhe de pagamento))
        UC4_3((Alterar plano de assinatura))
        UC4_4((Cancelar assinatura))
        UC4_5((Reativar assinatura))

        %% Subcasos - Monitoramento
        UC5_1((Visualizar log de atividade))

        %% Subcasos - Alertas
        UC7_1((Alerta de falha))
        UC7_2((Alerta de atraso))
        UC7_3((Alerta financeiro))

    end

    %% Ligações com ator
    G --> UC1
    G --> UC2
    G --> UC3
    G --> UC4
    G --> UC5
    G --> UC6
    G --> UC7

    %% Generalização
    UC3_1 -->|generalização| UC3
    UC3_2 -->|generalização| UC3

    %% <<include>> (obrigatórios)
    UC1 -.->|&lt;&lt;include&gt;&gt;| UC1_1
    UC1 -.->|&lt;&lt;include&gt;&gt;| UC1_2
    UC1 -.->|&lt;&lt;include&gt;&gt;| UC1_3
    UC1 -.->|&lt;&lt;include&gt;&gt;| UC1_4

    UC5 -.->|&lt;&lt;include&gt;&gt;| UC5_1

    %% <<extend>> (opcionais / condicionais)

    %% Alterações de assinatura são ações específicas
    UC4_2 -.->|&lt;&lt;extend&gt;&gt;| UC4
    UC4_3 -.->|&lt;&lt;extend&gt;&gt;| UC4
    UC4_4 -.->|&lt;&lt;extend&gt;&gt;| UC4
    UC4_5 -.->|&lt;&lt;extend&gt;&gt;| UC4

    %% Tipos de alertas (variações)
    UC7_1 -.->|&lt;&lt;extend&gt;&gt;| UC7
    UC7_2 -.->|&lt;&lt;extend&gt;&gt;| UC7
    UC7_3 -.->|&lt;&lt;extend&gt;&gt;| UC7
```
