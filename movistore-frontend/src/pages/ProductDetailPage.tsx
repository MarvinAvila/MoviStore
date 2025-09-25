import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      // Usar la primera imagen del producto o una placeholder
      const productImage = product.images?.[0]?.filename || '/api/placeholder/500/500';
      
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage
      }, quantity);
      
      alert('Producto agregado al carrito!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
        <Link to="/products" className="text-blue-600 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // Obtener imagen del producto
  const productImage = product.images?.[0]?.filename || '/api/placeholder/500/500';

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src={productImage} 
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600">${product.price}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">Cantidad:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Agregar al Carrito - ${(product.price * quantity).toFixed(2)}
          </button>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Información de entrega</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Envío gratuito en compras mayores a $500</li>
              <li>• Recoge en tienda disponible</li>
              <li>• Tiempo de entrega: 2-3 días hábiles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;