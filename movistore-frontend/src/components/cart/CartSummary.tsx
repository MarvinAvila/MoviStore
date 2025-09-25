import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const { items, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Productos ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors font-medium"
      >
        Proceder al Pago
      </button>
    </div>
  );
};

export default CartSummary;