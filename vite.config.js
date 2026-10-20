import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Asistente en modo local: `npm run dev` no tiene la IA de Cloudflare, así
 * que /api/chat responde un texto de prueba (marcado como tal) que llega de
 * a poco, igual que la respuesta real. En producción responde
 * functions/api/chat.js.
 */
const SAMPLE_VUELCO = `¡Genial, podemos ayudarte! La **habilitación de vuelco** es el permiso para descargar tus efluentes líquidos a la red, a un cauce o al suelo. Para obtenerla hay que demostrar que el efluente cumple los límites para ese destino.

Nosotros nos encargamos de todo:
- Visitamos tus instalaciones y relevamos de dónde sale cada efluente
- Tomamos muestras y coordinamos los análisis
- Si hace falta, diseñamos e instalamos el tratamiento
- Completamos la documentación y la presentamos ante el organismo que corresponde

¿A qué se dedica tu empresa y en qué localidad está? Si querés, seguimos por WhatsApp y coordinamos una visita.

(Respuesta de prueba: en modo local no hay IA.)`;

const SAMPLE_GENERAL = `¡Gracias por escribirnos! Contame un poco más: ¿a qué se dedica tu empresa, dónde está y qué te pidieron o qué problema tenés? Con eso te explico de qué se trata y cómo podemos resolverlo.

(Respuesta de prueba: en modo local no hay IA.)`;

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
          const text = /vuelco|efluente/.test(last) ? SAMPLE_VUELCO : SAMPLE_GENERAL;
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
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), assistantDevMock()],
});
