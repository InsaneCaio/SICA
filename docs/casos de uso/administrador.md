# Casos de Uso - Administrador

Este diagrama representa as interações do administrador com o sistema de agendamento.

## Casos de uso
- Gerenciar usuários
- Gerenciar clínica
- Agendar consulta
- Reagendar consulta
- Cancelar agendamento
- Login
- Logout
- Visualizar consultas
- Visualizar usuários

## Diagrama
```mermaid
flowchart LR
    A[Administrador]

    subgraph Sistema de Agendamento
        UC1((Gerenciar usuários))
        UC2((Gerenciar clínica))
        UC3((Agendar consulta))
        UC4((Reagendar consulta))
        UC5((Cancelar agendamento))
        UC6((Login))
        UC7((Logout))
        UC8((Visualizar consultas))
        UC9((Visualizar usuários))
    end

    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    A --> UC8
    A --> UC9

```
