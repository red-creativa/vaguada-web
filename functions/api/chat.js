/**
 * POST /api/chat — asistente de ÜILKA (Cloudflare Pages Function).
 *
 * Recibe la conversación, le agrega lo que sabe el asistente y devuelve la
 * respuesta de Workers AI como texto que va llegando de a poco.
 *
 * Privacidad: esta función NO guarda nada. No hay base de datos, no se
 * escribe en logs el contenido de los mensajes y no se usa AI Gateway.
 * Workers AI no conserva entradas ni salidas una vez entregada la respuesta.
 *
 * Requiere un binding de Workers AI llamado `AI` en el proyecto de Pages
 * (Settings → Bindings → Add → Workers AI → Variable name: AI).
 */

import { SYSTEM_PROMPT } from "../../src/asistente/conocimiento.js";

// Gemma 4: buen castellano y bajo consumo del cupo gratuito diario.
const MODEL = "@cf/google/gemma-4-26b-a4b-it";
const MAX_MESSAGES = 16; // últimos mensajes que se envían al modelo
const MAX_CHARS = 1500; // largo máximo de cada mensaje
const MAX_OUTPUT_TOKENS = 900;

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

/** Deja pasar solo mensajes de usuario/asistente, recortados. */
function sanitize(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const clean = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .filter((m) => m.content.trim())
    .slice(-MAX_MESSAGES);
  return clean.length && clean.at(-1).role === "user" ? clean : null;
}

/** Texto de la respuesta en cualquiera de los formatos de Workers AI (nunca el razonamiento). */
function textOf(obj) {
  const choice = obj?.choices?.[0];
  const content = choice?.delta?.content ?? choice?.message?.content;
  const fromContent = Array.isArray(content)
    ? content.map((part) => (typeof part === "string" ? part : part?.text ?? "")).join("")
    : content;
  // `||` y no `??`: algunos fragmentos traen `response: ""` junto al texto real.
  return obj?.response || fromContent || choice?.text || "";
}

/**
 * Convierte el stream SSE de Workers AI en texto plano. Acepta los formatos
 * `{ response }` (clásico) y `{ choices[0].delta.content }` (compatible con OpenAI).
 */
function sseToText() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const handle = (line, controller) => {
    if (!line.startsWith("data:")) return;
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    try {
      const text = textOf(JSON.parse(data));
      if (text) controller.enqueue(encoder.encode(text));
    } catch {
      // Fragmento incompleto o línea que no es JSON: se ignora.
    }
  };

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) handle(line, controller);
    },
    flush(controller) {
      if (buffer) handle(buffer, controller);
    },
  });
}

export async function onRequestPost({ request, env }) {
  // Solo desde la propia web (evita que otros sitios usen el cupo).
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ error: "origen" }, 403);
  }

  if (!env.AI) return json({ error: "sin-ia" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "pedido" }, 400);
  }

  const messages = sanitize(body?.messages);
  if (!messages) return json({ error: "pedido" }, 400);

  let upstream;
  try {
    upstream = await env.AI.run(MODEL, {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      max_completion_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.4,
      // Sin "modo razonamiento": si no, el modelo gasta el límite pensando y la respuesta llega vacía.
      chat_template_kwargs: { enable_thinking: false },
      store: false,
    });
  } catch (err) {
    // Cupo diario agotado u otro error del servicio. No se registra el contenido.
    return json({ error: "ia", detalle: String(err?.message ?? err).slice(0, 200) }, 503);
  }

  // Diagnóstico: con el encabezado `x-uilka-diagnostico: 1` se devuelve la
  // respuesta cruda del modelo (útil si cambia el formato). No guarda nada.
  if (request.headers.get("x-uilka-diagnostico") === "1") {
    return new Response(upstream instanceof ReadableStream ? upstream : JSON.stringify(upstream), {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  // Si el modelo no devolvió un stream (respuesta completa), se entrega igual.
  if (!(upstream instanceof ReadableStream)) {
    return new Response(textOf(upstream), {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  return new Response(upstream.pipeThrough(sseToText()), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
