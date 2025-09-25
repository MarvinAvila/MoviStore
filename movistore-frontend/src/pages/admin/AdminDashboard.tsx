import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import type { Order, Product, User } from '../../types';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/users'),
          apiClient.get('/orders')
        ]);

        const products: Product[] = productsRes.data;
        const users: User[] = usersRes.data;
        const orders: Order[] = ordersRes.data;

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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600">Resumen general de MoviStore</p>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="text-purple-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
            </div>
            <DollarSign className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package size={20} />
              <div>
                <p className="font-medium">Gestionar Productos</p>
                <p className="text-sm text-gray-600">Agregar, editar o eliminar productos</p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart size={20} />
              <div>
                <p className="font-medium">Gestionar Pedidos</p>
                <p className="text-sm text-gray-600">
                  {stats.pendingOrders} pedidos pendientes
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Pedidos Recientes</h2>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No hay pedidos recientes</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">Orden #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total}</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'pending' ? 'Pendiente' : 'Completado'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;