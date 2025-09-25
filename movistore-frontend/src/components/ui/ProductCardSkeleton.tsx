const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      {/* Placeholder para la imagen */}
      <div className="w-full h-48 bg-gray-200 animate-pulse" />
      <div className="p-4">
        {/* Placeholder para el nombre del producto */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
        {/* Placeholder para el precio */}
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;