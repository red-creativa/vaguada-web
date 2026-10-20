/**
 * Asistente.jsx — modo "Asistente" de la página: un chat con IA que conoce
 * los servicios de ÜILKA (ver conocimiento.js y functions/api/chat.js).
 *
 * Privacidad: la conversación vive solo en la memoria de esta pestaña.
 * No se usa localStorage, cookies ni estadísticas; al salir del modo
 * Asistente o cerrar la pestaña, se pierde.
 */

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Chat, Send, Shield, Spark } from "../icons";
import { BRAND, CONTACT } from "../contenido";
import { Bubbles, Microscope } from "../decoracion";

const SUGGESTIONS = [
  "Necesito la habilitación de vuelco de efluentes",
  "Me pidieron un estudio de impacto ambiental",
  "Genero residuos peligrosos y no sé qué hacer",
  "Recibí una intimación ambiental",
];

const PRIVACY = "No grabamos ni guardamos tu conversación. Se borra al cerrar esta pestaña.";
const MAX_USER_TURNS = 12;
const MAX_CHARS = 1500;

/* ── Resumen para WhatsApp ────────────────────────────────────────────────
 * Cada respuesta de la IA termina con un bloque <resumen>…</resumen> que la
 * persona no ve: lo usamos para que el mensaje de WhatsApp le llegue al
 * equipo con lo que necesita, su situación y el plan, sin repetir nada.
 */
// Tolera mayúsculas y espacios: "<resumen>", "< Resumen >", "</resumen >"…
const OPEN_RE = /<\s*resumen\s*>/i;
const CLOSE_RE = /<\s*\/\s*resumen\s*>/i;

/** Separa lo que se muestra del resumen oculto (también mientras va llegando el texto). */
function splitAnswer(raw) {
  const tidy = (s) => s.replace(/[\s*_`]+$/, ""); // por si lo envolvió en **negritas**
  const open = raw.match(OPEN_RE);
  if (open) {
    const rest = raw.slice(open.index + open[0].length);
    const close = rest.match(CLOSE_RE);
    return { visible: tidy(raw.slice(0, open.index)), summary: (close ? rest.slice(0, close.index) : rest).trim() };
  }
  // Mientras llega el texto, no mostrar un "<resu" a medio escribir.
  const lt = raw.lastIndexOf("<");
  if (lt >= 0 && raw.length - lt <= 12 && "<resumen>".startsWith(raw.slice(lt).toLowerCase().replace(/\s/g, ""))) {
    return { visible: tidy(raw.slice(0, lt)), summary: "" };
  }
  return { visible: raw, summary: "" };
}

/**
 * La consulta, en primera persona como si la escribiera el cliente (la arma
 * la IA en el bloque <resumen>). Si todavía no hay, la primera pregunta.
 */
function clientMessage(summary, question) {
  const text = summary
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/^"|"$/g, "");
  return (text || question).slice(0, 600);
}

/** Mensaje de WhatsApp: saludo + lo que necesita el cliente (lo mismo que muestra la tarjeta). */
function whatsappUrl(summary, question) {
  const text = `Hola ÜILKA, les escribo desde el asistente de la web.\n\n${clientMessage(summary, question)}`;
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

/* ── Switch Sitio / Asistente ─────────────────────────────────────────── */

export function AssistantToggle({ active, onChange }) {
  const options = [
    { key: false, label: "Sitio" },
    { key: true, label: "Asistente", icon: Spark },
  ];
  return (
    <div
      role="group"
      aria-label="Modo de la página"
      className="fixed z-50 top-3 right-3 sm:top-5 sm:right-6 flex p-1 bg-[#f4f9fb]/85 backdrop-blur-md ring-1 ring-[#1b4a5a24] shadow-md"
    >
      {options.map(({ key, label, icon: Icon }) => {
        const on = key === active;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(key)}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 font-syne text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              on ? "bg-[var(--e-box)] text-white" : "text-[var(--e-dim)] hover:text-[var(--e-text)]"
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${on ? "text-[var(--e-accent-soft)]" : "text-[var(--e-accent)]"}`} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Texto con formato simple (párrafos, listas y **negritas**) ───────── */

function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-semibold text-[var(--e-text)]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

const LIST_ITEM = /^\s*(?:[-*•]|\d+[.)])\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

function Markdown({ text }) {
  const blocks = [];
  let paragraph = [];
  let list = [];
  let ordered = false;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", lines: paragraph });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: ordered ? "ol" : "ul", lines: list });
    list = [];
  };

  for (const raw of text.split("\n")) {
    const line = raw.replace(/^#{1,6}\s+/, "");
    if (!line.trim()) {
      flushParagraph();
      flushList();
    } else if (LIST_ITEM.test(line)) {
      flushParagraph();
      if (!list.length) ordered = NUMBERED.test(line);
      list.push(line.replace(LIST_ITEM, ""));
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((b, i) =>
        b.type === "ol" ? (
          // El plan: pasos numerados con la cinta del logo a la izquierda.
          <ol key={i} className="flex flex-col gap-2 pl-3 border-l-2 [border-image:var(--e-ribbon)_1]">
            {b.lines.map((l, k) => (
              <li key={k} className="flex gap-2.5">
                <span className="w-5 shrink-0 font-mono-code text-xs leading-[1.75rem] text-[var(--e-accent)]">{k + 1}</span>
                <span>
                  <Inline text={l} />
                </span>
              </li>
            ))}
          </ol>
        ) : b.type === "ul" ? (
          <ul key={i} className="flex flex-col gap-1.5">
            {b.lines.map((l, k) => (
              <li key={k} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.6em] w-2.5 h-[3px] shrink-0 ribbon-gradient" />
                <span>
                  <Inline text={l} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline text={b.lines.join(" ")} />
          </p>
        ),
      )}
    </div>
  );
}

/* ── Piezas del chat ──────────────────────────────────────────────────── */

function Typing() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1" aria-label="Escribiendo">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="w-2 h-2 rounded-full bg-[var(--e-blue)] opacity-70 animate-bounce"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}

function WhatsAppLink({ summary, question, children = "Seguir por WhatsApp" }) {
  return (
    <a
      href={whatsappUrl(summary, question)}
      title="Se abre WhatsApp con un resumen de tu consulta; podés editarlo antes de enviar"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--e-box)] text-white font-syne text-xs uppercase tracking-wider hover:brightness-125 transition"
    >
      <Chat className="w-4 h-4 text-[var(--e-accent-soft)]" />
      {children}
      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/**
 * Tarjeta "Consulta para el operador": se completa con cada respuesta y
 * muestra exactamente lo que se envía por WhatsApp.
 */
function OperatorCard({ summary, question, onReset }) {
  return (
    <div className="sm:ml-11 flex flex-col gap-3 px-4 py-4 bg-white/70 ring-1 ring-[#1b4a5a24]">
      <span className="flex items-center gap-2 font-mono-code text-[11px] uppercase text-[var(--e-dim)]">
        <span className="w-4 h-[3px] ribbon-gradient" />
        Consulta para el operador
      </span>
      <p className="pl-3 border-l-2 border-[#1b4a5a24] text-sm leading-relaxed text-[var(--e-text)]">
        “{clientMessage(summary, question)}”
      </p>
      <p className="text-xs text-[var(--e-dim)]">
        Se completa con lo que nos vas contando. Al tocar el botón se abre WhatsApp con este texto y podés editarlo antes de enviar.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <WhatsAppLink summary={summary} question={question}>
          Enviar por WhatsApp
        </WhatsAppLink>
        <button
          type="button"
          onClick={onReset}
          className="px-2 py-2 font-mono-code text-xs uppercase text-[var(--e-dim)] hover:text-[var(--e-accent)] transition-colors cursor-pointer"
        >
          Nueva consulta
        </button>
      </div>
    </div>
  );
}

function AssistantMessage({ message, loading, summary, firstQuestion }) {
  const { visible } = splitAnswer(message.content);
  return (
    <div className="self-start w-full max-w-[94%] flex gap-3">
      <span className="mt-1 grid place-items-center w-8 h-8 shrink-0 bg-white ring-1 ring-[#1b4a5a24]">
        <Spark className="w-4 h-4 text-[var(--e-accent)]" />
      </span>
      <div className="min-w-0 flex-1 bg-white/95 px-4 py-3 text-[15px] leading-relaxed text-[var(--e-body)]">
        {message.error ? (
          <div className="flex flex-col gap-3">
            <p>
              Ahora no puedo responderte. Escribinos por WhatsApp y te respondemos nosotros.
            </p>
            <div>
              <WhatsAppLink summary={summary} question={firstQuestion} />
            </div>
          </div>
        ) : visible ? (
          <Markdown text={visible} />
        ) : (
          loading && <Typing />
        )}
      </div>
    </div>
  );
}

function Intro({ onPick }) {
  return (
    <div className="my-auto flex flex-col items-start gap-6 py-6">
      <span className="w-16 h-[3px] ribbon-gradient" />
      <div className="flex flex-col gap-3">
        <h1 className="font-syne text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.02] text-[var(--e-text)]">
          Contanos qué necesitás
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-[var(--e-body)] max-w-[46ch]">
          Describí tu situación con tus palabras: te explicamos de qué se trata y cómo podemos resolverlo.
        </p>
      </div>
      <p className="flex items-start gap-2.5 px-4 py-3 bg-white/70 ring-1 ring-[#1b4a5a1f] text-sm text-[var(--e-body)]">
        <Shield className="w-5 h-5 shrink-0 text-[var(--e-accent)]" />
        {PRIVACY}
      </p>
      <div className="w-full grid sm:grid-cols-2 gap-2.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="text-left px-4 py-3 bg-white/80 ring-1 ring-[#1b4a5a24] text-[15px] text-[var(--e-text)] hover:ring-[var(--e-accent)] hover:bg-white transition cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Vista principal ──────────────────────────────────────────────────── */

export function AssistantView() {
  const [messages, setMessages] = useState([]); // { role, content, error? }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const limitReached = userTurns >= MAX_USER_TURNS;
  const firstQuestion = messages.find((m) => m.role === "user")?.content ?? "";
  const last = messages.at(-1);
  // Último resumen que armó la IA (el más completo): va en el mensaje de WhatsApp.
  const summary =
    messages
      .filter((m) => m.role === "assistant" && m.content)
      .map((m) => splitAnswer(m.content).summary)
      .filter(Boolean)
      .at(-1) ?? "";

  // Al salir del modo Asistente se corta cualquier respuesta en curso.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Siempre mostrar lo último.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // En compu, el cursor arranca en la caja de texto (en celular no, para no abrir el teclado).
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  }, []);

  const autosize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const send = async (text) => {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || loading || limitReached) return;

    const history = [
      ...messages.filter((m) => !m.error && m.content).map(({ role, content: c }) => ({ role, content: c })),
      { role: "user", content },
    ];
    setMessages([...messages, { role: "user", content }, { role: "assistant", content: "" }]);
    setInput("");
    requestAnimationFrame(autosize);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const setLast = (patch) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: "", ...patch };
        return next;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setLast({ content: answer });
      }
      if (!answer.trim()) throw new Error("vacío");
    } catch {
      if (!controller.signal.aborted) setLast({ error: true });
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setLoading(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const showFollowUp = !loading && last?.role === "assistant" && last.content && !last.error;

  return (
    <div className="relative isolate h-[100dvh] flex flex-col slide-bg-light overflow-hidden selection:bg-[#bfe9f5] selection:text-[#0f2a33]">
      <Microscope className="-z-10" />
      <Bubbles className="-z-10" />

      <header className="shrink-0 h-16 px-4 sm:px-6 flex items-center gap-3">
        <span className="font-syne text-lg uppercase text-[var(--e-text)]">{BRAND.name}</span>
        <span className="w-2 h-2 ribbon-gradient -ml-1.5" />
        <span className="font-mono-code text-[11px] uppercase text-[var(--e-dim)]">Asistente</span>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div
          className="max-w-2xl mx-auto px-4 sm:px-6 pb-6 min-h-full flex flex-col gap-5"
          aria-live="polite"
          aria-busy={loading}
        >
          {messages.length === 0 ? (
            <Intro onPick={send} />
          ) : (
            <>
              <div className="pt-2" />
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={i}
                    className="self-end max-w-[85%] bg-stone-950 text-white px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words"
                  >
                    {m.content}
                  </div>
                ) : (
                  <AssistantMessage
                    key={i}
                    message={m}
                    loading={loading && i === messages.length - 1}
                    summary={summary}
                    firstQuestion={firstQuestion}
                  />
                ),
              )}
              {showFollowUp && <OperatorCard summary={summary} question={firstQuestion} onReset={reset} />}
            </>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="shrink-0 bg-[#f4f9fb]/85 backdrop-blur-md border-t border-[#1b4a5a1a]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {limitReached ? (
            <div className="flex flex-wrap items-center gap-3 py-1 text-sm text-[var(--e-body)]">
              <span>Llegaste al límite de esta conversación. Para seguir, escribinos.</span>
              <WhatsAppLink summary={summary} question={firstQuestion} />
            </div>
          ) : (
            <div className="flex items-end gap-2 p-1.5 bg-white ring-1 ring-[#1b4a5a33] focus-within:ring-2 focus-within:ring-[var(--e-accent)] transition">
              <label htmlFor="asistente-consulta" className="sr-only">
                Tu consulta
              </label>
              <textarea
                id="asistente-consulta"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_CHARS}
                autoComplete="off"
                placeholder="Escribí tu consulta…"
                onChange={(e) => {
                  setInput(e.target.value);
                  autosize();
                }}
                onKeyDown={onKeyDown}
                className="flex-1 resize-none bg-transparent px-2.5 py-2.5 text-base leading-snug text-[var(--e-text)] placeholder:text-[var(--e-faint)] outline-none max-h-40"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Enviar"
                className="grid place-items-center w-11 h-11 shrink-0 bg-[var(--e-box)] text-white disabled:opacity-35 transition-opacity cursor-pointer disabled:cursor-default"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] leading-snug text-[var(--e-dim)]">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>{PRIVACY} Respuestas orientativas generadas con IA.</span>
          </p>
        </div>
      </form>
    </div>
  );
}
