<h1 align="center">SICA - Sistema Integrado para Clínicas e Agendamentos</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue?style=for-the-badge">
<img src="https://img.shields.io/badge/Plataforma-Mobile-green?style=for-the-badge">
<img src="https://img.shields.io/badge/Área-Saúde-red?style=for-the-badge">
<img src="https://img.shields.io/badge/Projeto-Acadêmico-orange?style=for-the-badge">
<img src="https://img.shields.io/github/license/InsaneCaio/eng-soft-2026-1?style=for-the-badge">
  <img src="https://img.shields.io/github/issues/InsaneCaio/eng-soft-2026-1?style=for-the-badge">
</p>

<p align="center">
  Aplicação mobile para agendamento e gerenciamento de consultas,<br>
  centralizando informações e facilitando a organização do usuário.
</p>

---

## ✦ Sobre o Projeto

O sistema foi desenvolvido com o objetivo de simplificar o processo de agendamento médico, permitindo que usuários encontrem rapidamente clínicas, médicos e horários disponíveis.

Além disso, oferece suporte à gestão de dependentes, envio de encaminhamentos e acompanhamento completo dos compromissos de saúde.

---

## ✦ Persona Principal

<div align="center">

<img src="https://github.com/user-attachments/assets/74cfe30f-3c5d-4cd7-802a-60854295352c" width="500"/>

**Maria Eduarda Oliveira**  
38 anos • Persona Primária  

</div>

<br>

Responsável por organizar a saúde da família, Maria enfrenta dificuldades com a falta de centralização das informações e com a gestão de múltiplos agendamentos.

**Principais necessidades:**
- Agendamento rápido e simples  
- Visualização clara de horários  
- Lembretes automáticos  

📄 [Ver todas as personas](docs/personas.md)

---

## ✦ Requisitos do Sistema

<div align="center">

### Funcionais

| ID   | Descrição |
|------|----------|
| RF01 | Listar clínicas próximas |
| RF04 | Listar médicos disponíveis |
| RF08 | Selecionar data e horário |
| RF11 | Confirmar agendamento |

### Não Funcionais

| ID    | Tipo        | Descrição |
|-------|------------|-----------|
| RNF01 | Segurança  | Criptografia de dados |
| RNF02 | Desempenho | Resposta em até 2s |
| RNF03 | Confiabilidade | Alta disponibilidade |

</div>

📄 [Ver requisitos completos](docs/requisitos.md)

---

## ✦ Casos de Uso

### Administrador

**Principais ações:**
- Gerenciar médicos  
- Controlar agenda  
- Reagendar e cancelar consultas  

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

📄 Acesse os casos de uso completos:
- [Administrador](docs/casos%20de%20uso/administrador.md)  
- [Médico](docs/casos%20de%20uso/medico.md)  
- [Cliente](docs/casos%20de%20uso/paciente.md)  
- [Sistema](docs/casos%20de%20uso/sistema.md)  

---

## ✦ Problemas Abordados

- Falta de organização de consultas
- Dependência de processos manuais  
- Dificuldade em visualizar horários disponíveis  
- Falta de lembretes eficientes  
- Informações descentralizadas  

---

## ✦ Tecnologias

O projeto foi planejado com foco em:

- Database Oracle 
- Expo.dev  

---

## ✦ Equipe

<div align="center">

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/InsaneCaio">
        <img src="https://github.com/InsaneCaio.png" width="100px;"><br>
        <sub><b>Caio Domingues</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/EmanuelAlmeida27">
        <img src="https://github.com/EmanuelAlmeida27.png" width="100px;"><br>
        <sub><b>Emanuel Almeida</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/gustavo-carvalh0">
        <img src="https://github.com/gustavo-carvalh0.png" width="100px;"><br>
        <sub><b>Gustavo Carvalho</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/PGLS87">
        <img src="https://github.com/PGLS87.png" width="100px;"><br>
        <sub><b>Paulo Guilherme</b></sub>
      </a>
    </td>
  </tr>
</table>

</div>

---

## ✦ Licença

Distribuído sob a licença MIT.  
📄 [Ver licença](LICENSE)
