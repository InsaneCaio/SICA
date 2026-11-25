# Diagrama de Classes
<img width="754" height="668" alt="image" src="https://github.com/user-attachments/assets/7ba7ee74-9990-47c7-b5f9-336a10ac4b83" />

# Código
``` plantuml
@startuml

skinparam classAttributeIconSize 0
skinparam linetype ortho

' ==================================================
' PESSOAS E HIERARQUIA DE USUÁRIOS
' ==================================================

class Usuario {
    - id: int
    - tipoUsuario: String
    - nome: String
    - email: String
    - senha: String
    - telefone: String
}

class Admin {
    - id: int
    - cpf: String
}

class Funcionario {
    - id: int
    - cpf: String
    - status: String
}

class Paciente {
    - id: int
    - cpf: String
    - dataNascimento: LocalDate
}

class Dependente {
    - id: int
    - cpf: String
    - nome: String
    - dataNascimento: LocalDate
}

class Medico {
    - id: int
    - crm: String
    - especialidade: List<String>
    - especialidade: String
    - sobre: String
    - valorConsulta: Double
    - status: String
}

' HERANÇA
Usuario <|-- Admin
Usuario <|-- Funcionario
Usuario <|-- Paciente
Usuario <|-- Medico

' RELACIONAMENTO DE DEPENDÊNCIA
Paciente "1" *-- "0..*" Dependente : possui

' ==================================================
' AGENDAMENTO E ATENDIMENTO
' ==================================================

class HorarioMedico {
    - id: int
    - diaSemana: String
    - horaInicio: LocalTime
    - horaFim: LocalTime
    - intervaloMinutos: int
}

class Consulta {
    - id: int
    - dataConsulta: LocalDateTime
    - valorPago: Double
    - status: String
}

' RELACIONAMENTOS DE CONSULTA E HORÁRIOS
Medico "1" *-- "0..*" HorarioMedico : disponibiliza
Paciente "1" -- "0..*" Consulta : solicita
Dependente "0..1" -- "0..*" Consulta : realiza
Medico "1" -- "0..*" Consulta : atende

@enduml
