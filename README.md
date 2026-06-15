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
  <br><br>
  <strong>Maria Eduarda Oliveira</strong><br>
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
| RF03 | Selecionar especialidade |
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

📄 Acesse os casos de uso completos:
- [Gestor](docs/casos%20de%20uso/gestor.md)
- [Administrador](docs/casos%20de%20uso/administrador.md)  
- [Médico](docs/casos%20de%20uso/medico.md)  
- [Cliente](docs/casos%20de%20uso/cliente.md)  
- [Sistema](docs/casos%20de%20uso/sistema.md)  

---
## ✦ Protótipo Final

<div align="center">
  <img src="https://github.com/InsaneCaio/eng-soft-2026-1/blob/main/docs/imagens%20prot%C3%B3tipo/img1.jpeg" width="300"/>
  <img src="https://github.com/InsaneCaio/eng-soft-2026-1/blob/main/docs/imagens%20prot%C3%B3tipo/img2.png" width="300"/>
</div>

<br>

### Acesse todas as telas do protótipo

- 👤 [Interface Cliente](https://stitch.withgoogle.com/projects/11329770657792360424)  
- 🛠️ [Interface Administrativa](https://stitch.withgoogle.com/projects/3155227529588405910)  
- 🧑‍⚕️ [Interface Médica](https://stitch.withgoogle.com/projects/4247148496098155792) 
- 📊 [Interface Gestor](https://stitch.withgoogle.com/projects/9086520015571938135)

---

## ✦ Diagrama de Classes

```mermaid
classDiagram

class USUARIO
class PACIENTE
class PRINCIPAL

USUARIO <|-- PRINCIPAL
PACIENTE <|-- PRINCIPAL




%% ==================================================
%% PESSOAS
%% ==================================================

class Usuario {
    +id: int
    +nome: string
    +email: string
    +senha: string
}

class Paciente {
    +cpf: string
    +dataNascimento: date
    +convenio: string
}


%% ==================================================
%% USUÁRIOS
%% ==================================================

class Principal {
    +telefone: string
}

class Medico {
    +crm: string
    +especialidade: string
    +valorConsulta: double
    +diasAtend: Set~string~
    +horarioAtend: List~string~
}

class Administrador

class Gestor

Usuario <|-- Medico
Usuario <|-- Administrador
Usuario <|-- Gestor

%% ==================================================
%% PACIENTES
%% ==================================================

class Paciente

class Dependente{
    +id: int
    +nome: string
}

Paciente <|-- Principal
Paciente <|-- Dependente

Principal "1..1" *-- "0..*" Dependente

%% ==================================================
%% ATENDIMENTO
%% ==================================================

class Consulta {
    +id: int
    +dataHora: datetime
    +status: string
}

class Prontuario {
    +alergia: Set~string~
    +medicamento: List~string~
    +obs: string
}

Paciente "0..1" -- "0..*" Consulta : agenda

Medico "0..1" -- "0..*" Consulta : atende

Paciente "1..1" *-- "1..1" Prontuario

Consulta "0..*" --> "1..1" Prontuario

%% ==================================================
%% CLÍNICA
%% ==================================================

class Clinica {
    +nome: string
    +cnpj: string
    +email: string
    +telefone: string
    +endereco: string
    +diasAtend: Set~string~
    +horarioAtend: List~string~
}

Administrador "1..1" -- "0..1" Clinica : administra

Clinica "0..*" -- "0..*" Medico

%% ==================================================
%% FINANCEIRO
%% ==================================================

class Assinatura {
    +id: int
    +plano: string
    +status: string
}

class Pagamento {
    +id: int
    +valor: float
    +data: date
}

Clinica "1..1" *-- "0..*" Assinatura

Assinatura "1..1" *-- "1..*" Pagamento

Gestor "0..*" -- "0..*" Assinatura : gerencia

%% ==================================================
%% RELATÓRIOS
%% ==================================================

class Relatorio {
    +id: int
    +tipo: string
    +dataGeracao: date
}

Gestor "1..1" --> "0..*" Relatorio : gera
```


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
- Visual Studio 2022

---

## ✦ Vídeos do Projeto

- 🎥 Vídeo Parcial: https://www.youtube.com/watch?v=061SmmCakYc
- 🎥 Vídeo Final: https://www.youtube.com/watch?v=gcqeSQ4xo2w

---

## ✦ Proposta

📄 https://github.com/InsaneCaio/eng-soft-2026-1/blob/main/docs/SICA%20-%20Proposta.pdf

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
