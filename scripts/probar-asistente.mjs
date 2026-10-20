/**
 * probar-asistente.mjs — batería de preguntas difíciles contra el asistente publicado.
 *
 * Uso:
 *   npm run probar-asistente                         todo, con el modelo configurado
 *   npm run probar-asistente -- --solo charla        solo la conversación larga (loteo + edificios)
 *   npm run probar-asistente -- --solo amplias       solo consultas amplias
 *   npm run probar-asistente -- --modelo llama70     forzar un modelo (gemma, gemma-razona, llama70)
 *   npm run probar-asistente -- --url https://…      otra dirección (p. ej. la de prueba de una rama)
 *
 * Muestra cada respuesta para leerla y marca automáticamente lo que nunca
 * debería pasar. Cada respuesta usa parte del cupo diario de IA.
 */

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const BASE = opt("--url") ?? "https://uilka.pages.dev";
const MODELO = opt("--modelo");
const SOLO = opt("--solo");

const CASOS = [
  {
    grupo: "charla",
    turnos: [
      "estoy trabajando en un loteo y tengo consultas sobre la parte medioambiental",
      "recién está en etapa de planteo del proyecto. todavía no hicimos la presentación en catastro.",
      "tengo otras consultas ademas porque hay algunos edificios que tenemos que hay que regularizar la parte ambiental. estan en el centro de la ciudad de la rioja. y tengo también unos proyectos de reutilización de efluente de unas cabañas que estan al sur de la provincia.",
    ],
  },
  { grupo: "amplias", turnos: ["tengo un loteo"] },
  { grupo: "amplias", turnos: ["voy a abrir una fábrica de alimentos"] },
  { grupo: "amplias", turnos: ["qué hacen ustedes?"] },
  { grupo: "raras", turnos: ["hola. quiero saber cómo hacer para renovar el pacto global de la onu"] },
  { grupo: "raras", turnos: ["necesito certificar ISO 9001 de calidad"] },
  { grupo: "raras", turnos: ["quiero vender bonos de carbono de mi campo"] },
  { grupo: "raras", turnos: ["pasame una receta de pizza"], sinPlan: true },
].filter((c) => !SOLO || c.grupo === SOLO);

const PROHIBIDAS = [/no podemos/i, /no hacemos/i, /no (está|esta|entra) dentro de nuestros servicios/i, /<\s*\/?\s*resumen/i];
const palabras = (t) => t.split(/\s+/).filter(Boolean).length;

console.log(`Probando ${BASE}${MODELO ? ` con el modelo "${MODELO}"` : ""}`);
let problemas = 0;

for (const caso of CASOS) {
  const historia = [];
  console.log("\n" + "█".repeat(70) + `\n${caso.grupo.toUpperCase()}`);
  for (const turno of caso.turnos) {
    historia.push({ role: "user", content: turno });
    const t0 = Date.now();
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: BASE, ...(MODELO ? { "x-uilka-modelo": MODELO } : {}) },
      body: JSON.stringify({ messages: historia }),
    });
    const raw = await res.text();
    historia.push({ role: "assistant", content: raw });
    const segundos = ((Date.now() - t0) / 1000).toFixed(1);
    const [visible, resumen = ""] = raw.split(/<\s*resumen\s*>/i);

    const avisos = [];
    if (!res.ok || !raw.trim()) avisos.push(`sin respuesta (HTTP ${res.status}) ${raw.slice(0, 120)}`);
    for (const re of PROHIBIDAS) if (re.test(visible)) avisos.push(`no debería aparecer: ${re}`);
    if (!caso.sinPlan && !resumen.trim()) avisos.push("falta el mensaje para el operador");
    if (palabras(visible) > 170) avisos.push(`muy largo (${palabras(visible)} palabras)`);
    problemas += avisos.length;

    console.log("─".repeat(70));
    console.log(`PERSONA: ${turno}   (${segundos} s · ${palabras(visible)} palabras)`);
    console.log("─".repeat(70));
    console.log(visible.trim());
    if (resumen.trim()) console.log(`\n[Mensaje para el operador] ${resumen.replace(/<\s*\/\s*resumen\s*>/i, "").trim()}`);
    if (avisos.length) console.log(`\n⚠ ${avisos.join(" · ")}`);
  }
}

console.log("\n" + "═".repeat(70));
console.log(problemas ? `Revisar: ${problemas} aviso(s) automáticos. Leer igual las respuestas.` : "Sin avisos automáticos. Leer igual las respuestas.");
