
-- =====================================================================
-- MoviStore - Script Completo de Base de Datos (PostgreSQL)
-- =====================================================================

-- 0. Crear la base de datos (se recomienda ejecutar esto por separado)
-- CREATE DATABASE movistore_db;

-- Conéctate a la base de datos movistore_db antes de ejecutar el resto del script.

-- =====================================================================
-- 1. DEFINICIÓN DE TABLAS
-- =====================================================================

-- Tabla de usuarios

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer', -- roles: 'admin' | 'customer'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de categorías de productos
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Tabla de sucursales (tiendas)
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT
);

-- Tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sku VARCHAR(80) UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para imágenes de productos
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    filename VARCHAR(300) NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE
);

-- Tabla para gestionar el stock por sucursal
CREATE TABLE product_stock (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, store_id)
);

-- Tabla de órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    store_id INTEGER REFERENCES stores(id), -- Sucursal donde se recoge o envía
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- Estados: pending | paid | shipped | cancelled
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ítems de una orden
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
);

-- Tabla para auditar movimientos de stock
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    store_id INTEGER REFERENCES stores(id),
    change INTEGER NOT NULL, -- Positivo para entradas, negativo para salidas
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================================
-- 2. ÍNDICES PARA MEJORA DE RENDIMIENTO
-- =====================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_stock_prod_store ON product_stock(product_id, store_id);

-- =====================================================================
-- 3. FUNCIÓN TRANSACCIONAL PARA CREAR ÓRDENES
-- =====================================================================

-- Esta función crea una orden, descuenta el stock y registra el movimiento de forma atómica.
-- p_items debe ser un JSON array: '[{"product_id": 1, "quantity": 2}, ...]'
CREATE OR REPLACE FUNCTION create_order(p_user INT, p_store INT, p_items JSON)
RETURNS INTEGER AS $$
DECLARE
    v_order_id INTEGER;
    v_item JSON;
    v_pid INTEGER;
    v_qty INTEGER;
    v_price NUMERIC(10, 2);
    v_stock INTEGER;
BEGIN
    -- Crear la cabecera de la orden
    INSERT INTO orders(user_id, store_id, status, created_at)
    VALUES (p_user, p_store, 'pending', NOW())
    RETURNING id INTO v_order_id;

    -- Iterar sobre los ítems del carrito
    FOR v_item IN SELECT * FROM json_array_elements(p_items)
    LOOP
        v_pid := (v_item->>'product_id')::INT;
        v_qty := (v_item->>'quantity')::INT;

        -- Obtener precio del producto
        SELECT price INTO v_price FROM products WHERE id = v_pid;

        -- Verificar stock (con bloqueo de fila para evitar concurrencia)
        SELECT quantity INTO v_stock FROM product_stock
        WHERE product_id = v_pid AND store_id = p_store FOR UPDATE;

        IF v_stock IS NULL OR v_stock < v_qty THEN
            RAISE EXCEPTION 'No hay stock suficiente para el producto ID % en la sucursal ID %', v_pid, p_store;
        END IF;

        -- Insertar el ítem en la orden
        INSERT INTO order_items(order_id, product_id, quantity, unit_price)
        VALUES (v_order_id, v_pid, v_qty, v_price);

        -- Decrementar el stock
        UPDATE product_stock SET quantity = quantity - v_qty, updated_at = NOW()
        WHERE product_id = v_pid AND store_id = p_store;

        -- Registrar el movimiento de stock para auditoría
        INSERT INTO stock_movements(product_id, store_id, change, reason)
        VALUES (v_pid, p_store, -v_qty, 'Venta - Orden ID ' || v_order_id);
    END LOOP;

    -- Actualizar el total de la orden
    UPDATE orders
    SET total = (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM order_items WHERE order_id = v_order_id)
    WHERE id = v_order_id;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 4. DATOS DE EJEMPLO (SEED DATA)
-- =====================================================================

INSERT INTO stores (name, address) VALUES
('MoviStore Centro', 'Av. Principal 123, Tapachula'),
('MoviStore Norte', 'Calle 55 No. 10, Tapachula');

INSERT INTO categories (name, description) VALUES
('Celulares', 'Smartphones de última generación'),
('Accesorios', 'Cargadores, fundas, audífonos y más'),
('Smartwatches', 'Relojes inteligentes y bandas de actividad');

INSERT INTO products (name, description, price, sku, category_id) VALUES
('XPhone 12', 'Smartphone XPhone 12 - 64GB, color negro', 8999.00, 'XP12-64-BLK', 1),
('Gama S21', 'Smartphone Gama S21 - 128GB, color plata', 12500.00, 'GS21-128-SLV', 1),
('Cargador Rápido 30W', 'Cargador de pared USB-C con tecnología de carga rápida de 30W', 299.00, 'CHG-USBC-30W', 2),
('Audífonos Inalámbricos TWS', 'Audífonos True Wireless Stereo con cancelación de ruido', 750.00, 'TWS-NC-WHT', 2),
('Smart Band 6', 'Pulsera de actividad física con monitor de ritmo cardiaco y oxígeno en sangre', 950.00, 'SMBND-6-BLK', 3);

-- Asignar stock inicial a todos los productos en todas las sucursales
INSERT INTO product_stock (product_id, store_id, quantity)
SELECT p.id, s.id, CASE WHEN p.category_id = 1 THEN 15 ELSE 50 END -- 15 para celulares, 50 para el resto
FROM products p
CROSS JOIN stores s;