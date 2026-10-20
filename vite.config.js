import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Asistente en modo local: `npm run dev` no tiene la IA de Cloudflare, así
 * que /api/chat responde un texto de prueba (marcado como tal) que llega de
 * a poco, igual que la respuesta real. En producción responde
 * functions/api/chat.js.
 */
const SAMPLE_VUELCO = `Sí, ÜILKA puede ayudar con la habilitación de vuelco. El equipo identifica qué requisitos aplican a la actividad y a la ubicación, y desde ahí encauza el trámite y las soluciones técnicas que hagan falta.

¿A qué se dedica la empresa y en qué localidad está?

(Respuesta de prueba: en modo local no hay IA.)`;

const SAMPLE_RESIDUOS = `ÜILKA puede ayudar a ordenar la gestión de estos residuos y definir una solución acorde al tipo y la cantidad que generan.

¿Qué tipo de residuos son y en qué localidad está el predio?

(Respuesta de prueba: en modo local no hay IA.)`;

const SAMPLE_GENERAL = `Esta es una respuesta de prueba fija: en tu compu no hay IA, así que el simulador solo tiene ejemplos para consultas sobre vuelco de efluentes y residuos.

Publicado en Cloudflare, el asistente lee tu consulta y responde sobre ese caso concreto.`;

function assistantDevMock() {
  return {
    name: "asistente-simulado",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/chat", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end();
        }
        let raw = "";
        req.on("data", (c) => (raw += c));
        req.on("end", () => {
          let last = "";
          try {
            last = JSON.parse(raw).messages.at(-1).content.toLowerCase();
          } catch {
            res.statusCode = 400;
            return res.end();
          }
          const text = /vuelco|efluente/.test(last)
            ? SAMPLE_VUELCO
            : /residuo|basural|patog|contaminad/.test(last)
              ? SAMPLE_RESIDUOS
              : SAMPLE_GENERAL;
          res.setHeader("content-type", "text/plain; charset=utf-8");
          const words = text.split(/(?<=\s)/);
          let i = 0;
          const tick = setInterval(() => {
            if (i >= words.length) {
              clearInterval(tick);
              return res.end();
            }
            res.write(words.slice(i, i + 3).join(""));
            i += 3;
          }, 45);
          // Si la persona sale del chat a mitad de respuesta, se corta.
          res.on("close", () => clearInterval(tick));
        });
      });

      // Resumen simulado para compartir con el equipo en modo local.
      server.middlewares.use("/api/resumen", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end();
        }
        let raw = "";
        req.on("data", (c) => (raw += c));
        req.on("end", () => {
          let resumen = "Consulta general.";
          try {
            const consultas = JSON.parse(raw).messages.filter((m) => m.role === "user").map((m) => m.content.trim());
            if (consultas.length) resumen = `Resumen de prueba: ${consultas.join(" ")}`.slice(0, 400);
          } catch {
            // se deja el resumen genérico
          }
          setTimeout(() => {
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ resumen }));
          }, 600);
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), assistantDevMock()],
});
