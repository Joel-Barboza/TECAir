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

  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [asientosAReservar, setAsientosAReservar] = useState('');

  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');

  useEffect(() => {
    cargarVuelosSQLite();
    cargarReservasSQLite();
  }, []);

  const cargarVuelosSQLite = async () => {
    const db = getDatabase();
    const data = await db.getAllAsync('SELECT * FROM vuelo ORDER BY vuelo_id');
    setVuelos(data);
  };

  const cargarReservasSQLite = async () => {
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
      console.error(error);
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

    if (!numeroTarjeta || numeroTarjeta.length < 4 || !nombreTarjeta.trim()) {
      Alert.alert('Error', 'Ingrese nombre y número de tarjeta válido.');
      return;
    }

    try {
      const db = getDatabase();

      const pagoId = Math.floor(Math.random() * 100000);
      const ultimosDigitos = numeroTarjeta.slice(-4);

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
        `Pago simulado guardado en SQLite.\nMonto: $${pago.monto}\nTarjeta: **** ${ultimosDigitos}`
      );

      setReservaSeleccionada(null);
      setNumeroTarjeta('');
      setNombreTarjeta('');

      cargarReservasSQLite();

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el pago.');
    }
  };

  const sincronizar = async () => {
    const result = await sincronizarPendientes();
    Alert.alert('Sincronización', result.message);
    cargarReservasSQLite();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.brandTitle}>TECAir ✈️</Text>
        <Text style={styles.pageTitle}>Reservaciones móviles</Text>

        {usuarioActual && (
          <View style={styles.userBox}>
            <Text style={styles.userText}>Usuario: {usuarioActual.nombre}</Text>
            <Text style={styles.userText}>ID: {usuarioActual.usuario_id}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Vuelos disponibles</Text>

        {vuelos.map((vuelo) => (
          <View key={vuelo.vuelo_id} style={styles.card}>
            <Text style={styles.codigoText}>{vuelo.codigo}</Text>
            <Text style={styles.rutaText}>{vuelo.origen} → {vuelo.destino}</Text>
            <Text>Fecha: {vuelo.fecha_salida}</Text>
            <Text>Hora: {vuelo.salida}</Text>
            <Text>Precio: ${vuelo.precio_boleto}</Text>
            <Text>Asientos disponibles: {vuelo.asientos}</Text>

            <TouchableOpacity
              style={styles.btnSeleccionar}
              onPress={() => setVueloSeleccionado(vuelo)}
            >
              <Text style={styles.btnSeleccionarText}>Seleccionar vuelo</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.formularioContainer}>
          <Text style={styles.formTitle}>Crear reservación</Text>

          <Text style={styles.inputLabel}>Vuelo seleccionado</Text>
          <TextInput
            style={styles.input}
            value={vueloSeleccionado ? `${vueloSeleccionado.codigo} - ${vueloSeleccionado.destino}` : ''}
            editable={false}
            placeholder="Seleccione un vuelo"
          />

          <Text style={styles.inputLabel}>Cantidad de asientos</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            keyboardType="numeric"
            value={asientosAReservar}
            onChangeText={setAsientosAReservar}
          />

          <TouchableOpacity style={styles.btnConfirmar} onPress={confirmarReserva}>
            <Text style={styles.btnConfirmarText}>GUARDAR RESERVA EN SQLITE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Reservas guardadas localmente</Text>

        {reservas.length === 0 ? (
          <Text style={styles.emptyText}>No hay reservas locales todavía.</Text>
        ) : (
          reservas.map((reserva) => (
            <View key={reserva.reserva_id} style={styles.reservaCard}>
              <Text style={styles.codigoText}>Reserva #{reserva.reserva_id}</Text>
              <Text>Vuelo: {reserva.codigo}</Text>
              <Text>Ruta: {reserva.origen} → {reserva.destino}</Text>
              <Text>Asientos: {reserva.asientos_reservados}</Text>
              <Text>Total: ${reserva.total}</Text>
              <Text>Pago: {reserva.estado_pago}</Text>
              <Text>Sync: {reserva.synced === 1 ? 'Sincronizada' : 'Pendiente'}</Text>

              {reserva.estado_pago !== 'Pagado' && (
                <TouchableOpacity
                  style={styles.btnPagar}
                  onPress={() => setReservaSeleccionada(reserva)}
                >
                  <Text style={styles.btnConfirmarText}>Seleccionar para pagar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        <View style={styles.formularioPago}>
          <Text style={styles.formTitle}>Pago simulado</Text>

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

          <TouchableOpacity style={styles.btnPagar} onPress={pagarReserva}>
            <Text style={styles.btnConfirmarText}>PAGAR RESERVA</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnSync} onPress={sincronizar}>
          <Text style={styles.btnConfirmarText}>SINCRONIZAR PENDIENTES</Text>
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
  container: { padding: 20 },
  brandTitle: { fontSize: 14, fontWeight: 'bold', color: '#003366', letterSpacing: 2 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 10 },
  userBox: { backgroundColor: '#e7f5ff', padding: 12, borderRadius: 8, marginBottom: 15 },
  userText: { color: '#003366', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ced4da' },
  reservaCard: { backgroundColor: '#fff7e6', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ffd43b' },
  codigoText: { fontSize: 16, fontWeight: 'bold', color: '#0056b3' },
  rutaText: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  btnSeleccionar: { backgroundColor: '#f1f3f5', marginTop: 10, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  btnSeleccionarText: { color: '#495057', fontSize: 12, fontWeight: 'bold' },
  formularioContainer: { marginTop: 10, padding: 15, backgroundColor: '#f0f4f8', borderRadius: 10, borderWidth: 1, borderColor: '#b8daff' },
  formularioPago: { marginTop: 15, padding: 15, backgroundColor: '#edf7ed', borderRadius: 10, borderWidth: 1, borderColor: '#b2d8b2' },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 15 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#495057', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: '#ced4da' },
  btnConfirmar: { backgroundColor: '#0056b3', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  btnPagar: { backgroundColor: '#2b8a3e', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnSync: { backgroundColor: '#495057', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 20 },
  btnConfirmarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#6c757d', fontStyle: 'italic', marginBottom: 15 },
  menuContainer: { marginTop: 20, width: '100%' }
});