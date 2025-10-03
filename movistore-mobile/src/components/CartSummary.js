import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';

// ✅ Función segura para formatear precios
const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return '0.00';
  }
  const numPrice = Number(price);
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

const CartSummary = () => {
  const { items, total } = useCart();
  const navigation = useNavigation();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // ✅ Precios formateados
  const formattedTotal = formatPrice(total);
  const formattedSubtotal = formatPrice(total);

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen del Pedido</Text>
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Productos ({itemCount})</Text>
          <Text style={styles.value}>${formattedSubtotal}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${formattedTotal}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[
          styles.checkoutButton,
          items.length === 0 && styles.checkoutButtonDisabled
        ]}
        onPress={handleCheckout}
        disabled={items.length === 0}
      >
        <Text style={styles.checkoutButtonText}>
          Proceder al Pago
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  details: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6C6C70',
  },
  value: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartSummary;