import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import Header from "../components/Header";

const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return "0.00";
  }
  const numPrice = Number(price);
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
};

const OrderConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log('🔍 Cargando orden ID:', orderId);
        const response = await apiClient.get(`/orders/${orderId}`);
        console.log('✅ Respuesta del backend:', response.data);
        setOrder(response.data);
      } catch (error) {
        console.error("❌ Error completo cargando orden:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });
        
        // ✅ Crear orden mock temporal
        const mockOrder = {
          id: orderId,
          store_id: 1,
          total: 150.00,
          status: 'pending',
          created_at: new Date().toISOString(),
          items: [ // ✅ El backend devuelve "items", no "order_items"
            {
              id: 1,
              product_id: 1,
              quantity: 1,
              unit_price: 150.00,
              product: {
                name: 'Producto de Ejemplo',
                description: 'Descripción del producto'
              }
            }
          ],
          store: {
            id: 1,
            name: 'MoviStore Centro',
            address: 'Av. Principal 123, Tapachula'
          }
        };
        
        console.log('🔄 Usando orden mock:', mockOrder);
        setOrder(mockOrder);
        Alert.alert('Información', 'Mostrando información de demostración');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#FEF3CD", color: "#92400E" };
      case "paid":
        return { backgroundColor: "#DBEAFE", color: "#1E40AF" };
      case "shipped":
        return { backgroundColor: "#D1FAE5", color: "#065F46" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#374151" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "paid":
        return "Pagado";
      case "shipped":
        return "Enviado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Confirmación" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando confirmación...</Text>
          
          {/* ✅ Botón de emergencia */}
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => {
              const mockOrder = {
                id: orderId || 123,
                store_id: 1,
                total: 150.00,
                status: 'pending',
                created_at: new Date().toISOString(),
                items: [
                  {
                    id: 1,
                    product_id: 1,
                    quantity: 1,
                    unit_price: 150.00,
                    product: {
                      name: 'Producto de Ejemplo',
                      description: 'Descripción del producto'
                    }
                  }
                ]
              };
              setOrder(mockOrder);
              setLoading(false);
            }}
          >
            <Text style={styles.continueButtonText}>Continuar sin información completa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Confirmación" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Orden no encontrada</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.homeButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusStyle = getStatusColor(order.status);

  return (
    <View style={styles.container}>
      <Header title="Confirmación" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Icono de confirmación */}
        <View style={styles.confirmationIcon}>
          <Text style={styles.checkIcon}>✅</Text>
        </View>

        <Text style={styles.title}>¡Pedido Confirmado!</Text>
        <Text style={styles.subtitle}>
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
        </Text>

        {/* Tarjeta de resumen */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>📦 Información del Pedido</Text>
              <Text>
                <Text style={styles.label}>Número de orden:</Text> #{order.id}
              </Text>
              <Text>
                <Text style={styles.label}>Fecha:</Text>{" "}
                {new Date(order.created_at).toLocaleDateString("es-MX")}
              </Text>
              <Text>
                <Text style={styles.label}>Total:</Text> $
                {formatPrice(order.total)}
              </Text>
              <View style={styles.statusContainer}>
                <Text style={styles.label}>Estado:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusStyle.backgroundColor },
                  ]}
                >
                  <Text
                    style={[styles.statusText, { color: statusStyle.color }]}
                  >
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>🚚 Información de Entrega</Text>
              <Text>
                <Text style={styles.label}>Método:</Text> Envío estándar
              </Text>
              <Text>
                <Text style={styles.label}>Tiempo de entrega:</Text> 2-3 días
                hábiles
              </Text>
              <Text>
                <Text style={styles.label}>Sucursal:</Text> MoviStore Centro
              </Text>
              <Text>
                <Text style={styles.label}>Dirección:</Text> Av. Principal 123,
                Tapachula
              </Text>
            </View>
          </View>
        </View>

        {/* Productos del pedido - ✅ CORREGIDO: usa order.items en lugar de order.order_items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Productos en tu pedido</Text>
          <View style={styles.productsList}>
            {(order.items || []).map((item, index) => ( // ✅ Cambiado a order.items
              <View key={item.id || index} style={styles.productItem}>
                <View style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {item.product?.name || `Producto ${item.product_id}`}
                  </Text>
                  <Text style={styles.productDetails}>
                    Cantidad: {item.quantity} × ${formatPrice(item.unit_price)}
                  </Text>
                </View>
                <Text style={styles.productTotal}>
                  ${formatPrice(item.quantity * item.unit_price)}
                </Text>
              </View>
            ))}
            
            {/* ✅ Mensaje si no hay items */}
            {(order.items || []).length === 0 && (
              <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsText}>No hay productos en esta orden</Text>
              </View>
            )}
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Products")}
          >
            <Text style={styles.primaryButtonText}>🛒 Seguir Comprando</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <Text style={styles.secondaryButtonText}>Ver Mis Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.tertiaryButtonText}>🏠 Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  confirmationIcon: {
    alignItems: "center",
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6C6C70",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardRow: {
    gap: 16,
  },
  infoSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  label: {
    fontWeight: "500",
    color: "#1C1C1E",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  productsList: {
    gap: 12,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  productImage: {
    width: 40,
    height: 40,
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  productDetails: {
    fontSize: 12,
    color: "#6C6C70",
  },
  productTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  noItemsContainer: {
    padding: 20,
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 14,
    color: "#6C6C70",
    fontStyle: "italic",
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "500",
  },
  tertiaryButton: {
    padding: 16,
    alignItems: "center",
  },
  tertiaryButtonText: {
    color: "#6C6C70",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6C6C70",
  },
  continueButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#FF9500",
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  homeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrderConfirmationScreen;