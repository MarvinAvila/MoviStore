// routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Registra un nuevo usuario
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Autentica un usuario y devuelve un token
// @access  Public
router.post('/login', loginUser);

module.exports = router;

