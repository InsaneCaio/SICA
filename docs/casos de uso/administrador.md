# Casos de Uso - Administrador

Este diagrama representa as interações do administrador com o sistema de agendamento.

## Casos de uso
- Gerenciar médicos
- Cadastrar/Editar médicos
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
        UC2((Cadastrar/Editar médicos))
        UC3((Gerenciar/Editar dados da clínica))
        UC4((Fazer agendamento))
        UC5((Reagendar))
        UC6((Cancelar agendamento))
        UC7((Gerenciar assinatura))
    end

    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7

```

