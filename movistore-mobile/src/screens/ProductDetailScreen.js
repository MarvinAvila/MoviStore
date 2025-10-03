import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import apiClient from '../api/apiClient';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId, product: initialProduct } = route.params || {};
  
  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // ✅ Función segura para formatear precios
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return '0.00';
    }
    const numPrice = Number(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (initialProduct) return;
      
      try {
        const response = await apiClient.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('Error', 'No se pudo cargar el producto');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, initialProduct, navigation]);

  const handleAddToCart = () => {
    if (product) {
      // ✅ Verifica que el precio esté definido
      if (product.price === undefined || product.price === null) {
        Alert.alert('Error', 'Este producto no tiene precio definido');
        return;
      }

      const productImage = product.images?.[0]?.filename 
        ? `http://192.168.1.66:3000/images/${product.images[0].filename}` // ✅ Cambia la IP
        : 'https://via.placeholder.com/500';
      
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage
      }, quantity);
      
      Alert.alert('¡Éxito!', 'Producto agregado al carrito');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Detalle" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando producto...</Text>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Header title="Detalle" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Producto no encontrado</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver al catálogo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const productImage = product.images?.[0]?.filename 
    ? `http://192.168.1.66:3000/images/${product.images[0].filename}` // ✅ Cambia la IP
    : 'https://via.placeholder.com/500';

  // ✅ Precios formateados de forma segura
  const formattedPrice = formatPrice(product?.price);
  const totalPrice = formatPrice((product?.price || 0) * quantity);

  return (
    <View style={styles.container}>
      <Header title="Detalle" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: productImage }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name || 'Producto sin nombre'}</Text>
          {/* ✅ Usa el precio formateado */}
          <Text style={styles.price}>${formattedPrice}</Text>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>
              {product.description || 'Sin descripción disponible'}
            </Text>
          </View>

          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.quantityButtonDisabled
                ]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartIcon}>🛒</Text>
            <Text style={styles.addToCartText}>
              {/* ✅ Usa el precio total formateado */}
              Agregar al Carrito - ${totalPrice}
            </Text>
          </TouchableOpacity>

          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTitle}>Información de entrega</Text>
            <View style={styles.deliveryList}>
              <Text style={styles.deliveryItem}>• Envío gratuito en compras mayores a $500</Text>
              <Text style={styles.deliveryItem}>• Recoge en tienda disponible</Text>
              <Text style={styles.deliveryItem}>• Tiempo de entrega: 2-3 días hábiles</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Tus estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  imageContainer: {
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6C6C70',
    lineHeight: 22,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  quantityButtonDisabled: {
    borderColor: '#C7C7CC',
    backgroundColor: '#F8F8F8',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  addToCartIcon: {
    fontSize: 20,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryInfo: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  deliveryList: {
    gap: 4,
  },
  deliveryItem: {
    fontSize: 14,
    color: '#6C6C70',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C6C70',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
});

export default ProductDetailScreen;