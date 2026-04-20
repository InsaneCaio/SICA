# Casos de Uso - Administrador

Este diagrama representa as interações do administrador com o sistema de agendamento.

## Casos de uso
- Consultar médicos
- Editar médico
- Cadastrar médico
- Fazer agendamento
- Reagendar
- Cancelar agendamento

## Diagrama
```mermaid
flowchart LR
    A[Administrador]

    subgraph Sistema de Agendamento
        UC1((Consultar médicos))
        UC2((Editar médico))
        UC3((Cadastrar médico))
        UC4((Fazer agendamento))
        UC5((Reagendar))
        UC6((Cancelar agendamento))
    end

    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6

```

