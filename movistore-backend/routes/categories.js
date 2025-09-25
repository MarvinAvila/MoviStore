// routes/categories.js
const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoriesController');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Obtiene todas las categorías
// @access  Public
router.get('/', getCategories);

// @route   POST /api/categories
// @desc    Crea una nueva categoría (solo para admin)
// @access  Private/Admin
router.post('/', protect, admin, createCategory);

// @route   PUT /api/categories/:id
// @desc    Actualiza una categoría (solo para admin)
// @access  Private/Admin
router.put('/:id', protect, admin, updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Elimina una categoría (solo para admin)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;