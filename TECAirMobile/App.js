import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { initDatabase } from './src/database/database';
import RegisterScreen from './src/screens/RegisterScreen'; // <-- Sin extensión, Expo lo busca automáticamente como .js

export default function App() {
  
  useEffect(() => {
    try {
      // Inicializa la base de datos local al arrancar la app
      initDatabase();
    } catch (error) {
      console.error("Error al inicializar la base de datos:", error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <RegisterScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});