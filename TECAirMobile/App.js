import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SucursalScreen from './src/screens/SucursalScreen';
import TicketStack from './src/screens/TicketStack';

import { initDatabase } from './src/database/database';

export default function App() {
  const [pantalla, setPantalla] = useState('Register');
  const [dbReady, setDbReady] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    initDatabase();
    setDbReady(true);
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  const cambiarPantalla = (nombre) => setPantalla(nombre);

  if (pantalla === 'Register') {
    return (
      <RegisterScreen
        cambiarPantalla={cambiarPantalla}
        setUsuarioActual={setUsuarioActual}
      />
    );
  }

  if (pantalla === 'Home') {
    return <HomeScreen cambiarPantalla={cambiarPantalla} />;
  }

  if (pantalla === 'Sucursal') {
    return <SucursalScreen cambiarPantalla={cambiarPantalla} />;
  }

  if (pantalla === 'TicketStack') {
    return (
      <TicketStack
        cambiarPantalla={cambiarPantalla}
        usuarioActual={usuarioActual}
      />
    );
  }

  return (
    <RegisterScreen
      cambiarPantalla={cambiarPantalla}
      setUsuarioActual={setUsuarioActual}
    />
  );
}