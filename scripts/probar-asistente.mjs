/**
 * probar-asistente.mjs — batería de preguntas difíciles contra el asistente publicado.
 *
 * Uso:  npm run probar-asistente            (prueba https://uilka.pages.dev)
 *       npm run probar-asistente -- <url>   (otra dirección, p. ej. la de prueba de una rama)
 *
 * Muestra cada respuesta y marca automáticamente lo que no debería pasar.
 * Cada pregunta usa una respuesta del cupo diario de IA (unas 50 "neurons").
 */

const BASE = process.argv[2] ?? "https://uilka.pages.dev";

const CASOS = [
  { pregunta: "hola. quiero saber cómo hacer para renovar el pacto global de la onu", espera: "plan" },
  { pregunta: "necesito certificar ISO 9001 de calidad", espera: "plan" },
  { pregunta: "me pidieron un programa de seguridad e higiene para la planta", espera: "plan" },
  { pregunta: "quiero vender bonos de carbono de mi campo", espera: "plan" },
  { pregunta: "necesito la habilitación bromatológica de mi fábrica de alimentos", espera: "plan" },
  { pregunta: "cómo calculo la huella de carbono de mi empresa", espera: "plan" },
  { pregunta: "tengo neumáticos viejos acumulados en el galpón, qué hago", espera: "plan" },
  { pregunta: "necesito un análisis de agua de pozo para consumo humano", espera: "plan" },
  { pregunta: "pasame una receta de pizza", espera: "sin-plan" },
];

const PROHIBIDAS = [/no podemos/i, /no hacemos/i, /no (está|esta|entra) dentro de nuestros servicios/i, /no (es|son) (de )?nuestro/i];

const palabras = (t) => t.split(/\s+/).filter(Boolean).length;

let problemas = 0;

for (const { pregunta, espera } of CASOS) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: BASE },
    body: JSON.stringify({ messages: [{ role: "user", content: pregunta }] }),
  });
  const raw = await res.text();
  const [visible, resumen = ""] = raw.split(/<\s*resumen\s*>/i);

  const avisos = [];
  if (!res.ok || !raw.trim()) avisos.push(`sin respuesta (HTTP ${res.status})`);
  for (const re of PROHIBIDAS) if (re.test(visible)) avisos.push(`frase prohibida: ${re}`);
  if (espera === "plan" && !/plan sugerido/i.test(visible)) avisos.push("falta el plan");
  if (espera === "plan" && !resumen.trim()) avisos.push("falta el mensaje para el operador");
  if (palabras(visible) > 130) avisos.push(`muy largo (${palabras(visible)} palabras)`);
  problemas += avisos.length;

  console.log("\n" + "═".repeat(70));
  console.log(`PERSONA: ${pregunta}`);
  console.log("─".repeat(70));
  console.log(visible.trim());
  if (resumen.trim()) console.log(`\n[Mensaje para el operador] ${resumen.replace(/<\s*\/\s*resumen\s*>/i, "").trim()}`);
  console.log(avisos.length ? `\n⚠ ${avisos.join(" · ")}` : "\n✓ OK");
}

console.log("\n" + "═".repeat(70));
console.log(problemas ? `Revisar: ${problemas} aviso(s).` : "Todo OK.");
