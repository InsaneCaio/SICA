-- =============================================================================
-- SEED SICA - 20+ REGISTROS POR TABELA
-- Senha padrão para todos os usuários: Senha@123
-- =============================================================================

BEGIN;

-- 1. ESPECIALIDADES (55 registros)
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


-- 2. USUARIOS (80 registros: 1-20 Admin, 21-40 Func, 41-60 Médico, 61-80 Paciente)
INSERT INTO usuario (id_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url)
VALUES
    -- Admins (1 a 20)
    (1,  'Carlos Alberto Silva',     'admin01@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'),
    (2,  'Mariana Souza Dias',       'admin02@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000002', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'),
    (3,  'Rodrigo Gomes Ferreira',   'admin03@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000003', NULL),
    (4,  'Patricia Lima Santos',     'admin04@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000004', NULL),
    (5,  'Felipe Macedo Rocha',      'admin05@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000005', NULL),
    (6,  'Juliana Barbosa Cruz',     'admin06@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000006', NULL),
    (7,  'Thiago Monteiro Neves',    'admin07@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000007', NULL),
    (8,  'Camila Ribeiro Prado',     'admin08@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000008', NULL),
    (9,  'Lucas Vasconcelos',        'admin09@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000009', NULL),
    (10, 'Beatriz Cardoso Leite',    'admin10@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000010', NULL),
    (11, 'Guilherme Castro Alves',   'admin11@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000011', NULL),
    (12, 'Larissa Antunes Pires',    'admin12@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000012', NULL),
    (13, 'Marcelo Cunha Tavares',    'admin13@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000013', NULL),
    (14, 'Fernanda Viana Borges',    'admin14@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000014', NULL),
    (15, 'Andre Ramos Guimaraes',    'admin15@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000015', NULL),
    (16, 'Renata Duarte Meireles',   'admin16@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000016', NULL),
    (17, 'Gustavo Peixoto Lins',     'admin17@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000017', NULL),
    (18, 'Aline Morais Fontes',      'admin18@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000018', NULL),
    (19, 'Leandro Farias Teles',     'admin19@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000019', NULL),
    (20, 'Daniela Camargo Bueno',    'admin20@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11981000020', NULL),

    -- Funcionários (21 a 40)
    (21, 'Amanda Figueiredo',        'func01@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000001', NULL),
    (22, 'Bruno Correa Pinto',       'func02@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000002', NULL),
    (23, 'Carla Nogueira Maia',      'func03@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000003', NULL),
    (24, 'Diego Mendonca Luz',       'func04@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000004', NULL),
    (25, 'Eliane Siqueira Vaz',      'func05@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000005', NULL),
    (26, 'Fabio Queiroz Arruda',     'func06@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000006', NULL),
    (27, 'Gisele Barreto Mello',     'func07@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000007', NULL),
    (28, 'Hugo Zanin Aguiar',        'func08@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000008', NULL),
    (29, 'Isabela Toledo Assis',     'func09@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000009', NULL),
    (30, 'Joao Paulo Brandao',       'func10@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000010', NULL),
    (31, 'Kelly Cristina Franco',    'func11@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000011', NULL),
    (32, 'Leonardo Xavier Abreu',    'func12@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000012', NULL),
    (33, 'Monique Falcao Paz',       'func13@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000013', NULL),
    (34, 'Nelson Carvalho Frota',    'func14@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000014', NULL),
    (35, 'Otavio Dantas Paes',       'func15@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000015', NULL),
    (36, 'Priscila Gusmao Rios',     'func16@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000016', NULL),
    (37, 'Quezia Miranda Horta',     'func17@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000017', NULL),
    (38, 'Rafael Simoes Chaves',     'func18@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000018', NULL),
    (39, 'Sabrina Godoy Muniz',      'func19@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000019', NULL),
    (40, 'Tatiane Salgado Prado',    'func20@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11982000020', NULL),

    -- Médicos (41 a 60)
    (41, 'Dr. Arnaldo Silveira',     'medico01@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000001', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'),
    (42, 'Dra. Bianca Vasquez',      'medico02@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000002', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'),
    (43, 'Dr. Claudio Valadares',    'medico03@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000003', NULL),
    (44, 'Dra. Deborah Calheiros',   'medico04@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000004', 'https://images.unsplash.com/photo-1594824813576-90c74f7d2460?w=400'),
    (45, 'Dr. Eduardo Furtado',      'medico05@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000005', NULL),
    (46, 'Dra. Fabiana Dorneles',    'medico06@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000006', NULL),
    (47, 'Dr. Gabriel Antunes',      'medico07@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000007', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400'),
    (48, 'Dra. Helena Junqueira',    'medico08@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000008', NULL),
    (49, 'Dr. Igor Montenegro',      'medico09@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000009', NULL),
    (50, 'Dra. Jessica Esteves',     'medico10@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000010', NULL),
    (51, 'Dr. Kleber Lacerda',       'medico11@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000011', NULL),
    (52, 'Dra. Lorena Medeiros',     'medico12@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000012', NULL),
    (53, 'Dr. Murilo Barcellos',     'medico13@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000013', NULL),
    (54, 'Dra. Natalia Guedes',      'medico14@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000014', NULL),
    (55, 'Dr. Osvaldo Benicio',      'medico15@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000015', NULL),
    (56, 'Dra. Paola Campinas',      'medico16@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000016', NULL),
    (57, 'Dr. Renato Figueira',      'medico17@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000017', NULL),
    (58, 'Dra. Silvia Damasceno',    'medico18@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000018', NULL),
    (59, 'Dr. Tales Bittencourt',    'medico19@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000019', NULL),
    (60, 'Dra. Vanessa Dornas',      'medico20@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11983000020', NULL),

    -- Pacientes (61 a 80)
    (61, 'Alvaro Pimentel',          'paciente01@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000001', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
    (62, 'Brenda Nogueira',          'paciente02@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000002', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'),
    (63, 'Caio Cesar Lima',          'paciente03@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000003', NULL),
    (64, 'Debora Regina Castro',     'paciente04@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000004', NULL),
    (65, 'Emerson Fagundes',         'paciente05@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000005', NULL),
    (66, 'Flavia Cristina Dias',     'paciente06@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000006', NULL),
    (67, 'Gilberto Rangel',          'paciente07@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000007', NULL),
    (68, 'Heloisa Fernandes',        'paciente08@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000008', NULL),
    (69, 'Italo Gusmao',             'paciente09@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000009', NULL),
    (70, 'Janaína Brandao',          'paciente10@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000010', NULL),
    (71, 'Kauê Martins',             'paciente11@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000011', NULL),
    (72, 'Leticia Vasconcelos',      'paciente12@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000012', NULL),
    (73, 'Marcos Vinicius Serra',    'paciente13@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000013', NULL),
    (74, 'Naiara Fontoura',          'paciente14@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000014', NULL),
    (75, 'Otavio Henrique Ramos',    'paciente15@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000015', NULL),
    (76, 'Paloma Salgado',           'paciente16@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000016', NULL),
    (77, 'Ramon de Oliveira',        'paciente17@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000017', NULL),
    (78, 'Samara Aguiar Costa',      'paciente18@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000018', NULL),
    (79, 'Tiago Barreto Lins',       'paciente19@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000019', NULL),
    (80, 'Viviane Teles Godoy',      'paciente20@sica.com', '$2a$10$y58o5hKovlqKGyR0E4z74.s4y7oF2PqQ6bIqYtZcZ4KkVG8tq6q1y', '11984000020', NULL)
ON CONFLICT (id_usuario) DO NOTHING;


-- 3. ADMIN (20 registros)
INSERT INTO admin (id_admin, id_usuario, cpf_admin)
VALUES
    (1,  1,  '10000000001'),
    (2,  2,  '10000000002'),
    (3,  3,  '10000000003'),
    (4,  4,  '10000000004'),
    (5,  5,  '10000000005'),
    (6,  6,  '10000000006'),
    (7,  7,  '10000000007'),
    (8,  8,  '10000000008'),
    (9,  9,  '10000000009'),
    (10, 10, '10000000010'),
    (11, 11, '10000000011'),
    (12, 12, '10000000012'),
    (13, 13, '10000000013'),
    (14, 14, '10000000014'),
    (15, 15, '10000000015'),
    (16, 16, '10000000016'),
    (17, 17, '10000000017'),
    (18, 18, '10000000018'),
    (19, 19, '10000000019'),
    (20, 20, '10000000020')
ON CONFLICT (id_admin) DO NOTHING;


-- 4. FUNCIONARIOS (20 registros: 16 Ativos e 4 Inativos)
INSERT INTO funcionario (id_funcionario, id_usuario, cpf_funcionario, status_funcionario)
VALUES
    (1,  21, '20000000001', 'ATIVO'),
    (2,  22, '20000000002', 'ATIVO'),
    (3,  23, '20000000003', 'ATIVO'),
    (4,  24, '20000000004', 'ATIVO'),
    (5,  25, '20000000005', 'ATIVO'),
    (6,  26, '20000000006', 'ATIVO'),
    (7,  27, '20000000007', 'ATIVO'),
    (8,  28, '20000000008', 'ATIVO'),
    (9,  29, '20000000009', 'ATIVO'),
    (10, 30, '20000000010', 'ATIVO'),
    (11, 31, '20000000011', 'ATIVO'),
    (12, 32, '20000000012', 'ATIVO'),
    (13, 33, '20000000013', 'ATIVO'),
    (14, 34, '20000000014', 'ATIVO'),
    (15, 35, '20000000015', 'ATIVO'),
    (16, 36, '20000000016', 'ATIVO'),
    (17, 37, '20000000017', 'INATIVO'),
    (18, 38, '20000000018', 'INATIVO'),
    (19, 39, '20000000019', 'INATIVO'),
    (20, 40, '20000000020', 'INATIVO')
ON CONFLICT (id_funcionario) DO NOTHING;


-- 5. MEDICOS (20 registros: 18 Ativos e 2 Inativos)
INSERT INTO medico (id_medico, crm, id_usuario, sobre_medico, valor_consulta, status_medico)
VALUES
    (1,  '10001-SP', 41, 'Cardiologista intervencionista com foco em prevenção e exames de esforço.', 300.00, 'ATIVO'),
    (2,  '10002-SP', 42, 'Dermatologista clínica e estética com foco em saúde preventiva da pele.', 320.00, 'ATIVO'),
    (3,  '10003-RJ', 43, 'Pediatra dedicado à puericultura e desenvolvimento da primeira infância.', 260.00, 'ATIVO'),
    (4,  '10004-RJ', 44, 'Ortopedista e traumatologista com foco em lesões de joelho e ombro.', 310.00, 'ATIVO'),
    (5,  '10005-MG', 45, 'Clínico geral com ampla experiência em acompanhamento ambulatorial.', 220.00, 'ATIVO'),
    (6,  '10006-MG', 46, 'Ginecologista e obstetra com pós-graduação em reprodução assistida.', 350.00, 'ATIVO'),
    (7,  '10007-RS', 47, 'Neurologista focado em cefaleias e distúrbios neurodegenerativos.', 400.00, 'ATIVO'),
    (8,  '10008-RS', 48, 'Endocrinologista especialista em diabetes, tireoide e metabolismo.', 290.00, 'ATIVO'),
    (9,  '10009-PR', 49, 'Psiquiatra com foco em transtornos de ansiedade e saúde mental do adulto.', 350.00, 'ATIVO'),
    (10, '10010-PR', 50, 'Oftalmologista com ampla vivência em cirurgia refrativa e catarata.', 280.00, 'ATIVO'),
    (11, '10011-BA', 51, 'Otorrinolaringologista com ênfase em cirurgia de septo e rinite alérgica.', 270.00, 'ATIVO'),
    (12, '10012-BA', 52, 'Urologista geral com experiência em prevenção e cálculos renais.', 310.00, 'ATIVO'),
    (13, '10013-PE', 53, 'Gastroenterologista e hepatologista com foco em doenças inflamatórias.', 300.00, 'ATIVO'),
    (14, '10014-PE', 54, 'Pneumologista com atuação em asma, DPOC e medicina do sono.', 280.00, 'ATIVO'),
    (15, '10015-CE', 55, 'Reumatologista especialista em doenças autoimunes e osteoporose.', 330.00, 'ATIVO'),
    (16, '10016-CE', 56, 'Geriatra com foco na longevidade ativa e acompanhamento multidimensional.', 340.00, 'ATIVO'),
    (17, '10017-SC', 57, 'Cirurgião geral com experiência em procedimentos por videolaparoscopia.', 380.00, 'ATIVO'),
    (18, '10018-SC', 58, 'Infectologista consultor em imunizações e doenças transmissíveis.', 270.00, 'ATIVO'),
    (19, '10019-GO', 59, 'Médico de família e comunidade para cuidado integral de famílias.', 200.00, 'INATIVO'),
    (20, '10020-DF', 60, 'Cirurgião plástico reparador e procedimentos estéticos reconstrutivos.', 450.00, 'INATIVO')
ON CONFLICT (id_medico) DO NOTHING;


-- 6. MEDICO_ESPECIALIDADE (26 registros)
INSERT INTO medico_especialidade (id_medico, id_especialidade)
VALUES
    -- Médico 1 (Cardiologia + Clínica médica)
    (1,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Cardiologia')),
    (1,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Clínica médica')),

    -- Médico 2 (Dermatologia)
    (2,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Dermatologia')),

    -- Médico 3 (Pediatria)
    (3,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Pediatria')),

    -- Médico 4 (Ortopedia e traumatologia + Medicina esportiva)
    (4,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Ortopedia e traumatologia')),
    (4,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Medicina esportiva')),

    -- Médico 5 (Clínica médica)
    (5,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Clínica médica')),

    -- Médico 6 (Ginecologia e obstetrícia)
    (6,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Ginecologia e obstetrícia')),

    -- Médico 7 (Neurologia)
    (7,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Neurologia')),

    -- Médico 8 (Endocrinologia e metabologia)
    (8,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Endocrinologia e metabologia')),

    -- Médico 9 (Psiquiatria)
    (9,  (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Psiquiatria')),

    -- Médico 10 (Oftalmologia)
    (10, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Oftalmologia')),

    -- Médico 11 (Otorrinolaringologia)
    (11, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Otorrinolaringologia')),

    -- Médico 12 (Urologia)
    (12, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Urologia')),

    -- Médico 13 (Gastroenterologia + Endoscopia)
    (13, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Gastroenterologia')),
    (13, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Endoscopia')),

    -- Médico 14 (Pneumologia)
    (14, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Pneumologia')),

    -- Médico 15 (Reumatologia)
    (15, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Reumatologia')),

    -- Médico 16 (Geriatria + Clínica médica)
    (16, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Geriatria')),
    (16, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Clínica médica')),

    -- Médico 17 (Cirurgia geral)
    (17, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Cirurgia geral')),

    -- Médico 18 (Infectologia)
    (18, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Infectologia')),

    -- Médico 19 (Medicina de família e comunidade)
    (19, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Medicina de família e comunidade')),

    -- Médico 20 (Cirurgia plástica + Cirurgia geral)
    (20, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Cirurgia plástica')),
    (20, (SELECT id_especialidade FROM especialidade WHERE nome_especialidade = 'Cirurgia geral'))
ON CONFLICT (id_medico, id_especialidade) DO NOTHING;


-- 7. HORARIO_MEDICO (24 registros)
INSERT INTO horario_medico (id_horario, id_medico, dia_semana, hora_inicio, hora_fim, intervalo_minutos, duracao_minutos)
VALUES
    (1,  1,  'SEGUNDA', '08:00', '12:00', 10, 30),
    (2,  1,  'QUARTA',  '08:00', '12:00', 10, 30),
    (3,  2,  'TERCA',   '13:00', '18:00', 15, 30),
    (4,  2,  'QUINTA',  '13:00', '18:00', 15, 30),
    (5,  3,  'QUARTA',  '09:00', '13:00', 10, 30),
    (6,  3,  'SEXTA',   '09:00', '13:00', 10, 30),
    (7,  4,  'SEGUNDA', '14:00', '19:00', 10, 30),
    (8,  4,  'QUINTA',  '14:00', '19:00', 10, 30),
    (9,  5,  'SEGUNDA', '08:00', '17:00', 60, 30),
    (10, 6,  'TERCA',   '08:00', '12:00', 10, 40),
    (11, 7,  'QUARTA',  '13:00', '18:00', 15, 45),
    (12, 8,  'QUINTA',  '08:00', '14:00', 15, 30),
    (13, 9,  'SEXTA',   '08:00', '16:00', 20, 50),
    (14, 10, 'SEGUNDA', '08:00', '12:00', 10, 20),
    (15, 11, 'TERCA',   '14:00', '18:00', 10, 30),
    (16, 12, 'QUARTA',  '08:00', '12:00', 10, 30),
    (17, 13, 'QUINTA',  '13:00', '17:00', 15, 30),
    (18, 14, 'SEXTA',   '09:00', '13:00', 10, 30),
    (19, 15, 'SEGUNDA', '13:00', '17:00', 15, 40),
    (20, 16, 'TERCA',   '08:00', '13:00', 20, 45),
    (21, 17, 'QUARTA',  '14:00', '18:00', 10, 30),
    (22, 18, 'SEXTA',   '14:00', '18:00', 10, 30),
    (23, 19, 'SABADO',  '08:00', '12:00', 10, 30),
    (24, 20, 'SABADO',  '08:00', '13:00', 15, 60)
ON CONFLICT (id_horario) DO NOTHING;


-- 8. PACIENTES (20 registros)
INSERT INTO paciente (id_paciente, id_usuario, cpf_paciente, data_nascimento_paciente)
VALUES
    (1,  61, '30000000001', '1984-03-15'),
    (2,  62, '30000000002', '1990-07-22'),
    (3,  63, '30000000003', '1975-11-05'),
    (4,  64, '30000000004', '2000-01-30'),
    (5,  65, '30000000005', '1988-09-12'),
    (6,  66, '30000000006', '1995-04-18'),
    (7,  67, '30000000007', '1968-12-03'),
    (8,  68, '30000000008', '1982-06-27'),
    (9,  69, '30000000009', '1999-08-14'),
    (10, 70, '30000000010', '1993-02-09'),
    (11, 71, '30000000011', '1986-10-21'),
    (12, 72, '30000000012', '1979-05-17'),
    (13, 73, '30000000013', '2002-12-29'),
    (14, 74, '30000000014', '1991-03-08'),
    (15, 75, '30000000015', '1980-07-04'),
    (16, 76, '30000000016', '1997-11-23'),
    (17, 77, '30000000017', '1965-09-19'),
    (18, 78, '30000000018', '1989-01-11'),
    (19, 79, '30000000019', '1994-06-02'),
    (20, 80, '30000000020', '2001-08-25')
ON CONFLICT (id_paciente) DO NOTHING;


-- 9. DEPENDENTES (20 registros distribuídos entre os pacientes)
INSERT INTO dependente (id_dependente, id_paciente, cpf_dependente, nome_dependente, data_nascimento_dependente)
VALUES
    (1,  1,  '40000000001', 'Arthur Silva Pimentel',      '2014-05-10'),
    (2,  1,  '40000000002', 'Beatriz Silva Pimentel',     '2017-09-18'),
    (3,  2,  '40000000003', 'Caio Nogueira Maia',         '2019-02-14'),
    (4,  3,  '40000000004', 'Davi Castro Lima',           '2012-08-03'),
    (5,  3,  '40000000005', 'Eduarda Castro Lima',        '2015-11-20'),
    (6,  4,  '40000000006', 'Felipe Castro Rocha',        '2022-04-01'),
    (7,  5,  '40000000007', 'Gabriel Fagundes Jr.',       '2016-10-12'),
    (8,  6,  '40000000008', 'Helena Dias Barreto',        '2020-03-25'),
    (9,  7,  '40000000009', 'Igor Rangel Sobrinho',       '2011-06-30'),
    (10, 8,  '40000000010', 'Julia Fernandes Assis',      '2018-01-17'),
    (11, 9,  '40000000011', 'Lucas Gusmao Neto',          '2021-07-29'),
    (12, 10, '40000000012', 'Manuela Brandao Ramos',      '2019-12-05'),
    (13, 11, '40000000013', 'Nicolas Martins Cruz',       '2013-04-14'),
    (14, 12, '40000000014', 'Olivia Vasconcelos Paz',     '2017-08-22'),
    (15, 13, '40000000015', 'Pedro Vinicius Serra',       '2023-01-10'),
    (16, 14, '40000000016', 'Rafaela Fontoura Mello',     '2015-09-03'),
    (17, 15, '40000000017', 'Samuel Ramos de Souza',      '2010-11-19'),
    (18, 16, '40000000018', 'Theo Salgado Frota',         '2022-06-16'),
    (19, 17, '40000000019', 'Valentina Oliveira Pinto',   '2014-02-28'),
    (20, 18, '40000000020', 'Yago Aguiar Costa',          '2018-10-07')
ON CONFLICT (id_dependente) DO NOTHING;


-- 10. CONSULTAS (25 registros sem sobreposição de horário por médico)
INSERT INTO consulta (id_consulta, id_paciente, id_dependente, id_medico, data_inicio_consulta, data_fim_consulta, valor_pago, status_consulta)
VALUES
    -- Consultas Médica 1 (Cardiologia)
    (1,  1,  NULL, 1,  '2026-03-02 08:00:00', '2026-03-02 08:30:00', 300.00, 'CONCLUIDA'),
    (2,  2,  NULL, 1,  '2026-03-02 08:40:00', '2026-03-02 09:10:00', 300.00, 'CONCLUIDA'),
    (3,  3,  NULL, 1,  '2026-03-04 09:00:00', '2026-03-04 09:30:00', 300.00, 'CONFIRMADA'),
    (4,  4,  NULL, 1,  '2026-03-04 10:00:00', '2026-03-04 10:30:00', 0.00,   'CANCELADA'),

    -- Consultas Médica 2 (Dermatologia)
    (5,  2,  NULL, 2,  '2026-03-03 13:00:00', '2026-03-03 13:30:00', 320.00, 'CONCLUIDA'),
    (6,  5,  NULL, 2,  '2026-03-05 14:00:00', '2026-03-05 14:30:00', 320.00, 'CONFIRMADA'),
    (7,  6,  NULL, 2,  '2026-03-05 15:00:00', '2026-03-05 15:30:00', 320.00, 'AGENDADA'),

    -- Consultas Médico 3 (Pediatria - com dependentes)
    (8,  1,  1,    3,  '2026-03-04 09:00:00', '2026-03-04 09:30:00', 260.00, 'CONCLUIDA'),
    (9,  2,  3,    3,  '2026-03-06 10:00:00', '2026-03-06 10:30:00', 260.00, 'CONFIRMADA'),
    (10, 3,  4,    3,  '2026-03-06 11:00:00', '2026-03-06 11:30:00', 260.00, 'AGENDADA'),

    -- Consultas Médico 4 (Ortopedia)
    (11, 7,  NULL, 4,  '2026-03-02 14:00:00', '2026-03-02 14:30:00', 310.00, 'CONCLUIDA'),
    (12, 8,  NULL, 4,  '2026-03-05 16:00:00', '2026-03-05 16:30:00', 310.00, 'AGENDADA'),

    -- Consultas Médico 5 (Clínica médica)
    (13, 9,  NULL, 5,  '2026-03-02 10:00:00', '2026-03-02 10:30:00', 220.00, 'CONCLUIDA'),
    (14, 10, NULL, 5,  '2026-03-02 11:00:00', '2026-03-02 11:30:00', 220.00, 'NAO_COMPARECEU'),

    -- Consultas Médica 6 (Ginecologia)
    (15, 6,  NULL, 6,  '2026-03-03 08:30:00', '2026-03-03 09:10:00', 350.00, 'CONFIRMADA'),
    (16, 12, NULL, 6,  '2026-03-03 10:00:00', '2026-03-03 10:40:00', 350.00, 'AGENDADA'),

    -- Consultas Médico 7 (Neurologia)
    (17, 11, NULL, 7,  '2026-03-04 13:30:00', '2026-03-04 14:15:00', 400.00, 'CONFIRMADA'),

    -- Consultas Médica 8 (Endocrinologia)
    (18, 13, NULL, 8,  '2026-03-05 09:00:00', '2026-03-05 09:30:00', 290.00, 'AGENDADA'),

    -- Consultas Médico 9 (Psiquiatria)
    (19, 14, NULL, 9,  '2026-03-06 09:00:00', '2026-03-06 09:50:00', 350.00, 'CONFIRMADA'),
    (20, 15, NULL, 9,  '2026-03-06 10:30:00', '2026-03-06 11:20:00', 350.00, 'AGENDADA'),

    -- Consultas Médico 10 (Oftalmologia)
    (21, 16, NULL, 10, '2026-03-02 08:30:00', '2026-03-02 08:50:00', 280.00, 'CONCLUIDA'),

    -- Consultas Médico 11 (Otorrino)
    (22, 17, NULL, 11, '2026-03-03 14:30:00', '2026-03-03 15:00:00', 270.00, 'CONFIRMADA'),

    -- Consultas Médico 12 (Urologia)
    (23, 18, NULL, 12, '2026-03-04 08:30:00', '2026-03-04 09:00:00', 310.00, 'AGENDADA'),

    -- Consultas Médico 13 (Gastroenterologia)
    (24, 19, NULL, 13, '2026-03-05 13:30:00', '2026-03-05 14:00:00', 300.00, 'CONFIRMADA'),

    -- Consultas Médico 14 (Pneumologia)
    (25, 20, NULL, 14, '2026-03-06 09:30:00', '2026-03-06 10:00:00', 280.00, 'AGENDADA')
ON CONFLICT (id_consulta) DO NOTHING;


-- 11. ATUALIZAÇÃO DAS SEQUENCES (AUTO-INCREMENTO)
SELECT setval(pg_get_serial_sequence('especialidade', 'id_especialidade'), COALESCE(MAX(id_especialidade), 1)) FROM especialidade;
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'),             COALESCE(MAX(id_usuario), 1)) FROM usuario;
SELECT setval(pg_get_serial_sequence('admin', 'id_admin'),                 COALESCE(MAX(id_admin), 1)) FROM admin;
SELECT setval(pg_get_serial_sequence('funcionario', 'id_funcionario'),     COALESCE(MAX(id_funcionario), 1)) FROM funcionario;
SELECT setval(pg_get_serial_sequence('medico', 'id_medico'),               COALESCE(MAX(id_medico), 1)) FROM medico;
SELECT setval(pg_get_serial_sequence('horario_medico', 'id_horario'),     COALESCE(MAX(id_horario), 1)) FROM horario_medico;
SELECT setval(pg_get_serial_sequence('paciente', 'id_paciente'),           COALESCE(MAX(id_paciente), 1)) FROM paciente;
SELECT setval(pg_get_serial_sequence('dependente', 'id_dependente'),       COALESCE(MAX(id_dependente), 1)) FROM dependente;
SELECT setval(pg_get_serial_sequence('consulta', 'id_consulta'),           COALESCE(MAX(id_consulta), 1)) FROM consulta;

COMMIT;