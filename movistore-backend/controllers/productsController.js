// controllers/productsController.js
const db = require('../config/db');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        const queryParams = [];

        if (category) {
            query += ' WHERE c.name = $1';
            queryParams.push(category);
        }

        query += ' ORDER BY p.created_at DESC';

        const { rows } = await db.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const productQuery = `
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = $1
        `;
        const productResult = await db.query(productQuery, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const imagesResult = await db.query('SELECT filename FROM product_images WHERE product_id = $1', [id]);

        const product = productResult.rows[0];
        product.images = imagesResult.rows.map(img => `/images/${img.filename}`);

        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};


// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { name, description, price, sku, category_id, stock } = req.body;
    // stock debería ser un JSON string: '[{"store_id": 1, "quantity": 10}, {"store_id": 2, "quantity": 5}]'

    if (!name || !price || !category_id || !stock) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar producto
        const productQuery = `
            INSERT INTO products (name, description, price, sku, category_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `;
        const productResult = await client.query(productQuery, [name, description, price, sku, category_id]);
        const productId = productResult.rows[0].id;

        // Insertar imágenes si existen
        if (req.files) {
            for (const file of req.files) {
                await client.query(
                    'INSERT INTO product_images (product_id, filename) VALUES ($1, $2)',
                    [productId, file.filename]
                );
            }
        }
        
        // Insertar stock inicial
        const stockData = JSON.parse(stock);
        for (const s of stockData) {
             await client.query(
                'INSERT INTO product_stock (product_id, store_id, quantity) VALUES ($1, $2, $3)',
                [productId, s.store_id, s.quantity]
             );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Producto creado exitosamente', productId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error.message);
        res.status(500).send('Error del servidor');
    } finally {
        client.release();
    }
};


// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, sku, category_id } = req.body;

    try {
        const updatedProduct = await db.query(
            `UPDATE products SET 
                name = $1, 
                description = $2, 
                price = $3, 
                sku = $4, 
                category_id = $5,
                updated_at = NOW()
             WHERE id = $6 RETURNING *`,
            [name, description, price, sku, category_id, id]
        );

        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        // Aquí se podría agregar lógica para actualizar imágenes o stock si es necesario.

        res.json(updatedProduct.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // La eliminación en cascada en la DB se encargará de product_images y product_stock
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        // Aquí se podría agregar lógica para eliminar los archivos de imagen del servidor.

        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
