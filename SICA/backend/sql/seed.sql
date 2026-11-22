BEGIN;

-- ============================================================================
-- 0. LIMPEZA COMPLETA COM RESET DE SEQUÊNCIAS
-- ============================================================================
TRUNCATE TABLE consulta, dependente, paciente, horario_medico, 
               medico_especialidade, medico, funcionario, admin, 
               usuario, especialidade RESTART IDENTITY CASCADE;

-- ============================================================================
-- FUNÇÃO AUXILIAR TEMPORÁRIA: GERA CPFs COM DÍGITOS 100% VÁLIDOS
-- ============================================================================
CREATE OR REPLACE FUNCTION pg_temp.gerar_cpf(p_num INT)
RETURNS VARCHAR(11) AS $$
DECLARE
    v_base VARCHAR(9);
    v_soma INT := 0;
    v_resto INT;
    v_d1 INT;
    v_d2 INT;
    i INT;
BEGIN
    v_base := lpad(p_num::text, 9, '0');
    FOR i IN 1..9 LOOP
        v_soma := v_soma + (substring(v_base, i, 1)::int * (11 - i));
    END LOOP;
    v_resto := (v_soma * 10) % 11;
    IF v_resto = 10 THEN v_resto := 0; END IF;
    v_d1 := v_resto;
    
    v_soma := 0;
    FOR i IN 1..9 LOOP
        v_soma := v_soma + (substring(v_base, i, 1)::int * (12 - i));
    END LOOP;
    v_soma := v_soma + (v_d1 * 2);
    v_resto := (v_soma * 10) % 11;
    IF v_resto = 10 THEN v_resto := 0; END IF;
    v_d2 := v_resto;
    
    RETURN v_base || v_d1::text || v_d2::text;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 1. ESPECIALIDADES (35 registros com IDs fixos 1..35)
-- ============================================================================
INSERT INTO especialidade (id_especialidade, nome_especialidade) VALUES
(1, 'Cardiologia'), (2, 'Dermatologia'), (3, 'Ortopedia'), (4, 'Pediatria'), (5, 'Ginecologia e Obstetrícia'),
(6, 'Neurologia'), (7, 'Psiquiatria'), (8, 'Oftalmologia'), (9, 'Endocrinologia'), (10, 'Otorrinolaringologia'),
(11, 'Urologia'), (12, 'Gastroenterologia'), (13, 'Pneumologia'), (14, 'Reumatologia'), (15, 'Infectologia'),
(16, 'Cirurgia Geral'), (17, 'Nefrologia'), (18, 'Geriatria'), (19, 'Oncologia'), (20, 'Hematologia'),
(21, 'Alergologia e Imunologia'), (22, 'Anestesiologia'), (23, 'Angiologia'), (24, 'Cirurgia Plástica'), (25, 'Coloproctologia'),
(26, 'Mastologia'), (27, 'Medicina de Família'), (28, 'Medicina do Trabalho'), (29, 'Medicina Esportiva'), (30, 'Neurocirurgia'),
(31, 'Nutrologia'), (32, 'Patologia'), (33, 'Radiologia'), (34, 'Cirurgia Vascular'), (35, 'Fisiatria');


-- ============================================================================
-- 2. USUÁRIOS (135 registros com IDs fixos 1..135)
-- Senha padrão para todos: "Mudar@123"
-- ============================================================================
DO $$
DECLARE
    v_senha CONSTANT VARCHAR(255) := '$2b$10$EPVp8D4RskWq0Q.W4i9kbuVpWqNlZ5eDmgN4K4w8g9C6a4/9N0t2G';
    v_nomes_admin TEXT[] := ARRAY[
        'Ana Paula Ferreira', 'Carlos Eduardo Lima', 'Mariana Ribeiro Alves', 'Roberto Carlos Silva', 'Fernanda Souza Costa',
        'Lucas Gabriel Santos', 'Juliana Rocha Mendes', 'Ricardo Dias Barreto', 'Beatriz Martins Duarte', 'Marcelo Vieira Pires',
        'Camila Nogueira Neves', 'Thiago Henrique Gomes', 'Patricia Borges Faria', 'Gustavo Henrique Leite', 'Larissa Azevedo Reis',
        'Diego Franco Macedo', 'Bruna Rafaela Castro', 'Eduardo Silveira Ramos', 'Vanessa Toledo Bueno', 'Fabio Junior Esteves',
        'Renata Peixoto Prado', 'Alexandre Pinto Cunha', 'Monique Caldeira Lins', 'Rodrigo Magalhaes Vaz', 'Tatiane Queiroz Cruz',
        'Vitor Hugo Fonseca', 'Debora Meireles Teles', 'Leandro Antunes Paiva', 'Aline Brandao Siqueira', 'Caio Cesar Guimaraes'
    ];
    v_nomes_func TEXT[] := ARRAY[
        'Sandra Helena Dias', 'Marcos Vinicius Maia', 'Simone Cristina Viana', 'Paulo Sergio Matos', 'Cristina Amaral Porto',
        'Flavio Augusto Braga', 'Claudia Regina Seixas', 'Anderson Luis Dantas', 'Rosana Mara Pinheiro', 'Sergio Murilo Loyola',
        'Eliane Aparecida Morais', 'Mauricio Jose Salgado', 'Luciana Mara Chaves', 'Rogerio Valadares Bessa', 'Daniela Carla Fontes',
        'Andre Luiz Campelo', 'Adriana Soares Godoy', 'Denis Carvalho Aguiar', 'Gisele Miranda Frota', 'Wellington Paes Leme',
        'Silvia Leticia Arantes', 'Renato Garcia Muniz', 'Marta Sueli Botelho', 'Claudio Manoel Vilar', 'Tania Mara Coimbra',
        'Helio Rubens Saraiva', 'Cintia Valente Dornas', 'Marcio Andre Feitosa', 'Valeria Gusmao Caldas', 'Gilberto Gil Novaes'
    ];
    v_nomes_med TEXT[] := ARRAY[
        'Dr. Rodolfo Neves', 'Dra. Camila Albuquerque', 'Dr. Henrique Vasconcelos', 'Dra. Patricia Medeiros', 'Dr. Fernando Peixoto',
        'Dra. Helena Gusmao', 'Dr. Sergio Barcellos', 'Dra. Leticia Antunes', 'Dr. Renato Figueiredo', 'Dra. Bianca Bittencourt',
        'Dr. Otavio Sampaio', 'Dra. Mariana Fontenele', 'Dr. Leonardo Castilho', 'Dra. Gabriela Rezende', 'Dr. Daniel Guimaraes',
        'Dra. Carolina Mendonca', 'Dr. Marcelo Benevides', 'Dra. Larissa Holanda', 'Dr. Arthur Silveira', 'Dra. Vivian Queiroz',
        'Dr. Murilo Alcantara', 'Dra. Isabela Fontes', 'Dr. Bruno Campedelli', 'Dra. Amanda Portela', 'Dr. Rodrigo Montenegro',
        'Dra. Clarissa Vilarinho', 'Dr. Vinicius Sanches', 'Dra. Priscila Padilha', 'Dr. Guilherme Junqueira', 'Dra. Natalia Bezerra',
        'Dr. Igor Cavalcante', 'Dra. Alice Marinho', 'Dr. Felipe Boaventura', 'Dra. Rafaela Alencar', 'Dr. Cesar Augusto Prado'
    ];
    v_nomes_pac TEXT[] := ARRAY[
        'Joao Pedro Alencar', 'Maria Eduarda Freitas', 'Gabriel Henrique Sales', 'Sophia Helena Moreira', 'Matheus Felipe Cunha',
        'Laura Beatriz Pimentel', 'Enzo Gabriel Fagundes', 'Valentina Rossini Assis', 'Guilherme Augusto Diniz', 'Heloisa Helena Furtado',
        'Nicolas Martins Lacerda', 'Lorena Cristina Paixao', 'Samuel Victorino Rios', 'Livia Maria Marcondes', 'Benjamin Carvalho Maia',
        'Manuela Esteves Garcia', 'Davi Lucca Bernardes', 'Cecilia Andrade Prado', 'Pedro Henrique Maciel', 'Eloah Victoria Godinho',
        'Joaquim Barbosa Teles', 'Antonella Figueira Paz', 'Samuel Levi Carrijo', 'Mirella Bastos Toledo', 'Bryan Lucas Cerqueira',
        'Isis Fernanda Trindade', 'Theo Henrique Valente', 'Ayla Cristina Campolina', 'Isaac Newton Silveira', 'Maysa Gabriela Dornas',
        'Anthony Gabriel Froes', 'Agatha Beatriz Fontoura', 'Emanuel de Freitas Souza', 'Yasmin Gabrielle Vilela', 'Bento Silva Sarmento',
        'Clarice Lispector Brandao', 'Ravi Lucca Meirelles', 'Lavinia Bianca Portilho', 'Gael Vicente Casagrande', 'Stella Maris Resende'
    ];
    i INT;
BEGIN
    -- 1 a 30: ADMINS
    FOR i IN 1..30 LOOP
        INSERT INTO usuario (id_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url)
        VALUES (
            i,
            v_nomes_admin[i],
            'admin' || i || '@sica.com.br',
            v_senha,
            '(11) 9' || lpad((80000000 + i)::text, 8, '0'),
            'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' || i
        );
    END LOOP;

    -- 31 a 60: FUNCIONÁRIOS
    FOR i IN 1..30 LOOP
        INSERT INTO usuario (id_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url)
        VALUES (
            30 + i,
            v_nomes_func[i],
            'funcionario' || i || '@sica.com.br',
            v_senha,
            '(11) 9' || lpad((70000000 + i)::text, 8, '0'),
            'https://api.dicebear.com/7.x/avataaars/svg?seed=func' || i
        );
    END LOOP;

    -- 61 a 95: MÉDICOS
    FOR i IN 1..35 LOOP
        INSERT INTO usuario (id_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url)
        VALUES (
            60 + i,
            v_nomes_med[i],
            'medico' || i || '@sica.com.br',
            v_senha,
            '(11) 9' || lpad((60000000 + i)::text, 8, '0'),
            'https://api.dicebear.com/7.x/avataaars/svg?seed=medico' || i
        );
    END LOOP;

    -- 96 a 135: PACIENTES
    FOR i IN 1..40 LOOP
        INSERT INTO usuario (id_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url)
        VALUES (
            95 + i,
            v_nomes_pac[i],
            'paciente' || i || '@gmail.com',
            v_senha,
            '(15) 9' || lpad((50000000 + i)::text, 8, '0'),
            'https://api.dicebear.com/7.x/avataaars/svg?seed=paciente' || i
        );
    END LOOP;
END $$;


-- ============================================================================
-- 3. ADMIN (30 registros com IDs 1..30 e id_usuario 1..30)
-- ============================================================================
INSERT INTO admin (id_admin, id_usuario, cpf_admin)
SELECT 
    id,
    id,
    pg_temp.gerar_cpf(100000000 + id)
FROM generate_series(1, 30) AS id;


-- ============================================================================
-- 4. FUNCIONÁRIO (30 registros com IDs 1..30 e id_usuario 31..60)
-- ============================================================================
INSERT INTO funcionario (id_funcionario, id_usuario, cpf_funcionario, status_funcionario)
SELECT 
    id - 30,
    id,
    pg_temp.gerar_cpf(200000000 + id),
    CASE WHEN id % 5 = 0 THEN 'INATIVO' ELSE 'ATIVO' END
FROM generate_series(31, 60) AS id;


-- ============================================================================
-- 5. MÉDICO (35 registros com IDs 1..35 e id_usuario 61..95)
-- ============================================================================
INSERT INTO medico (id_medico, crm, id_usuario, sobre_medico, valor_consulta, status_medico)
SELECT 
    id - 60,
    lpad((10000 + (id - 60))::text, 5, '0') || '-' || 
    (ARRAY['SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'BA', 'DF', 'ES', 'GO'])[(id % 10) + 1],
    id,
    'Médico especialista com mais de ' || (5 + (id % 20)) || ' anos de experiência em atendimento clínico humanizado.',
    200.00 + ((id % 12) * 50.00),
    CASE WHEN id IN (65, 80) THEN 'INATIVO' ELSE 'ATIVO' END
FROM generate_series(61, 95) AS id;


-- ============================================================================
-- 6. MÉDICO_ESPECIALIDADE (45 registros)
-- ============================================================================
INSERT INTO medico_especialidade (id_medico, id_especialidade)
SELECT id, ((id - 1) % 35) + 1 FROM generate_series(1, 35) AS id;

INSERT INTO medico_especialidade (id_medico, id_especialidade)
SELECT id, (((id - 1) + 7) % 35) + 1 FROM generate_series(1, 10) AS id;


-- ============================================================================
-- 7. HORÁRIO_MÉDICO (50 registros)
-- ============================================================================
INSERT INTO horario_medico (id_horario, id_medico, dia_semana, hora_inicio, hora_fim, intervalo_minutos, duracao_minutos) VALUES
(1,  1,  'SEGUNDA', '08:00', '12:00', 10, 30),
(2,  1,  'TERCA',   '13:00', '18:00', 0,  40),
(3,  1,  'QUARTA',  '08:00', '12:00', 10, 30),
(4,  2,  'SEGUNDA', '09:00', '17:00', 15, 45),
(5,  2,  'QUINTA',  '09:00', '17:00', 15, 45),
(6,  3,  'TERCA',   '08:00', '12:00', 0,  30),
(7,  3,  'QUARTA',  '14:00', '19:00', 10, 50),
(8,  4,  'SEGUNDA', '08:00', '13:00', 0,  30),
(9,  4,  'SEXTA',   '08:00', '13:00', 0,  30),
(10, 5,  'QUARTA',  '13:00', '18:00', 15, 30),
(11, 5,  'QUINTA',  '13:00', '18:00', 15, 30),
(12, 6,  'SEGUNDA', '08:00', '16:00', 30, 60),
(13, 6,  'TERCA',   '08:00', '12:00', 0,  30),
(14, 7,  'SEXTA',   '08:00', '18:00', 10, 30),
(15, 7,  'SABADO',  '08:00', '12:00', 0,  30),
(16, 8,  'SEGUNDA', '10:00', '16:00', 0,  40),
(17, 8,  'QUINTA',  '10:00', '16:00', 0,  40),
(18, 9,  'TERCA',   '08:00', '13:00', 0,  30),
(19, 9,  'QUARTA',  '08:00', '13:00', 0,  30),
(20, 10, 'SEXTA',  '13:00', '19:00', 15, 45),
(21, 11, 'SEGUNDA', '08:00', '18:00', 10, 40),
(22, 11, 'TERCA',   '14:00', '18:00', 0,  40),
(23, 12, 'QUINTA',  '08:00', '12:00', 0,  30),
(24, 13, 'SEGUNDA', '13:00', '17:00', 0,  30),
(25, 14, 'TERCA',   '08:00', '12:00', 10, 30),
(26, 15, 'QUARTA',  '10:00', '15:00', 0,  60),
(27, 16, 'SEXTA',   '08:00', '12:00', 15, 45),
(28, 17, 'SEGUNDA', '14:00', '18:00', 0,  30),
(29, 18, 'TERCA',   '09:00', '17:00', 20, 40),
(30, 19, 'QUARTA',  '08:00', '12:00', 0,  30),
(31, 20, 'QUINTA',  '13:00', '18:00', 10, 30),
(32, 21, 'SEXTA',   '08:00', '12:00', 0,  30),
(33, 22, 'SABADO',  '08:00', '13:00', 0,  30),
(34, 23, 'SEGUNDA', '08:00', '17:00', 15, 45),
(35, 24, 'TERCA',   '13:00', '18:00', 0,  30),
(36, 25, 'QUARTA',  '08:00', '14:00', 10, 40),
(37, 26, 'QUINTA',  '09:00', '17:00', 0,  60),
(38, 27, 'SEXTA',   '08:00', '12:00', 15, 30),
(39, 28, 'SEGUNDA', '13:00', '19:00', 0,  45),
(40, 29, 'TERCA',   '08:00', '12:00', 0,  30),
(41, 30, 'QUARTA',  '14:00', '18:00', 10, 30),
(42, 31, 'QUINTA',  '08:00', '12:00', 0,  30),
(43, 32, 'SEXTA',   '13:00', '17:00', 0,  30),
(44, 33, 'SEGUNDA', '08:00', '15:00', 15, 45),
(45, 34, 'TERCA',   '10:00', '16:00', 0,  40),
(46, 35, 'QUARTA',  '08:00', '12:00', 0,  30),
(47, 1,  'SEXTA',   '14:00', '18:00', 0,  30),
(48, 2,  'TERCA',   '08:00', '12:00', 10, 30),
(49, 11, 'QUARTA',  '08:00', '12:00', 0,  40),
(50, 12, 'SEXTA',   '14:00', '18:00', 10, 30);


-- ============================================================================
-- 8. PACIENTE (40 registros com IDs 1..40 e id_usuario 96..135)
-- ============================================================================
INSERT INTO paciente (id_paciente, id_usuario, cpf_paciente, data_nascimento_paciente, conta_ativada)
SELECT 
    id - 95,
    id,
    pg_temp.gerar_cpf(300000000 + id),
    (DATE '1960-01-01' + ((id * 389) % 18000))::DATE,
    CASE WHEN id % 2 = 0 THEN TRUE ELSE FALSE END
FROM generate_series(96, 135) AS id;


-- ============================================================================
-- 9. DEPENDENTE (35 registros com IDs 1..35 e id_paciente 1..35)
-- ============================================================================
INSERT INTO dependente (id_dependente, id_paciente, cpf_dependente, nome_dependente, data_nascimento_dependente) VALUES
(1,  1,  pg_temp.gerar_cpf(400000001), 'Enzo Gabriel Alencar',       '2018-04-12'),
(2,  2,  pg_temp.gerar_cpf(400000002), 'Arthur Freitas Lima',        '2015-01-05'),
(3,  3,  pg_temp.gerar_cpf(400000003), 'Helena Sales Moura',         '2020-11-23'),
(4,  4,  pg_temp.gerar_cpf(400000004), 'Bernardo Moreira Dias',      '2017-06-30'),
(5,  5,  pg_temp.gerar_cpf(400000005), 'Lorena Cunha Pires',         '2019-09-14'),
(6,  6,  pg_temp.gerar_cpf(400000006), 'Davi Pimentel Gomes',        '2014-03-22'),
(7,  7,  pg_temp.gerar_cpf(400000007), 'Luiza Fagundes Barreto',     '2022-02-10'),
(8,  8,  pg_temp.gerar_cpf(400000008), 'Joao Miguel Assis',          '2016-07-08'),
(9,  9,  pg_temp.gerar_cpf(400000009), 'Alice Diniz Lacerda',        '2019-12-01'),
(10, 10, pg_temp.gerar_cpf(400000010), 'Theo Furtado Castro',        '2021-05-17'),
(11, 11, pg_temp.gerar_cpf(400000011), 'Manuela Lacerda Pinto',      '2013-10-29'),
(12, 12, pg_temp.gerar_cpf(400000012), 'Noah Paixao Ramos',          '2023-01-15'),
(13, 13, pg_temp.gerar_cpf(400000013), 'Maya Rios Alcantara',        '2018-09-04'),
(14, 14, pg_temp.gerar_cpf(400000014), 'Gael Marcondes Rocha',       '2020-04-26'),
(15, 15, pg_temp.gerar_cpf(400000015), 'Sara Carvalho Toledo',       '2015-11-11'),
(16, 16, pg_temp.gerar_cpf(400000016), 'Murilo Esteves Siqueira',    '2017-08-07'),
(17, 17, pg_temp.gerar_cpf(400000017), 'Mirella Bernardes Cruz',     '2022-09-30'),
(18, 18, pg_temp.gerar_cpf(400000018), 'Ravi Andrade Teles',         '2023-06-02'),
(19, 19, pg_temp.gerar_cpf(400000019), 'Isabella Maciel Fonseca',    '2014-12-18'),
(20, 20, pg_temp.gerar_cpf(400000020), 'Caio Godinho Antunes',       '2016-02-27'),
(21, 21, pg_temp.gerar_cpf(400000021), 'Melissa Teles Meireles',     '2019-07-13'),
(22, 22, pg_temp.gerar_cpf(400000022), 'Joao Lucas Paz Queiroz',     '2021-10-05'),
(23, 23, pg_temp.gerar_cpf(400000023), 'Lara Carrijo Magalhaes',     '2018-03-09'),
(24, 24, pg_temp.gerar_cpf(400000024), 'Benicio Toledo Caldeira',    '2020-01-21'),
(25, 25, pg_temp.gerar_cpf(400000025), 'Emanuelly Cerqueira Lins',   '2015-05-16'),
(26, 26, pg_temp.gerar_cpf(400000026), 'Samuel Trindade Cunha',      '2017-11-03'),
(27, 27, pg_temp.gerar_cpf(400000027), 'Beatriz Valente Prado',      '2022-04-14'),
(28, 28, pg_temp.gerar_cpf(400000028), 'Matheus Campolina Esteves',  '2013-08-25'),
(29, 29, pg_temp.gerar_cpf(400000029), 'Maria Flor Silveira Bueno',  '2023-03-08'),
(30, 30, pg_temp.gerar_cpf(400000030), 'Felipe Dornas Ramos',        '2016-09-19'),
(31, 31, pg_temp.gerar_cpf(400000031), 'Ana Sophia Froes Castro',    '2019-04-02'),
(32, 32, pg_temp.gerar_cpf(400000032), 'Henrique Fontoura Macedo',   '2021-12-28'),
(33, 33, pg_temp.gerar_cpf(400000033), 'Maria Julia Souza Almeida',  '2018-06-15'),
(34, 34, pg_temp.gerar_cpf(400000034), 'Vicente Vilela Reis',        '2020-08-20'),
(35, 35, pg_temp.gerar_cpf(400000035), 'Clara Beatriz Alencar',      '2021-08-19');


-- ============================================================================
-- 10. CONSULTA (40 registros com IDs 1..40)
-- ============================================================================
INSERT INTO consulta (id_consulta, id_paciente, id_dependente, id_medico, data_inicio_consulta, data_fim_consulta, valor_pago, status_consulta) VALUES
(1,  1,  NULL, 1,  '2026-02-02 08:00:00', '2026-02-02 08:30:00', 250.00, 'CONCLUIDA'),
(2,  1,  1,    1,  '2026-02-02 08:40:00', '2026-02-02 09:10:00', 250.00, 'CONCLUIDA'),
(3,  2,  NULL, 2,  '2026-02-02 09:00:00', '2026-02-02 09:45:00', 300.00, 'CONCLUIDA'),
(4,  3,  NULL, 3,  '2026-02-03 08:00:00', '2026-02-03 08:30:00', 350.00, 'CONCLUIDA'),
(5,  4,  NULL, 4,  '2026-02-06 08:00:00', '2026-02-06 08:30:00', 400.00, 'CONCLUIDA'),
(6,  5,  NULL, 5,  '2026-02-11 13:00:00', '2026-02-11 13:30:00', 450.00, 'CONCLUIDA'),
(7,  6,  NULL, 6,  '2026-02-16 08:00:00', '2026-02-16 09:00:00', 500.00, 'CONCLUIDA'),
(8,  7,  NULL, 7,  '2026-02-20 08:00:00', '2026-02-20 08:30:00', 550.00, 'CONCLUIDA'),
(9,  8,  NULL, 8,  '2026-02-23 10:00:00', '2026-02-23 10:40:00', 600.00, 'CONCLUIDA'),
(10, 9,  NULL, 9,  '2026-02-24 08:00:00', '2026-02-24 08:30:00', 650.00, 'CONCLUIDA'),
(11, 10, NULL, 10, '2026-03-06 13:00:00', '2026-03-06 13:45:00', 700.00, 'CANCELADA'),
(12, 11, NULL, 11, '2026-03-09 08:00:00', '2026-03-09 08:40:00', 750.00, 'NAO_COMPARECEU'),
(13, 12, NULL, 12, '2026-03-12 08:00:00', '2026-03-12 08:30:00', 200.00, 'CANCELADA'),
(14, 13, NULL, 13, '2026-03-16 13:00:00', '2026-03-16 13:30:00', 250.00, 'NAO_COMPARECEU'),
(15, 14, NULL, 14, '2026-03-17 08:00:00', '2026-03-17 08:30:00', 300.00, 'CANCELADA'),
(16, 15, NULL, 15, '2026-04-01 10:00:00', '2026-04-01 11:00:00', 350.00, 'CONFIRMADA'),
(17, 16, NULL, 16, '2026-04-03 08:00:00', '2026-04-03 08:45:00', 400.00, 'CONFIRMADA'),
(18, 17, NULL, 17, '2026-04-06 14:00:00', '2026-04-06 14:30:00', 450.00, 'CONFIRMADA'),
(19, 18, NULL, 18, '2026-04-07 09:00:00', '2026-04-07 09:40:00', 500.00, 'CONFIRMADA'),
(20, 19, NULL, 19, '2026-04-08 08:00:00', '2026-04-08 08:30:00', 550.00, 'CONFIRMADA'),
(21, 20, NULL, 20, '2026-04-09 13:00:00', '2026-04-09 13:30:00', 600.00, 'CONFIRMADA'),
(22, 21, NULL, 21, '2026-04-10 08:00:00', '2026-04-10 08:30:00', 650.00, 'CONFIRMADA'),
(23, 22, NULL, 22, '2026-04-11 08:00:00', '2026-04-11 08:30:00', 700.00, 'CONFIRMADA'),
(24, 23, NULL, 23, '2026-04-13 08:00:00', '2026-04-13 08:45:00', 750.00, 'CONFIRMADA'),
(25, 24, NULL, 24, '2026-04-14 13:00:00', '2026-04-14 13:30:00', 200.00, 'CONFIRMADA'),
(26, 25, 25,   25, '2026-11-04 08:00:00', '2026-11-04 08:40:00', 250.00, 'AGENDADA'),
(27, 26, 26,   26, '2026-11-05 09:00:00', '2026-11-05 10:00:00', 300.00, 'AGENDADA'),
(28, 27, NULL, 27, '2026-11-06 08:00:00', '2026-11-06 08:30:00', 350.00, 'AGENDADA'),
(29, 28, NULL, 28, '2026-11-09 13:00:00', '2026-11-09 13:45:00', 400.00, 'AGENDADA'),
(30, 29, NULL, 29, '2026-11-10 08:00:00', '2026-11-10 08:30:00', 450.00, 'AGENDADA'),
(31, 30, NULL, 30, '2026-11-11 14:00:00', '2026-11-11 14:30:00', 500.00, 'AGENDADA'),
(32, 31, NULL, 31, '2026-11-12 08:00:00', '2026-11-12 08:30:00', 550.00, 'AGENDADA'),
(33, 32, NULL, 32, '2026-11-13 13:00:00', '2026-11-13 13:30:00', 600.00, 'AGENDADA'),
(34, 33, 33,   33, '2026-11-16 08:00:00', '2026-11-16 08:45:00', 650.00, 'AGENDADA'),
(35, 34, 34,   34, '2026-11-17 10:00:00', '2026-11-17 10:40:00', 700.00, 'AGENDADA'),
(36, 35, 35,   35, '2026-11-18 08:00:00', '2026-11-18 08:30:00', 750.00, 'AGENDADA'),
(37, 1,  NULL, 1,  '2026-11-20 14:00:00', '2026-11-20 14:30:00', 250.00, 'AGENDADA'),
(38, 2,  NULL, 2,  '2026-11-24 08:00:00', '2026-11-24 08:30:00', 300.00, 'AGENDADA'),
(39, 11, NULL, 11, '2026-11-24 14:00:00', '2026-11-24 14:40:00', 750.00, 'AGENDADA'),
(40, 11, NULL, 11, '2026-11-24 14:40:00', '2026-11-24 15:20:00', 750.00, 'AGENDADA');


-- ============================================================================
-- 11. SINCRONIZAR SEQUÊNCIAS PARA NOVOS INSERTS NO SISTEMA
-- ============================================================================
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), (SELECT MAX(id_usuario) FROM usuario));
SELECT setval(pg_get_serial_sequence('admin', 'id_admin'), (SELECT MAX(id_admin) FROM admin));
SELECT setval(pg_get_serial_sequence('funcionario', 'id_funcionario'), (SELECT MAX(id_funcionario) FROM funcionario));
SELECT setval(pg_get_serial_sequence('medico', 'id_medico'), (SELECT MAX(id_medico) FROM medico));
SELECT setval(pg_get_serial_sequence('especialidade', 'id_especialidade'), (SELECT MAX(id_especialidade) FROM especialidade));
SELECT setval(pg_get_serial_sequence('horario_medico', 'id_horario'), (SELECT MAX(id_horario) FROM horario_medico));
SELECT setval(pg_get_serial_sequence('paciente', 'id_paciente'), (SELECT MAX(id_paciente) FROM paciente));
SELECT setval(pg_get_serial_sequence('dependente', 'id_dependente'), (SELECT MAX(id_dependente) FROM dependente));
SELECT setval(pg_get_serial_sequence('consulta', 'id_consulta'), (SELECT MAX(id_consulta) FROM consulta));

COMMIT;