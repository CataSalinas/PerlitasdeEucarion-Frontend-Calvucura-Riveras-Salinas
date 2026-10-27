# Perlitas de Eucarión — Frontend (React + Bootstrap)

Migración del frontend HTML/CSS/JS a React, tomando como base la tienda del profe (DSY1104, Evaluación Parcial 2).

## Cómo ejecutar
```bash
npm install
npm run dev
```

## Pruebas
```bash
npm test          # Karma + Jasmine en ChromeHeadless, con cobertura en coverage/html
npm run test:jsdom # alternativa sin Chrome
```

## Estructura
- `src/components`: Navbar, Footer, ProductCard
- `src/pages`: Inicio, Productos, Carrito, RegistrarProducto
- `src/context/CarritoContext.jsx`: estado global del carrito (localStorage)
- `src/utils/validaciones.js`: funciones puras de validación
- `src/context/ProductosContext.jsx` + `src/services/productosService.js`: carga el catálogo desde `public/productos.json`
- `test/`: pruebas Jasmine + Karma (`karma.conf.cjs`)
