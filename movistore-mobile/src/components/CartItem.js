import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../contexts/CartContext';

// ✅ Función segura para formatear precios
const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return '0.00';
  }
  const numPrice = Number(price);
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // ✅ Precio formateado de forma segura
  const formattedPrice = formatPrice(item?.price);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {/* ✅ Usa el precio formateado */}
        <Text style={styles.price}>${formattedPrice}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

// Tus estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1C1C1E',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  quantity: {
    width: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    color: '#1C1C1E',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});

export default CartItem;