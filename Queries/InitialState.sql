

INSERT INTO usuario (nombre, apellido1, apellido2, email, telefono, carnet, universidad)
VALUES ('Joel', 'Barboza', 'Picado', 'joelbarbozafalse@gmail.com', '+506-8888-8888', 1999203823, 'Instituto Tecnológico de Costa Rica');

INSERT INTO usuario (nombre, apellido1, apellido2, email, telefono)
VALUES ('Juan', 'Perez', 'Arjona', 'arjona@gmail.com', '+506-6666-6666');

select * from aeropuerto

-- Insertar aeropuertos
INSERT INTO aeropuerto (nombre, ubicacion) VALUES
('John F. Kennedy International Airport', 'Nueva York, Estados Unidos'),
('Aeropuerto Charles de Gaulle', 'París, Francia'),
('Heathrow Airport', 'Londres, Reino Unido'),
('Aeropuerto Adolfo Suárez Madrid-Barajas', 'Madrid, España'),
('Aeropuerto Internacional El Dorado', 'Bogotá, Colombia'),
('Aeropuerto Internacional de São Paulo-Guarulhos', 'São Paulo, Brasil');


-- Insertar aviones
INSERT INTO avion (capacidad, modelo) VALUES
(396, 'Boeing 777-300ER'),
(853, 'Boeing 737 MAX 8');