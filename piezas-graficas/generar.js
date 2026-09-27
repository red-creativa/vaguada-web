// Generador de piezas VAGUADA (tarjeta 9x5 cm + one-pager A4).
// Todo el contenido está en CONTENIDO; la paleta y fuentes en MARCA.
const pptxgen = require("pptxgenjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");
const fs = require("fs");

// ───────────── MARCA (sale de src/vaguada.css) ─────────────
const MARCA = {
  ink: "1E2A45", body: "4B5768", dim: "8993A3", faint: "B7BFC9",
  accent: "3B6FA0", accentSoft: "8FC1E0", bg: "F4F7FB", white: "FFFFFF",
  titulo: "Manrope",            // .font-syne
  texto: "Plus Jakarta Sans",   // body
};

// ───────────── CONTENIDO (sale de src/VaguadaLanding.jsx) ─────────────
const CONTENIDO = {
  nombre: "VAGUADA",
  lema: "Soluciones ambientales para industrias e instituciones.",
  descripcion: "Diagnóstico, diseño, gestión e implementación de soluciones ambientales. Desarrollos aplicados al sector industrial, infraestructura y recursos naturales.",
  email: "contacto@vaguada.com",
  telefono: "+54 3804 49-4798",
  ubicacion: "La Rioja y Provincias Aledañas, Argentina",
  equipo: [
    { nombre: "Francisco Salvadores", rol: "Director Operativo",
      formacion: ["Ingeniero Ambiental", "Universidad Nacional del Litoral"],
      linkedin: "linkedin.com/in/fransalva2res",
      bio: "Evaluación de impacto ambiental, líneas de base, gestión integral de residuos y sistemas ISO 14001 / ISO 9001. Coordinación de equipos interdisciplinarios." },
    { nombre: "Luca Parquet", rol: "Director de SIG y Modelado",
      formacion: ["Ingénieur — École des Ponts ParisTech, Francia", "Ingeniero en Recursos Hídricos, UNL"],
      linkedin: "linkedin.com/in/luca-parquet",
      bio: "Modelación hidráulica e hidrológica (HEC-RAS, HEC-HMS, TELEMAC-MASCARET) y SIG. Experiencia en Francia y Argentina en obras y riesgo de inundación." },
  ],
  pasos: [
    ["LuSearch", "Relevamos el problema", "en el lugar: técnico, normativo u operativo."],
    ["LuSlidersVertical", "Diseñamos a medida", "ingeniería, balances o documentación normativa."],
    ["LuWorkflow", "Gestionamos todo", "compras, proveedores y trámites hasta la ejecución."],
    ["LuCircleCheck", "Entregamos funcionando", "permiso aprobado u obra operando."],
  ],
  areas: [
    ["LuCompass", "Diagnósticos y recomendaciones", "Entendimiento técnico de la operación como punto de partida."],
    ["LuFileCheck2", "Cumplimiento ambiental", "EIA, DIA, permisos, licencias y planes de gestión."],
    ["LuDroplet", "Agua y efluentes", "Infraestructura de agua y tratamiento de efluentes."],
    ["LuRecycle", "Residuos y economía circular", "Gestión de residuos y modelos de valorización."],
    ["LuWind", "Emisiones atmosféricas", "Caracterización, modelación y control de emisiones."],
    ["LuGauge", "Sustentabilidad empresarial", "Cultura ambiental, indicadores y datos para la gestión."],
    ["LuCloudRain", "Riesgo climático y adaptación", "De datos climáticos a decisiones de inversión."],
    ["LuSprout", "Remediación y restauración", "Suelos, aguas y ecosistemas."],
    ["LuWaves", "Modelado hidráulico e hidrológico", "Crecidas y escurrimientos con HEC-RAS y HEC-HMS."],
  ],
  sectores: ["Minería", "Energía", "Industria y manufactura", "Infraestructura y construcción",
    "Hidrocarburos y combustibles", "Industria agro-ganadera", "Logística", "Grandes instalaciones",
    "Sector público y gobiernos"],
};

// ───────────── utilidades ─────────────
async function icono(nombre, color, px = 256) {
  const svg = renderToStaticMarkup(React.createElement(lu[nombre], { size: px, color: "#" + color }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Logo "topographic" del sitio, dibujado con formas nativas (editables).
// Escala el viewBox 40x40 del SVG original.
function curvas(pres, slide, x, y, s, color, grosores = [3.2, 2.2, 1.8], dot = [20, 10, 1.8], transp = [5, 40, 60]) {
  const k = s / 40;
  const paths = [
    [[6, 10], [13, 10, 16.5, 25, 20, 29], [23.5, 25, 27, 10, 34, 10]],
    [[10, 17], [14.5, 17, 17, 26.5, 20, 31], [23, 26.5, 25.5, 17, 30, 17]],
    [[14, 23.5], [17, 23.5, 18.5, 28.5, 20, 32.5], [21.5, 28.5, 23, 23.5, 26, 23.5]],
  ];
  paths.forEach((p, i) => {
    if (grosores[i] == null) return;
    const xs = [p[0][0], p[1][4], p[2][4]], ys = [p[0][1], p[1][5], p[2][5], p[1][1], p[2][3]];
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const L = (v, m) => (v - m) * k;
    slide.addShape(pres.shapes.CUSTOM_GEOMETRY, {
      x: x + minX * k, y: y + minY * k, w: (maxX - minX) * k, h: (maxY - minY) * k,
      line: { color, width: grosores[i] * k * 72, transparency: transp[i] },
      points: [
        { x: L(p[0][0], minX), y: L(p[0][1], minY), moveTo: true },
        ...p.slice(1).map(c => ({ x: L(c[4], minX), y: L(c[5], minY),
          curve: { type: "cubic", x1: L(c[0], minX), y1: L(c[1], minY), x2: L(c[2], minX), y2: L(c[3], minY) } })),
      ],
    });
  });
  if (dot) {
    const r = dot[2] * k;
    slide.addShape(pres.shapes.OVAL, { x: x + dot[0] * k - r, y: y + dot[1] * k - r, w: 2 * r, h: 2 * r,
      fill: { color, transparency: transp[0] }, line: { type: "none" } });
  }
}

function logo(pres, slide, x, y, s) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: s, h: s, rectRadius: s * 0.22,
    fill: { color: MARCA.ink }, line: { type: "none" } });
  const inner = s * 0.72;
  curvas(pres, slide, x + (s - inner) / 2, y + (s - inner) / 2, inner, MARCA.accentSoft);
}

function marcaDeAgua(pres, slide, x, y, s, color, transp) {
  curvas(pres, slide, x, y, s, color, [2.8, 2, null], [20, 35, 2], [transp, transp, transp]);
}

const T = (o) => ({ isTextBox: true, margin: 0, fontFace: MARCA.texto, color: MARCA.body, valign: "top", ...o });

// ═════════════ TARJETA 9 x 5 cm ═════════════
async function tarjeta() {
  const pres = new pptxgen();
  const W = 9 / 2.54, H = 5 / 2.54;
  pres.defineLayout({ name: "TARJETA", width: W, height: H });
  pres.layout = "TARJETA";
  pres.title = "VAGUADA — Tarjeta";

  // FRENTE
  const f = pres.addSlide();
  f.background = { color: MARCA.bg };
  marcaDeAgua(pres, f, W - 1.55, 0.25, 2.1, MARCA.ink, 92);
  const ls = 0.62;
  logo(pres, f, 0.22, 0.24, ls);
  f.addText([
    { text: CONTENIDO.nombre, options: { fontFace: MARCA.titulo, bold: true, color: MARCA.ink, fontSize: 17, charSpacing: -0.3 } },
    { text: " ●", options: { color: MARCA.accent, fontSize: 7 } },
  ], T({ x: 0.97, y: 0.26, w: 2.3, h: 0.3 }));
  f.addText(CONTENIDO.lema.toUpperCase(), T({ x: 0.97, y: 0.58, w: 2.2, h: 0.3,
    fontFace: MARCA.titulo, bold: true, fontSize: 6, color: MARCA.ink, lineSpacingMultiple: 1.05 }));
  const ic = { mail: await icono("LuMail", MARCA.accent), tel: await icono("LuPhone", MARCA.accent), pin: await icono("LuMapPin", MARCA.accent) };
  [[ic.mail, CONTENIDO.email], [ic.tel, CONTENIDO.telefono], [ic.pin, CONTENIDO.ubicacion]].forEach(([d, t], i) => {
    const yy = 1.2 + i * 0.19;
    f.addImage({ data: d, x: 0.24, y: yy + 0.012, w: 0.1, h: 0.1 });
    f.addText(t, T({ x: 0.4, y: yy, w: 2.9, h: 0.13, fontSize: 6.5, color: MARCA.body }));
  });

  // DORSO
  const d = pres.addSlide();
  d.background = { color: MARCA.ink };
  marcaDeAgua(pres, d, W - 1.2, H - 1.72, 1.5, MARCA.accentSoft, 88);
  d.addText("EQUIPO", T({ x: 0.22, y: 0.2, w: 1.5, h: 0.14, fontSize: 5.5, bold: true, charSpacing: 1.5, color: MARCA.accentSoft }));
  const cap = await icono("LuGraduationCap", MARCA.accentSoft);
  const colW = 1.5;
  CONTENIDO.equipo.forEach((m, i) => {
    const x = 0.22 + i * (colW + 0.16);
    d.addText(m.nombre, T({ x, y: 0.42, w: colW, h: 0.17, fontFace: MARCA.titulo, bold: true, fontSize: 8.5, color: MARCA.white }));
    d.addText(m.rol, T({ x, y: 0.6, w: colW, h: 0.13, fontSize: 5.5, color: MARCA.accentSoft, bold: true }));
    d.addImage({ data: cap, x, y: 0.82, w: 0.11, h: 0.11 });
    d.addText(m.formacion.map((l, j) => ({ text: l, options: { breakLine: j < m.formacion.length - 1, paraSpaceAfter: 2,
      bold: j === 0, color: j === 0 ? MARCA.white : "C9D3E0" } })),
      T({ x: x + 0.15, y: 0.8, w: colW - 0.15, h: 0.5, fontSize: 5.5, lineSpacingMultiple: 1.05 }));
  });
  d.addText(`${CONTENIDO.email}   ·   ${CONTENIDO.telefono}`, T({ x: 0.22, y: H - 0.33, w: 3, h: 0.13, fontSize: 5.5, color: "C9D3E0" }));
  await pres.writeFile({ fileName: "vaguada-tarjeta.pptx" });
}

// ═════════════ ONE-PAGER A4 ═════════════
async function onepager() {
  const pres = new pptxgen();
  const W = 21 / 2.54, H = 29.7 / 2.54, M = 0.5, CW = W - 2 * M;
  pres.defineLayout({ name: "A4", width: W, height: H });
  pres.layout = "A4";
  pres.title = "VAGUADA — Presentación";
  const s = pres.addSlide();
  s.background = { color: MARCA.bg };
  const sombra = () => ({ type: "outer", color: MARCA.ink, blur: 10, offset: 3, angle: 90, opacity: 0.1 });
  const card = (x, y, w, h, fill = MARCA.white) => s.addShape(pres.shapes.ROUNDED_RECTANGLE,
    { x, y, w, h, rectRadius: 0.16, fill: { color: fill }, line: { type: "none" }, shadow: sombra() });
  const h2 = (t, y) => s.addText(t, T({ x: M, y, w: CW, h: 0.34, fontFace: MARCA.titulo, bold: true, fontSize: 15, color: MARCA.ink }));

  // Portada
  const heroH = 2.55;
  s.addImage({ path: "/mnt/user-data/uploads/vaguada-web/public/images/hero.jpg", x: 0, y: 0, w: W, h: heroH,
    sizing: { type: "cover", w: W, h: heroH } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: heroH, fill: { color: MARCA.ink, transparency: 14 }, line: { type: "none" } });
  marcaDeAgua(pres, s, W - 2.75, 0.12, 2.35, MARCA.accentSoft, 85);
  logo(pres, s, M, 0.4, 0.9);
  s.addText([
    { text: CONTENIDO.nombre, options: { fontFace: MARCA.titulo, bold: true, color: MARCA.white, fontSize: 34, charSpacing: -0.5 } },
    { text: " ●", options: { color: MARCA.accentSoft, fontSize: 12 } },
  ], T({ x: M + 1.1, y: 0.44, w: 4.5, h: 0.6 }));
  s.addText("CONSULTORA AMBIENTAL", T({ x: M + 1.12, y: 1.04, w: 4, h: 0.2, fontSize: 8.5, bold: true, charSpacing: 3, color: MARCA.accentSoft }));
  s.addText(CONTENIDO.lema.toUpperCase(), T({ x: M, y: 1.45, w: 5.6, h: 0.62, fontFace: MARCA.titulo, bold: true, fontSize: 17, color: MARCA.white, lineSpacingMultiple: 1.0 }));
  s.addText(CONTENIDO.descripcion, T({ x: M, y: 2.13, w: 5.6, h: 0.45, fontSize: 9, color: "D5DEEA", lineSpacingMultiple: 1.2 }));

  // Nos encargamos de todo
  let y = heroH + 0.25;
  h2("Nos encargamos de todo.", y);
  y += 0.38;
  const pw = (CW - 3 * 0.16) / 4, ph = 1.02;
  for (let i = 0; i < 4; i++) {
    const [ico, lead, rest] = CONTENIDO.pasos[i];
    const x = M + i * (pw + 0.16);
    card(x, y, pw, ph);
    s.addImage({ data: await icono(ico, MARCA.accent), x: x + 0.16, y: y + 0.16, w: 0.22, h: 0.22 });
    s.addText(`0${i + 1}`, T({ x: x + pw - 0.46, y: y + 0.18, w: 0.3, h: 0.16, fontSize: 8, bold: true, color: MARCA.faint, align: "right" }));
    s.addText([
      { text: lead, options: { bold: true, color: MARCA.ink, breakLine: true } },
      { text: rest, options: { color: MARCA.body } },
    ], T({ x: x + 0.16, y: y + 0.45, w: pw - 0.28, h: 0.52, fontSize: 7.5, lineSpacingMultiple: 1.1 }));
  }

  // Áreas
  y += ph + 0.25;
  h2("Áreas de trabajo", y);
  y += 0.38;
  const aw = (CW - 2 * 0.16) / 3, ah = 0.82;
  for (let i = 0; i < 9; i++) {
    const [ico, t, st] = CONTENIDO.areas[i];
    const x = M + (i % 3) * (aw + 0.16), yy = y + Math.floor(i / 3) * (ah + 0.12);
    card(x, yy, aw, ah);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.14, y: yy + 0.16, w: 0.38, h: 0.38, rectRadius: 0.09, fill: { color: "E6EEF7" }, line: { type: "none" } });
    s.addImage({ data: await icono(ico, MARCA.accent), x: x + 0.23, y: yy + 0.25, w: 0.2, h: 0.2 });
    s.addText(t, T({ x: x + 0.64, y: yy + 0.1, w: aw - 0.74, h: 0.3, valign: "bottom", fontFace: MARCA.titulo, bold: true, fontSize: 8, color: MARCA.ink }));
    s.addText(st, T({ x: x + 0.64, y: yy + 0.44, w: aw - 0.74, h: 0.34, fontSize: 6.8, color: MARCA.body, lineSpacingMultiple: 1.1 }));
  }

  // Sectores (chips)
  y += 3 * ah + 2 * 0.12 + 0.25;
  h2("Sectores de aplicación", y);
  y += 0.38;
  let cx = M, cy = y;
  const chipH = 0.26;
  CONTENIDO.sectores.forEach((t) => {
    const w = 0.28 + t.length * 0.052;
    if (cx + w > M + CW) { cx = M; cy += chipH + 0.08; }
    s.addText(t, T({ x: cx, y: cy, w, h: chipH, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: chipH / 2,
      fill: { color: MARCA.white }, line: { color: "D9E1EC", width: 0.75 }, align: "center", valign: "middle", fontSize: 7, bold: true, color: MARCA.ink }));
    cx += w + 0.08;
  });

  // Equipo
  y = cy + chipH + 0.25;
  h2("Equipo", y);
  y += 0.38;
  const ew = (CW - 0.16) / 2, eh = 1.52;
  const cap = await icono("LuGraduationCap", MARCA.accentSoft);
  const lin = await icono("LuLinkedin", MARCA.dim);
  CONTENIDO.equipo.forEach((m, i) => {
    const x = M + i * (ew + 0.16);
    card(x, y, ew, eh, MARCA.ink);
    s.addText(m.nombre, T({ x: x + 0.22, y: y + 0.18, w: ew - 0.4, h: 0.26, fontFace: MARCA.titulo, bold: true, fontSize: 13, color: MARCA.white }));
    s.addText(m.rol.toUpperCase(), T({ x: x + 0.22, y: y + 0.45, w: ew - 0.4, h: 0.16, fontSize: 7, bold: true, charSpacing: 1.5, color: MARCA.accentSoft }));
    s.addImage({ data: cap, x: x + 0.22, y: y + 0.7, w: 0.17, h: 0.17 });
    s.addText(m.formacion.map((l, j) => ({ text: l, options: { breakLine: j < m.formacion.length - 1, bold: j === 0, color: j === 0 ? MARCA.white : "C9D3E0" } })),
      T({ x: x + 0.46, y: y + 0.69, w: ew - 0.66, h: 0.34, fontSize: 8, lineSpacingMultiple: 1.15 }));
    s.addText(m.bio, T({ x: x + 0.22, y: y + 1.02, w: ew - 0.44, h: 0.36, fontSize: 6.8, color: "AEB9C8", lineSpacingMultiple: 1.15 }));
  });

  // Contacto (banda inferior)
  const fh = 0.55, fy = H - fh;
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: fy, w: W, h: fh, fill: { color: MARCA.ink }, line: { type: "none" } });
  s.addText("CONTACTO", T({ x: M, y: fy, w: 1.2, h: fh, valign: "middle", fontSize: 8, bold: true, charSpacing: 2.5, color: MARCA.accentSoft }));
  const cont = [["LuMail", CONTENIDO.email], ["LuPhone", CONTENIDO.telefono], ["LuMapPin", CONTENIDO.ubicacion]];
  const cw3 = [1.9, 1.5, 2.7]; let xx = M + 1.15;
  for (let i = 0; i < 3; i++) {
    s.addImage({ data: await icono(cont[i][0], MARCA.accentSoft), x: xx, y: fy + fh / 2 - 0.08, w: 0.16, h: 0.16 });
    s.addText(cont[i][1], T({ x: xx + 0.24, y: fy, w: cw3[i] - 0.3, h: fh, fontSize: 8.5, color: MARCA.white, valign: "middle" }));
    xx += cw3[i];
  }
  await pres.writeFile({ fileName: "vaguada-onepager.pptx" });
}

(async () => { await tarjeta(); await onepager(); })();
