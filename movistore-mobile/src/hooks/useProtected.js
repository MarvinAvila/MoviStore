import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para proteger contenido específico que requiere autenticación
 * o rol específico
 */
export const useProtected = (requiredRole = null) => {
  const { user, isLoading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirigir al login si no hay usuario
      navigation.navigate('Login');
      return;
    }

    if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      // Redirigir al home si no tiene el rol requerido
      navigation.navigate('Home');
    }
  }, [user, isLoading, requiredRole, navigation]);

  return {
    user,
    isLoading,
    hasAccess: !isLoading && user && (!requiredRole || user.role === requiredRole)
  };
};