-- ============================================================================
-- SEED DE APRESENTAÇÃO — SICA
-- ============================================================================
--  Dados mínimos para demonstração ao vivo:
--    • 1 Administrador
--    • 2 Médicos  (Cardiologista + Clínica Médica)
--    • 1 Paciente (conta ativada)
--    • 2 Consultas (1 concluída + 1 agendada)
--
--  Senha padrão de todos os usuários: Demo@123
--  Hash bcrypt (cost 10): $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
--
--  IDs: 500+ para não colidir com o seed.sql principal
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. USUÁRIOS
-- ============================================================================
INSERT INTO usuario (id_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url)
VALUES
    -- Administrador
    (500, 'Admin Demo',
          'admin.demo@sica.com.br',
          '$2b$10$kBAfl0iVXrKN9/CADDdPKO6J1UbkXGM4KptoCz7xATz9ZNewHswuu',
          '(11) 99000-0001',
          'https://api.dicebear.com/7.x/avataaars/svg?seed=admindemo'),

    -- Médico 1 — Cardiologista
    (501, 'Dr. Bruno Carvalho',
          'bruno.carvalho@sica.com.br',
          '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          '(11) 99000-0002',
          'https://api.dicebear.com/7.x/avataaars/svg?seed=medicodemo1'),

    -- Médica 2 — Clínica Médica
    (502, 'Dra. Fernanda Lima',
          'fernanda.lima@sica.com.br',
          '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          '(11) 99000-0003',
          'https://api.dicebear.com/7.x/avataaars/svg?seed=medicodemo2'),

    -- Paciente
    (503, 'João Silva Santos',
          'joao.santos@gmail.com',
          '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          '(11) 99000-0004',
          'https://api.dicebear.com/7.x/avataaars/svg?seed=pacientedemo');


-- ============================================================================
-- 2. ADMIN
--    CPF: 529.982.247-25  (válido)
-- ============================================================================
INSERT INTO admin (id_admin, id_usuario, cpf_admin)
VALUES (500, 500, '52998224725');


-- ============================================================================
-- 3. MÉDICOS
--    CPF Dr. Bruno:    500.000.002-13  (válido)
--    CPF Dra. Fernanda: 500.000.003-02 (válido)
-- ============================================================================
INSERT INTO medico (id_medico, crm, id_usuario, sobre_medico, valor_consulta, status_medico)
VALUES
    (500,
     '12345-SP',
     501,
     'Especialista em Cardiologia com 12 anos de experiência. Formado pela USP com residência no InCor. Atendimento humanizado e focado na prevenção cardiovascular.',
     250.00,
     'ATIVO'),

    (501,
     '67890-RJ',
     502,
     'Especialista em Clínica Médica e Medicina de Família. Mestre em Saúde Coletiva pela UFRJ. Comprometida com a saúde integral e o bem-estar dos pacientes.',
     200.00,
     'ATIVO');


-- ============================================================================
-- 4. ESPECIALIDADES (ON CONFLICT para não duplicar caso já existam)
-- ============================================================================
INSERT INTO especialidade (nome_especialidade)
VALUES
    ('Acupuntura'),
    ('Alergia e imunologia'),
    ('Anestesiologia'),
    ('Angiologia'),
    ('Cardiologia'),
    ('Cirurgia cardiovascular'),
    ('Cirurgia da mão'),
    ('Cirurgia de cabeça e pescoço'),
    ('Cirurgia do aparelho digestivo'),
    ('Cirurgia geral'),
    ('Cirurgia oncológica'),
    ('Cirurgia pediátrica'),
    ('Cirurgia plástica'),
    ('Cirurgia torácica'),
    ('Cirurgia vascular'),
    ('Clínica médica'),
    ('Coloproctologia'),
    ('Dermatologia'),
    ('Endocrinologia e metabologia'),
    ('Endoscopia'),
    ('Gastroenterologia'),
    ('Genética médica'),
    ('Geriatria'),
    ('Ginecologia e obstetrícia'),
    ('Hematologia e hemoterapia'),
    ('Homeopatia'),
    ('Infectologia'),
    ('Mastologia'),
    ('Medicina de emergência'),
    ('Medicina de família e comunidade'),
    ('Medicina do trabalho'),
    ('Medicina do tráfego'),
    ('Medicina esportiva'),
    ('Medicina física e reabilitação'),
    ('Medicina intensiva'),
    ('Medicina legal e perícia médica'),
    ('Medicina nuclear'),
    ('Medicina preventiva e social'),
    ('Nefrologia'),
    ('Neurocirurgia'),
    ('Neurologia'),
    ('Nutrologia'),
    ('Oftalmologia'),
    ('Oncologia clínica'),
    ('Ortopedia e traumatologia'),
    ('Otorrinolaringologia'),
    ('Patologia'),
    ('Patologia clínica/medicina laboratorial'),
    ('Pediatria'),
    ('Pneumologia'),
    ('Psiquiatria'),
    ('Radiologia e diagnóstico por imagem'),
    ('Radioterapia'),
    ('Reumatologia'),
    ('Urologia')
ON CONFLICT (nome_especialidade) DO NOTHING;


-- ============================================================================
-- 5. MÉDICO_ESPECIALIDADE
-- ============================================================================
INSERT INTO medico_especialidade (id_medico, id_especialidade)
VALUES
    (500, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Cardiologia')),
    (501, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Clínica médica'));


-- ============================================================================
-- 6. HORÁRIOS DOS MÉDICOS
-- ============================================================================
INSERT INTO horario_medico (id_horario, id_medico, dia_semana, hora_inicio, hora_fim, intervalo_minutos, duracao_minutos)
VALUES
    (500, 500, 'SEGUNDA', '08:00', '12:00', 10, 30),
    (501, 500, 'QUARTA',  '08:00', '12:00', 10, 30),
    (502, 500, 'SEXTA',   '14:00', '18:00', 10, 30),
    (503, 501, 'TERCA',   '09:00', '17:00', 15, 40),
    (504, 501, 'QUINTA',  '09:00', '17:00', 15, 40),
    (505, 501, 'SEXTA',   '14:00', '18:00', 15, 40);


-- ============================================================================
-- 7. PACIENTE
--    CPF: 500.000.004-85  (válido)
-- ============================================================================
INSERT INTO paciente (id_paciente, id_usuario, cpf_paciente, data_nascimento_paciente, conta_ativada)
VALUES (500, 503, '50000000485', '1990-06-15', TRUE);


-- ============================================================================
-- 8. CONSULTAS
--    #500 — João com Dr. Bruno  → CONCLUÍDA  (10/11/2026 09h)
--    #501 — João com Dra. Fernanda → AGENDADA (05/12/2026 10h)
-- ============================================================================
INSERT INTO consulta (id_consulta, id_paciente, id_dependente, id_medico,
                      data_inicio_consulta,    data_fim_consulta,
                      valor_pago, status_consulta)
VALUES
    (500, 500, NULL, 500,
     '2026-11-27 15:00:00', '2026-11-27 15:30:00',
     250.00, 'AGENDADA'),

    (501, 500, NULL, 501,
     '2026-11-27 15:30:00', '2026-11-27 16:10:00',
     200.00, 'AGENDADA');


-- ============================================================================
-- 9. SINCRONIZAR SEQUÊNCIAS
-- ============================================================================
SELECT setval(pg_get_serial_sequence('usuario',        'id_usuario'),       (SELECT MAX(id_usuario)       FROM usuario));
SELECT setval(pg_get_serial_sequence('admin',          'id_admin'),         (SELECT MAX(id_admin)         FROM admin));
SELECT setval(pg_get_serial_sequence('medico',         'id_medico'),        (SELECT MAX(id_medico)        FROM medico));
SELECT setval(pg_get_serial_sequence('especialidade',  'id_especialidade'), (SELECT MAX(id_especialidade) FROM especialidade));
SELECT setval(pg_get_serial_sequence('horario_medico', 'id_horario'),       (SELECT MAX(id_horario)       FROM horario_medico));
SELECT setval(pg_get_serial_sequence('paciente',       'id_paciente'),      (SELECT MAX(id_paciente)      FROM paciente));
SELECT setval(pg_get_serial_sequence('consulta',       'id_consulta'),      (SELECT MAX(id_consulta)      FROM consulta));

COMMIT;
