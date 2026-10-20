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

## Asistente con IA

El switch **Sitio / Asistente** (arriba a la derecha) transforma la página en un chat. También se abre directo con `…/#asistente`.

| Archivo | Qué hace |
|---|---|
| `src/asistente/Asistente.jsx` | El switch, la conversación, el reintento de respuestas y el resumen con opciones de contacto |
| `src/asistente/conocimiento.js` | El propósito e instrucciones del asistente, los servicios y las **fichas de trámites** |
| `functions/api/chat.js` | Función de Cloudflare Pages que consulta Gemini 3.8 Flash |
| `functions/api/resumen.js` | Prepara, cuando la persona lo pide, un resumen de la consulta para WhatsApp o correo |

Cuando el asistente ya entiende el caso, explica cómo ÜILKA puede encauzarlo y ofrece llamar al equipo o preparar un resumen neutral. Mientras se genera, aparece una animación de carga. El resumen se muestra antes de compartirlo; permite agregar nombre y apellido opcionalmente, abrir WhatsApp con el resumen o redactar un correo formal en la ventana de composición habitual de Gmail o Outlook web.

**Privacidad:** la conversación vive solo en la pestaña y el sitio no la guarda en cookies ni almacenamiento. Para generar respuestas y resúmenes, se envía a Gemini API. En el nivel gratuito, Google puede usar las entradas y respuestas para mejorar sus productos y puede hacer que revisores humanos las lean; no enviar datos sensibles, confidenciales ni personales. La función no registra el contenido. El resumen y el nombre opcional solo se incluyen en el enlace de WhatsApp o correo cuando la persona elige compartirlos.

**Activarlo en Cloudflare** (una sola vez): crear una API key de Gemini en Google AI Studio; en Cloudflare Pages → proyecto → Settings → Variables and Secrets → Add → **Secret**, nombre `GEMINI_API_KEY`, valor la clave creada. Configurarlo para Preview y Production y volver a desplegar. La clave solo se usa en las funciones del servidor; nunca se incluye en el navegador.

**Cupo:** Gemini API tiene cuotas gratuitas por proyecto (solicitudes por minuto, tokens por minuto y solicitudes por día). Los límites dependen del modelo y del proyecto, pueden cambiar y se consultan en la página Rate limits de Google AI Studio. Las cuotas diarias se reinician a medianoche del Pacífico. El asistente usa Gemini 3.8 Flash con razonamiento bajo.

**En la compu:** `npm run dev` responde con un texto de prueba (no hay IA local).
