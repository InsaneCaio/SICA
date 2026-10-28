# Casos de Uso - Paciente

Este diagrama representa as interações do cliente com o sistema de agendamento.

## Casos de uso
- Agendar consultas 
- Visualizar consultas
- Gerenciar consultas  
- Gerenciar dependentes  
- Visualizar dependentes
- Visualizar notificações


## Diagrama
```mermaid
flowchart LR
    P[Cliente]

    subgraph Sistema de Agendamento
        UC1((Agendar consultas))
        UC2((Visualizar consultas))
        UC3((Gerenciar consultas))
        UC4((Gerenciar dependentes))
        UC5((Visualizar dependentes))
        UC6((Visualizar notificações))
    end

    P --> UC1
    P --> UC2
    P --> UC3
    P --> UC4
    P --> UC5
    P --> UC6

```
