// controllers/ordersController.js
const db = require('../config/db');

// @desc    Crear una nueva orden
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const { store_id, items } = req.body; // items es un array: [{ product_id: 1, quantity: 2 }, ...]
    const user_id = req.user.id;

    if (!store_id || !items || items.length === 0) {
        return res.status(400).json({ message: 'Faltan datos para crear la orden' });
    }

    try {
        // Usamos la función transaccional de PostgreSQL
        const result = await db.query('SELECT create_order($1, $2, $3::json)', [user_id, store_id, JSON.stringify(items)]);
        const orderId = result.rows[0].create_order;

        res.status(201).json({
            message: 'Orden creada exitosamente',
            orderId: orderId,
        });
    } catch (error) {
        // El error de la función de PG es más descriptivo (ej: 'No hay stock suficiente...')
        console.error(error.message);
        res.status(500).json({ message: error.message || 'Error del servidor al crear la orden' });
    }
};

// @desc    Obtener las órdenes del usuario logueado
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await db.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(orders.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Obtener una orden por ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        const order = orderResult.rows[0];

        // Verificar si el usuario es el dueño de la orden o es un admin
        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado para ver esta orden' });
        }

        const itemsResult = await db.query(
            `SELECT oi.quantity, oi.unit_price, p.name, p.id as product_id
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = $1`,
            [id]
        );

        order.items = itemsResult.rows;
        res.json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Obtener todas las órdenes (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await db.query('SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
        res.json(orders.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Actualizar estado de la orden (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'paid', 'shipped', 'cancelled'

    if (!status) {
        return res.status(400).json({ message: 'El estado es requerido' });
    }

    try {
        const result = await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};
