movistore-backend/
├── config/             # Archivos de configuración
│   └── db.js           # Conexión a la base de datos
├── controllers/        # Lógica de negocio para cada ruta
│   ├── productsController.js
|   ├── OrderController.js
|   ├──StoresControlles.js
│   ├── categoriesController.js
│   ├── usersController.js
│   └── authController.js
├── middleware/         # Lógica intermedia para peticiones
│   ├── auth.js         # Autenticación JWT
│   └── upload.js       # Middleware de Multer
├── models/              
│   ├── User.js          
│   ├── Category.js      
│   ├── Store.js         
│   ├── Product.js       
│   ├── ProductImage.js  
│   ├── ProductStock.js  
│   ├── Order.js         
│   ├── OrderItem.js     
│   └── StockMovement.js 
├── public/             # Archivos públicos (imágenes)
│   └── images/
├── routes/             # Definición de las rutas de la API
│   ├── products.js
│   ├── categories.js
│   ├── users.js
|   ├── orders.js
|   ├── stores.js
│   └── auth.js
├── .env                # Variables de entorno
├── server.js           # Archivo principal de la aplicación
└── package.json
