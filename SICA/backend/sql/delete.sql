-- =============================================================================
-- LIMPEZA DE DADOS (ZERA REGISTROS E REINICIA AUTO-INCREMENTO)
-- =============================================================================

BEGIN;

TRUNCATE TABLE 
    consulta,
    dependente,
    horario_medico,
    medico_especialidade,
    especialidade,
    medico,
    funcionario,
    paciente,
    admin,
    usuario
RESTART IDENTITY CASCADE;

COMMIT;