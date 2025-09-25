-- =====================================================================
-- MoviStore - Datos de Ejemplo (Seed Data)
-- =====================================================================

-- Insertar sucursales
INSERT INTO stores (name, address) VALUES
('MoviStore Centro', 'Av. Principal 123, Tapachula'),
('MoviStore Norte', 'Calle 55 No. 10, Tapachula');

-- Insertar categorías
INSERT INTO categories (name, description) VALUES
('Celulares', 'Smartphones de última generación'),
('Accesorios', 'Cargadores, fundas, audífonos y más'),
('Smartwatches', 'Relojes inteligentes y bandas de actividad');

-- Insertar productos
INSERT INTO products (name, description, price, sku, category_id) VALUES
('XPhone 12', 'Smartphone XPhone 12 - 64GB, color negro', 8999.00, 'XP12-64-BLK', 1),
('Gama S21', 'Smartphone Gama S21 - 128GB, color plata', 12500.00, 'GS21-128-SLV', 1),
('Cargador Rápido 30W', 'Cargador de pared USB-C con tecnología de carga rápida de 30W', 299.00, 'CHG-USBC-30W', 2),
('Audífonos Inalámbricos TWS', 'Audífonos True Wireless Stereo con cancelación de ruido', 750.00, 'TWS-NC-WHT', 2),
('Smart Band 6', 'Pulsera de actividad física con monitor de ritmo cardiaco y oxígeno en sangre', 950.00, 'SMBND-6-BLK', 3);

-- Asignar stock inicial a todos los productos en todas las sucursales
INSERT INTO product_stock (product_id, store_id, quantity)
SELECT p.id, s.id, CASE WHEN p.category_id = 1 THEN 15 ELSE 50 END
FROM products p
CROSS JOIN stores s;

-- Opcional: Insertar algún usuario de prueba (si lo necesitas para testing)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin MoviStore', 'admin@movistore.com', '$2b$10$ExampleHashForPassword123', 'admin'),
('Cliente Ejemplo', 'cliente@ejemplo.com', '$2b$10$ExampleHashForPassword456', 'customer');