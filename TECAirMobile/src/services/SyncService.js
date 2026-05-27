const API_URL = 'http://192.168.1.34:5262/api';

export const SincronizarAPostresDB = async () => {

  try {

    const res = await fetch(`${API_URL}/Usuario`);

    if (!res.ok) {
      throw new Error('Error al obtener usuarios');
    }

    const usuarios = await res.json();

    console.log('✅ Usuarios:', usuarios);

    return usuarios;

  } catch (error) {

    console.error('🔴 Error:', error);

  }

};