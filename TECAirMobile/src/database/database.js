import * as SQLite from 'expo-sqlite';

export const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync('tecair.db');
    db.execSync('PRAGMA foreign_keys = ON;');
  }
  return db;
};



// Quitamos la apertura global de la base de datos para evitar el NullPointerException
export const initDatabase = () => {
  try {
    const db = SQLite.openDatabaseSync('tecair.db');
    db.execSync(`
      CREATE TABLE IF NOT EXISTS usuario (
        usuario_id INTEGER PRIMARY KEY NOT NULL,
        nombre     TEXT NOT NULL,
        apellido1  TEXT NOT NULL,
        apellido2  TEXT,
        email      TEXT NOT NULL UNIQUE,
        telefono   TEXT NOT NULL,
        carnet     INTEGER,
        universidad TEXT
      );
 
      CREATE TABLE IF NOT EXISTS aeropuerto (
        aeropuerto_id INTEGER PRIMARY KEY NOT NULL,
        nombre        TEXT NOT NULL,
        ubicacion     TEXT NOT NULL
      );
 
      CREATE TABLE IF NOT EXISTS avion (
        avion_id  INTEGER PRIMARY KEY NOT NULL,
        capacidad INTEGER NOT NULL,
        modelo    TEXT NOT NULL
      );
 
      CREATE TABLE IF NOT EXISTS vuelo (
        vuelo_id        INTEGER PRIMARY KEY NOT NULL,
        aeropuerto_id   INTEGER NOT NULL,
        avion_id        INTEGER NOT NULL,
        asientos        INTEGER NOT NULL,
        destino         TEXT NOT NULL,
        salida          TEXT NOT NULL,
        fecha_salida    TEXT NOT NULL,
        fecha_llegada   TEXT NOT NULL,
        puerta_abordaje TEXT,
        precio_boleto   REAL DEFAULT 0,
        estado_vuelo    TEXT DEFAULT 'Programado',
        fecha_apertura  TEXT,
        FOREIGN KEY (aeropuerto_id) REFERENCES aeropuerto(aeropuerto_id),
        FOREIGN KEY (avion_id)      REFERENCES avion(avion_id)
      );
 
      CREATE TABLE IF NOT EXISTS reserva (
        reserva_id         INTEGER PRIMARY KEY NOT NULL,
        usuario_id         INTEGER NOT NULL,
        vuelo_id           INTEGER NOT NULL,
        fecha_reserva      TEXT NOT NULL,
        asientos_reservados INTEGER NOT NULL,
        estado_pago        TEXT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
        FOREIGN KEY (vuelo_id)   REFERENCES vuelo(vuelo_id)
      );
 
      CREATE TABLE IF NOT EXISTS boleto (
        boleto_id   INTEGER PRIMARY KEY NOT NULL,
        reserva_id  INTEGER NOT NULL,
        precio      REAL NOT NULL,
        asiento     TEXT NOT NULL,
        fecha       TEXT NOT NULL,
        estado_pago TEXT NOT NULL,
        FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id)
      );
 
      CREATE TABLE IF NOT EXISTS factura (
        factura_id    INTEGER PRIMARY KEY NOT NULL,
        boleto_id     INTEGER NOT NULL,
        metodo_pago   TEXT NOT NULL,
        total         REAL NOT NULL,
        fecha_emision TEXT NOT NULL,
        FOREIGN KEY (boleto_id) REFERENCES boleto(boleto_id)
      );
 
      CREATE TABLE IF NOT EXISTS maleta (
        maleta_id        INTEGER PRIMARY KEY NOT NULL,
        reserva_id       INTEGER NOT NULL,
        peso             REAL NOT NULL,
        color            TEXT NOT NULL,
        costo_adicional  REAL NOT NULL,
        FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id)
      );
 
      CREATE TABLE IF NOT EXISTS asiento (
        asiento_id  INTEGER PRIMARY KEY NOT NULL,
        reserva_id  INTEGER NOT NULL UNIQUE,
        num_asiento TEXT NOT NULL,
        tipo        TEXT NOT NULL,
        FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id)
      );
 
      CREATE TABLE IF NOT EXISTS promocion (
        promocion_id INTEGER PRIMARY KEY NOT NULL,
        vuelo_id     INTEGER NOT NULL,
        origen       TEXT NOT NULL,
        destino      TEXT NOT NULL,
        descuento    REAL NOT NULL,
        fecha_inicio TEXT NOT NULL,
        fecha_fin    TEXT NOT NULL,
        FOREIGN KEY (vuelo_id) REFERENCES vuelo(vuelo_id)
      );
 
      CREATE TABLE IF NOT EXISTS checkin (
        checkin_id    INTEGER PRIMARY KEY NOT NULL,
        reserva_id    INTEGER NOT NULL UNIQUE,
        asiento_id    INTEGER NOT NULL UNIQUE,
        fecha_checkin TEXT NOT NULL DEFAULT (datetime('now')),
        metodo_envio  TEXT,
        estado_envio  TEXT DEFAULT 'Pendiente',
        FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id),
        FOREIGN KEY (asiento_id) REFERENCES asiento(asiento_id)
      );

    `);
    console.log("✅ Base de datos inicializada correctamente.");
    return db;
  } catch (error) {
    console.error("❌ Error inicializando BD:", error);
    return null;
  }
};