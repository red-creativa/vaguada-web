# Imágenes del sitio

Copia aquí tus imágenes con **exactamente** estos nombres y carpetas para que la página las muestre.
Los nombres distinguen mayúsculas de minúsculas y deben terminar en `.jpg`.

```
public/images/
├── hero.jpg
├── proceso.jpg
├── sectores.jpg
├── contacto.jpg
├── areas/
│   ├── diagnostico.jpg
│   ├── cumplimiento.jpg
│   ├── agua.jpg
│   ├── residuos.jpg
│   ├── emisiones.jpg
│   ├── sustentabilidad.jpg
│   ├── riesgo-climatico.jpg
│   └── remediacion.jpg
└── equipo/
    ├── francisco-salvadores.jpg
    └── luca-parquet.jpg
```

## Fondos de sección

| Archivo | Dónde aparece | Sugerencia |
|---|---|---|
| `hero.jpg` | Fondo de la portada (primera pantalla) | Horizontal, 1920 px de ancho o más |
| `proceso.jpg` | Fondo de “Nos encargamos de todo.” (solo escritorio) | Horizontal |
| `sectores.jpg` | Fondo de “Sectores de aplicación” | Horizontal |
| `contacto.jpg` | Fondo de “Contacto” | Horizontal |

Los fondos se muestran muy transparentes (entre 10 % y 20 % de opacidad), así que sirven fotos con mucho detalle.

## Tarjetas de áreas (`areas/`)

| Archivo | Tarjeta |
|---|---|
| `diagnostico.jpg` | 01 · Diagnósticos y Recomendaciones |
| `cumplimiento.jpg` | 02 · Cumplimiento ambiental |
| `agua.jpg` | 03 · Agua y efluentes |
| `residuos.jpg` | 04 · Residuos y economía circular |
| `emisiones.jpg` | 05 · Emisiones atmosféricas |
| `sustentabilidad.jpg` | 06 · Sustentabilidad empresarial |
| `riesgo-climatico.jpg` | 07 · Riesgo climático y adaptación |
| `remediacion.jpg` | 08 · Remediación y restauración |

Se recortan para llenar la tarjeta (unos 400 × 320 px en pantalla). Conviene que sean horizontales o cuadradas, de 800 px de ancho o más.

## Equipo (`equipo/`)

| Archivo | Persona |
|---|---|
| `francisco-salvadores.jpg` | Francisco Salvadores |
| `luca-parquet.jpg` | Luca Parquet |

Se muestran en un círculo, así que conviene una foto cuadrada con la cara centrada (400 × 400 px o más).

## ¿Otro nombre o formato?

Si quieres usar `.png`, `.webp` u otros nombres, cambia las rutas en el objeto `IMAGES`, al principio de `src/VaguadaLanding.jsx`.
