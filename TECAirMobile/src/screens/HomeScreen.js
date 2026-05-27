import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';

import { getDatabase } from '../database/database';

export default function HomeScreen({ cambiarPantalla }) {
  const [promociones, setPromociones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);

  useEffect(() => {
    cargarPromocionesSQLite();
  }, []);

  const cargarPromocionesSQLite = async () => {
    try {
      const db = getDatabase();

      const data = await db.getAllAsync(`
        SELECT 
          p.promocion_id,
          p.vuelo_id,
          p.origen,
          p.destino,
          p.precio_promocion,
          p.fecha_inicio,
          p.fecha_fin,
          v.codigo,
          v.salida,
          v.fecha_salida,
          v.asientos
        FROM promocion p
        LEFT JOIN vuelo v ON p.vuelo_id = v.vuelo_id
        ORDER BY p.promocion_id
      `);

      setPromociones(data);
    } catch (error) {
      console.error('Error cargando promociones:', error);
      Alert.alert('Error', 'No se pudieron cargar las promociones desde SQLite.');
    }
  };

  const abrirDetalles = (promo) => {
    setPromocionSeleccionada(promo);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headerBox}>
          <Text style={styles.brandTitle}>TECAir ✈️</Text>
          <Text style={styles.pageTitle}>App Móvil de Reservaciones</Text>
          <Text style={styles.subtitle}>
            Promociones, vuelos, reservas y pagos usando SQLite local.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => cambiarPantalla('TicketStack')}
        >
          <Text style={styles.mainButtonText}>IR A RESERVACIONES</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Promociones disponibles</Text>

        {promociones.length === 0 ? (
          <Text style={styles.emptyText}>No hay promociones disponibles.</Text>
        ) : (
          promociones.map((promo) => (
            <View key={promo.promocion_id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.codigoText}>
                  {promo.codigo || `PROMO-${promo.promocion_id}`}
                </Text>
                <Text style={styles.badge}>SQLite</Text>
              </View>

              <Text style={styles.destinoText}>
                {promo.origen} → {promo.destino}
              </Text>

              <Text style={styles.precioText}>
                Precio promocional: <Text style={styles.monto}>${promo.precio_promocion}</Text>
              </Text>

              <Text style={styles.detalleText}>
                Vigencia: {promo.fecha_inicio} al {promo.fecha_fin}
              </Text>

              <Text style={styles.detalleText}>
                Salida: {promo.fecha_salida || 'No definida'} - {promo.salida || 'No definida'}
              </Text>

              <Text style={styles.detalleText}>
                Asientos disponibles: {promo.asientos ?? 'No definido'}
              </Text>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => abrirDetalles(promo)}
              >
                <Text style={styles.secondaryButtonText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.menuContainer}>
          <Button
            title="Cerrar Sesión"
            color="#c92a2a"
            onPress={() => cambiarPantalla('Register')}
          />
        </View>
      </ScrollView>

      {promocionSeleccionada && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalCentrado}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Detalle de promoción</Text>

              <Text style={styles.modalCodigo}>
                {promocionSeleccionada.codigo || `PROMO-${promocionSeleccionada.promocion_id}`}
              </Text>

              <View style={styles.divisor} />

              <Text style={styles.modalText}>
                Ruta: {promocionSeleccionada.origen} → {promocionSeleccionada.destino}
              </Text>

              <Text style={styles.modalText}>
                Precio: ${promocionSeleccionada.precio_promocion}
              </Text>

              <Text style={styles.modalText}>
                Fecha salida: {promocionSeleccionada.fecha_salida || 'No definida'}
              </Text>

              <Text style={styles.modalText}>
                Hora salida: {promocionSeleccionada.salida || 'No definida'}
              </Text>

              <Text style={styles.modalText}>
                Asientos disponibles: {promocionSeleccionada.asientos ?? 'No definido'}
              </Text>

              <View style={styles.divisor} />

              <TouchableOpacity
                style={styles.btnModalReservar}
                onPress={() => {
                  setModalVisible(false);
                  cambiarPantalla('TicketStack');
                }}
              >
                <Text style={styles.btnModalReservarText}>Ir a reservar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnModalCerrar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnModalCerrarText}>Cerrar</Text>
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

  headerBox: {
    backgroundColor: '#003366',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18
  },

  brandTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dbeafe',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },

  subtitle: {
    fontSize: 13,
    color: '#e7f5ff',
    marginTop: 6
  },

  mainButton: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },

  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
    elevation: 2
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  codigoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0056b3',
    backgroundColor: '#e7f5ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },

  badge: {
    backgroundColor: '#f1f3f5',
    color: '#495057',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20
  },

  destinoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 6
  },

  precioText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5
  },

  monto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b8a3e'
  },

  detalleText: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 3
  },

  secondaryButton: {
    backgroundColor: '#003366',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },

  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  emptyText: {
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 15
  },

  menuContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 10
  },

  modalCentrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  modalView: {
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 22,
    elevation: 5
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4
  },

  modalCodigo: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 5
  },

  modalText: {
    fontSize: 14,
    color: '#212529',
    marginBottom: 8
  },

  divisor: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 12
  },

  btnModalReservar: {
    backgroundColor: '#0056b3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },

  btnModalReservarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },

  btnModalCerrar: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },

  btnModalCerrarText: {
    color: '#6c757d',
    fontWeight: 'bold',
    fontSize: 14
  }
});