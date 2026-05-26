import React, { useState } from 'react';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SucursalScreen from './src/screens/SucursalScreen';
import TicketStack from './src/screens/TicketStack'; // <-- Importamos la nueva vista

export default function App() {
  const [pantallaActual, setPantallaActual] = useState('Register');

  const cambiarPantalla = (nombrePantalla) => {
    setPantallaActual(nombrePantalla);
  };

  // Renderizado condicional según la pantalla activa
  if (pantallaActual === 'Register') {
    return <RegisterScreen cambiarPantalla={cambiarPantalla} />;
  }
  if (pantallaActual === 'Home') {
    return <HomeScreen cambiarPantalla={cambiarPantalla} />;
  }
  if (pantallaActual === 'Sucursal') {
    return <SucursalScreen cambiarPantalla={cambiarPantalla} />;
  }
  if (pantallaActual === 'TicketStack') {
    return <TicketStack cambiarPantalla={cambiarPantalla} />;
  }

  return null;
}