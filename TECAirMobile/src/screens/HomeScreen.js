import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ cambiarPantalla }) {
  const promociones = [
    { id: '1', destino: "San José ✈️ Miami", precio: "$250", clase: "Económica" },
    { id: '2', destino: "San José ✈️ Madrid", precio: "$680", clase: "Ejecutiva" },
    { id: '3', destino: "San José ✈️ Cancún", precio: "$199", clase: "Económica" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brandTitle}>TECAir ✈️</Text>
        <Text style={styles.pageTitle}>Promociones del Día</Text>
        <Text style={styles.subtitle}>Viaja con las mejores tarifas del mercado</Text>

        <View style={styles.listaContainer}>
          {promociones.map((vuelo) => (
            <View key={vuelo.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.destinoText}>{vuelo.destino}</Text>
                <Text style={styles.claseBadge}>{vuelo.clase}</Text>
              </View>
              
              <Text style={styles.precioText}>
                Desde: <Text style={styles.monto}>{vuelo.precio}</Text>
              </Text>
              
              <TouchableOpacity style={styles.btnComprar}>
                <Text style={styles.btnText}>Ver Detalles del Vuelo</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menú de Navegación</Text>
          <Button title="Ir a Sucursales" color="#003366" onPress={() => cambiarPantalla('Sucursal')} />
          <View style={{ height: 10 }} />
          <Button title="Cerrar Sesión" color="#c92a2a" onPress={() => cambiarPantalla('Register')} />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  destinoText: { fontSize: 18, fontWeight: 'bold', color: '#343a40' },
  claseBadge: { backgroundColor: '#e7f5ff', color: '#003366', fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  precioText: { fontSize: 15, color: '#495057', marginBottom: 15 },
  monto: { fontSize: 18, fontWeight: 'bold', color: '#2b8a3e' },
  btnComprar: { backgroundColor: '#003366', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  menuContainer: { marginTop: 20, padding: 15, backgroundColor: '#e9ecef', borderRadius: 10 },
  menuTitle: { fontSize: 12, fontWeight: 'bold', color: '#6c757d', marginBottom: 10, textAlign: 'center' }
});