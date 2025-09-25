import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, ShoppingBag, Truck, Home } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import type { Order } from '../types';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando confirmación...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Orden no encontrada</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icono de confirmación */}
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Pedido Confirmado!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
        </p>

        {/* Tarjeta de resumen */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ShoppingBag size={20} />
                Información del Pedido
              </h3>
              <p><strong>Número de orden:</strong> #{order.id}</p>
              <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Estado:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'pending' ? 'Pendiente' :
                   order.status === 'paid' ? 'Pagado' :
                   order.status === 'shipped' ? 'Enviado' : 'Cancelado'}
                </span>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Truck size={20} />
                Información de Entrega
              </h3>
              <p><strong>Método:</strong> Envío estándar</p>
              <p><strong>Tiempo de entrega:</strong> 2-3 días hábiles</p>
              <p><strong>Sucursal:</strong> MoviStore Centro</p>
              <p><strong>Dirección:</strong> Av. Principal 123, Tapachula</p>
            </div>
          </div>
        </div>

        {/* Productos del pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-semibold mb-4">Productos en tu pedido</h3>
          <div className="space-y-3">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div>
                    <p className="font-medium">{item.product?.name || 'Producto'}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${item.unit_price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={20} />
            Seguir Comprando
          </Link>
          
          <Link
            to="/profile/orders"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver Mis Pedidos
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 px-6 py-3 rounded-lg hover:text-gray-900 transition-colors"
          >
            <Home size={20} />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;