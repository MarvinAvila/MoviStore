const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configura CORS más permisivo temporalmente
app.use(cors({
  origin: '*', // ← Temporalmente permite todos los orígenes
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const storeRoutes = require('./routes/stores');


app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/stores', storeRoutes); 

// Ruta de health check para testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MoviStore API funcionando',
    timestamp: new Date().toISOString()
  });
});

// Mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('API de MoviStore funcionando correctamente!');
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
  console.log(`🌐 Accesible desde la red: http://192.168.1.84:${port}`);
  console.log(`📱 Usa esta IP en tu app móvil: 192.168.1.84:${port}`);
});