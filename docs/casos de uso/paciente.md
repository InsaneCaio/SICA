# Casos de Uso - Paciente

Este diagrama representa as interações do paciente com o sistema de agendamento.

## Casos de uso
- Fazer agendamento  
- Consultar agenda  
- Cancelar consulta  
- Consultar detalhes  
- Responder confirmação

## Diagrama
```mermaid
flowchart LR
    P[Paciente]

    subgraph Sistema de Agendamento
        UC1((Fazer agendamento))
        UC2((Consultar agenda))
        UC3((Cancelar consulta))
        UC4((Consultar detalhes))
        UC5((Responder confirmacao))
    end

    P --> UC1
    P --> UC2
    P --> UC3
    P --> UC4
    P --> UC5

```
