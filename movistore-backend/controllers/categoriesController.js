// controllers/categoriesController.js
const db = require('../config/db');

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Crear una categoría
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCategory = await db.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description || null]
        );
        res.status(201).json(newCategory.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Actualizar una categoría
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedCategory = await db.query(
            'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        if (updatedCategory.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(updatedCategory.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Eliminar una categoría
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};


module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
