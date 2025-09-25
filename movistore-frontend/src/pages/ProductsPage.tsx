import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import type { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';

const ProductsPage = () => {
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para saber si estamos cargando los datos
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para almacenar cualquier error que ocurra
  const [error, setError] = useState<string | null>(null);

  // useEffect se ejecuta después de que el componente se monta en la pantalla
  useEffect(() => {
    // Definimos una función asíncrona para obtener los productos
    const fetchProducts = async () => {
      try {
        // Hacemos la petición GET a la ruta '/products' de nuestra API
        const response = await apiClient.get('/products');
        // Actualizamos el estado con los datos recibidos
        setProducts(response.data);
      } catch (err) {
        // Si hay un error, lo guardamos en el estado de error
        setError('No se pudieron cargar los productos. Por favor, intenta más tarde.');
        console.error("Error fetching products:", err);
      } finally {
        // Al final, ya sea con éxito o error, dejamos de cargar
        setLoading(false);
      }
    };

    // Llamamos a la función para que se ejecute
    fetchProducts();
  }, []); // El array vacío [] significa que este efecto se ejecutará solo una vez

  // --- Lógica de renderizado condicional ---

  // Si está cargando, mostramos un mensaje
  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Nuestro Catálogo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Muestra 8 esqueletos mientras carga */}
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Si hubo un error, mostramos el error
  if (error) {
    return <div className="text-center py-20 bg-red-50 rounded-lg">
      <p className="text-xl text-red-700 font-semibold">{error}</p>
    </div>;
  }

  // Si todo salió bien, mostramos la lista de productos
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Nuestro Catálogo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
