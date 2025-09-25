import { X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import type { CartProduct } from '../../types'; 

interface CartItemProps {
  item: CartProduct;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-blue-600 font-bold"></p>
        <div className="flex items-center gap-2 mt-2">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-full border flex items-center justify-center"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full border flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
      <button 
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default CartItem;
