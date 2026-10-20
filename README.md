# ÜILKA — sitio web

Landing de ÜILKA hecha con React, Vite y Tailwind CSS v4.

## Requisitos

- [Node.js](https://nodejs.org/) 20.19 o superior (recomendado: 22 LTS)

## Primeros pasos

```bash
npm install     # instala las dependencias (solo la primera vez)
npm run dev     # abre el servidor de desarrollo en http://localhost:5173
```

Cada cambio que guardes se ve al instante en el navegador.

## Publicar

```bash
npm run build   # genera el sitio listo para subir en la carpeta dist/
npm run preview # previsualiza ese resultado localmente
```

Sube el contenido de `dist/` a cualquier hosting estático (Cloudflare Pages, Netlify, Vercel, etc.).

## Estructura

```
uilka-web/
├── index.html               # HTML base: título, metadatos, fuentes y precarga de la portada
├── package.json             # dependencias y scripts
├── vite.config.js           # Vite + React + Tailwind
├── imagenes-originales/     # fotos originales, sin comprimir (no se publican)
├── scripts/
│   └── optimizar-imagenes.mjs  # genera las WebP livianas de public/images
├── public/
│   └── images/              # imágenes del sitio ya optimizadas (WebP)
├── src/
│   ├── main.jsx             # punto de entrada: monta el componente
│   ├── UilkaLanding.jsx     # toda la página
│   ├── icons.jsx            # íconos propios de la marca
│   └── uilka.css            # Tailwind, diapositivas y capa de tema
└── _sin-usar/               # archivos que la página no usa (guardados por las dudas)
```

## Imágenes

Para cambiar o agregar una foto:

1. Copiala en `imagenes-originales/` con el mismo nombre y carpeta (`areas/agua.jpg`, `equipo/…`, `hero.jpg`, etc.). Sirve cualquier formato.
2. Corré `npm run imagenes`. Se genera la versión WebP liviana en `public/images/`.

Las que terminan en `-mobile` son las que se usan en celulares.

## Dónde editar

Todo el contenido está en constantes al principio de `src/UilkaLanding.jsx`:

| Constante | Qué contiene |
|---|---|
| `IMAGES` | Rutas de las imágenes |
| `BRAND` | Nombre, lema, correo y ubicación |
| `AREAS` / `AREA_ICONS` | Las 9 áreas de servicio, sus ítems e íconos |
| `SECTORS` | Los 9 sectores de aplicación |
| `TEAM` | Equipo y enlaces de LinkedIn |
| `CONTACT` | Correo, teléfono, WhatsApp y ubicación |
| `PROCESS_STEPS` | Los 3 pasos de “Nos encargamos de todo.” |
| `SLIDE_LABELS` | Nombres de las diapositivas en la navegación lateral (mismo orden que en pantalla) |

## Comportamiento

- **Escritorio**: diapositivas a pantalla completa con scroll-snap y navegación lateral por puntos. Orden: Inicio → Llave en mano → Áreas (3) → Sectores → Equipo → Contacto. En pantallas bajas una diapositiva puede crecer en vez de cortar contenido.
- **Tablets táctiles**: las mismas secciones en una página continua, sin snap.
- **Móvil (≤ 767 px)**: diapositivas con fundido al deslizar; las áreas en un carrusel horizontal. Si una diapositiva no entra en pantalla, primero se desplaza y recién después pasa a la siguiente.
- Las tarjetas de área giran al hacer clic o tocar (y con Enter o espacio).
- El botón “Contacto” de la portada lleva a la última diapositiva.

## Estilo

`src/uilka.css` incluye una **capa de tema** que convierte las clases `stone`/`emerald` del JSX en tarjetas de vidrio en azul pizarra (`--e-text`, `--e-accent`, etc.).
Para cambiar la paleta, edita las variables de `:root`.
