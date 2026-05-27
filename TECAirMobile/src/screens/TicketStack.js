import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

import { getDatabase } from '../database/database';
import { agregarPendienteSync, sincronizarPendientes } from '../services/SyncService';

export default function TicketStack({ cambiarPantalla, usuarioActual }) {
  const [vuelos, setVuelos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pagos, setPagos] = useState([]);

  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [asientosAReservar, setAsientosAReservar] = useState('');

  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');

  useEffect(() => {
    cargarVuelosSQLite();
    cargarReservasSQLite();
    cargarPagosSQLite();
  }, []);

  const cargarVuelosSQLite = async () => {
    try {
      const db = getDatabase();
      const data = await db.getAllAsync('SELECT * FROM vuelo ORDER BY vuelo_id');
      setVuelos(data);
    } catch (error) {
      console.error('Error cargando vuelos:', error);
      Alert.alert('Error', 'No se pudieron cargar los vuelos desde SQLite.');
    }
  };

  const cargarReservasSQLite = async () => {
    try {
      const db = getDatabase();

      const data = await db.getAllAsync(`
        SELECT 
          r.reserva_id,
          r.usuario_id,
          r.vuelo_id,
          r.fecha_reserva,
          r.asientos_reservados,
          r.estado_pago,
          r.total,
          r.synced,
          v.codigo,
          v.origen,
          v.destino
        FROM reserva r
        INNER JOIN vuelo v ON r.vuelo_id = v.vuelo_id
        ORDER BY r.fecha_reserva DESC
      `);

      setReservas(data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      Alert.alert('Error', 'No se pudieron cargar las reservas locales.');
    }
  };

  const cargarPagosSQLite = async () => {
    try {
      const db = getDatabase();

      const data = await db.getAllAsync(`
        SELECT 
          p.pago_id,
          p.reserva_id,
          p.monto,
          p.metodo_pago,
          p.ultimos_digitos,
          p.fecha_pago,
          p.synced,
          r.usuario_id,
          v.codigo,
          v.origen,
          v.destino
        FROM pago p
        INNER JOIN reserva r ON p.reserva_id = r.reserva_id
        INNER JOIN vuelo v ON r.vuelo_id = v.vuelo_id
        ORDER BY p.fecha_pago DESC
      `);

      setPagos(data);
    } catch (error) {
      console.error('Error cargando pagos:', error);
      Alert.alert('Error', 'No se pudieron cargar los pagos locales.');
    }
  };

  const confirmarReserva = async () => {
    if (!usuarioActual) {
      Alert.alert('Error', 'Debe iniciar sesión antes de reservar.');
      return;
    }

    if (!vueloSeleccionado || !asientosAReservar) {
      Alert.alert('Campos incompletos', 'Seleccione vuelo y cantidad de asientos.');
      return;
    }

    if (!/^\d+$/.test(asientosAReservar)) {
      Alert.alert('Error', 'La cantidad de asientos debe ser un número entero.');
      return;
    }

    const cantidad = Number(asientosAReservar);

    if (cantidad <= 0) {
      Alert.alert('Error', 'La cantidad de asientos debe ser mayor a cero.');
      return;
    }

    if (cantidad > vueloSeleccionado.asientos) {
      Alert.alert('Error', 'No hay suficientes asientos disponibles.');
      return;
    }

    try {
      const db = getDatabase();

      const reservaId = Math.floor(Math.random() * 100000);
      const total = cantidad * vueloSeleccionado.precio_boleto;

      const reserva = {
        reserva_id: reservaId,
        usuario_id: usuarioActual.usuario_id,
        vuelo_id: vueloSeleccionado.vuelo_id,
        fecha_reserva: new Date().toISOString(),
        asientos_reservados: cantidad,
        estado_pago: 'Pendiente',
        total
      };

      await db.runAsync(
        `INSERT INTO reserva 
        (reserva_id, usuario_id, vuelo_id, fecha_reserva, asientos_reservados, estado_pago, total, synced)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [
          reserva.reserva_id,
          reserva.usuario_id,
          reserva.vuelo_id,
          reserva.fecha_reserva,
          reserva.asientos_reservados,
          reserva.estado_pago,
          reserva.total
        ]
      );

      await db.runAsync(
        'UPDATE vuelo SET asientos = asientos - ? WHERE vuelo_id = ?',
        [cantidad, vueloSeleccionado.vuelo_id]
      );

      await agregarPendienteSync('reserva', 'POST', '/reservas', reserva);

      Alert.alert(
        'Reserva guardada',
        `Reserva creada en SQLite.\nReserva ID: ${reservaId}\nTotal: $${total}`
      );

      setVueloSeleccionado(null);
      setAsientosAReservar('');

      cargarVuelosSQLite();
      cargarReservasSQLite();

    } catch (error) {
      console.error('Error guardando reserva:', error);
      Alert.alert('Error', 'No se pudo guardar la reserva.');
    }
  };

  const pagarReserva = async () => {
    if (!reservaSeleccionada) {
      Alert.alert('Error', 'Seleccione una reserva pendiente.');
      return;
    }

    if (reservaSeleccionada.estado_pago === 'Pagado') {
      Alert.alert('Aviso', 'Esta reserva ya fue pagada.');
      return;
    }

    if (!nombreTarjeta.trim()) {
      Alert.alert('Error', 'Ingrese el nombre del titular.');
      return;
    }

    const tarjetaLimpia = numeroTarjeta.replace(/\s/g, '');

    if (!/^\d+$/.test(tarjetaLimpia)) {
      Alert.alert('Error', 'La tarjeta solo debe contener números.');
      return;
    }

    if (tarjetaLimpia.length < 12) {
      Alert.alert('Error', 'La tarjeta debe tener al menos 12 dígitos.');
      return;
    }

    try {
      const db = getDatabase();

      const pagoExistente = await db.getFirstAsync(
        'SELECT * FROM pago WHERE reserva_id = ?',
        [reservaSeleccionada.reserva_id]
      );

      if (pagoExistente) {
        Alert.alert('Aviso', 'Esta reserva ya tiene un pago registrado.');
        return;
      }

      const pagoId = Math.floor(Math.random() * 100000);
      const ultimosDigitos = tarjetaLimpia.slice(-4);

      const pago = {
        pago_id: pagoId,
        reserva_id: reservaSeleccionada.reserva_id,
        monto: reservaSeleccionada.total,
        metodo_pago: 'Tarjeta',
        ultimos_digitos: ultimosDigitos,
        fecha_pago: new Date().toISOString()
      };

      await db.runAsync(
        `INSERT INTO pago
        (pago_id, reserva_id, monto, metodo_pago, ultimos_digitos, fecha_pago, synced)
        VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [
          pago.pago_id,
          pago.reserva_id,
          pago.monto,
          pago.metodo_pago,
          pago.ultimos_digitos,
          pago.fecha_pago
        ]
      );

      await db.runAsync(
        `UPDATE reserva SET estado_pago = 'Pagado' WHERE reserva_id = ?`,
        [reservaSeleccionada.reserva_id]
      );

      await agregarPendienteSync('pago', 'POST', '/pagos', pago);

      Alert.alert(
        'Pago realizado',
        `Pago guardado localmente en SQLite.\nMonto: $${pago.monto}\nTarjeta: **** ${ultimosDigitos}`
      );

      setReservaSeleccionada(null);
      setNumeroTarjeta('');
      setNombreTarjeta('');

      cargarReservasSQLite();
      cargarPagosSQLite();

    } catch (error) {
      console.error('Error guardando pago:', error);
      Alert.alert('Error', 'No se pudo guardar el pago.');
    }
  };

  const sincronizar = async () => {
    const result = await sincronizarPendientes();
    Alert.alert('Sincronización', result.message);

    cargarReservasSQLite();
    cargarPagosSQLite();
  };

  const reservasPendientes = reservas.filter((r) => r.estado_pago !== 'Pagado');
  const reservasPagadas = reservas.filter((r) => r.estado_pago === 'Pagado');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headerBox}>
          <Text style={styles.brandTitle}>TECAir ✈️</Text>
          <Text style={styles.pageTitle}>Reservaciones móviles</Text>

          {usuarioActual ? (
            <Text style={styles.headerText}>
              Usuario: {usuarioActual.nombre} | ID: {usuarioActual.usuario_id}
            </Text>
          ) : (
            <Text style={styles.headerText}>No hay usuario activo</Text>
          )}
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>1. Seleccionar vuelo</Text>

          {vuelos.map((vuelo) => (
            <TouchableOpacity
              key={vuelo.vuelo_id}
              style={[
                styles.flightCard,
                vueloSeleccionado?.vuelo_id === vuelo.vuelo_id && styles.flightCardSelected
              ]}
              onPress={() => setVueloSeleccionado(vuelo)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.codigoText}>{vuelo.codigo}</Text>
                <Text style={styles.priceText}>${vuelo.precio_boleto}</Text>
              </View>

              <Text style={styles.rutaText}>{vuelo.origen} → {vuelo.destino}</Text>
              <Text style={styles.detailText}>Fecha: {vuelo.fecha_salida} | Hora: {vuelo.salida}</Text>
              <Text style={styles.detailText}>Asientos disponibles: {vuelo.asientos}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>2. Crear reservación</Text>

          <Text style={styles.inputLabel}>Vuelo seleccionado</Text>
          <TextInput
            style={styles.input}
            value={vueloSeleccionado ? `${vueloSeleccionado.codigo} - ${vueloSeleccionado.destino}` : ''}
            editable={false}
            placeholder="Seleccione un vuelo arriba"
          />

          <Text style={styles.inputLabel}>Cantidad de asientos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 1"
            keyboardType="numeric"
            value={asientosAReservar}
            onChangeText={setAsientosAReservar}
          />

          <TouchableOpacity style={styles.btnPrimary} onPress={confirmarReserva}>
            <Text style={styles.btnText}>GUARDAR RESERVA EN SQLITE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>3. Reservas pendientes de pago</Text>

          {reservasPendientes.length === 0 ? (
            <Text style={styles.emptyText}>No hay reservas pendientes.</Text>
          ) : (
            reservasPendientes.map((reserva) => (
              <TouchableOpacity
                key={reserva.reserva_id}
                style={[
                  styles.reservaCard,
                  reservaSeleccionada?.reserva_id === reserva.reserva_id && styles.reservaCardSelected
                ]}
                onPress={() => setReservaSeleccionada(reserva)}
              >
                <Text style={styles.codigoText}>Reserva #{reserva.reserva_id}</Text>
                <Text style={styles.detailText}>Vuelo: {reserva.codigo}</Text>
                <Text style={styles.detailText}>Ruta: {reserva.origen} → {reserva.destino}</Text>
                <Text style={styles.detailText}>Asientos: {reserva.asientos_reservados}</Text>
                <Text style={styles.totalText}>Total: ${reserva.total}</Text>
                <Text style={styles.pendingText}>Estado: Pendiente de pago</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>4. Pago simulado</Text>

          <Text style={styles.inputLabel}>Reserva seleccionada</Text>
          <TextInput
            style={styles.input}
            value={reservaSeleccionada ? `Reserva #${reservaSeleccionada.reserva_id} - $${reservaSeleccionada.total}` : ''}
            editable={false}
            placeholder="Seleccione una reserva pendiente"
          />

          <Text style={styles.inputLabel}>Nombre en tarjeta</Text>
          <TextInput
            style={styles.input}
            value={nombreTarjeta}
            onChangeText={setNombreTarjeta}
            placeholder="Nombre del titular"
          />

          <Text style={styles.inputLabel}>Número de tarjeta</Text>
          <TextInput
            style={styles.input}
            value={numeroTarjeta}
            onChangeText={setNumeroTarjeta}
            placeholder="Ej: 4111111111111111"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.btnSuccess} onPress={pagarReserva}>
            <Text style={styles.btnText}>PAGAR RESERVA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>5. Reservas pagadas</Text>

          {reservasPagadas.length === 0 ? (
            <Text style={styles.emptyText}>No hay reservas pagadas todavía.</Text>
          ) : (
            reservasPagadas.map((reserva) => (
              <View key={reserva.reserva_id} style={styles.paidCard}>
                <Text style={styles.codigoText}>Reserva #{reserva.reserva_id}</Text>
                <Text style={styles.detailText}>Vuelo: {reserva.codigo}</Text>
                <Text style={styles.detailText}>Ruta: {reserva.origen} → {reserva.destino}</Text>
                <Text style={styles.detailText}>Asientos: {reserva.asientos_reservados}</Text>
                <Text style={styles.totalText}>Total: ${reserva.total}</Text>
                <Text style={styles.successText}>Estado: Pagado</Text>
                <Text style={styles.detailText}>
                  Sync: {reserva.synced === 1 ? 'Sincronizada' : 'Pendiente'}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>6. Pagos guardados localmente</Text>

          {pagos.length === 0 ? (
            <Text style={styles.emptyText}>No hay pagos locales todavía.</Text>
          ) : (
            pagos.map((pago) => (
              <View key={pago.pago_id} style={styles.pagoCard}>
                <Text style={styles.codigoText}>Pago #{pago.pago_id}</Text>
                <Text style={styles.detailText}>Reserva: #{pago.reserva_id}</Text>
                <Text style={styles.detailText}>Vuelo: {pago.codigo}</Text>
                <Text style={styles.detailText}>Ruta: {pago.origen} → {pago.destino}</Text>
                <Text style={styles.totalText}>Monto: ${pago.monto}</Text>
                <Text style={styles.detailText}>Método: {pago.metodo_pago}</Text>
                <Text style={styles.detailText}>Tarjeta: **** {pago.ultimos_digitos}</Text>
                <Text style={styles.detailText}>
                  Sync: {pago.synced === 1 ? 'Sincronizado' : 'Pendiente'}
                </Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.btnSync} onPress={sincronizar}>
          <Text style={styles.btnText}>SINCRONIZAR PENDIENTES</Text>
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          <Button
            title="⬅️ VOLVER AL HOME"
            color="#003366"
            onPress={() => cambiarPantalla('Home')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { padding: 18 },

  headerBox: {
    backgroundColor: '#003366',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16
  },

  brandTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#dbeafe',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4
  },

  headerText: {
    fontSize: 13,
    color: '#e7f5ff',
    marginTop: 8
  },

  sectionBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dee2e6'
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12
  },

  flightCard: {
    backgroundColor: '#f8f9fa',
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ced4da'
  },

  flightCardSelected: {
    borderColor: '#2b8a3e',
    backgroundColor: '#ebfbee'
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },

  codigoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0056b3'
  },

  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2b8a3e'
  },

  rutaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5
  },

  detailText: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 3
  },

  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginTop: 3
  },

  pendingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f08c00',
    marginTop: 4
  },

  successText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginTop: 4
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 5
  },

  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ced4da'
  },

  reservaCard: {
    backgroundColor: '#fff7e6',
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffd43b'
  },

  reservaCardSelected: {
    borderColor: '#f08c00',
    backgroundColor: '#fff3bf'
  },

  paidCard: {
    backgroundColor: '#ebfbee',
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8ce99a'
  },

  pagoCard: {
    backgroundColor: '#e7f5ff',
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#74c0fc'
  },

  btnPrimary: {
    backgroundColor: '#0056b3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },

  btnSuccess: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },

  btnSync: {
    backgroundColor: '#495057',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },

  emptyText: {
    color: '#6c757d',
    fontStyle: 'italic'
  },

  menuContainer: {
    marginTop: 5,
    marginBottom: 20
  }
});