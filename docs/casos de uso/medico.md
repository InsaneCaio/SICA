# Casos de Uso - Médico

Este diagrama representa as interações do médico com o sistema de agendamento.

## Casos de uso
- Visualizar agenda
- Enviar documentos médicos
- Visualizar consulta
- Visualizar prontuário

## Diagrama
```mermaid
flowchart LR
    M[Medico]

    subgraph Sistema de Agendamento
        UC1((Visualizar agenda))
        UC2((Enviar documentos médicos))
        UC3((Visualizar consulta))
        UC4((Visualizar prontuário))
    end

    M --> UC1
    M --> UC2
    M --> UC3
    M --> UC4
```
