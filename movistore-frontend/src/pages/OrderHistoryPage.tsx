import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, Search, ArrowRight } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import type { Order } from '../types';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/users/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagado';
      case 'shipped': return 'Enviado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Pedidos</h1>
        <p className="text-gray-600">Revisa el estado de tus pedidos anteriores</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por número de orden o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron pedidos' : 'Aún no tienes pedidos'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Intenta con otro término de búsqueda' 
              : 'Cuando realices tu primer pedido, aparecerá aquí'
            }
          </p>
          {!searchTerm && (
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Package size={20} />
              Comenzar a Comprar
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">Orden #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{new Date(order.created_at).toLocaleDateString('es-MX')}</span>
                      </div>
                      <div>
                        <strong>Total:</strong> ${order.total}
                      </div>
                      <div>
                        <strong>Productos:</strong> {order.order_items?.length || 0}
                      </div>
                      {order.store && (
                        <div>
                          <strong>Sucursal:</strong> {order.store.name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver Detalles
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Productos preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2 flex-wrap">
                      {order.order_items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <Package size={14} className="text-gray-500" />
                          </div>
                          <span className="text-sm font-medium">
                            {item.product?.name || 'Producto'} × {item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.order_items.length > 3 && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-600">
                            +{order.order_items.length - 3} más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;