# Casos de Uso - Administrador

Este diagrama representa as interações do administrador com o sistema de agendamento.

## Casos de uso
- Gerenciar médicos
- Gerenciar/Editar dados da clínica
- Fazer agendamento
- Reagendar
- Cancelar agendamento
- Gerenciar assinatura

## Diagrama
```mermaid
flowchart LR
    A[Administrador]

    subgraph Sistema de Agendamento
        UC1((Gerenciar médicos))
        UC2((Gerenciar/Editar dados da clínica))
        UC3((Fazer agendamento))
        UC4((Reagendar))
        UC5((Cancelar agendamento))
        UC6((Gerenciar assinatura))
    end

    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6

```

