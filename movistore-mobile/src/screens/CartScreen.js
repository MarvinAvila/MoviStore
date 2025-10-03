import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import Header from '../components/Header';

const CartScreen = () => {
  const { items, clearCart } = useCart();
  const navigation = useNavigation();

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar Carrito',
      '¿Estás seguro de que quieres vaciar el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', style: 'destructive', onPress: clearCart }
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Carrito" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Agrega algunos productos para continuar</Text>
          <TouchableOpacity 
            style={styles.productsButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.productsButtonText}>Ver Productos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Carrito" />
      <View style={styles.header}>
        <Text style={styles.title}>Carrito de Compras</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Vaciar Carrito</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.summaryContainer}>
        <CartSummary />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  clearButton: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6C6C70',
    textAlign: 'center',
    marginBottom: 24,
  },
  productsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  productsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;