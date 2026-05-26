import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView, SafeAreaView } from 'react-native';
import { registrarUsuarioLocal } from '../database/userQueries';
import * as SQLite from 'expo-sqlite';

export default function RegisterScreen({ cambiarPantalla }) { 
  const [usuarioId, setUsuarioId] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [carnet, setCarnet] = useState('');
  const [universidad, setUniversidad] = useState('');
  
  // Estado local para renderizar los registros guardados en SQLite
  const [usuariosGuardados, setUsuariosGuardados] = useState([]);

  // Función encargada de leer el archivo físico de SQLite en tiempo real
  const cargarUsuariosDeSQLite = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('tecair.db');
      const todos = await db.getAllAsync('SELECT * FROM usuario;');
      setUsuariosGuardados(todos);
    } catch (error) {
      console.error("Error al leer la base de datos:", error);
      Alert.alert("Error", "No se pudieron leer los datos de SQLite");
    }
  };

  // Cargar registros existentes apenas se monta la pantalla
  useEffect(() => {
    cargarUsuariosDeSQLite();
  }, []);

  const handleRegistro = () => {
    // Validación estricta en JavaScript antes de tocar la base de datos
    if (!usuarioId.trim() || !nombre.trim() || !apellido1.trim() || !email.trim() || !telefono.trim()) {
      Alert.alert("Error", "Por favor llena todos los campos obligatorios (*)");
      return;
    }

    // Enviamos un único objeto estructurado para blindar el paso de parámetros
    const resultado = registrarUsuarioLocal({
      usuarioId: parseInt(usuarioId),
      nombre: nombre,
      apellido1: apellido1,
      apellido2: apellido2.trim() || null,
      email: email.trim(),
      telefono: telefono.trim(),
      carnet: carnet.trim() || null,
      universidad: universidad.trim() || null
    });

    if (resultado.success) {
      Alert.alert("¡Éxito!", "Usuario guardado localmente en SQLite.");
      
      // Limpiar el formulario de forma impecable
      setUsuarioId('');
      setNombre('');
      setApellido1('');
      setApellido2('');
      setEmail('');
      setTelefono('');
      setCarnet('');
      setUniversidad('');
      
      // Forzar la actualización visual inmediata de la lista de abajo
      cargarUsuariosDeSQLite();

      // ✨ ¡CABLE VISUAL CONECTADO! En cuanto se guarde con éxito, saltamos al Home seguido
      cambiarPantalla('Home');
    } else {
      Alert.alert("Error en la inserción", resultado.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro de Usuario (Offline)</Text>

        {/* 1. CÉDULA */}
        <TextInput 
          style={styles.input} 
          placeholder="Cédula / ID (*)" 
          value={usuarioId} 
          onChangeText={setUsuarioId} 
          keyboardType="numeric" 
        />

        {/* 2. NOMBRE */}
        <TextInput 
          style={styles.input} 
          placeholder="Nombre (*)" 
          value={nombre} 
          onChangeText={setNombre} 
        />

        {/* 3. PRIMER APELLIDO */}
        <TextInput 
          style={styles.input} 
          placeholder="Primer Apellido (*)" 
          value={apellido1} 
          onChangeText={setApellido1} 
        />

        {/* 4. SEGUNDO APELLIDO */}
        <TextInput 
          style={styles.input} 
          placeholder="Segundo Apellido" 
          value={apellido2} 
          onChangeText={setApellido2} 
        />

        {/* 5. CORREO ELECTRÓNICO */}
        <TextInput 
          style={styles.input} 
          placeholder="Correo Electrónico (*)" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none"
        />

        {/* 6. TELÉFONO */}
        <TextInput 
          style={styles.input} 
          placeholder="Teléfono (*)" 
          value={telefono} 
          onChangeText={setTelefono} 
          keyboardType="phone-pad" 
        />

        {/* 7. CARNÉ UNIVERSITARIO */}
        <TextInput 
          style={styles.input} 
          placeholder="Carné Universitario (Opcional)" 
          value={carnet} 
          onChangeText={setCarnet} 
        />

        {/* 8. UNIVERSIDAD */}
        <TextInput 
          style={styles.input} 
          placeholder="Universidad (Opcional)" 
          value={universidad} 
          onChangeText={setUniversidad} 
        />

        <View style={styles.buttonContainer}>
          <Button title="REGISTRAR EN DISPOSITIVO" onPress={handleRegistro} color="#0056b3" />
        </View>

        {/* ================= SECCIÓN DE COMPROBACIÓN VISUAL EN DISPOSITIVO ================= */}
        <View style={styles.verificacionContainer}>
          <Text style={styles.verificacionTitle}>🗃️ Registros Físicos en SQLite:</Text>
          <View style={{ marginBottom: 10 }}>
            <Button title="🔄 Actualizar Lista" onPress={cargarUsuariosDeSQLite} color="#28a745" />
          </View>
          
          {usuariosGuardados.length === 0 ? (
            <Text style={styles.noDataText}>No hay usuarios guardados en el almacenamiento local todavía.</Text>
          ) : (
            usuariosGuardados.map((user, index) => (
              <View key={index} style={styles.cardUsuario}>
                <Text style={styles.cardText}>🆔 **ID:** {user.usuario_id}</Text>
                <Text style={styles.cardText}>👤 **Nombre:** {user.nombre} {user.apellido1}</Text>
                <Text style={styles.cardText}>📧 **Email:** {user.email}</Text>
                <Text style={styles.cardText}>📞 **Tel:** {user.telefono}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#ccc' },
  buttonContainer: { marginTop: 10, marginBottom: 25 },
  verificacionContainer: { marginTop: 15, padding: 15, backgroundColor: '#e9ecef', borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6' },
  verificacionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#495057' },
  noDataText: { textAlign: 'center', color: '#6c757d', marginTop: 10, fontStyle: 'italic' },
  cardUsuario: { backgroundColor: '#fff', padding: 12, borderRadius: 6, marginTop: 10, borderWidth: 1, borderColor: '#ced4da' },
  cardText: { fontSize: 13, color: '#333', marginBottom: 2 }
});