// routes/orders.js
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/ordersController');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Crea una nueva orden
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders/myorders
// @desc    Obtiene las ordenes del usuario logueado
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders
// @desc    Obtiene todas las ordenes (solo para admin)
// @access  Private/Admin
router.get('/', protect, admin, getAllOrders);

// @route   GET /api/orders/:id
// @desc    Obtiene una orden por su ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Actualiza el estado de una orden (solo para admin)
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;

