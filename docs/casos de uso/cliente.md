# Casos de Uso - Cliente

Este diagrama representa as interações do cliente com o sistema de agendamento.

## Casos de uso
- Fazer agendamento  
- Consultar agenda  
- Cancelar consulta  
- Gerenciar dependentes  
- Responder confirmação
- Visualizar documentos

## Diagrama
```mermaid
flowchart LR
    P[Cliente]

    subgraph Sistema de Agendamento
        UC1((Fazer agendamento))
        UC2((Consultar agenda))
        UC3((Cancelar consulta))
        UC4((Gerenciar dependentes))
        UC5((Responder confirmacao))
        UC6((Visualizar documentos))
    end

    P --> UC1
    P --> UC2
    P --> UC3
    P --> UC4
    P --> UC5
    P --> UC6

```
