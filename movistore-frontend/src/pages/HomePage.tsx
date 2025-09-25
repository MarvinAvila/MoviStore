import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 md:py-32">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
        La Tecnología que te Mueve,
        <br />
        <span className="text-blue-600">a tu Alcance.</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
        Explora lo último en smartphones, smartwatches y accesorios. En MoviStore, encuentras calidad y confianza en cada compra.
      </p>
      <Link to="/products" className="mt-10 inline-flex items-center gap-2 px-8 py-4 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
        Ver Catálogo
        <ArrowRight size={20} />
      </Link>
    </div>
  );
};
export default HomePage;