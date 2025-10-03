import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/users'),
        apiClient.get('/orders')
      ]);

      const products = productsRes.data;
      const users = usersRes.data;
      const orders = ordersRes.data;

      const revenue = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        pendingOrders
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Panel Admin" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando dashboard...</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FEF3CD', color: '#92400E' };
      case 'paid': return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'shipped': return { backgroundColor: '#D1FAE5', color: '#065F46' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagado';
      case 'shipped': return 'Enviado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Panel Admin" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Panel de Administración</Text>
          <Text style={styles.subtitle}>Resumen general de MoviStore</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View>
                <Text style={styles.statLabel}>Total Productos</Text>
                <Text style={styles.statValue}>{stats.totalProducts}</Text>
              </View>
              <Text style={styles.statIcon}>📦</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View>
                <Text style={styles.statLabel}>Total Usuarios</Text>
                <Text style={styles.statValue}>{stats.totalUsers}</Text>
              </View>
              <Text style={styles.statIcon}>👥</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View>
                <Text style={styles.statLabel}>Total Pedidos</Text>
                <Text style={styles.statValue}>{stats.totalOrders}</Text>
              </View>
              <Text style={styles.statIcon}>🛒</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View>
                <Text style={styles.statLabel}>Ingresos Totales</Text>
                <Text style={styles.statValue}>${stats.totalRevenue.toFixed(2)}</Text>
              </View>
              <Text style={styles.statIcon}>💰</Text>
            </View>
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.mainContent}>
          {/* Acciones rápidas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionsList}>
              <TouchableOpacity style={styles.actionItem}>
                <Text style={styles.actionIcon}>📦</Text>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Gestionar Productos</Text>
                  <Text style={styles.actionDescription}>
                    Agregar, editar o eliminar productos
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <Text style={styles.actionIcon}>🛒</Text>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Gestionar Pedidos</Text>
                  <Text style={styles.actionDescription}>
                    {stats.pendingOrders} pedidos pendientes
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pedidos recientes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
            <View style={styles.ordersList}>
              {recentOrders.length === 0 ? (
                <Text style={styles.emptyText}>No hay pedidos recientes</Text>
              ) : (
                recentOrders.map(order => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <View key={order.id} style={styles.orderItem}>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>Orden #{order.id}</Text>
                        <Text style={styles.orderDate}>
                          {new Date(order.created_at).toLocaleDateString('es-MX')}
                        </Text>
                      </View>
                      <View style={styles.orderDetails}>
                        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                          <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {getStatusText(order.status)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C6C70',
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 14,
    color: '#6C6C70',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statIcon: {
    fontSize: 24,
  },
  mainContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6C6C70',
  },
  ordersList: {
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#6C6C70',
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6C6C70',
    paddingVertical: 16,
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
});

export default AdminDashboard;