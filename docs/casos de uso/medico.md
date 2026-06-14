# Casos de Uso - Médico

Este diagrama representa as interações do médico com o sistema de agendamento.

## Casos de uso
- Visualizar agenda
- Visualizar consulta
- Visualizar prontuário
- Enviar documentos médicos

## Diagrama
```mermaid
flowchart LR
    M[Medico]

    subgraph Sistema de Agendamento
        UC1((Visualizar agenda))
        UC2((Visualizar consulta))
        UC3((Visualizar prontuário))
        UC4((Enviar documentos médicos))
    end

    M --> UC1
    M --> UC2
    M --> UC3
    M --> UC4
```
