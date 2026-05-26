import * as SQLite from 'expo-sqlite';

// Quitamos la apertura global de la base de datos para evitar el NullPointerException
export const initDatabase = () => {
  try {
    const db = SQLite.openDatabaseSync('tecair.db');
    db.execSync(`
      CREATE TABLE IF NOT EXISTS usuario (
        usuario_id INTEGER PRIMARY KEY NOT NULL,
        nombre TEXT NOT NULL,
        apellido1 TEXT NOT NULL,
        apellido2 TEXT,
        email TEXT NOT NULL,
        telefono TEXT NOT NULL,
        carnet INTEGER,
        universidad TEXT
      );
    `);
    console.log("✅ Base de datos inicializada correctamente.");
    return db;
  } catch (error) {
    console.error("❌ Error inicializando BD:", error);
    return null;
  }
};