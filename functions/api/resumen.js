/**
 * POST /api/resumen — prepara un resumen de la consulta a partir de la conversación.
 *
 * Devuelve { resumen }. No guarda ni registra el contenido. En el nivel
 * gratuito, Gemini puede usar prompts y respuestas para mejorar sus productos.
 */

import { RESUMEN_PROMPT } from "../../src/asistente/conocimiento.js";
import { foreignOrigin, GEMINI_MODEL, geminiTextOf, json, sanitize } from "../../src/asistente/servidor.js";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/** Limpia lo que a veces agregan los modelos: comillas, saludo, prefijos. */
function tidy(text) {
  return text
    .trim()
    .replace(/^(resumen( de (tu )?consulta)?\s*:\s*)/i, "")
    .replace(/^["“'«]+|["”'»]+$/g, "")
    .replace(/^hola[^.!?\n]{0,20}[.!,]?\s*/i, "")
    .trim()
    .slice(0, 400);
}

export async function onRequestPost({ request, env }) {
  if (foreignOrigin(request)) return json({ error: "origen" }, 403);
  if (!env.GEMINI_API_KEY) return json({ error: "sin-ia" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "pedido" }, 400);
  }

  const messages = sanitize(body?.messages, { userLast: false });
  if (!messages) return json({ error: "pedido" }, 400);

  // Excluir al asistente evita que sus sugerencias pasen al resumen como pedidos del cliente.
  const customerMessages = messages.filter((message) => message.role === "user");
  if (!customerMessages.length) return json({ error: "pedido" }, 400);
  const transcript = customerMessages.map((message) => `PERSONA: ${message.content}`).join("\n\n");

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: RESUMEN_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: `CONVERSACIÓN:\n\n${transcript}\n\nPrepará ahora el resumen.` }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 350,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
    });
    if (!response.ok) return json({ error: "ia", detalle: (await response.text()).slice(0, 200) }, 503);
    const resumen = tidy(geminiTextOf(await response.json()));
    return resumen ? json({ resumen }) : json({ error: "vacio" }, 502);
  } catch {
    return json({ error: "ia" }, 503);
  }
}
