-- =============================================================================
-- DROP DAS TABELAS (REMOVE A ESTRUTURA DO BANCO)
-- =============================================================================

BEGIN;

DROP TABLE IF EXISTS consulta CASCADE;
DROP TABLE IF EXISTS dependente CASCADE;
DROP TABLE IF EXISTS horario_medico CASCADE;
DROP TABLE IF EXISTS medico_especialidade CASCADE;
DROP TABLE IF EXISTS especialidade CASCADE;
DROP TABLE IF EXISTS medico CASCADE;
DROP TABLE IF EXISTS funcionario CASCADE;
DROP TABLE IF EXISTS paciente CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- Opcional: remover a extensão btree_gist caso queira resetar 100%
-- DROP EXTENSION IF EXISTS btree_gist CASCADE;

COMMIT;