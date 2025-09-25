const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} MoviStore. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-400 mt-1">
            Tu tienda de confianza en Tapachula, Chiapas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
