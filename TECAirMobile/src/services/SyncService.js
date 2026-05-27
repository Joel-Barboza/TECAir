import { getDatabase } from '../database/database';
//const API_URL = 'http://192.168.1.34:5005/api';

const API_URL = 'http://10.0.2.2:5262/api';

export const probarConexionAPI = async () => {
  try {
    const res = await fetch(`${API_URL}/aeropuerto/Usuarios`);
    return res.ok;
  } catch {
    return false;
  }
};

export const agregarPendienteSync = async (tabla, operacion, endpoint, body) => {
  const db = getDatabase();

  await db.runAsync(
    `INSERT INTO sync_queue (tabla, operacion, endpoint, body, estado)
     VALUES (?, ?, ?, ?, 'pendiente')`,
    [tabla, operacion, endpoint, JSON.stringify(body)]
  );
};

export const sincronizarPendientes = async () => {
  const db = getDatabase();

  try {
    const pendientes = await db.getAllAsync(
      `SELECT * FROM sync_queue WHERE estado = 'pendiente'`
    );

    if (pendientes.length === 0) {
      console.log('✅ No hay pendientes por sincronizar');
      return { success: true, message: 'No hay pendientes' };
    }

    for (const item of pendientes) {
      const res = await fetch(`${API_URL}${item.endpoint}`, {
        method: item.operacion,
        headers: {
          'Content-Type': 'application/json',
        },
        body: item.body,
      });

      if (res.ok) {
        await db.runAsync(
          `UPDATE sync_queue SET estado = 'sincronizado' WHERE sync_id = ?`,
          [item.sync_id]
        );

        if (item.tabla === 'usuario') {
          const data = JSON.parse(item.body);
          await db.runAsync(
            `UPDATE usuario SET synced = 1 WHERE usuario_id = ?`,
            [data.usuario_id]
          );
        }

        if (item.tabla === 'reserva') {
          const data = JSON.parse(item.body);
          await db.runAsync(
            `UPDATE reserva SET synced = 1 WHERE reserva_id = ?`,
            [data.reserva_id]
          );
        }
      } else {
        console.log('❌ Error sincronizando:', item);
      }
    }

    return { success: true, message: 'Sincronización finalizada' };
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    return { success: false, message: error.message };
  }
};