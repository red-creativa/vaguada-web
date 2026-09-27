# VAGUADA — sitio web

Landing de VAGUADA hecha con React, Vite y Tailwind CSS v4.

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

Sube el contenido de `dist/` a cualquier hosting estático (Netlify, Vercel, GitHub Pages, cPanel, etc.).

## Estructura

```
vaguada-web/
├── index.html              # HTML base: título, metadatos y <body class="font-sans">
├── package.json            # dependencias y scripts
├── vite.config.js          # Vite + React + Tailwind
├── public/
│   └── images/             # imágenes del sitio (ver images/README.md)
└── src/
    ├── main.jsx            # punto de entrada: monta el componente
    ├── VaguadaLanding.jsx  # toda la página
    └── vaguada.css         # Tailwind, fuentes, diapositivas y capa de tema
```

## Dónde editar

Todo el contenido está en constantes al principio de `src/VaguadaLanding.jsx`:

| Constante | Qué contiene |
|---|---|
| `IMAGES` | Rutas de las imágenes |
| `BRAND` | Nombre, lema, correo y ubicación |
| `AREAS` / `AREA_ICONS` | Las 8 áreas de servicio, sus ítems e íconos |
| `SECTORS` | Los 9 sectores de aplicación |
| `TEAM` | Equipo directivo y enlaces de LinkedIn |
| `CONTACT` | Correo, teléfono, WhatsApp y ubicación |
| `PROCESS_STEPS` | Los 4 pasos de “Nos encargamos de todo.” |
| `HERO_STATS` | Los indicadores de la portada |

Los íconos vienen de [lucide.dev](https://lucide.dev/icons/). Para cambiar uno, importa el nuevo nombre desde `lucide-react`.

## Comportamiento

- **Escritorio**: diapositivas a pantalla completa con scroll-snap y navegación lateral por puntos.
- **Tablets táctiles**: las mismas secciones en una página continua, sin snap.
- **Móvil (≤ 767 px)**: diseño propio, con las áreas en un carrusel horizontal.
- Las tarjetas de área giran al hacer clic o tocar (y con Enter o espacio).

## Estilo

`src/vaguada.css` incluye una **capa de tema** que convierte las clases `stone`/`emerald` del JSX en tarjetas de vidrio redondeadas en azul pizarra (`--e-ink`, `--e-accent`, etc.).
Para cambiar la paleta, edita las variables de `:root`. Si borras ese bloque, verás el estilo base: beige con bordes negros.
