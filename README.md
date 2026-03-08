# 📱 The Kebab Lab - Carta Digital Pública

Este repositorio contiene el código fuente de la **Web Pública Cliente (Carta Digital)** del ecosistema The Kebab Lab. Está construida como una Single Page Application (SPA) con **React** y **Vite**, optimizada para un alto rendimiento y diseñada bajo un enfoque **Mobile-First**.

---

## 🎨 1. Design System y Customización (Re-Skin)

Este proyecto está diseñado para ser fácilmente clonable y adaptable a nuevas marcas o restaurantes sin alterar la lógica core del carrito o los datos. A continuación, se detalla la configuración visual:

### 1.1 Colores Globales y Tailwind
El esquema de colores principal está definido en la configuración de Tailwind.
1. Abre `tailwind.config.js`.
2. Modifica la paleta dentro de `theme.extend.colors` (por ejemplo, el Primary Color o el Secondary Color). A nivel de CSS puro, algunas variables esenciales pueden encontrarse al principio de `src/index.css`.

### 1.2 Fondo Texturizado (Background)
El fondo actual utiliza una imagen de patrón combinada con una capa de color superpuesta.
- **Imagen de Patrón**: `zellige-bg.webp` (situada en `public/` o `src/assets/`).
- **Color Base**: La capa de color superpuesta (verde) está definida en `index.css` o `App.css` (clase `.app-container` o directamente en el `body`).
*Para cambiar de marca, simplemente reemplaza la textura y ajusta el `background-color` principal.*

### 1.3 UI de Tarjetas (Card UI)
Los productos se renderizan en cajas blancas con sombras (Card UI) para garantizar el contraste de lectura sobre el fondo texturizado.
- **`ProductCard.jsx`**: Es el componente principal. El fondo blanco (`bg-white`), el redondeo (`rounded-xl` o similar) y las sombras tipo "drop-shadow" aseguran la máxima legibilidad de los nombres, descripciones y precios frente a fondos oscuros o con ruido visual.

---

## ⚙️ 2. Arquitectura de Datos y Desacoplamiento

Por motivos de **Seguridad y Rendimiento Extremo** (Zero-Latency), la web pública **NO tiene conexión directa a ninguna Base de Datos** (ni PostgreSQL ni SQLite).

### 2.1 El Archivo `menu.json`
Todo el catálogo de productos es impulsado por un único archivo estático: **`public/menu.json`**.
1. El backend / panel Admin (.NET) exporta el estado actual del inventario, precios y estados ("Agotado").
2. Genera un `menu.json`.
3. Sube dicho archivo a la plataforma de alojamiento de esta web (como Cloudflare Pages).
4. El Frontend (React) hace un sencillo `fetch('/menu.json')` al cargar, llenando reactivamente todas las categorías, tarjetas y precios. 

*Para probar la aplicación en local con datos modificados, basta con editar `public/menu.json` de forma manual.*

---

## 🌍 3. Internacionalización (i18n) e Idiomas

El sistema soporta traducciones instantáneas de la interfaz sin necesidad de recargar la página.

### 3.1 Diccionario Central (locales)
Las traducciones estáticas se alojan en: **`src/data/locales.js`**.
Allí residen los bloques de cada idioma soportado (español, francés, inglés, árabe, alemán, holandés).
- **Traducción de Categorías**: Se hace un mapeo 1:1 de los nombres base del Json contra el bloque de `categories`.
- **Traducción de Productos (Descripciones y Nombres Cortos)**: El array `products` tiene como "key" el nombre base original que viene en el `menu.json`, pero como "value" un objeto con su `name` visual amigable y su `description` rica.

### 3.2 Categorías y SVG Dinámico
La barra lateral / menú horizontal **carece de texto explícito (hardcodeado) sobre imágenes JPG/PNG**.
- **Iconografía**: En la carpeta `public/categories/`, se alojan iconos modulares y limpios en formato `.svg`.
- **Texto Superpuesto**: En `CategorySidebar.jsx`, el icono vectorial se establece como fondo, y mediante posicionamiento absoluto (`position: absolute`, `z-index`), se superpone el texto. Dicho texto está enlazado a `t('categories.Nombre')`.
*Resultado: Al cambiar de idioma, el texto de la categoría cambia al instante manteniendo el icono vectorizado inalterado debajo de él.*
