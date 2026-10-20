import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Asistente en modo local: `npm run dev` no tiene la IA de Cloudflare, así
 * que /api/chat responde un texto de prueba (marcado como tal) que llega de
 * a poco, igual que la respuesta real. En producción responde
 * functions/api/chat.js.
 */
const SAMPLE_VUELCO = `¡Genial, podemos ayudarte! La **habilitación de vuelco** es el permiso para descargar tus efluentes a la red, un cauce o el suelo, demostrando que cumplen los límites.

**Plan sugerido**
1. Visitamos la planta y relevamos cada salida de efluente.
2. Tomamos muestras y coordinamos los análisis.
3. Si no cumple, diseñamos e instalamos el tratamiento.
4. Completamos y presentamos la documentación hasta obtener el permiso.

¿A qué se dedica la empresa y en qué localidad está?

(Respuesta de prueba: en modo local no hay IA.)
<resumen>
Necesito: habilitación de vuelco de efluentes.
Plan: relevamiento; muestreo y análisis; tratamiento si hace falta; presentación del trámite.
</resumen>`;

const SAMPLE_RESIDUOS = `¡Genial, podemos ayudarte! Los residuos **biocontaminados** no pueden ir con la basura común y el servicio municipal no los retira: conviene resolverlo rápido.

**Plan sugerido**
1. Limpiamos el predio y retiramos lo acumulado.
2. Separamos y acondicionamos los residuos según su tipo.
3. Coordinamos transporte y tratamiento con empresas habilitadas.
4. Dejamos armado un circuito para que no vuelva a pasar.

¿En qué localidad está el predio?

(Respuesta de prueba: en modo local no hay IA.)
<resumen>
Necesito: retirar residuos biocontaminados acumulados en el predio.
Situación: la municipalidad no los retira.
Plan: limpieza y retiro; separación; transporte y tratamiento habilitados; circuito de retiro.
</resumen>`;

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
