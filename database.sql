-- 1. Auth Service
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Usuario administrador por defecto
-- Reemplaza el campo password con el hash BCrypt de tu contraseña antes de ejecutar
INSERT INTO usuarios (username, password, rol)
VALUES ('admin', '$2a$12$MCVx/.rSObSgkOG.zrsRJ.8rWm1k5C0ORgOuY.y0d7tXIs6AViL/6', 'ADMIN');

-- 2. Cliente Service
CREATE DATABASE IF NOT EXISTS clientes_db;
USE clientes_db;
CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- 3. Catalogo Service
CREATE DATABASE IF NOT EXISTS catalogo_db;
USE catalogo_db;
CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DOUBLE NOT NULL,
    stock INT NOT NULL,
    categoria_id BIGINT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- 4. Ventas Service
CREATE DATABASE IF NOT EXISTS ventas_db;
USE ventas_db;
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DOUBLE NOT NULL,
    subtotal DOUBLE NOT NULL
);
CREATE TABLE IF NOT EXISTS ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    cliente_id BIGINT NOT NULL,
    total DOUBLE NOT NULL
);
-- Tabla intermedia para relación OneToMany unidireccional por defecto de Hibernate
CREATE TABLE IF NOT EXISTS ventas_detalles (
    venta_id BIGINT NOT NULL,
    detalles_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (detalles_id) REFERENCES detalle_ventas(id)
);

-- 5. Personal Service
CREATE DATABASE IF NOT EXISTS personal_db;
USE personal_db;
CREATE TABLE IF NOT EXISTS personal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    email VARCHAR(100)
);
-- ============================================================
-- DATOS DE MUESTRA - InkaSalud (Farmacia)
-- ============================================================

-- ============================================================
-- 1. AUTH_DB — Usuarios adicionales
-- ============================================================
USE auth_db;

INSERT INTO usuarios (username, password, rol) VALUES
('farmaceutico1',  '$2a$12$pg2CZhkfSqtuS3hmriMb7OOMpJfu1hmdJgkuODks2PG/l65yzGhEO', 'FARMACEUTICO'),
('farmaceutico2',  '$2a$12$8lJueuolRu/co1P4RNNSp.otJR.TkIi1EbTTd99zygSXHnKFgE32.', 'FARMACEUTICO'),
('cajero1',        '$2a$12$on6A3FAucMoEOtTgEfcfAOEItlNBJCZWWtd.z1w6jCZkeQoFtrnP6', 'CAJERO'),
('cajero2',        '$2a$12$DCN4PcWpqDWpqZezkq5bCulUWmJJvrzWSCRe4Ol3QBcyHuF1Nq1vO', 'CAJERO'),
('supervisor1',    '$2a$12$5zJYS95Ht4yjfC/TS/Up9ugaPmmM3uSVMIi.TddHi26i7pOd0rc4i', 'SUPERVISOR');

-- ============================================================
-- 2. CLIENTES_DB
-- ============================================================
USE clientes_db;

INSERT INTO clientes (nombres, apellidos, dni, telefono, email) VALUES
('Carlos Alberto',   'Quispe Mamani',      '74521036', '987654321', 'carlos.quispe@gmail.com'),
('María Elena',      'Huanca Flores',      '62318745', '976543210', 'maria.huanca@gmail.com'),
('José Luis',        'Condori Apaza',      '48963215', '965432109', 'jose.condori@hotmail.com'),
('Ana María',        'Ccopa Ticona',       '53127864', '954321098', 'ana.ccopa@gmail.com'),
('Roberto',          'Vargas Huallpa',     '71456892', '943210987', 'roberto.vargas@gmail.com'),
('Lucía',            'Mamani Catacora',    '68234571', '932109876', 'lucia.mamani@outlook.com'),
('Pedro Pablo',      'Quispe Torres',      '59874123', '921098765', 'pedro.quispe@gmail.com'),
('Carmen Rosa',      'Lazo Puma',          '47123698', '910987654', 'carmen.lazo@gmail.com'),
('Julio César',      'Ramos Choque',       '63984512', '909876543', 'julio.ramos@hotmail.com'),
('Sofía',            'Apaza Corimanya',    '72345619', '998765432', 'sofia.apaza@gmail.com'),
('Miguel Ángel',     'Flores Mamani',      '55698734', '987654322', 'miguel.flores@gmail.com'),
('Rosa Isabel',      'Chura Quispe',       '61234897', '976543211', 'rosa.chura@gmail.com'),
('Fernando',         'Ticona Calcina',     '49871236', '965432108', 'fernando.ticona@outlook.com'),
('Gloria',           'Huanca Pari',        '73456128', '954321097', 'gloria.huanca@gmail.com'),
('Diego Armando',    'Catacora Mamani',    '58712345', '943210986', 'diego.catacora@gmail.com'),
('Patricia',         'Yucra Flores',       '64523178', '932109875', 'patricia.yucra@hotmail.com'),
('Raúl',             'Puma Condori',       '70891234', '921098764', 'raul.puma@gmail.com'),
('Verónica',         'Corimanya Apaza',    '51234786', '910987653', 'veronica.corimanya@gmail.com');

-- ============================================================
-- 3. CATALOGO_DB — Categorías y Productos
-- ============================================================
USE catalogo_db;

INSERT INTO categorias (nombre, descripcion) VALUES
('Analgésicos y Antiinflamatorios', 'Medicamentos para el dolor y la inflamación'),
('Antibióticos',                    'Medicamentos para infecciones bacterianas'),
('Antihistamínicos',                'Medicamentos para alergias'),
('Vitaminas y Suplementos',         'Suplementos nutricionales y vitamínicos'),
('Gastroenterología',               'Medicamentos para el sistema digestivo'),
('Dermatología',                    'Cremas, ungüentos y productos para la piel'),
('Respiratorio',                    'Medicamentos para afecciones respiratorias'),
('Cardiovascular',                  'Medicamentos para el sistema cardiovascular'),
('Diabetes',                        'Medicamentos y dispositivos para diabéticos'),
('Higiene y Cuidado Personal',      'Productos de higiene y cuidado personal');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES
-- Analgésicos (cat 1)
('Paracetamol 500mg x 20 tab',       'Analgésico y antipirético de uso general',              8.50,  150, 1),
('Ibuprofeno 400mg x 20 tab',        'Antiinflamatorio no esteroideo',                        10.90, 120, 1),
('Naproxeno 500mg x 10 tab',         'Antiinflamatorio para dolor moderado a severo',         12.50,  80, 1),
('Tramadol 50mg x 10 cap',           'Analgésico opioide para dolor severo',                  25.00,  40, 1),
('Diclofenaco gel 50g',              'Antiinflamatorio tópico para dolores musculares',        18.00,  60, 1),

-- Antibióticos (cat 2)
('Amoxicilina 500mg x 21 cap',       'Antibiótico de amplio espectro',                        22.00,  90, 2),
('Azitromicina 500mg x 3 tab',       'Antibiótico para infecciones respiratorias',            28.50,  70, 2),
('Ciprofloxacino 500mg x 14 tab',    'Antibiótico quinolónico de amplio espectro',            19.90,  85, 2),
('Metronidazol 500mg x 20 tab',      'Antibiótico y antiparasitario',                         14.00,  75, 2),

-- Antihistamínicos (cat 3)
('Loratadina 10mg x 10 tab',         'Antihistamínico no sedante para alergias',               9.50, 110, 3),
('Cetirizina 10mg x 10 tab',         'Antihistamínico para rinitis alérgica',                  9.90, 100, 3),
('Desloratadina 5mg x 10 tab',       'Antihistamínico de nueva generación',                   13.00,  65, 3),

-- Vitaminas (cat 4)
('Vitamina C 1000mg x 30 tab',       'Suplemento de vitamina C efervescente',                 15.00, 200, 4),
('Complejo B x 30 tab',              'Complejo de vitaminas del grupo B',                     12.50, 180, 4),
('Vitamina D3 2000UI x 30 cap',      'Suplemento de vitamina D para huesos',                  22.00, 130, 4),
('Omega 3 1000mg x 30 cap',          'Suplemento de ácidos grasos omega 3',                   28.00, 110, 4),
('Multivitamínico adulto x 30 tab',  'Multivitamínico completo para adultos',                 35.00,  90, 4),

-- Gastroenterología (cat 5)
('Omeprazol 20mg x 14 cap',          'Inhibidor de la bomba de protones para gastritis',      11.50, 140, 5),
('Ranitidina 150mg x 20 tab',        'Antiácido para úlcera y reflujo',                        8.00,  95, 5),
('Loperamida 2mg x 12 cap',          'Antidiarreico de acción rápida',                        10.00,  80, 5),
('Simeticona 80mg x 20 tab',         'Antiflalulento para cólicos y gases',                    7.50, 120, 5),
('Sales de rehidratación oral x 4',  'Rehidratación oral para diarrea y vómitos',              6.00, 160, 5),

-- Dermatología (cat 6)
('Clotrimazol crema 1% 20g',         'Antifúngico tópico para micosis cutánea',               12.00,  70, 6),
('Hidrocortisona crema 1% 15g',      'Corticoide tópico para dermatitis e irritaciones',      10.50,  60, 6),
('Protector solar SPF50 120ml',      'Protector solar de amplio espectro',                    38.00,  45, 6),

-- Respiratorio (cat 7)
('Salbutamol inhalador 100mcg',      'Broncodilatador para asma y EPOC',                      35.00,  50, 7),
('Ambroxol jarabe 30mg/5ml 120ml',   'Mucolítico para tos productiva',                        15.50,  75, 7),
('Loratadina + Pseudoefedrina x 10', 'Descongestivo nasal combinado',                         16.00,  65, 7),

-- Cardiovascular (cat 8)
('Enalapril 10mg x 20 tab',          'Antihipertensivo IECA',                                 14.00,  85, 8),
('Atorvastatina 20mg x 30 tab',      'Reductor de colesterol estatina',                       32.00,  55, 8),
('Aspirina 100mg x 30 tab',          'Antiagregante plaquetario cardioprotector',              8.50, 100, 8),

-- Diabetes (cat 9)
('Metformina 850mg x 30 tab',        'Hipoglucemiante oral para diabetes tipo 2',             18.00,  70, 9),
('Glibenclamida 5mg x 30 tab',       'Hipoglucemiante oral sulfonilurea',                     12.00,  60, 9),
('Tiras reactivas glucosa x 50',     'Tiras para medición de glucosa en sangre',              45.00,  40, 9),

-- Higiene (cat 10)
('Alcohol en gel 70% 500ml',         'Desinfectante de manos a base de alcohol',              12.00, 200, 10),
('Mascarillas quirúrgicas x 10',     'Mascarillas de protección de 3 capas',                   8.00, 300, 10),
('Termómetro digital',               'Termómetro digital de medición rápida',                 25.00,  50, 10),
('Tensiómetro digital de brazo',     'Monitor de presión arterial automático',               120.00,  20, 10);

-- ============================================================
-- 4. VENTAS_DB — Detalles y Ventas
-- ============================================================
USE ventas_db;

-- Detalles de venta
INSERT INTO detalle_ventas (producto_id, cantidad, precio_unitario, subtotal) VALUES
-- Venta 1
(1,  2,  8.50,  17.00),
(13, 1, 15.00,  15.00),
-- Venta 2
(6,  1, 22.00,  22.00),
(18, 2, 11.50,  23.00),
-- Venta 3
(2,  1, 10.90,  10.90),
(10, 2,  9.50,  19.00),
(22, 1,  7.50,   7.50),
-- Venta 4
(27, 1, 35.00,  35.00),
(28, 1, 15.50,  15.50),
-- Venta 5
(33, 1, 18.00,  18.00),
(16, 1, 28.00,  28.00),
-- Venta 6
(3,  2, 12.50,  25.00),
(5,  1, 18.00,  18.00),
-- Venta 7
(7,  1, 28.50,  28.50),
(11, 1,  9.90,   9.90),
(20, 1, 10.00,  10.00),
-- Venta 8
(30, 1, 14.00,  14.00),
(31, 1, 32.00,  32.00),
(32, 1,  8.50,   8.50),
-- Venta 9
(14, 2, 12.50,  25.00),
(15, 1, 22.00,  22.00),
-- Venta 10
(23, 1, 12.00,  12.00),
(36, 2, 12.00,  24.00),
-- Venta 11
(8,  1, 19.90,  19.90),
(9,  2, 14.00,  28.00),
-- Venta 12
(17, 1, 35.00,  35.00),
(21, 3,  6.00,  18.00),
-- Venta 13
(4,  1, 25.00,  25.00),
(19, 1,  8.00,   8.00),
-- Venta 14
(12, 1, 13.00,  13.00),
(26, 1, 10.50,  10.50),
-- Venta 15
(35, 1, 45.00,  45.00),
(38, 1, 25.00,  25.00);

-- Ventas
INSERT INTO ventas (fecha, cliente_id, total) VALUES
('2026-01-05 09:15:00',  1,  32.00),
('2026-01-07 10:30:00',  3,  45.00),
('2026-01-10 11:00:00',  5,  37.40),
('2026-01-12 14:20:00',  2,  50.50),
('2026-01-15 09:45:00',  7,  46.00),
('2026-01-18 16:00:00',  4,  43.00),
('2026-01-20 10:10:00',  9,  48.40),
('2026-01-23 12:30:00',  6,  54.50),
('2026-01-25 08:50:00', 11,  47.00),
('2026-01-28 15:00:00', 13,  36.00),
('2026-02-01 09:00:00',  8,  47.90),
('2026-02-03 11:20:00', 15,  53.00),
('2026-02-05 14:00:00', 10,  33.00),
('2026-02-07 10:45:00', 12,  23.50),
('2026-02-10 16:30:00', 16,  70.00);

-- Tabla intermedia ventas_detalles (relaciona cada venta con sus detalles)
INSERT INTO ventas_detalles (venta_id, detalles_id) VALUES
(1,  1), (1,  2),
(2,  3), (2,  4),
(3,  5), (3,  6), (3,  7),
(4,  8), (4,  9),
(5, 10), (5, 11),
(6, 12), (6, 13),
(7, 14), (7, 15), (7, 16),
(8, 17), (8, 18), (8, 19),
(9, 20), (9, 21),
(10,22), (10,23),
(11,24), (11,25),
(12,26), (12,27),
(13,28), (13,29),
(14,30), (14,31),
(15,32), (15,33);

-- ============================================================
-- 5. PERSONAL_DB
-- ============================================================
USE personal_db;

INSERT INTO personal (nombres, apellidos, cargo, email) VALUES
('Carla Milagros',   'Quispe Ramos',       'Químico Farmacéutico',     'carla.quispe@inkasalud.pe'),
('Jorge Eduardo',    'Mamani Torres',      'Químico Farmacéutico',     'jorge.mamani@inkasalud.pe'),
('Diana Lucía',      'Flores Apaza',       'Técnico en Farmacia',      'diana.flores@inkasalud.pe'),
('Marco Antonio',    'Condori Huanca',     'Técnico en Farmacia',      'marco.condori@inkasalud.pe'),
('Silvia Patricia',  'Choque Catacora',    'Técnico en Farmacia',      'silvia.choque@inkasalud.pe'),
('Luis Fernando',    'Apaza Corimanya',    'Cajero',                   'luis.apaza@inkasalud.pe'),
('Miriam',           'Ticona Calcina',     'Cajero',                   'miriam.ticona@inkasalud.pe'),
('Ricardo',          'Puma Yucra',         'Cajero',                   'ricardo.puma@inkasalud.pe'),
('Beatriz',          'Lazo Huallpa',       'Almacenero',               'beatriz.lazo@inkasalud.pe'),
('Víctor Hugo',      'Ccopa Mamani',       'Almacenero',               'victor.ccopa@inkasalud.pe'),
('Elena',            'Catacora Quispe',    'Supervisor de Turno',      'elena.catacora@inkasalud.pe'),
('Héctor',           'Huanca Pari',        'Supervisor de Turno',      'hector.huanca@inkasalud.pe'),
('Nora',             'Vargas Calcina',     'Administrador de Sistema', 'nora.vargas@inkasalud.pe'),
('Pablo César',      'Ramos Flores',       'Regente Farmacéutico',     'pablo.ramos@inkasalud.pe'),
('Giovanna',         'Chura Corimanya',    'Asistente Administrativo', 'giovanna.chura@inkasalud.pe'),
('Rodrigo',          'Quispe Catacora',    'Técnico en Farmacia',      'rodrigo.quispe@inkasalud.pe'),
('Susana',           'Mamani Lazo',        'Cajero',                   'susana.mamani@inkasalud.pe'),
('Wilfredo',         'Torres Apaza',       'Almacenero',               'wilfredo.torres@inkasalud.pe');