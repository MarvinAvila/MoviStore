import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * En React Native, manejamos la protección a nivel de navegación
 * pero este componente puede usarse para contenido específico
 */
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    // En React Native, la redirección se maneja en el navigator
    // Este componente simplemente no renderiza el contenido si no hay usuario
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;