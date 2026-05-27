import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Switch
} from 'react-native';

import { getDatabase } from '../database/database';
import { agregarPendienteSync } from '../services/SyncService';

export default function RegisterScreen({ cambiarPantalla, setUsuarioActual }) {
  const [isLogin, setIsLogin] = useState(true);

  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const [esEstudiante, setEsEstudiante] = useState(false);
  const [carnet, setCarnet] = useState('');
  const [universidad, setUniversidad] = useState('');

  const limpiarFormulario = () => {
    setNombre('');
    setApellido1('');
    setApellido2('');
    setEmail('');
    setTelefono('');
    setCarnet('');
    setUniversidad('');
    setEsEstudiante(false);
  };

  const handleAuth = async () => {
    if (!email.trim() || !nombre.trim()) {
      Alert.alert('Error', 'El nombre y el correo son obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Ingrese un correo válido.');
      return;
    }

    const db = getDatabase();

    try {
      if (isLogin) {
        const user = await db.getFirstAsync(
          'SELECT * FROM usuario WHERE email = ? AND nombre = ?',
          [email.toLowerCase(), nombre.trim()]
        );

        if (user) {
          console.log('🟢 Login exitoso:', user);

          if (setUsuarioActual) {
            setUsuarioActual(user);
          }

          Alert.alert(
            'Sesión iniciada',
            `Bienvenido/a ${user.nombre}.\n\nTu ID de usuario es: ${user.usuario_id}`
          );

          cambiarPantalla('Home');
        } else {
          Alert.alert('Error', 'Usuario no encontrado en SQLite.');
        }
      } else {
        const existe = await db.getFirstAsync(
          'SELECT * FROM usuario WHERE email = ?',
          [email.toLowerCase()]
        );

        if (existe) {
          Alert.alert('Error', 'Correo ya registrado.');
          return;
        }

        const usuarioId = Math.floor(Math.random() * 10000);

        const usuario = {
          usuario_id: usuarioId,
          nombre: nombre.trim(),
          apellido1,
          apellido2,
          email: email.toLowerCase(),
          telefono,
          carnet: esEstudiante ? Number(carnet) || null : null,
          universidad: esEstudiante ? universidad : null,
        };

        await db.runAsync(
          `INSERT INTO usuario 
          (
            usuario_id,
            nombre,
            apellido1,
            apellido2,
            email,
            telefono,
            carnet,
            universidad,
            synced
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
          [
            usuario.usuario_id,
            usuario.nombre,
            usuario.apellido1,
            usuario.apellido2,
            usuario.email,
            usuario.telefono,
            usuario.carnet,
            usuario.universidad,
          ]
        );

        console.log('🟢 Usuario creado con ID:', usuarioId);

        await agregarPendienteSync(
          'usuario',
          'POST',
          '/aeropuerto/Usuarios',
          usuario
        );

        Alert.alert(
          'Usuario creado',
          `Usuario guardado en SQLite.\n\nID generado: ${usuarioId}\n\nUsá este ID para reservar.`
        );

        limpiarFormulario();
        setIsLogin(true);
      }
    } catch (e) {
      console.error('🔴 Error SQLite:', e);
      Alert.alert('Error', 'Fallo al acceder a SQLite.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.brand}>TECAir</Text>
        <Text style={styles.subtitle}>Reservaciones en línea</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.activeTab]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={isLogin ? styles.activeTabText : styles.inactiveTabText}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.activeTab]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={!isLogin ? styles.activeTabText : styles.inactiveTabText}>
                Crear Cuenta
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nombre *</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

          {!isLogin && (
            <>
              <Text style={styles.label}>Primer apellido</Text>
              <TextInput style={styles.input} value={apellido1} onChangeText={setApellido1} />

              <Text style={styles.label}>Segundo apellido</Text>
              <TextInput style={styles.input} value={apellido2} onChangeText={setApellido2} />
            </>
          )}

          <Text style={styles.label}>Correo electrónico *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {!isLogin && (
            <>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />

              <View style={styles.switchRow}>
                <Switch value={esEstudiante} onValueChange={setEsEstudiante} />
                <Text style={styles.switchLabel}>Soy estudiante universitario</Text>
              </View>

              {esEstudiante && (
                <>
                  <Text style={styles.label}>Carné</Text>
                  <TextInput
                    style={styles.input}
                    value={carnet}
                    onChangeText={setCarnet}
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Universidad</Text>
                  <TextInput
                    style={styles.input}
                    value={universidad}
                    onChangeText={setUniversidad}
                  />
                </>
              )}
            </>
          )}

          <TouchableOpacity style={styles.btnPrincipal} onPress={handleAuth}>
            <Text style={styles.btnText}>
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { backgroundColor: '#2c3e50', padding: 20, paddingTop: 40 },
  brand: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#fff', fontSize: 14 },
  container: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 5, elevation: 5 },
  tabContainer: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderColor: '#ccc' },
  tab: { flex: 1, padding: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderColor: '#0056b3' },
  activeTabText: { fontWeight: 'bold', color: '#0056b3' },
  inactiveTabText: { color: '#666' },
  label: { fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 15 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  switchLabel: { marginLeft: 10, color: '#333' },
  btnPrincipal: { backgroundColor: '#3b82f6', padding: 12, alignItems: 'center', borderRadius: 4 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});