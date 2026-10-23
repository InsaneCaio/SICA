# Diagrama de Classes
<img width="714" height="735" alt="fLNDRjf04BuZyGuhBf4Y4QLNr4fPOQTO0fjYU831teHHrxlMxhfIq_RGKwM-5Y_MCM0mnf3G-EITdVdcv_l6Vh0EZ2iosUrqE_OhgXmCP2oHO2rtpk2oS298j8hnHR3xkez49TptN31jt4gNyJViqzLF6JNrupZYCVFPAF1dVFPb4N3c-MmHBzQ_Pq4K_ozqjxDfX2ri0GOr-z7jC7hw3D" src="https://github.com/user-attachments/assets/601426ff-8270-476b-b900-a0059f33f4f0" />

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
