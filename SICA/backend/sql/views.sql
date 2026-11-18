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