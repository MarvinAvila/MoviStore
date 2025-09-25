// controllers/storesController.js
const db = require('../config/db');

// @desc    Obtener todas las sucursales
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stores ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Crear una sucursal
// @route   POST /api/stores
// @access  Private/Admin
const createStore = async (req, res) => {
    const { name, address } = req.body;
    try {
        const newStore = await db.query(
            'INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *',
            [name, address]
        );
        res.status(201).json(newStore.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Actualizar una sucursal
// @route   PUT /api/stores/:id
// @access  Private/Admin
const updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;
    try {
        const updatedStore = await db.query(
            'UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *',
            [name, address, id]
        );
        if (updatedStore.rows.length === 0) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.json(updatedStore.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Eliminar una sucursal
// @route   DELETE /api/stores/:id
// @access  Private/Admin
const deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.json({ message: 'Sucursal eliminada' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

module.exports = {
    getStores,
    createStore,
    updateStore,
    deleteStore,
};
