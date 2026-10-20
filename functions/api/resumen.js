/**
 * POST /api/resumen — prepara un resumen de la consulta a partir de la conversación.
 *
 * Es una tarea aparte de la conversación (así el modelo que conversa no
 * tiene que acordarse de un formato) y la hace el modelo más barato.
 * Devuelve { resumen }. No guarda nada.
 */

import { RESUMEN_PROMPT } from "../../src/asistente/conocimiento.js";
import { RESUMEN_PRESET, foreignOrigin, json, sanitize, textOf } from "../../src/asistente/servidor.js";

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
  if (!env.AI) return json({ error: "sin-ia" }, 503);

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
    const out = await env.AI.run(RESUMEN_PRESET.model, {
      messages: [
        { role: "system", content: RESUMEN_PROMPT },
        { role: "user", content: `CONVERSACIÓN:\n\n${transcript}\n\nPrepará ahora el resumen.` },
      ],
      temperature: 0.2,
      ...RESUMEN_PRESET.params,
      max_completion_tokens: 350,
    });
    const resumen = tidy(textOf(out));
    return resumen ? json({ resumen }) : json({ error: "vacio" }, 502);
  } catch {
    return json({ error: "ia" }, 503);
  }
}
