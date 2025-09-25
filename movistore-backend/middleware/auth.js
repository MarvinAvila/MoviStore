// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener usuario del token y agregarlo al objeto request
            req.user = decoded; // El payload del token se agrega a req.user
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, el token falló' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, no eres administrador' });
    }
};

module.exports = { protect, admin };
