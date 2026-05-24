import * as SQLite from 'expo-sqlite';

/**
 * Registra un usuario en la base de datos local de SQLite.
 * @param {Object} usuario - Objeto con los datos del formulario.
 */
export const registrarUsuarioLocal = (usuario) => {
  const { usuarioId, nombre, apellido1, apellido2, email, telefono, carnet, universidad } = usuario;
  
  try {
    // Abrir la base de datos de forma síncrona
    const db = SQLite.openDatabaseSync('tecair.db');
    
    // Ejecutar la inserción asegurando el mapeo posicional exacto de las variables
    db.runSync(
      `INSERT INTO usuario (usuario_id, nombre, apellido1, apellido2, email, telefono, carnet, universidad) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [usuarioId, nombre, apellido1, apellido2, email, telefono, carnet, universidad]
    );
    
    console.log(`✅ [SQLite] Usuario "${nombre}" insertado con éxito en el dispositivo.`);
    return { success: true };
  } catch (error) {
    console.error("🔴 Error crítico en SQLite al registrar usuario:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Busca un usuario por su ID de manera local.
 */
export const loginUsuarioLocal = (usuarioId) => {
  try {
    const db = SQLite.openDatabaseSync('tecair.db');
    const usuario = db.getFirstSync('SELECT * FROM usuario WHERE usuario_id = ?;', [usuarioId]);
    return usuario || null;
  } catch (error) {
    console.error("🔴 Error en SQLite al buscar usuario:", error);
    return null;
  }
};