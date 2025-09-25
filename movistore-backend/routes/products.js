// routes/products.js
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productsController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/products
// @desc    Obtiene todos los productos
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Obtiene un producto por su ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Crea un nuevo producto (solo para admin)
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 5), createProduct);

// @route   PUT /api/products/:id
// @desc    Actualiza un producto (solo para admin)
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Elimina un producto (solo para admin)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;