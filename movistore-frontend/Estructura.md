movistore-frontend/
└── src/
    ├── api/                # Lógica para conectarse al backend
    │   └── axiosConfig.ts
    ├── assets/             # Imágenes, fuentes, etc.
    ├── components/         # Componentes de UI reutilizables
    │   ├── layout/         # Componentes estructurales (Navbar, Footer)
    │   └── ui/             # Componentes genéricos (Button, Card, Input)
    ├── contexts/           # State Management (Context API para Auth, Carrito)
    ├── hooks/              # Hooks personalizados (useAuth, useCart)
    ├── pages/              # Vistas principales de la aplicación (HomePage, AdminDashboard)
    ├── types/              # Definiciones de tipos de TypeScript (Product, User)
    ├── utils/              # Funciones de ayuda generales
    ├── App.tsx             # Componente principal y configuración de rutas
    ├── index.css           # Estilos globales (ya configurado para Tailwind)
    └── main.tsx            # Punto de entrada de la aplicación