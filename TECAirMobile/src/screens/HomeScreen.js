import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';

export default function HomeScreen({ cambiarPantalla }) {
  // Lista de promociones exclusivas de la aerolínea
  const promociones = [
    { id: '1', codigo: 'VUE-012', destino: "San José ✈️ Miami", precio: 250, clase: "Económica", salida: "05/06/2026 - 08:30 AM", aeropuerto: "Juan Santamaría", avion: "Boeing 737", asientosDisponibles: 120, escalas: "Directo" },
    { id: '2', codigo: 'VUE-013', destino: "San José ✈️ Madrid", precio: 680, clase: "Ejecutiva", salida: "12/06/2026 - 22:15 PM", aeropuerto: "Juan Santamaría", avion: "Airbus A320", asientosDisponibles: 90, escalas: "1 Escala en Bogotá" },
    { id: '3', codigo: 'VUE-014', destino: "San José ✈️ Cancún", precio: 199, clase: "Económica", salida: "18/06/2026 - 11:00 AM", aeropuerto: "Juan Santamaría", avion: "Embraer 190", asientosDisponibles: 35, escalas: "Directo" },
  ];

  // Estados para controlar el Modal y la cantidad de campos/asientos
  const [modalVisible, setModalVisible] = useState(false);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [cantidadAsientos, setCantidadAsientos] = useState(1);

  // Abrir modal e inicializar el contador de asientos en 1
  const abrirDetalles = (vuelo) => {
    setVueloSeleccionado(vuelo);
    setCantidadAsientos(1); 
    setModalVisible(true);
  };

  // Modificar la cantidad de campos a reservar
  const ajustarAsientos = (operacion) => {
    if (operacion === 'mas' && cantidadAsientos < 10) {
      setCantidadAsientos(cantidadAsientos + 1);
    } else if (operacion === 'menos' && cantidadAsientos > 1) {
      setCantidadAsientos(cantidadAsientos - 1);
    }
  };

  // PROCESAR LA RESERVA REAL DE LA PROMOCIÓN
  const confirmarReservaPromocion = () => {
    setModalVisible(false);
    
    // Extraemos solo el nombre limpio del destino (ej: " Miami")
    const destinoLimpio = vueloSeleccionado.destino.split('✈️')[1];
    const costoTotal = vueloSeleccionado.precio * cantidadAsientos;

    // Alerta corregida: Informa con total precisión qué campos y qué vuelo reservó
    Alert.alert(
      "¡Reservación Confirmada! 🎉", 
      `Tu reserva se procesó con éxito.\n\n` +
      `• Vuelo: ${vueloSeleccionado.codigo}\n` +
      `• Destino:${destinoLimpio}\n` +
      `• Asientos Reservados: ${cantidadAsientos} campo(s)\n` +
      `• Total a Cancelar: $${costoTotal}\n\n` +
      `¡Gracias por viajar con TECAir!`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado */}
        <Text style={styles.brandTitle}>TECAir ✈️</Text>
        <Text style={styles.pageTitle}>Promociones del Día</Text>
        <Text style={styles.subtitle}>Selecciona una oferta exclusiva y asegura tus campos de inmediato</Text>

        {/* Lista de Tarjetas */}
        <View style={styles.listaContainer}>
          {promociones.map((vuelo) => (
            <View key={vuelo.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.codigoText}>{vuelo.codigo}</Text>
                <Text style={styles.claseBadge}>{vuelo.clase}</Text>
              </View>
              
              <Text style={styles.destinoText}>{vuelo.destino}</Text>
              
              <Text style={styles.precioText}>
                Tarifa Especial: <Text style={styles.monto}>${vuelo.precio}</Text>
              </Text>
              
              <TouchableOpacity style={styles.btnComprar} onPress={() => abrirDetalles(vuelo)}>
                <Text style={styles.btnText}>Ver Detalles y Reservar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* MENÚ DE NAVEGACIÓN INFERIOR */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menú de Navegación</Text>
          <Button title="Ir a Buscador de Vuelos (Tabla)" color="#2b8a3e" onPress={() => cambiarPantalla('TicketStack')} />
          <View style={{ height: 10 }} />
          <Button title="Ir a Sucursales" color="#003366" onPress={() => cambiarPantalla('Sucursal')} />
          <View style={{ height: 10 }} />
          <Button title="Cerrar Sesión" color="#c92a2a" onPress={() => cambiarPantalla('Register')} />
        </View>
      </ScrollView>

      {/* ================= MODAL DE DETALLES Y SELECCIÓN DE ASIENTOS ================= */}
      {vueloSeleccionado && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalCentrado}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>✈️ Resumen de la Promoción</Text>
              <Text style={styles.modalCodigo}>Código de Ruta: {vueloSeleccionado.codigo} ({vueloSeleccionado.clase})</Text>
              
              <View style={styles.divisor} />

              {/* Ficha técnica del itinerario */}
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>📍 Destino:</Text>
                <Text style={styles.modalValue}>{vueloSeleccionado.destino}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>📅 Horario:</Text>
                <Text style={styles.modalValue}>{vueloSeleccionado.salida}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>🏢 Terminal:</Text>
                <Text style={styles.modalValue}>{vueloSeleccionado.aeropuerto}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>🔄 Tipo de Vuelo:</Text>
                <Text style={styles.modalValue}>{vueloSeleccionado.escalas}</Text>
              </View>

              <View style={styles.divisor} />
              
              {/* INTERFAZ MEJORADA: SELECCIÓN DE CAMPOS EXACTOS */}
              <Text style={styles.sectionTitle}>🪑 ¿Cuántos campos desea reservar?</Text>
              <View style={styles.selectorAsientosContainer}>
                <TouchableOpacity style={styles.btnContador} onPress={() => ajustarAsientos('menos')}>
                  <Text style={styles.btnContadorText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.cantidadText}>{cantidadAsientos}</Text>
                
                <TouchableOpacity style={styles.btnContador} onPress={() => ajustarAsientos('mas')}>
                  <Text style={styles.btnContadorText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.disponiblesText}>(Quedan {vueloSeleccionado.asientosDisponibles} asientos disponibles)</Text>

              <View style={styles.divisor} />
              
              {/* Precio dinámico calculado en tiempo real */}
              <Text style={styles.modalPrecio}>Total a Pagar: ${vueloSeleccionado.precio * cantidadAsientos}</Text>

              {/* Botones de acción */}
              <TouchableOpacity style={styles.btnModalReservar} onPress={confirmarReservaPromocion}>
                <Text style={styles.btnModalReservarText}>CONFIRMAR MI RESERVA</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnModalCerrar} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnModalCerrarText}>Cancelar Operación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { padding: 20 },
  brandTitle: { fontSize: 14, fontWeight: 'bold', color: '#003366', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#212529' },
  subtitle: { fontSize: 13, color: '#6c757d', marginBottom: 20 },
  listaContainer: { width: '100%' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#dee2e6', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  codigoText: { fontSize: 14, fontWeight: 'bold', color: '#0056b3', backgroundColor: '#e7f5ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  claseBadge: { backgroundColor: '#f1f3f5', color: '#495057', fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  destinoText: { fontSize: 18, fontWeight: 'bold', color: '#212529', marginBottom: 5 },
  precioText: { fontSize: 14, color: '#495057', marginBottom: 15 },
  monto: { fontSize: 18, fontWeight: 'bold', color: '#2b8a3e' },
  btnComprar: { backgroundColor: '#003366', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  menuContainer: { marginTop: 15, padding: 15, backgroundColor: '#e9ecef', borderRadius: 10 },
  menuTitle: { fontSize: 12, fontWeight: 'bold', color: '#6c757d', marginBottom: 10, textAlign: 'center' },
  
  // MODAL
  modalCentrado: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalView: { width: '88%', backgroundColor: 'white', borderRadius: 16, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 19, fontWeight: 'bold', color: '#212529', marginBottom: 4 },
  modalCodigo: { fontSize: 13, color: '#6c757d', fontWeight: '500', marginBottom: 5 },
  divisor: { height: 1, backgroundColor: '#dee2e6', marginVertical: 12 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  modalLabel: { fontSize: 14, fontWeight: 'bold', color: '#495057' },
  modalValue: { fontSize: 14, color: '#212529' },
  
  // CONTROLES DE ASIENTOS COMPLETO
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#495057', textAlign: 'center', marginBottom: 10 },
  selectorAsientosContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 },
  btnContador: { backgroundColor: '#e9ecef', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ced4da' },
  btnContadorText: { fontSize: 20, fontWeight: 'bold', color: '#212529' },
  cantidadText: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 25, color: '#003366' },
  disponiblesText: { fontSize: 11, color: '#6c757d', textAlign: 'center', marginTop: 4, fontStyle: 'italic' },
  
  modalPrecio: { fontSize: 19, fontWeight: 'bold', color: '#2b8a3e', textAlign: 'center', marginVertical: 8 },
  btnModalReservar: { backgroundColor: '#0056b3', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnModalReservarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  btnModalCerrar: { marginTop: 8, paddingVertical: 10, alignItems: 'center' },
  btnModalCerrarText: { color: '#6c757d', fontWeight: 'bold', fontSize: 14 }
});