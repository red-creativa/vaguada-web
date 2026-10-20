/**
 * servidor.js — piezas compartidas por las funciones del asistente
 * (functions/api/chat.js y functions/api/mensaje.js). Corre en Cloudflare,
 * no en el navegador.
 *
 * Privacidad: nada de esto guarda ni registra el contenido de los mensajes.
 */

/**
 * Modelos disponibles para conversar. Se usa el de la variable de entorno
 * ASISTENTE_MODELO (Cloudflare → Settings → Variables) o, si no está, el
 * DEFAULT_PRESET. Para comparar sin cambiar la web: encabezado
 * `x-uilka-modelo: <nombre>` (solo acepta estos nombres).
 */
export const PRESETS = {
  // Gemma 4 (26B, ~4B activos): razonamiento habilitado; incluido en el cupo gratuito.
  gemma: {
    model: "@cf/google/gemma-4-26b-a4b-it",
    params: { max_completion_tokens: 1800, chat_template_kwargs: { enable_thinking: true }, store: false },
  },
  // Llama 3.3 70B.
  llama70: {
    model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    params: { max_tokens: 900 },
  },
  // GLM 5.3 Flash (320B, 18B activos): siempre razona; "low" para que sea ágil.
  glm: {
    model: "@cf/zai-org/glm-5.3-flash",
    params: { max_completion_tokens: 3000, reasoning_effort: "low" },
  },
  // DeepSeek V4.1 Flash (552B) sin razonamiento.
  deepseek: {
    model: "@cf/deepseek-ai/deepseek-v4.1-flash-1017",
    params: { max_completion_tokens: 900, reasoning_effort: "none" },
  },
  // DeepSeek V4.1 Flash razonando poco.
  "deepseek-razona": {
    model: "@cf/deepseek-ai/deepseek-v4.1-flash-1017",
    params: { max_completion_tokens: 3000, reasoning_effort: "low" },
  },
};
export const DEFAULT_PRESET = "gemma";

/** El mensaje es una tarea breve: usa Gemma sin razonamiento adicional. */
export const MENSAJE_PRESET = {
  model: PRESETS.gemma.model,
  params: { chat_template_kwargs: { enable_thinking: false }, store: false },
};

export function pickPreset(request, env) {
  const requested = request.headers.get("x-uilka-modelo");
  const name = [requested, env.ASISTENTE_MODELO].find((n) => n && PRESETS[n]) ?? DEFAULT_PRESET;
  return PRESETS[name];
}

const MAX_MESSAGES = 24; // hasta 12 turnos completos de usuario y asistente
const MAX_CHARS = 1500; // largo máximo de cada mensaje

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

/** Valida y recorta mensajes de usuario/asistente, quitando bloques resumen de conversaciones antiguas. */
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

/** Texto de la respuesta en cualquiera de los formatos de Workers AI (nunca el razonamiento). */
export function textOf(obj) {
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
export function sseToText() {
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
