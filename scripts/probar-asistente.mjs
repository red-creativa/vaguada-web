/**
 * probar-asistente.mjs — batería de preguntas difíciles contra el asistente publicado.
 *
 * Uso:
 *   npm run probar-asistente                         todas las preguntas, modelo configurado
 *   npm run probar-asistente -- --amplias            solo las consultas amplias / exploratorias
 *   npm run probar-asistente -- --modelo llama70     forzar un modelo (gemma, gemma-razona, llama70)
 *   npm run probar-asistente -- --url https://…      otra dirección (p. ej. la de prueba de una rama)
 *
 * Muestra cada respuesta y marca automáticamente lo que no debería pasar.
 * Cada pregunta usa una respuesta del cupo diario de IA.
 */

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const BASE = opt("--url") ?? "https://uilka.pages.dev";
const MODELO = opt("--modelo");
const SOLO_AMPLIAS = args.includes("--amplias");

const CASOS = [
  // Consultas amplias: tienen que mostrar el panorama, no una sola opción.
  { pregunta: "tengo un loteo", espera: "panorama" },
  { pregunta: "voy a abrir una fábrica de alimentos", espera: "panorama" },
  { pregunta: "tengo un campo con vacas", espera: "panorama" },
  { pregunta: "qué hacen ustedes?", espera: "panorama" },
  // Consultas fuera de lo habitual: nunca "no podemos".
  { pregunta: "hola. quiero saber cómo hacer para renovar el pacto global de la onu", espera: "plan" },
  { pregunta: "necesito certificar ISO 9001 de calidad", espera: "plan" },
  { pregunta: "me pidieron un programa de seguridad e higiene para la planta", espera: "plan" },
  { pregunta: "quiero vender bonos de carbono de mi campo", espera: "plan" },
  { pregunta: "necesito la habilitación bromatológica de mi fábrica de alimentos", espera: "plan" },
  { pregunta: "tengo neumáticos viejos acumulados en el galpón, qué hago", espera: "plan" },
  { pregunta: "pasame una receta de pizza", espera: "sin-plan" },
].filter((c) => !SOLO_AMPLIAS || c.espera === "panorama");

const PROHIBIDAS = [/no podemos/i, /no hacemos/i, /no (está|esta|entra) dentro de nuestros servicios/i, /no (es|son) (de )?nuestro/i];
const palabras = (t) => t.split(/\s+/).filter(Boolean).length;

console.log(`Probando ${BASE}${MODELO ? ` con el modelo "${MODELO}"` : ""} · ${CASOS.length} preguntas`);
let problemas = 0;

for (const { pregunta, espera } of CASOS) {
  const t0 = Date.now();
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: BASE, ...(MODELO ? { "x-uilka-modelo": MODELO } : {}) },
    body: JSON.stringify({ messages: [{ role: "user", content: pregunta }] }),
  });
  const raw = await res.text();
  const segundos = ((Date.now() - t0) / 1000).toFixed(1);
  const [visible, resumen = ""] = raw.split(/<\s*resumen\s*>/i);

  const avisos = [];
  if (!res.ok || !raw.trim()) avisos.push(`sin respuesta (HTTP ${res.status}) ${raw.slice(0, 120)}`);
  for (const re of PROHIBIDAS) if (re.test(visible)) avisos.push(`frase prohibida: ${re}`);
  if (espera !== "sin-plan" && !/plan sugerido/i.test(visible)) avisos.push("falta el plan");
  if (espera === "panorama" && !(/obligatorio/i.test(visible) && /suma/i.test(visible))) avisos.push("no muestra el panorama");
  if (espera !== "sin-plan" && !resumen.trim()) avisos.push("falta el mensaje para el operador");
  const limite = espera === "panorama" ? 180 : 130;
  if (palabras(visible) > limite) avisos.push(`muy largo (${palabras(visible)} palabras)`);
  problemas += avisos.length;

  console.log("\n" + "═".repeat(70));
  console.log(`PERSONA: ${pregunta}   (${segundos} s)`);
  console.log("─".repeat(70));
  console.log(visible.trim());
  if (resumen.trim()) console.log(`\n[Mensaje para el operador] ${resumen.replace(/<\s*\/\s*resumen\s*>/i, "").trim()}`);
  console.log(avisos.length ? `\n⚠ ${avisos.join(" · ")}` : "\n✓ OK");
}

console.log("\n" + "═".repeat(70));
console.log(problemas ? `Revisar: ${problemas} aviso(s).` : "Todo OK.");
