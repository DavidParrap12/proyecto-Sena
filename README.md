# Sistema de Gestión de Ventas e Inventario
Este proyecto es una aplicación web completa para la gestión de ventas, inventario y reportes, desarrollada con una arquitectura de frontend en React y backend en Node.js/Express.

## Características principales
- Gestión de productos: Registro, edición y control de inventario de productos.
- Registro de ventas: Creación y seguimiento de ventas, con cálculo automático de métricas.
- Reportes avanzados: Visualización de métricas clave, gráficos interactivos, exportación a PDF y Excel, y filtros por rango de fechas.
- Panel principal: Dashboard con resumen de ingresos, productos más vendidos, productos con cantidad baja, ventas recientes y promociones activas.
- Autenticación de usuarios: Registro, inicio de sesión y control de acceso por roles.
## Estructura del proyecto
```
ProyectoFull/
├── backend/           # Backend Node.
js/Express
│   ├── src/
│   │   ├── controllers/   # 
Controladores de rutas y lógica de 
negocio
│   │   ├── models/        # Modelos de 
datos (Mongoose)
│   │   ├── routes/        # Definición 
de rutas API
│   │   └── ...
├── client/            # Frontend React
│   ├── src/
│   │   ├── components/    # 
Componentes reutilizables
│   │   ├── pages/         # Vistas 
principales (Reportes, Inventario, etc.)
│   │   ├── services/      # Llamadas a 
la API
│   │   └── styles/        # Archivos 
CSS
└── ...
```
## Instalación
1. Clona el repositorio:
   ```
   git clone <url-del-repositorio>
   ```
2. Instala dependencias en backend y frontend:
   ```
   cd backend
   npm install
   cd ../client
   npm install
   ```
3. Configura las variables de entorno en backend/.env .
4. Inicia el backend:
   ```
   npm start
   ```
5. Inicia el frontend:
   ```
   npm run dev
   ```
## Dependencias principales
- Backend: express, mongoose, jsonwebtoken, bcryptjs
- Frontend: react, axios, chart.js, jspdf, xlsx
## Licencia
Proyecto desarrollado para fines educativos y de práctica profesional.
