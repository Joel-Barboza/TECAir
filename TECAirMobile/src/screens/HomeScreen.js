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
  const [cantidadAsientos, setCantidadAsientos] = useState(1);

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
    setCantidadAsientos(1);
    setModalVisible(true);
  };

  const ajustarAsientos = (operacion) => {
    if (operacion === 'mas' && cantidadAsientos < 10) {
      setCantidadAsientos(cantidadAsientos + 1);
    } else if (operacion === 'menos' && cantidadAsientos > 1) {
      setCantidadAsientos(cantidadAsientos - 1);
    }
  };

  const confirmarReservaPromocion = () => {
    setModalVisible(false);

    Alert.alert(
      'Promoción seleccionada',
      `Promoción cargada desde SQLite.\n\n` +
      `Vuelo: ${promocionSeleccionada.codigo}\n` +
      `Ruta: ${promocionSeleccionada.origen} → ${promocionSeleccionada.destino}\n` +
      `Asientos: ${cantidadAsientos}\n` +
      `Total: $${promocionSeleccionada.precio_promocion * cantidadAsientos}\n\n` +
      `Para completar la reserva, vaya al buscador de vuelos.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.brandTitle}>TECAir ✈️</Text>
        <Text style={styles.pageTitle}>Promociones</Text>
        <Text style={styles.subtitle}>
          Promociones cargadas desde SQLite
        </Text>

        <View style={styles.listaContainer}>
          {promociones.length === 0 ? (
            <Text style={styles.emptyText}>No hay promociones disponibles.</Text>
          ) : (
            promociones.map((promo) => (
              <View key={promo.promocion_id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.codigoText}>
                    {promo.codigo || `PROMO-${promo.promocion_id}`}
                  </Text>
                  <Text style={styles.claseBadge}>Promoción</Text>
                </View>

                <Text style={styles.destinoText}>
                  {promo.origen} ✈️ {promo.destino}
                </Text>

                <Text style={styles.precioText}>
                  Precio promocional:{' '}
                  <Text style={styles.monto}>${promo.precio_promocion}</Text>
                </Text>

                <Text style={styles.detalleText}>
                  Vigencia: {promo.fecha_inicio} al {promo.fecha_fin}
                </Text>

                <Text style={styles.detalleText}>
                  Fecha de salida: {promo.fecha_salida || 'No definida'}
                </Text>

                <Text style={styles.detalleText}>
                  Hora: {promo.salida || 'No definida'}
                </Text>

                <Text style={styles.detalleText}>
                  Asientos disponibles: {promo.asientos ?? 'No definido'}
                </Text>

                <TouchableOpacity
                  style={styles.btnComprar}
                  onPress={() => abrirDetalles(promo)}
                >
                  <Text style={styles.btnText}>Ver detalles</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menú de navegación</Text>

          <Button
            title="Ir a Buscador de Vuelos"
            color="#2b8a3e"
            onPress={() => cambiarPantalla('TicketStack')}
          />

          <View style={{ height: 10 }} />

          <Button
            title="Ir a Sucursales"
            color="#003366"
            onPress={() => cambiarPantalla('Sucursal')}
          />

          <View style={{ height: 10 }} />

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

              <Text style={styles.modalTitle}>Resumen de Promoción</Text>

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

              <View style={styles.divisor} />

              <Text style={styles.sectionTitle}>
                ¿Cuántos campos desea reservar?
              </Text>

              <View style={styles.selectorAsientosContainer}>
                <TouchableOpacity
                  style={styles.btnContador}
                  onPress={() => ajustarAsientos('menos')}
                >
                  <Text style={styles.btnContadorText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.cantidadText}>{cantidadAsientos}</Text>

                <TouchableOpacity
                  style={styles.btnContador}
                  onPress={() => ajustarAsientos('mas')}
                >
                  <Text style={styles.btnContadorText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalPrecio}>
                Total: ${promocionSeleccionada.precio_promocion * cantidadAsientos}
              </Text>

              <TouchableOpacity
                style={styles.btnModalReservar}
                onPress={confirmarReservaPromocion}
              >
                <Text style={styles.btnModalReservarText}>CONTINUAR</Text>
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

  brandTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 5
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529'
  },

  subtitle: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 20
  },

  listaContainer: { width: '100%' },

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
    alignItems: 'center',
    marginBottom: 8
  },

  codigoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0056b3',
    backgroundColor: '#e7f5ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },

  claseBadge: {
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
    marginBottom: 5
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

  btnComprar: {
    backgroundColor: '#003366',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
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

  menuTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 10,
    textAlign: 'center'
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
    fontSize: 19,
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
    marginBottom: 6
  },

  divisor: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 12
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 10
  },

  selectorAsientosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  },

  btnContador: {
    backgroundColor: '#e9ecef',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da'
  },

  btnContadorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529'
  },

  cantidadText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 25,
    color: '#003366'
  },

  modalPrecio: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2b8a3e',
    textAlign: 'center',
    marginVertical: 8
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