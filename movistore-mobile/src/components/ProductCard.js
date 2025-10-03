import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Alert 
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigation = useNavigation();

  // ✅ Función segura para formatear el precio
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return '0.00';
    }
    const numPrice = Number(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const handleAddToCart = () => {
    // Usar la primera imagen del producto o una placeholder
    const productImage = product.images?.[0]?.filename 
      ? `http://192.168.1.66:3000/images/${product.images[0].filename}` // ✅ Cambia la IP
      : 'https://via.placeholder.com/300';

    // ✅ Verifica que el precio esté definido antes de agregar al carrito
    if (product.price === undefined || product.price === null) {
      Alert.alert('Error', 'Este producto no tiene precio definido');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage
    }, 1);

    Alert.alert('¡Éxito!', 'Producto agregado al carrito');
  };

  const handleProductPress = () => {
    navigation.navigate('ProductDetail', { 
      productId: product.id,
      product 
    });
  };

  // Obtener imagen del producto
  const productImage = product.images?.[0]?.filename 
    ? `http://192.168.1.66:3000/images/${product.images[0].filename}` // ✅ Cambia la IP
    : 'https://via.placeholder.com/300';

  // ✅ Precio formateado de forma segura
  const formattedPrice = formatPrice(product?.price);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleProductPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        <Image 
          source={{ uri: productImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name || 'Producto sin nombre'}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description || 'Sin descripción'}
          </Text>
          <View style={styles.footer}>
            {/* ✅ Usa el precio formateado de forma segura */}
            <Text style={styles.price}>${formattedPrice}</Text>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={handleAddToCart}
              activeOpacity={0.7}
            >
              <Text style={styles.cartIcon}>🛒</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Tus estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    margin: 8,
    flex: 1,
    maxWidth: '50%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: '#6C6C70',
    marginBottom: 12,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    flex: 1,
  },
  cartButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  cartIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ProductCard;