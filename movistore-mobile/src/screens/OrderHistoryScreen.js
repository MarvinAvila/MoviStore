import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import Header from "../components/Header";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0.00";
    }
    const numPrice = Number(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('🔍 Cargando historial de pedidos...');
        // ✅ CORREGIDO: usa solo '/orders/myorders' ya que apiClient ya tiene '/api'
        const response = await apiClient.get("/orders/myorders");
        console.log('✅ Pedidos cargados:', response.data.length);
        setOrders(response.data);
      } catch (error) {
        console.error("❌ Error cargando pedidos:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });
        
        // Datos mock temporales para testing
        const mockOrders = [
          {
            id: 1,
            total: 150.00,
            status: 'pending',
            created_at: new Date().toISOString(),
            items: [
              {
                product: { name: 'Smartphone Ejemplo' },
                quantity: 1,
                unit_price: 150.00
              }
            ],
            store: { name: 'MoviStore Centro' }
          },
          {
            id: 2,
            total: 299.99,
            status: 'paid',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            items: [
              {
                product: { name: 'Tablet Ejemplo' },
                quantity: 1,
                unit_price: 299.99
              }
            ],
            store: { name: 'MoviStore Centro' }
          }
        ];
        
        console.log('🔄 Usando datos mock temporales');
        setOrders(mockOrders);
        Alert.alert('Información', 'Mostrando datos de demostración');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ... el resto del código se mantiene igual
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#FEF3CD", color: "#92400E" };
      case "paid":
        return { backgroundColor: "#DBEAFE", color: "#1E40AF" };
      case "shipped":
        return { backgroundColor: "#D1FAE5", color: "#065F46" };
      case "cancelled":
        return { backgroundColor: "#FEE2E2", color: "#DC2626" };
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-MX");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Mis Pedidos" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando pedidos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mis Pedidos" />

      <View style={styles.header}>
        <Text style={styles.title}>Historial de Pedidos</Text>
        <Text style={styles.subtitle}>
          Revisa el estado de tus pedidos anteriores
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por número de orden o estado..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>
            {searchTerm ? "No se encontraron pedidos" : "Aún no tienes pedidos"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Cuando realices tu primer pedido, aparecerá aquí"}
          </Text>
          {!searchTerm && (
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate("Products")}
            >
              <Text style={styles.shopButtonText}>🛒 Comenzar a Comprar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: order }) => {
            const statusStyle = getStatusColor(order.status);
            return (
              <TouchableOpacity
                style={styles.orderCard}
                onPress={() =>
                  navigation.navigate("OrderConfirmation", {
                    orderId: order.id,
                    order: order
                  })
                }
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>Orden #{order.id}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusStyle.color },
                        ]}
                      >
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📅 Fecha:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(order.created_at)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>💰 Total:</Text>
                    <Text style={styles.detailValue}>
                      ${formatPrice(order.total)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📦 Productos:</Text>
                    <Text style={styles.detailValue}>
                      {order.items?.length || 0}
                    </Text>
                  </View>
                  {order.store && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🏪 Sucursal:</Text>
                      <Text style={styles.detailValue}>{order.store.name}</Text>
                    </View>
                  )}
                </View>

                {order.items && order.items.length > 0 && (
                  <View style={styles.productsPreview}>
                    <Text style={styles.productsTitle}>Productos:</Text>
                    <View style={styles.productsList}>
                      {order.items.slice(0, 3).map((item, index) => (
                        <View key={index} style={styles.productChip}>
                          <Text style={styles.productChipText}>
                            {item.product?.name || `Producto ${item.product_id}`} × {item.quantity}
                          </Text>
                        </View>
                      ))}
                      {order.items.length > 3 && (
                        <View style={styles.moreChip}>
                          <Text style={styles.moreChipText}>
                            +{order.items.length - 3} más
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.viewDetails}>
                  <Text style={styles.viewDetailsText}>Ver detalles →</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// Tus estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6C6C70",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderHeader: {
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  orderDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6C6C70",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#1C1C1E",
  },
  productsPreview: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
    marginBottom: 12,
  },
  productsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  productsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  productChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productChipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  moreChip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  moreChipText: {
    fontSize: 12,
    color: "#6B7280",
  },
  viewDetails: {
    alignItems: "flex-end",
  },
  viewDetailsText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6C6C70",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
});

export default OrderHistoryScreen;