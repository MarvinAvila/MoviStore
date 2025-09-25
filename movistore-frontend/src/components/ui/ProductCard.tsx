import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Usar la primera imagen del producto o una placeholder
    const productImage = product.images?.[0]?.filename || '/api/placeholder/300/300';
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage
    }, 1);
    
    alert('Producto agregado al carrito!');
  };

  // Obtener imagen del producto
  const productImage = product.images?.[0]?.filename || '/api/placeholder/300/300';

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold text-lg">${product.price}</span>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Agregar al carrito"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;