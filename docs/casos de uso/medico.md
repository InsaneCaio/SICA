# Casos de Uso - Médico

Este diagrama representa as interações do médico com o sistema de agendamento.

## Casos de uso
- Visualizar consultas
- Visualizar notificações
- Visualizar agenda
- Agendar consultas
- Reagendar consultas

## Diagrama
```mermaid
flowchart LR
    M[Medico]

    subgraph Sistema de Agendamento
        UC1((Visualizar consultas))
        UC2((Visualizar notificações))
        UC3((Visualizar agenda))
        UC4((Agendar consultas))
        UC5((Reagendar consultas))
    end

    M --> UC1
    M --> UC2
    M --> UC3
    M --> UC4
    M --> UC5
```
