# Perlitas de Eucarión — Frontend (React + Bootstrap)

Migración del frontend HTML/CSS/JS de la tienda a una aplicación React (SPA) con diseño responsivo en Bootstrap, datos simulados con persistencia en `localStorage` y pruebas unitarias con Jasmine y Karma.

Proyecto de la asignatura DSY1104 Desarrollo Fullstack II, Evaluación Parcial N° 2.
Integrantes: Yuliana Calvucura, Francisco Riveros y Catalina Salinas.

## Cómo ejecutar

    npm install
    npm run dev      # servidor de desarrollo (Vite)
    npm run build    # empaquetado para producción

## Pruebas

    npm test           # Karma + Jasmine en ChromeHeadless, con cobertura en coverage/html
    npm run test:jsdom # alternativa sin Chrome
    npm run test:watch # modo observador

52 pruebas unitarias en 9 archivos. Detalle y cobertura en `Documentacion/InformeTesting_Perlitas_de_Eucarion`.

## Estructura

- `src/main.jsx`: punto de entrada (Router + proveedores de contexto + Bootstrap).
- `src/App.jsx`: Navbar, 15 rutas y Footer.
- `src/components`: Navbar, Footer, ProductCard.
- `src/pages`: 15 páginas.
  - Tienda: Inicio, Productos, ProductoDetalle, Categorias, Ofertas, Carrito, Checkout, CompraExitosa, CompraError.
  - Administración: AdministrarProductos, DetalleProducto, EditarProducto, RegistrarProducto, AdministrarOrdenes, DetalleOrden.
- `src/context`: estado global.
  - `CarritoContext.jsx`: carrito (localStorage).
  - `ProductosContext.jsx`: catálogo y CRUD (localStorage).
  - `OrdenesContext.jsx`: órdenes de compra (localStorage).
- `src/services/productosService.js`: carga el catálogo desde `public/productos.json`.
- `src/data`: categorías, regiones y comunas.
- `src/utils/validaciones.js`: funciones puras de validación y formato.
- `test/`: pruebas Jasmine + Karma (`karma.conf.cjs` en la raíz).
- `Documentacion/`: Informe Técnico e Informe de Testing.
