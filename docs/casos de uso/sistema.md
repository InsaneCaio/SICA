# Casos de Uso - Sistema

Este diagrama representa os processos internos do sistema responsáveis por garantir o funcionamento correto do agendamento de consultas.

## Casos de uso
- Registrar agendamento  
- Validar dados  
- Notificar confirmação  
- Atualizar agenda 

## Diagrama
```mermaid
flowchart LR
    S[Sistema]

    subgraph Processos Internos
        UC1((Registrar agendamento))
        UC2((Validar dados))
        UC3((Notificar confirmacao))
        UC4((Atualizar agenda))
    end

    S --> UC1
    S --> UC2
    S --> UC3
    S --> UC4

```
