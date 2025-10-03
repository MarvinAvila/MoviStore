// src/utils/helpers.js

// Función para formatear precios de forma segura
export const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return '0.00';
  }
  const numPrice = Number(price);
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

// Función para obtener la URL de la imagen del producto
export const getProductImageUrl = (product, baseUrl = 'http://192.168.1.66:3000/images/') => {
  return product?.images?.[0]?.filename 
    ? `${baseUrl}${product.images[0].filename}`
    : 'https://via.placeholder.com/300';
};

// Función para validar si un producto es válido para el carrito
export const isValidProduct = (product) => {
  return product && 
         product.id && 
         product.name && 
         product.price !== undefined && 
         product.price !== null;
};