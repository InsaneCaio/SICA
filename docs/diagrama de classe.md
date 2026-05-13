# Diagrama de Classe

```mermaid
classDiagram

class Cliente {
    +cpf: string
    +dataNascimento: date
    +convenio: string
}

class Dependente {
    +id: int
    +nome: string
}

Cliente <|-- Dependente
Cliente <|-- Principal


%% =======================
%% USUÁRIOS (HERANÇA)
%% =======================

class Usuario {
    +id: int
    +nome: string
    +email: string
    +senha: string
}

class Principal {
    +telefone
}

class Medico {
    +crm: string
    +especialidade: string
    +valorConsulta: double
    +diasAtend: Set<string>
    +horarioAtend: List<string>
}

class Administrador {
}

class Gestor {
}

Usuario <|-- Principal
Usuario <|-- Medico
Usuario <|-- Administrador
Usuario <|-- Gestor

%% =======================
%% CLIENTE (HERANÇA)
%% =======================



%% =======================
%% RELAÇÃO PACIENTE - DEPENDENTE
%% =======================

Principal "0..1" -- "0..1" Dependente : gerencia

class Clinica{
    +nome: string
    +cnpj: string
    +email: string
    +telefone: string
    +endereço: string
    +diasAtend: Set<string>
    +horarioAtend: List<string>
}

Administrador "0..1" -- "0..1" Clinica : administra
Gestor "0..*" -- "0..*" Assinatura : gerencia
Clinica "0..1" o-- "0..*" Medico
Clinica "0..1" *-- "0..*" Assinatura


%% =======================
%% AGENDAMENTO
%% =======================

class Consulta {
    +id: int
    +dataHora: datetime
    +status: string
}

Principal "1..1" -- "0..*" Consulta : agenda
Dependente "1..1" -- "0..*" Consulta : agenda
Medico "1..1" -- "0..*" Consulta : atende

%% =======================
%% PRONTUÁRIO
%% =======================

class Prontuario {
    +alergia: Set<string>
    +medicamento: List<string>
}

Consulta "0..*" -- "0..1" Prontuario



%% =======================
%% ASSINATURA / FINANCEIRO
%% =======================

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

Assinatura "1..1" *-- "1..*" Pagamento

%% =======================
%% RELATÓRIOS
%% =======================

class Relatorio {
    +id: int
    +tipo: string
    +dataGeracao: date
}

Gestor "1..1" --> "0..*" Relatorio
```
