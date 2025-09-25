// controllers/usersController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user es agregado por el middleware 'protect'
    const user = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.user.id;

        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = userResult.rows[0];
        const newName = name || user.name;
        const newEmail = email || user.email;
        
        let newPasswordHash = user.password_hash;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            newPasswordHash = await bcrypt.hash(password, salt);
        }

        const updatedUserResult = await db.query(
            'UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING id, name, email, role',
            [newName, newEmail, newPasswordHash, userId]
        );

        res.json(updatedUserResult.rows[0]);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// --- ADMIN CONTROLLERS ---

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await db.query('SELECT id, name, email, role FROM users ORDER BY created_at DESC');
        res.json(users.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};


module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};

