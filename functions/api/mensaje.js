/**
 * POST /api/mensaje — arma el "Mensaje para el operador" a partir de la conversación.
 *
 * Es una tarea aparte de la conversación (así el modelo que conversa no
 * tiene que acordarse de un formato) y la hace el modelo más barato.
 * Devuelve { mensaje }. No guarda nada.
 */

import { MENSAJE_PROMPT } from "../../src/asistente/conocimiento.js";
import { MENSAJE_PRESET, foreignOrigin, json, sanitize, textOf } from "../../src/asistente/servidor.js";

/** Limpia lo que a veces agregan los modelos: comillas, saludo, prefijos. */
function tidy(text) {
  return text
    .trim()
    .replace(/^(mensaje( para el operador)?\s*:\s*)/i, "")
    .replace(/^["“'«]+|["”'»]+$/g, "")
    .replace(/^hola[^.!?\n]{0,20}[.!,]?\s*/i, "")
    .trim()
    .slice(0, 300);
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

  // La conversación va como texto (y no como chat) para que el modelo no la "continúe".
  const transcript = messages.map((m) => `${m.role === "user" ? "PERSONA" : "ASISTENTE"}: ${m.content}`).join("\n\n");

  try {
    const out = await env.AI.run(MENSAJE_PRESET.model, {
      messages: [
        { role: "system", content: MENSAJE_PROMPT },
        { role: "user", content: `CONVERSACIÓN:\n\n${transcript}\n\nEscribí ahora el mensaje.` },
      ],
      temperature: 0.2,
      ...MENSAJE_PRESET.params,
      max_completion_tokens: 200,
    });
    const mensaje = tidy(textOf(out));
    return mensaje ? json({ mensaje }) : json({ error: "vacio" }, 502);
  } catch {
    return json({ error: "ia" }, 503);
  }
}
