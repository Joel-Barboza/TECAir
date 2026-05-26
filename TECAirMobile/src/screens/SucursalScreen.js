import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function SucursalScreen({ cambiarPantalla }) {
  // Lista de sucursales física simulada para la maquetación
  const oficinas = [
    { id: '1', nombre: "Sucursal Central Alajuela", Ubicacion: "Aeropuerto Internacional Juan Santamaría", horario: "24/7", tel: "2222-0101" },
    { id: '2', nombre: "Sucursal San José Centro", Ubicacion: "Av. Central, contiguo al Teatro Nacional", horario: "8:00 AM - 6:00 PM", tel: "2222-0202" },
    { id: '3', nombre: "Sucursal Cartago", Ubicacion: "De la Plaza Mayor, 100m Este", horario: "8:00 AM - 5:00 PM", tel: "2222-0303" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brandTitle}>TECAir ✈️</Text>
        <Text style={styles.pageTitle}>Nuestras Sucursales</Text>
        <Text style={styles.subtitle}>Encuentra tu oficina de atención más cercana</Text>

        {/* Listado de Oficinas */}
        <View style={styles.listaContainer}>
          {oficinas.map((sucursal) => (
            <View key={sucursal.id} style={styles.card}>
              <Text style={styles.oficinaTitle}>📍 {sucursal.nombre}</Text>
              <Text style={styles.infoText}><Text style={styles.label}>Ubicación:</Text> {sucursal.Ubicacion}</Text>
              <Text style={styles.infoText}><Text style={styles.label}>Horario:</Text> {sucursal.horario}</Text>
              <Text style={styles.infoText}><Text style={styles.label}>Teléfono:</Text> {sucursal.tel}</Text>
              
              <TouchableOpacity style={styles.btnLlamar}>
                <Text style={styles.btnText}>Llamar a Sucursal</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Botón para regresar al Home */}
        <View style={styles.menuContainer}>
          <Button title="⬅️ VOLVER AL MENU PRINCIPAL" color="#003366" onPress={() => cambiarPantalla('Home')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { padding: 20 },
  brandTitle: { fontSize: 14, fontWeight: 'bold', color: '#003366', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#212529' },
  subtitle: { fontSize: 14, color: '#6c757d', marginBottom: 25 },
  listaContainer: { width: '100%' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#dee2e6', elevation: 2 },
  oficinaTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
  infoText: { fontSize: 13, color: '#495057', marginBottom: 5 },
  label: { fontWeight: 'bold', color: '#212529' },
  btnLlamar: { backgroundColor: '#e7f5ff', marginTop: 12, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#003366', fontWeight: 'bold', fontSize: 13 },
  menuContainer: { marginTop: 15, width: '100%' }
});