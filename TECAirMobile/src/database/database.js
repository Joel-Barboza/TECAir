import * as SQLite from 'expo-sqlite';

let db = null;

export const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync('tecair.db');
    db.execSync('PRAGMA foreign_keys = ON;');
  }
  return db;
};

export const initDatabase = () => {
  try {
    const database = getDatabase();

    database.execSync(`
      CREATE TABLE IF NOT EXISTS usuario (
        usuario_id INTEGER PRIMARY KEY NOT NULL,
        nombre TEXT NOT NULL,
        apellido1 TEXT,
        apellido2 TEXT,
        email TEXT NOT NULL UNIQUE,
        telefono TEXT,
        carnet INTEGER,
        universidad TEXT,
        synced INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS vuelo (
        vuelo_id INTEGER PRIMARY KEY NOT NULL,
        codigo TEXT,
        origen TEXT NOT NULL,
        destino TEXT NOT NULL,
        salida TEXT,
        fecha_salida TEXT,
        fecha_llegada TEXT,
        precio_boleto REAL DEFAULT 0,
        asientos INTEGER DEFAULT 0,
        estado_vuelo TEXT DEFAULT 'Programado'
      );

      CREATE TABLE IF NOT EXISTS reserva (
        reserva_id INTEGER PRIMARY KEY NOT NULL,
        usuario_id INTEGER NOT NULL,
        vuelo_id INTEGER NOT NULL,
        fecha_reserva TEXT NOT NULL,
        asientos_reservados INTEGER NOT NULL,
        estado_pago TEXT NOT NULL,
        total REAL DEFAULT 0,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
        FOREIGN KEY (vuelo_id) REFERENCES vuelo(vuelo_id)
      );

      CREATE TABLE IF NOT EXISTS pago (
        pago_id INTEGER PRIMARY KEY NOT NULL,
        reserva_id INTEGER NOT NULL,
        monto REAL NOT NULL,
        metodo_pago TEXT NOT NULL,
        ultimos_digitos TEXT,
        fecha_pago TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id)
      );

      CREATE TABLE IF NOT EXISTS promocion (
        promocion_id INTEGER PRIMARY KEY NOT NULL,
        vuelo_id INTEGER,
        origen TEXT NOT NULL,
        destino TEXT NOT NULL,
        precio_promocion REAL NOT NULL,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        imagen TEXT,
        synced INTEGER DEFAULT 1,
        FOREIGN KEY (vuelo_id) REFERENCES vuelo(vuelo_id)
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        sync_id INTEGER PRIMARY KEY AUTOINCREMENT,
        tabla TEXT NOT NULL,
        operacion TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        body TEXT NOT NULL,
        estado TEXT DEFAULT 'pendiente',
        fecha_creacion TEXT DEFAULT (datetime('now'))
      );

      INSERT OR IGNORE INTO vuelo 
      (vuelo_id, codigo, origen, destino, salida, fecha_salida, fecha_llegada, precio_boleto, asientos)
      VALUES
      (1, 'VUE-011', 'San José', 'Dinamarca', '15:46', '2026-06-01', '2026-06-02', 750, 45),
      (2, 'VUE-012', 'San José', 'Miami', '08:30', '2026-06-05', '2026-06-05', 250, 120),
      (3, 'VUE-013', 'San José', 'Madrid', '22:15', '2026-06-12', '2026-06-13', 680, 90);

      INSERT OR IGNORE INTO promocion
      (promocion_id, vuelo_id, origen, destino, precio_promocion, fecha_inicio, fecha_fin)
      VALUES
      (1, 2, 'San José', 'Miami', 250, '2026-06-01', '2026-06-05'),
      (2, 3, 'San José', 'Madrid', 680, '2026-06-01', '2026-06-12');
    `);

    console.log('✅ SQLite inicializado correctamente');
    return database;

  } catch (error) {
    console.error('❌ Error inicializando SQLite:', error);
    return null;
  }
};