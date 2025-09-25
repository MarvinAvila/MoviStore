import axios from 'axios';

// 1. Definimos la URL base de nuestro backend.
const API_BASE_URL = 'http://localhost:3000/api';

// 2. Creamos una instancia de axios con la configuración por defecto.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Exportamos la instancia para poder usarla en cualquier parte de la app.
export default apiClient;

