/**
 * servidor.js — utilidades compartidas por las funciones del asistente.
 * Corre en Cloudflare, no en el navegador.
 */

const MAX_MESSAGES = 24; // hasta 12 turnos completos de usuario y asistente
const MAX_CHARS = 1500; // largo máximo de cada mensaje
export const GEMINI_MODEL = "gemini-3.8-flash";

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

/** Solo desde la propia web (evita que otros sitios usen el cupo). */
export function foreignOrigin(request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && new URL(origin).host !== new URL(request.url).host);
}

/** Valida y recorta mensajes, quitando bloques resumen de conversaciones antiguas. */
export function sanitize(messages, { userLast = true } = {}) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const clean = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.replace(/<\s*resumen\s*>[\s\S]*$/i, "").slice(0, MAX_CHARS) }))
    .filter((m) => m.content.trim())
    .slice(-MAX_MESSAGES);
  if (!clean.length) return null;
  return !userLast || clean.at(-1).role === "user" ? clean : null;
}

/** Texto visible de una respuesta de Gemini, omitiendo las partes de razonamiento. */
export function geminiTextOf(response) {
  return (response?.candidates?.[0]?.content?.parts ?? [])
    .filter((part) => !part.thought && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

/** Convierte el stream SSE de Gemini en texto plano sin exponer sus bloques de pensamiento. */
export function geminiSseToText() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const handle = (line, controller) => {
    if (!line.startsWith("data:")) return;
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    try {
      const text = geminiTextOf(JSON.parse(data));
      if (text) controller.enqueue(encoder.encode(text));
    } catch {
      // Ignora eventos SSE que no contengan JSON válido.
    }
  };

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) handle(line.replace(/\r$/, ""), controller);
    },
    flush(controller) {
      if (buffer) handle(buffer.replace(/\r$/, ""), controller);
    },
  });
}
