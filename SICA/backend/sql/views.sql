CREATE VIEW vw_usuarios AS
SELECT 
    u.id_usuario,
    u.nome_usuario,
    u.email_usuario,
    u.telefone_usuario,
    u.foto_url,
    ARRAY_REMOVE(ARRAY[
        CASE WHEN a.id_admin IS NOT NULL THEN 'ADMIN' END,
        CASE WHEN f.id_funcionario IS NOT NULL THEN 'FUNCIONARIO' END,
        CASE WHEN m.id_medico IS NOT NULL THEN 'MEDICO' END,
        CASE WHEN p.id_paciente IS NOT NULL THEN 'PACIENTE' END
    ], NULL) AS papeis,
    COALESCE(a.cpf_admin, f.cpf_funcionario, p.cpf_paciente) AS cpf,
    m.crm
FROM usuario u
LEFT JOIN admin a ON a.id_usuario = u.id_usuario
LEFT JOIN funcionario f ON f.id_usuario = u.id_usuario
LEFT JOIN medico m ON m.id_usuario = u.id_usuario
LEFT JOIN paciente p ON p.id_usuario = u.id_usuario
ORDER BY u.id_usuario;




CREATE OR REPLACE VIEW vw_medicos AS
SELECT 
    m.id_medico,
    u.id_usuario,
    u.nome_usuario,
    u.email_usuario,
    u.telefone_usuario,
    u.foto_url,
    m.crm,
    m.sobre_medico,
    m.valor_consulta,
    m.status_medico,
    -- Array com as especialidades
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', e.id_especialidade,
                'nome', e.nome_especialidade
            )
        ) FILTER (WHERE e.id_especialidade IS NOT NULL),
        '[]'::json
    ) AS especialidades,
    -- Array com os horários e dias de atendimento
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id_horario', h.id_horario,
                'dia_semana', h.dia_semana,
                'hora_inicio', h.hora_inicio,
                'hora_fim', h.hora_fim,
                'intervalo_minutos', h.intervalo_minutos,
                'duracao_minutos', h.duracao_minutos
            )
        ) FILTER (WHERE h.id_horario IS NOT NULL),
        '[]'::json
    ) AS horarios_atendimento
FROM medico m
INNER JOIN usuario u ON m.id_usuario = u.id_usuario
LEFT JOIN medico_especialidade me ON m.id_medico = me.id_medico
LEFT JOIN especialidade e ON me.id_especialidade = e.id_especialidade
LEFT JOIN horario_medico h ON m.id_medico = h.id_medico
GROUP BY 
    m.id_medico,
    u.id_usuario;




CREATE OR REPLACE VIEW vw_consultas AS
SELECT 
    -- Dados da Consulta
    c.id_consulta,
    c.data_inicio_consulta,
    c.data_fim_consulta,
    c.valor_pago,
    c.status_consulta,
    
    -- Quem será atendido (resolve se é o Titular ou Dependente)
    c.id_dependente,
    CASE 
        WHEN c.id_dependente IS NOT NULL THEN 'DEPENDENTE' 
        ELSE 'TITULAR' 
    END AS tipo_atendimento,
    COALESCE(d.nome_dependente, u_pac.nome_usuario) AS nome_paciente,
    COALESCE(d.cpf_dependente, pac.cpf_paciente) AS cpf_paciente,
    COALESCE(d.data_nascimento_dependente, pac.data_nascimento_paciente) AS data_nascimento_paciente,

    -- Dados do Titular / Contato para a clínica
    pac.id_paciente,
    u_pac.id_usuario AS id_usuario_titular,
    u_pac.nome_usuario AS nome_titular,
    u_pac.telefone_usuario AS telefone_contato,
    u_pac.email_usuario AS email_contato,
    u_pac.foto_url AS foto_paciente,

    -- Dados do Médico
    m.id_medico,
    u_med.id_usuario AS id_usuario_medico,
    u_med.nome_usuario AS nome_medico,
    m.crm,
    u_med.foto_url AS foto_medico,
    u_med.telefone_usuario AS telefone_medico,
    u_med.email_usuario AS email_medico,

    -- Especialidades do Médico (em formato JSON, igual na vw_medicos)
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', e.id_especialidade,
                'nome', e.nome_especialidade
            )
        ) FILTER (WHERE e.id_especialidade IS NOT NULL),
        '[]'::json
    ) AS especialidades_medico

FROM consulta c
INNER JOIN paciente pac ON c.id_paciente = pac.id_paciente
INNER JOIN usuario u_pac ON pac.id_usuario = u_pac.id_usuario
LEFT JOIN dependente d ON c.id_dependente = d.id_dependente
INNER JOIN medico m ON c.id_medico = m.id_medico
INNER JOIN usuario u_med ON m.id_usuario = u_med.id_usuario
LEFT JOIN medico_especialidade me ON m.id_medico = me.id_medico
LEFT JOIN especialidade e ON me.id_especialidade = e.id_especialidade
GROUP BY 
    c.id_consulta,
    pac.id_paciente,
    u_pac.id_usuario,
    d.id_dependente,
    m.id_medico,
    u_med.id_usuario
ORDER BY 
    c.data_inicio_consulta DESC;







CREATE OR REPLACE VIEW vw_pacientes AS
SELECT 
    p.id_paciente,
    u.id_usuario,
    u.nome_usuario AS nome,
    p.cpf_paciente AS cpf,
    u.email_usuario AS email,
    u.telefone_usuario AS telefone,
    p.data_nascimento_paciente AS data_nascimento,
    p.conta_ativada,
    u.foto_url,
    
    -- Array com os dependentes vinculados ao paciente (caso possua)
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id_dependente', d.id_dependente,
                'nome', d.nome_dependente,
                'cpf', d.cpf_dependente,
                'data_nascimento', d.data_nascimento_dependente
            )
        ) FILTER (WHERE d.id_dependente IS NOT NULL),
        '[]'::json
    ) AS dependentes

FROM paciente p
INNER JOIN usuario u ON p.id_usuario = u.id_usuario
LEFT JOIN dependente d ON p.id_paciente = d.id_paciente
GROUP BY 
    p.id_paciente,
    u.id_usuario
ORDER BY 
    u.nome_usuario;