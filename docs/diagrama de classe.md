# Diagrama de Classes
<img width="754" height="668" alt="class-diagram-basic" src="https://github.com/user-attachments/assets/20fd79cb-f910-4a35-a057-81a19ed2b1a7" />


# Código
``` plantuml
@startuml

skinparam classAttributeIconSize 0
skinparam linetype ortho

' ==================================================
' PESSOAS E HIERARQUIA DE USUÁRIOS
' ==================================================

class Usuario {
    - tipoUsuario: String
    - nome: String
    - email: String
    - senha: String
    - telefone: String
}

class Admin {
    - cpf: String
}

class Funcionario {
    - cpf: String
    - status: String
}

class Paciente {
    - cpf: String
    - dataNascimento: LocalDate
}

class Dependente {
    - cpf: String
    - nome: String
    - dataNascimento: LocalDate
}

class Medico {
    - crm: String
    - especialidade: List<String>
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
    - diaSemana: String
    - horaInicio: LocalTime
    - horaFim: LocalTime
    - intervaloMinutos: int
}

class Consulta {
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
