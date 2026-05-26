import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView, Switch } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function RegisterScreen({ cambiarPantalla }) {
  const [isLogin, setIsLogin] = useState(true); // Cambiado a true por defecto
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [esEstudiante, setEsEstudiante] = useState(false);

  const db = SQLite.openDatabaseSync('tecair.db');

  const handleAuth = async () => {
    // Validación básica
    if (!email.trim() || !nombre.trim()) {
      Alert.alert("Error", "El nombre y el correo son obligatorios.");
      return;
    }

    try {
      if (isLogin) {
        // Lógica de Inicio de Sesión
        const user = await db.getFirstAsync('SELECT * FROM usuario WHERE email = ? AND nombre = ?', [email.toLowerCase(), nombre.trim()]);
        if (user) {
          cambiarPantalla('Home');
        } else {
          Alert.alert("Error", "Credenciales incorrectas.");
        }
      } else {
        // Lógica de Registro
        const existe = await db.getFirstAsync('SELECT * FROM usuario WHERE email = ?', [email.toLowerCase()]);
        if (existe) {
          Alert.alert("Error", "Correo ya registrado.");
          return;
        }
        await db.runAsync(
          'INSERT INTO usuario (usuario_id, nombre, apellido1, apellido2, email, telefono) VALUES (?, ?, ?, ?, ?, ?)', 
          [Date.now(), nombre.trim(), apellido1, apellido2, email.toLowerCase(), telefono]
        );
        Alert.alert("Éxito", "Cuenta creada. Ahora inicia sesión.");
        setIsLogin(true); // Regresar a pestaña de Login
      }
    } catch (e) {
      Alert.alert("Error", "Fallo al acceder a la base de datos.");
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
          {/* Tabs funcionales */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, isLogin && styles.activeTab]} onPress={() => setIsLogin(true)}>
              <Text style={isLogin ? styles.activeTabText : styles.inactiveTabText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, !isLogin && styles.activeTab]} onPress={() => setIsLogin(false)}>
              <Text style={!isLogin ? styles.activeTabText : styles.inactiveTabText}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nombre *</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

          {!isLogin && (
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Primer apellido *</Text>
                <TextInput style={styles.input} value={apellido1} onChangeText={setApellido1} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Segundo apellido</Text>
                <TextInput style={styles.input} value={apellido2} onChangeText={setApellido2} />
              </View>
            </View>
          )}

          <Text style={styles.label}>Correo electrónico *</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          {!isLogin && (
            <View>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
              <View style={styles.switchRow}>
                <Switch value={esEstudiante} onValueChange={setEsEstudiante} />
                <Text style={styles.switchLabel}>Soy estudiante universitario</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.btnPrincipal} onPress={handleAuth}>
            <Text style={styles.btnText}>{isLogin ? "Iniciar Sesión" : "Crear cuenta"}</Text>
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
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  switchLabel: { marginLeft: 10, color: '#333' },
  btnPrincipal: { backgroundColor: '#3b82f6', padding: 12, alignItems: 'center', borderRadius: 4 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});