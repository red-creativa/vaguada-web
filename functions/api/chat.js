/**
 * POST /api/chat — asistente de ÜILKA (Cloudflare Pages Function).
 *
 * Recibe la conversación, le agrega lo que sabe el asistente y devuelve la
 * respuesta de Workers AI como texto que va llegando de a poco. El mensaje
 * el resumen de contacto se arma aparte en /api/resumen.
 *
 * Privacidad: esta función NO guarda nada. No hay base de datos, no se
 * escribe en logs el contenido de los mensajes y no se usa AI Gateway.
 * Workers AI no conserva entradas ni salidas una vez entregada la respuesta.
 *
 * Requiere un binding de Workers AI llamado `AI` en el proyecto de Pages
 * (Settings → Bindings → Add → Workers AI → Variable name: AI).
 */

import { SYSTEM_PROMPT } from "../../src/asistente/conocimiento.js";
import { foreignOrigin, json, pickPreset, sanitize, sseToText, textOf } from "../../src/asistente/servidor.js";

const TEXT = { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" };

export async function onRequestPost({ request, env }) {
  if (foreignOrigin(request)) return json({ error: "origen" }, 403);
  if (!env.AI) return json({ error: "sin-ia" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "pedido" }, 400);
  }

  const messages = sanitize(body?.messages);
  if (!messages) return json({ error: "pedido" }, 400);

  const preset = pickPreset(request, env);

  let upstream;
  try {
    upstream = await env.AI.run(preset.model, {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      temperature: 0.4,
      ...preset.params,
    });
  } catch (err) {
    // Cupo diario agotado u otro error del servicio. No se registra el contenido.
    return json({ error: "ia", detalle: String(err?.message ?? err).slice(0, 200) }, 503);
  }

  // Diagnóstico: con el encabezado `x-uilka-diagnostico: 1` se devuelve la
  // respuesta cruda del modelo (útil si cambia el formato). No guarda nada.
  if (request.headers.get("x-uilka-diagnostico") === "1") {
    return new Response(upstream instanceof ReadableStream ? upstream : JSON.stringify(upstream), { headers: TEXT });
  }

  // Si el modelo no devolvió un stream (respuesta completa), se entrega igual.
  if (!(upstream instanceof ReadableStream)) return new Response(textOf(upstream), { headers: TEXT });

  return new Response(upstream.pipeThrough(sseToText()), { headers: TEXT });
}
