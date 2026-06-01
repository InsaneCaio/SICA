# Casos de Uso - Médico

Este diagrama representa as interações do médico com o sistema de agendamento.

## Casos de uso
- Visualizar agenda
- Visualizar consulta
- Visualizar prontuário
- Cancelar consulta
- Enviar documentos médicos

## Diagrama
```mermaid
flowchart LR
    M[Medico]

    subgraph Sistema de Agendamento
        UC1((Visualizar agenda))
        UC2((Enviar documentos médicos))
        UC3((Visualizar consulta))
        UC4((Cancelar consulta))
        UC5((Visualizar prontuário))
    end

    M --> UC1
    M --> UC2
    M --> UC3
    M --> UC4
    M --> UC5
```
