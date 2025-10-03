// Este archivo define las "formas" de los objetos para referencia
// En React Native usamos JavaScript, pero mantenemos la documentación de tipos

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'customer' | 'admin'} role
 * @property {string} created_at
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 */

/**
 * @typedef {Object} Store
 * @property {number} id
 * @property {string} name
 * @property {string} address
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} sku
 * @property {number} category_id
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Category} [category]
 * @property {ProductImage[]} [images]
 * @property {ProductStock[]} [stock]
 */

/**
 * @typedef {Object} ProductImage
 * @property {number} id
 * @property {number} product_id
 * @property {string} filename
 * @property {boolean} is_thumbnail
 */

/**
 * @typedef {Object} ProductStock
 * @property {number} id
 * @property {number} product_id
 * @property {number} store_id
 * @property {number} quantity
 * @property {string} updated_at
 * @property {Store} [store]
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {number} user_id
 * @property {number} store_id
 * @property {number} total
 * @property {'pending' | 'paid' | 'shipped' | 'cancelled'} status
 * @property {string} created_at
 * @property {User} [user]
 * @property {Store} [store]
 * @property {OrderItem[]} [order_items]
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {number} order_id
 * @property {number} product_id
 * @property {number} quantity
 * @property {number} unit_price
 * @property {Product} [product]
 */

/**
 * @typedef {Object} StockMovement
 * @property {number} id
 * @property {number} product_id
 * @property {number} store_id
 * @property {number} change
 * @property {string} reason
 * @property {string} created_at
 */

/**
 * @typedef {Object} CartProduct
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

// Constantes para la aplicación
export const API_BASE = 'http://192.168.1.66:3000/api';

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Colores para la aplicación
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#8E8E93',
  dark: '#1C1C1E',
  background: '#FFFFFF',
  card: '#F2F2F7',
  text: '#000000',
  textSecondary: '#6C6C70'
};

// Configuración de la aplicación
export const APP_CONFIG = {
  cartMaxQuantity: 10,
  defaultStoreId: 1,
  imageBaseUrl: 'http://192.168.1.66:3000/images/'
};