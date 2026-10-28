# Casos de Uso - Funcionário

Este diagrama representa as interações do funcionário com o sistema de agendamento.

## Casos de uso
- Visualizar consultas
- Visualizar notificações
- Visualizar agenda
- Agendar consultas
- Reagendar consultas

## Diagrama
```mermaid
flowchart LR
    F[Funcionario]

    subgraph Sistema de Agendamento
        UC1((Visualizar consultas))
        UC2((Visualizar notificações))
        UC3((Visualizar agenda))
        UC4((Agendar consultas))
        UC5((Reagendar consultas))
    end

    F --> UC1
    F --> UC2
    F --> UC3
    F --> UC4
    F --> UC5
```
