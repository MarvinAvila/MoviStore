import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../api/apiClient";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return "0.00";
  }
  const numPrice = Number(price);
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
};

const CheckoutScreen = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "Tapachula",
    state: "Chiapas",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.zipCode
    ) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      return;
    }

    if (
      !formData.cardNumber ||
      !formData.cardName ||
      !formData.expiryDate ||
      !formData.cvv
    ) {
      Alert.alert("Error", "Por favor completa la información de pago");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        store_id: 1,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      const response = await apiClient.post("/orders", orderData);

      clearCart();
      Alert.alert(
        "¡Pedido Confirmado!",
        `Tu pedido #${response.data.id} ha sido procesado exitosamente`,
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("OrderConfirmation", {
                orderId: response.data.id,
              }),
          },
        ]
      );
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "Error al procesar el pedido. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Checkout" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Agrega algunos productos para continuar
          </Text>
          <TouchableOpacity
            style={styles.productsButton}
            onPress={() => navigation.navigate("Products")}
          >
            <Text style={styles.productsButtonText}>Ver Productos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const shippingCost = total >= 500 ? 0 : 50;
  const finalTotal = total + shippingCost;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header title="Finalizar Compra" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Información de Envío */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.sectionTitle}>Información de Envío</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange("firstName", value)}
                placeholder="Ingresa tu nombre"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellido *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
                placeholder="Ingresa tu apellido"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              placeholder="Av. Principal 123, Col. Centro"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ciudad</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value="Tapachula"
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value="Chiapas"
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Código Postal *</Text>
              <TextInput
                style={styles.input}
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange("zipCode", value)}
                placeholder="CP"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Información de Pago */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💳</Text>
            <Text style={styles.sectionTitle}>Información de Pago</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Número de Tarjeta *</Text>
            <TextInput
              style={styles.input}
              value={formData.cardNumber}
              onChangeText={(value) => handleInputChange("cardNumber", value)}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre en la Tarjeta *</Text>
            <TextInput
              style={styles.input}
              value={formData.cardName}
              onChangeText={(value) => handleInputChange("cardName", value)}
              placeholder="Como aparece en la tarjeta"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de Expiración *</Text>
              <TextInput
                style={styles.input}
                value={formData.expiryDate}
                onChangeText={(value) => handleInputChange("expiryDate", value)}
                placeholder="MM/AA"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>CVV *</Text>
              <TextInput
                style={styles.input}
                value={formData.cvv}
                onChangeText={(value) => handleInputChange("cvv", value)}
                placeholder="123"
                keyboardType="numeric"
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Resumen del Pedido */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>

          <View style={styles.orderItems}>
            {items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>
                    Cantidad: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  ${formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>${formatPrice(total)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Envío</Text>
              <Text>{shippingCost === 0 ? "Gratis" : "$50.00"}</Text>
            </View>
            <View style={styles.finalTotalRow}>
              <Text style={styles.finalTotalLabel}>Total</Text>
              <Text style={styles.finalTotalValue}>
                ${formatPrice(finalTotal)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              isProcessing && styles.confirmButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isProcessing}
          >
            <Text style={styles.confirmButtonText}>
              {isProcessing ? "Procesando..." : "Confirmar Pedido"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  disabledInput: {
    backgroundColor: "#F8F8F8",
    color: "#8E8E93",
  },
  summarySection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: "#6C6C70",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  totals: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 12,
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  finalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 8,
    marginTop: 4,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
  },
  productsButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  productsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CheckoutScreen;
