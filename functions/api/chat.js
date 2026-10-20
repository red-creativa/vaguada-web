/**
 * POST /api/chat — asistente de ÜILKA (Cloudflare Pages Function).
 *
 * No guarda ni registra el contenido. Gemini API en el nivel gratuito puede
 * usar prompts y respuestas para mejorar sus productos; no enviar datos
 * sensibles o confidenciales.
 *
 * Requiere el secreto GEMINI_API_KEY en Cloudflare Pages.
 */

import { SYSTEM_PROMPT } from "../../src/asistente/conocimiento.js";
import { foreignOrigin, geminiSseToText, json, sanitize } from "../../src/asistente/servidor.js";

const TEXT = { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" };
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse";

export async function onRequestPost({ request, env }) {
  if (foreignOrigin(request)) return json({ error: "origen" }, 403);
  if (!env.GEMINI_API_KEY) return json({ error: "sin-ia" }, 503);

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
    upstream = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map(({ role, content }) => ({
          role: role === "assistant" ? "model" : "user",
          parts: [{ text: content }],
        })),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1200,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });
  } catch (err) {
    return json({ error: "ia", detalle: String(err?.message ?? err).slice(0, 200) }, 503);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = (await upstream.text()).slice(0, 200);
    return json({ error: "ia", detalle: detail || `Gemini HTTP ${upstream.status}` }, 503);
  }

  return new Response(upstream.body.pipeThrough(geminiSseToText()), { headers: TEXT });
}
