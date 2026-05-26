import React, { useState } from 'react';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SucursalScreen from './src/screens/SucursalScreen';

export default function App() {
  // Este estado controla cuál pantalla se ve en el emulador.
  // Iniciamos con 'Register' para que sea lo primero que aparezca.
  const [pantallaActual, setPantallaActual] = useState('Register');

  // Función para cambiar de pantalla de forma limpia
  const cambiarPantalla = (nombrePantalla) => {
    setPantallaActual(nombrePantalla);
  };

  // Dependiendo del valor de 'pantallaActual', renderizamos la interfaz correspondiente
  if (pantallaActual === 'Register') {
    return <RegisterScreen cambiarPantalla={cambiarPantalla} />;
  }

  if (pantallaActual === 'Home') {
    return <HomeScreen cambiarPantalla={cambiarPantalla} />;
  }

  if (pantallaActual === 'Sucursal') {
    return <SucursalScreen cambiarPantalla={cambiarPantalla} />;
  }

  return null;
}