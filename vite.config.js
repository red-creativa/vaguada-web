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

const SAMPLE_RESIDUOS = `¡Genial, podemos ayudarte! Los residuos **biocontaminados** (patogénicos) no pueden ir con la basura común y el servicio municipal habitual no los retira. Si se acumulan, se forman focos de contaminación y de riesgo sanitario, así que conviene resolverlo rápido.

Nosotros nos encargamos de todo:
- Limpiamos el predio y retiramos lo acumulado con personal y equipos adecuados
- Separamos y acondicionamos los residuos según su tipo
- Coordinamos el retiro, transporte y tratamiento con empresas habilitadas
- Te entregamos los certificados de disposición final
- Dejamos armado un circuito para que no vuelva a pasar

¿A qué se dedica tu empresa o institución y en qué localidad está? Si querés, seguimos por WhatsApp y coordinamos una visita.

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
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), assistantDevMock()],
});
