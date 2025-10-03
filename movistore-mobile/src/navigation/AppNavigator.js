// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Importar navegadores
import MainNavigator from './MainNavigator';

// Importar pantallas públicas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Importar pantallas de stack (fuera del tab)
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import CartScreen from '../screens/CartScreen'; // ✅ FALTABA
import ProfileScreen from '../screens/ProfileScreen'; // ✅ FALTABA
import ProductsScreen from '../screens/ProductsScreen'; // ✅ FALTABA
import HomeScreen from '../screens/HomeScreen'; // ✅ FALTABA

// Importar pantallas de admin
import AdminDashboard from '../screens/admin/AdminDashboard';

const Stack = createNativeStackNavigator();

// Componente de carga
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Mostrar loading mientras verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {!user ? (
        // Pantallas públicas - usuario NO autenticado
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Crear Cuenta' }}
          />
        </>
      ) : user.role === 'admin' ? (
        // Pantallas para ADMIN
        <>
          <Stack.Screen 
            name="AdminMain" 
            component={AdminDashboard}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        // Pantallas para CLIENTE
        <>
          <Stack.Screen 
            name="Main" 
            component={MainNavigator}
            options={{ headerShown: false }}
          />
          {/* ✅ TODAS las pantallas que se navegan desde cualquier lugar */}
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ title: 'Carrito' }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{ title: 'Finalizar Compra' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Mi Perfil' }}
          />
          <Stack.Screen 
            name="OrderHistory" 
            component={OrderHistoryScreen}
            options={{ title: 'Mis Pedidos' }}
          />
          <Stack.Screen 
            name="OrderConfirmation" 
            component={OrderConfirmationScreen}
            options={{ title: 'Confirmación de Pedido' }}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen}
            options={{ title: 'Detalle del Producto' }}
          />
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen}
            options={{ title: 'Productos' }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Inicio' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}