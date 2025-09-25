// routes/users.js
const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser
} = require('../controllers/usersController');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Obtiene todos los usuarios (solo para admin)
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @route   DELETE /api/users/:id
// @desc    Elimina un usuario (solo para admin)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteUser);

// @route   GET & PUT /api/users/profile
// @desc    Obtiene y actualiza el perfil del usuario logueado
// @access  Private
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;

