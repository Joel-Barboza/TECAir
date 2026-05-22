

-- drop table promocion;
-- drop table asiento;
-- drop table maleta;
-- drop table factura;
-- drop table boleto;
-- drop table reserva;
-- drop table vuelo;
-- drop table aeropuerto;
-- drop table avion;
-- drop table usuario;


CREATE TABLE usuario (
	usuario_id 	SERIAL, 
	nombre 		VARCHAR(20) NOT NULL,
	apellido1 	VARCHAR(20) NOT NULL,
	apellido2 	VARCHAR(20),
	email 		VARCHAR(50) NOT NULL,
	telefono 	VARCHAR(20) NOT NULL,
	carnet 		INT,
	universidad	VARCHAR(80),
	UNIQUE 		(email),
	PRIMARY KEY (usuario_id)
);


CREATE TABLE aeropuerto (
	aeropuerto_id 	SERIAL,
	nombre 			VARCHAR(50) 	NOT NULL,
	ubicacion 		VARCHAR(100)	NOT NULL,
	PRIMARY KEY (aeropuerto_id)
);



CREATE TABLE avion (
	avion_id 	SERIAL,
	capacidad 	INT 		NOT NULL,
	modelo 		VARCHAR(50)	NOT NULL,
	PRIMARY KEY (avion_id)
);


CREATE TABLE vuelo (
	vuelo_id 		SERIAL,
	aeropuerto_id 	INT 		NOT NULL,
	avion_id 		INT 		NOT NULL,
	asientos 		INT 		NOT NULL,
	destino 		VARCHAR(50)	NOT NULL,
	salida 			VARCHAR(50) NOT NULL,
	fecha_salida 	TIMESTAMP 	NOT NULL,
	fecha_llegada 	TIMESTAMP 	NOT NULL,
	PRIMARY KEY (vuelo_id)
);


ALTER TABLE vuelo
ADD CONSTRAINT fk_vuelo_aeropuerto
FOREIGN KEY (aeropuerto_id)
REFERENCES aeropuerto(aeropuerto_id);

ALTER TABLE vuelo
ADD CONSTRAINT fk_vuelo_avion
FOREIGN KEY (avion_id)
REFERENCES avion(avion_id);



CREATE TABLE reserva (
	reserva_id 			SERIAL,
	usuario_id 			INT 		NOT NULL,
	vuelo_id 			INT 		NOT NULL,
	fecha_reserva 		TIMESTAMP	NOT NULL,
	asientos_reservados INT 		NOT NULL,
	estado_pago 		VARCHAR(20) NOT NULL,
	PRIMARY KEY (reserva_id)
);

ALTER TABLE reserva
ADD CONSTRAINT fk_reserva_usuario
FOREIGN KEY (usuario_id)
REFERENCES usuario(usuario_id);

ALTER TABLE reserva
ADD CONSTRAINT fk_reserva_vuelo
FOREIGN KEY (vuelo_id)
REFERENCES vuelo(vuelo_id);



CREATE TABLE boleto (
	boleto_id 		SERIAL,
	reserva_id 		INT				NOT NULL,
	precio 			DECIMAL(10,2) 	NOT NULL,
	asiento 		VARCHAR(10) 	NOT NULL,
	fecha 			TIMESTAMP 		NOT NULL,
	estado_pago 	VARCHAR(20) 	NOT NULL,
	PRIMARY KEY (boleto_id)
);

ALTER TABLE boleto
ADD CONSTRAINT fk_boleto_reserva
FOREIGN KEY (reserva_id)
REFERENCES reserva(reserva_id);



CREATE TABLE factura (
	factura_id 		SERIAL,
	boleto_id 		INT 			NOT NULL,
	metodo_pago 	VARCHAR(30) 	NOT NULL,
	total 			DECIMAL(10,2) 	NOT NULL,
	fecha_emision 	TIMESTAMP 		NOT NULL,
	PRIMARY KEY (factura_id)
);

ALTER TABLE factura
ADD CONSTRAINT fk_factura_boleto
FOREIGN KEY (boleto_id)
REFERENCES boleto(boleto_id);



CREATE TABLE maleta (
	maleta_id 			SERIAL,
	reserva_id 			INT 			NOT NULL,
	peso 				DECIMAL(5,2) 	NOT NULL,
	color 				VARCHAR(30) 	NOT NULL,
	costo_adicional 	DECIMAL(10,2) 	NOT NULL,
	PRIMARY KEY (maleta_id)
);

ALTER TABLE maleta
ADD CONSTRAINT fk_maleta_reserva
FOREIGN KEY (reserva_id)
REFERENCES reserva(reserva_id);



CREATE TABLE asiento (
	asiento_id 		SERIAL,
	reserva_id 		INT 		NOT NULL,
	num_asiento 	VARCHAR(10) NOT NULL,
	tipo 			VARCHAR(20) NOT NULL,
	PRIMARY KEY (asiento_id)
);

ALTER TABLE asiento
ADD CONSTRAINT fk_asiento_reserva
FOREIGN KEY (reserva_id)
REFERENCES reserva(reserva_id);



CREATE TABLE promocion (
	promocion_id 	SERIAL,
	vuelo_id 		INT 			NOT NULL,
	origen 			VARCHAR(50) 	NOT NULL,
	destino 		VARCHAR(50) 	NOT NULL,
	descuento 		DECIMAL(5,2) 	NOT NULL,
	fecha_inicio	DATE 			NOT NULL,
	fecha_fin 		DATE 			NOT NULL,
	PRIMARY KEY (promocion_id)
);

ALTER TABLE promocion
ADD CONSTRAINT fk_promocion_vuelo
FOREIGN KEY (vuelo_id)
REFERENCES vuelo(vuelo_id);

