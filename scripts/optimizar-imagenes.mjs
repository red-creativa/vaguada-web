/**
 * optimizar-imagenes.mjs — genera las imágenes livianas del sitio.
 *
 * Lee las fotos originales de /imagenes-originales (cualquier formato) y
 * escribe una versión WebP redimensionada en /public/images, con la misma
 * estructura de carpetas. Para cambiar una foto: reemplazá el original y
 * corré `npm run imagenes`.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("imagenes-originales");
const OUT = path.resolve("public/images");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

/** Ancho máximo y calidad según el uso de cada imagen. */
function preset(rel) {
  const name = path.basename(rel);
  if (rel.startsWith("equipo")) return { width: 480, quality: 80 };
  if (rel.startsWith("areas")) return { width: 900, quality: 74 };
  // Fondos: se muestran a baja opacidad, admiten más compresión.
  if (name.includes("-mobile")) return { width: 1080, quality: 66 };
  return { width: 1920, quality: 72 };
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (IMAGE_EXT.test(entry.name)) yield full;
  }
}

const kb = (n) => `${Math.round(n / 1024)} KB`;
let before = 0;
let after = 0;

for await (const file of walk(SRC)) {
  const rel = path.relative(SRC, file).split(path.sep).join("/");
  const out = path.join(OUT, rel.replace(IMAGE_EXT, ".webp"));
  const { width, quality } = preset(rel);

  await mkdir(path.dirname(out), { recursive: true });
  await sharp(file)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out);

  const [a, b] = [(await stat(file)).size, (await stat(out)).size];
  before += a;
  after += b;
  console.log(`${rel.padEnd(36)} ${kb(a).padStart(7)} → ${kb(b).padStart(6)}`);
}

console.log(`\nTotal: ${kb(before)} → ${kb(after)}`);
