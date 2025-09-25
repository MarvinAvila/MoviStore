// routes/stores.js
const express = require('express');
const router = express.Router();
const {
    getStores,
    createStore,
    updateStore,
    deleteStore
} = require('../controllers/storesController');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/stores
// @desc    Obtiene todas las sucursales
// @access  Public
router.get('/', getStores);

// @route   POST /api/stores
// @desc    Crea una nueva sucursal (solo para admin)
// @access  Private/Admin
router.post('/', protect, admin, createStore);

// @route   PUT /api/stores/:id
// @desc    Actualiza una sucursal (solo para admin)
// @access  Private/Admin
router.put('/:id', protect, admin, updateStore);

// @route   DELETE /api/stores/:id
// @desc    Elimina una sucursal (solo para admin)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteStore);

module.exports = router;