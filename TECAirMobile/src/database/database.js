import * as SQLite from 'expo-sqlite';

// Abre o crea el archivo de base de datos local en el celular llamado tecair.db
const db = SQLite.openDatabaseSync('tecair.db');

/**
 * Función que crea las tablas locales si no existen.
 * Mapeada fielmente con el modelo Usuario.cs de C# (.NET).
 */
export const initDatabase = () => {
  try {
    // Ejecutamos el comando SQL para crear la tabla espejo de usuarios
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
    console.log("¡[SQLite] Base de datos y tabla 'usuario' creadas con éxito en el móvil!");
  } catch (error) {
    console.error("Error al inicializar la base de datos local SQLite: ", error);
  }
};

export default db;