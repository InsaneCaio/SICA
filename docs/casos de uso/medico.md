# Casos de Uso - Médico

Este diagrama representa as interações do médico com o sistema de agendamento.

## Casos de uso
- Visualizar agenda
- Editar agenda
- Consultar detalhes da consulta
- Cancelar consulta
- Anexar receitas e encaminhamentos
- Editar perfil médico

## Diagrama
```mermaid
flowchart LR
    M[Medico]

    subgraph Sistema de Agendamento
        UC1((Visualizar agenda))
        UC2((Editar agenda))
        UC3((Consultar detalhes da consulta))
        UC4((Cancelar consulta))
        UC5((Anexar receitas e encaminhamentos))
        UC6((Editar perfil medico))
    end

    M --> UC1
    M --> UC2
    M --> UC3
    M --> UC4
    M --> UC5
    M --> UC6
```
