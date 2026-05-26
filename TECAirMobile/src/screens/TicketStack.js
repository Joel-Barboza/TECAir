import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function TicketStack({ cambiarPantalla }) {
  // Datos maquetados idénticos a las columnas de la vista web de tu compañera
  const vuelosDisponibles = [
    { codigo: 'VUE-011', ruta: "SJ ⇄ Dinamarca", fecha: "01/06/2026", hora: "15:46", aeropuerto: "Aeropuerto Internacional de Liberia", avion: "Boeing 737", asientos: 45 },
    { codigo: 'VUE-012', ruta: "SJ ⇄ Miami", fecha: "05/06/2026", hora: "08:30", aeropuerto: "Juan Santamaría", avion: "Boeing 737", asientos: 120 },
    { codigo: 'VUE-013', ruta: "SJ ⇄ Madrid", fecha: "12/06/2026", hora: "22:15", aeropuerto: "Juan Santamaría", avion: "Airbus A320", asientos: 90 },
  ];

  // Campos de formulario para simular la reservación como en la web
  const [codigoSeleccionado, setCodigoSeleccionado] = useState('');
  const [asientosAReservar, setAsientosAReservar] = useState('');

  const simularReserva = () => {
    if (!codigoSeleccionado || !asientosAReservar) {
      Alert.alert("Campos incompletos", "Por favor introduce el código del vuelo y la cantidad de asientos.");
      return;
    }
    Alert.alert("¡Reservación Exitosa!", `Se han bloqueado ${asientosAReservar} asientos para el vuelo ${codigoSeleccionado.toUpperCase()}.`);
    setCodigoSeleccionado('');
    setAsientosAReservar('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brandTitle}>TECAir ✈️</Text>
        <Text style={styles.pageTitle}>📋 Vista de Reservaciones</Text>
        <Text style={styles.subtitle}>Mismo control de vuelos de la plataforma Aeropuerto</Text>

        {/* CONTENEDOR DE LA TABLA ADAPTADA A TARJETAS */}
        <View style={styles.listaContainer}>
          {vuelosDisponibles.map((vuelo) => (
            <View key={vuelo.codigo} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.codigoText}>{vuelo.codigo}</Text>
                <Text style={styles.rutaText}>{vuelo.ruta}</Text>
              </View>

              {/* Campos de la tabla representados limpiamente */}
              <View style={styles.rowInfo}>
                <Text style={styles.label}>📅 Fecha/Hora:</Text>
                <Text style={styles.value}>{vuelo.fecha} - {vuelo.hora}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.label}>🏢 Aeropuerto:</Text>
                <Text style={styles.value} numberOfLines={1}>{vuelo.aeropuerto}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.label}>✈️ Avión / Asientos:</Text>
                <Text style={styles.value}>{vuelo.avion} ({vuelo.asientos} disp.)</Text>
              </View>

              <TouchableOpacity 
                style={styles.btnSeleccionar} 
                onPress={() => setCodigoSeleccionado(vuelo.codigo)}
              >
                <Text style={styles.btnSeleccionarText}>Seleccionar para reservar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* FORMULARIO DE RESERVACIÓN INFERIOR (ESTILO WEB) */}
        <View style={styles.formularioContainer}>
          <Text style={styles.formTitle}>Añadir Reservación</Text>
          
          <Text style={styles.inputLabel}>Código del Vuelo:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: VUE-011" 
            value={codigoSeleccionado}
            onChangeText={setCodigoSeleccionado}
          />

          <Text style={styles.inputLabel}>Asientos Disponibles a Solicitar:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Cantidad de asientos" 
            keyboardType="numeric"
            value={asientosAReservar}
            onChangeText={setAsientosAReservar}
          />

          <TouchableOpacity style={styles.btnConfirmar} onPress={simularReserva}>
            <Text style={styles.btnConfirmarText}>CONFIRMAR RESERVA</Text>
          </TouchableOpacity>
        </View>

        {/* NAVEGACIÓN PROVISIONAL */}
        <View style={styles.menuContainer}>
          <Button title="⬅️ VOLVER AL HOME" color="#003366" onPress={() => cambiarPantalla('Home')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { padding: 20 },
  brandTitle: { fontSize: 14, fontWeight: 'bold', color: '#003366', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529' },
  subtitle: { fontSize: 13, color: '#6c757d', marginBottom: 20 },
  listaContainer: { width: '100%' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ced4da', elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#e9ecef', paddingBottom: 8, marginBottom: 10 },
  codigoText: { fontSize: 16, fontWeight: 'bold', color: '#0056b3' },
  rutaText: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  rowInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#495057', width: '40%' },
  value: { fontSize: 13, color: '#212529', width: '60%', textAlign: 'right' },
  btnSeleccionar: { backgroundColor: '#f1f3f5', marginTop: 10, paddingVertical: 6, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#dee2e6' },
  btnSeleccionarText: { color: '#495057', fontSize: 12, fontWeight: 'bold' },
  formularioContainer: { marginTop: 10, padding: 15, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#b8daff', backgroundColor: '#f0f4f8' },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#b8daff', paddingBottom: 5 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#495057', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: '#ced4da' },
  btnConfirmar: { backgroundColor: '#0056b3', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  btnConfirmarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  menuContainer: { marginTop: 20, width: '100%' }
});