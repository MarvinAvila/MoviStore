// Define la "forma" de un objeto Usuario (basado en tabla users)
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
}

// Define la "forma" de un objeto Categoría (basado en tabla categories)
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Define la "forma" de un objeto Sucursal (basado en tabla stores)
export interface Store {
  id: number;
  name: string;
  address: string;
}

// Define la "forma" de un objeto Producto (basado en tabla products)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Cambié a number porque en BD es NUMERIC(10,2)
  sku: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  // Campos opcionales que pueden venir de relaciones
  category?: Category;
  images?: ProductImage[];
  stock?: ProductStock[];
}

// Define la "forma" de un objeto Imagen de Producto (basado en product_images)
export interface ProductImage {
  id: number;
  product_id: number;
  filename: string;
  is_thumbnail: boolean;
}

// Define la "forma" del stock (basado en product_stock)
export interface ProductStock {
  id: number;
  product_id: number;
  store_id: number;
  quantity: number;
  updated_at: string;
  store?: Store; // Relación opcional
}

// Define la "forma" de un objeto Orden (basado en orders)
export interface Order {
  id: number;
  user_id: number;
  store_id: number;
  total: number; // NUMERIC(12,2) en BD
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  created_at: string;
  // Relaciones opcionales
  user?: User;
  store?: Store;
  order_items?: OrderItem[];
}

// Define la "forma" de un ítem de orden (basado en order_items)
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number; // NUMERIC(10,2) en BD
  product?: Product; // Relación opcional
}

// Define la "forma" de movimiento de stock (basado en stock_movements)
export interface StockMovement {
  id: number;
  product_id: number;
  store_id: number;
  change: number;
  reason: string;
  created_at: string;
}

// Interfaces para el carrito (específicas del frontend)
export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string; // Imagen principal para mostrar en el carrito
  quantity: number;
}

// Interfaces para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}