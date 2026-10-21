/**
 * Asistente.jsx — modo "Asistente" de la página: un chat con IA que conoce
 * los servicios de ÜILKA (ver conocimiento.js y functions/api/chat.js).
 *
 * Privacidad: la conversación vive solo en la memoria de esta pestaña.
 * No se usa localStorage, cookies ni estadísticas; al salir del modo
 * Asistente o cerrar la pestaña, se pierde.
 */

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Chat, Check, Close, Copy, Mail, Phone, Send, Shield, Spark } from "../icons";
import { BRAND, CONTACT } from "../contenido";
import { Bubbles, Microscope } from "../decoracion";

const PRIVACY = "La conversación no se guarda en el sitio, pero se envía a Gemini para responder. En el nivel gratuito Google puede usarla para mejorar sus productos y revisarla; no compartas datos sensibles.";
const MAX_USER_TURNS = 12;
const MAX_CHARS = 1500;

const whatsappUrl = (text) => `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`;
const emailSubject = encodeURIComponent("Consulta para ÜILKA");
const gmailUrl = (text) =>
  `https://mail.google.com/mail/u/0/?view=cm&to=${encodeURIComponent(CONTACT.email)}&su=${emailSubject}&body=${encodeURIComponent(text)}`;
const outlookUrl = (text) =>
  `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(CONTACT.email)}&subject=${emailSubject}&body=${encodeURIComponent(text)}`;
const emailBody = (summary, name) =>
  `Estimados/as:\n\n${name ? `Mi nombre es ${name}.\n\n` : ""}Me comunico para consultar sobre lo siguiente:\n\n${summary}\n\nSaludos cordiales,${name ? `\n${name}` : ""}`;

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

  // La pregunta del final (el último párrafo que termina en "?") se destaca:
  // es la que invita a seguir contando y sacarle más provecho al asistente.
  const questionIndex = blocks.findLastIndex((b) => b.type === "p" && /\?\s*$/.test(b.lines.join(" ")));

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((b, i) =>
        b.type === "ol" ? (
          // Numeración nativa para listas puntuales que ayuden a explicar algo.
          <ol
            key={i}
            className="flex flex-col gap-2 pl-6 list-decimal marker:font-semibold marker:text-[var(--e-accent)] marker:text-[13px]"
          >
            {b.lines.map((l, k) => (
              <li key={k} className="pl-1">
                <Inline text={l} />
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
          <p
            key={i}
            className={i === questionIndex ? "mt-1 text-base sm:text-[17px] leading-snug font-medium text-[var(--e-text)]" : undefined}
          >
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

function ThinkingStatus({ waitingLong }) {
  return (
    <div className="flex flex-col items-start gap-2" role="status" aria-live="polite">
      <span className="inline-flex items-center gap-1.5" aria-hidden="true">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="w-2 h-2 rounded-full bg-[var(--e-blue)] opacity-70 animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </span>
      <p className="text-sm text-[var(--e-dim)]">
        {waitingLong
          ? "Esta respuesta está tardando un poco más de lo habitual. Sigo trabajando en ella; no hace falta que envíes otra consulta."
          : "Estoy revisando lo que me contaste para darte una orientación útil."}
      </p>
    </div>
  );
}

function SummaryLoading() {
  return (
    <div
      className="mt-3 p-4 bg-[#f4f9fb] ring-1 ring-[#1b4a5a1a]"
      role="status"
      aria-live="polite"
      aria-label="Preparando el resumen de tu consulta"
    >
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-9 h-9 shrink-0 bg-white ring-1 ring-[#1b4a5a1a]">
          <Spark className="w-4 h-4 text-[var(--e-accent)] animate-pulse" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--e-text)]">Estamos ordenando lo que nos contaste</p>
          <p className="mt-0.5 text-xs text-[var(--e-dim)]">Enseguida vas a poder revisar el resumen antes de compartirlo.</p>
        </div>
        <span
          aria-hidden="true"
          className="w-5 h-5 shrink-0 rounded-full border-2 border-[#1b4a5a24] border-t-[var(--e-accent)] animate-spin motion-reduce:animate-none"
        />
      </div>
      <div aria-hidden="true" className="mt-4 flex flex-col gap-2 animate-pulse">
        <span className="h-2.5 w-full bg-[#1b4a5a12]" />
        <span className="h-2.5 w-5/6 bg-[#1b4a5a12]" />
        <span className="h-2.5 w-2/3 bg-[#1b4a5a12]" />
      </div>
    </div>
  );
}

/** Copia al portapapeles; si el navegador no deja, usa el método clásico. */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/**
 * El resumen se prepara a pedido y se muestra antes de elegir cómo contactar.
 */
function ContactSummary({ summary, onGenerate }) {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const generating = summary === "loading";
  const ready = typeof summary === "string" && !generating;
  const contactName = name.trim().replace(/\s+/g, " ").slice(0, 100);
  const sharedText = ready ? `${summary}${contactName ? `\n\nNombre: ${contactName}` : ""}` : "";
  const emailText = ready ? emailBody(summary, contactName) : "";

  const onCopy = async () => {
    if (await copyText(summary)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const action =
    "inline-flex items-center gap-1.5 py-1 font-mono-code text-[11px] uppercase text-[var(--e-accent)] hover:text-[var(--e-text)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default";

  return (
    <div className="mt-4 pt-3 border-t border-[#1b4a5a1a]">
      <p className="mb-2 text-[13px] font-semibold text-[var(--e-body)]">¿Querés avanzar con el equipo?</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <a href={CONTACT.phoneHref} className={action} aria-label="Llamar al equipo de ÜILKA">
          <Phone className="w-4 h-4" />
          Llamar al equipo
        </a>
        {!ready && (
          <button type="button" onClick={onGenerate} disabled={generating} className={action}>
            {generating ? <Typing /> : <Chat className="w-4 h-4" />}
            {generating ? "Preparando resumen…" : summary === null ? "Reintentar resumen" : "Preparar resumen para enviar"}
          </button>
        )}
      </div>
      {ready ? (
        <>
          <div className="mt-3 p-3 bg-[#f4f9fb] ring-1 ring-[#1b4a5a1a]">
            <p className="mb-1 font-mono-code text-[10px] uppercase tracking-wider text-[var(--e-dim)]">Resumen de tu consulta</p>
            <p className="text-[14px] leading-relaxed text-[var(--e-body)]">{summary}</p>
          </div>
          <label htmlFor="asistente-nombre-contacto" className="mt-3 block text-[12px] text-[var(--e-dim)]">
            Nombre y apellido (opcional)
          </label>
          <input
            id="asistente-nombre-contacto"
            type="text"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre y apellido"
            className="mt-1 w-full bg-white px-3 py-2 text-sm text-[var(--e-text)] ring-1 ring-[#1b4a5a24] outline-none focus:ring-2 focus:ring-[var(--e-accent)]"
          />
          <p className="mt-1 text-[11px] text-[var(--e-dim)]">Si lo agregás, se incluirá aparte del resumen.</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={whatsappUrl(sharedText)}
              target="_blank"
              rel="noopener noreferrer"
              title="Se abre WhatsApp con el resumen visible arriba"
              className={action}
            >
              <Chat className="w-4 h-4" />
              Enviar resumen por WhatsApp
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href={gmailUrl(emailText)} target="_blank" rel="noopener noreferrer" className={action} title={`Abrir Gmail con un correo dirigido a ${CONTACT.email}`}>
              <Mail className="w-4 h-4" />
              Abrir Gmail
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href={outlookUrl(emailText)} target="_blank" rel="noopener noreferrer" className={action} title={`Abrir Outlook en el navegador con un correo dirigido a ${CONTACT.email}`}>
              <Mail className="w-4 h-4" />
              Abrir Outlook
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <button type="button" onClick={onCopy} className={action} aria-live="polite">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado" : "Copiar resumen"}
            </button>
          </div>
        </>
      ) : (
        <>
          {generating && <SummaryLoading />}
          {summary === null && (
            <p role="alert" className="mt-2 text-[13px] text-[var(--e-body)]">
              No pudimos preparar el resumen. Probá de nuevo o llamá al equipo.
            </p>
          )}
        </>
      )}
      {generating && (
        <span className="sr-only" role="status">
          Preparando el resumen de tu consulta
        </span>
      )}
    </div>
  );
}

function AssistantMessage({ message, loading, isLast, onGenerateSummary, onRetry }) {
  const [waitingLong, setWaitingLong] = useState(false);

  useEffect(() => {
    if (!loading || message.content) {
      setWaitingLong(false);
      return undefined;
    }
    const timeout = window.setTimeout(() => setWaitingLong(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [loading, message.content]);

  return (
    <div className="self-start w-full max-w-[94%] flex gap-3">
      <span className="mt-1 grid place-items-center w-8 h-8 shrink-0 bg-white ring-1 ring-[#1b4a5a24]">
        <Spark className="w-4 h-4 text-[var(--e-accent)]" />
      </span>
      <div className="min-w-0 flex-1 bg-white/95 px-4 py-3 text-[15px] leading-relaxed text-[var(--e-body)]">
        {message.error ? (
          <div className="flex flex-col items-start gap-2">
            <p>Hubo un problema temporal al responder. Podés reintentar la consulta.</p>
            <button
              type="button"
              onClick={onRetry}
              disabled={loading}
              className="inline-flex items-center gap-1.5 py-1 font-mono-code text-[11px] uppercase text-[var(--e-accent)] hover:text-[var(--e-text)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
            >
              <Chat className="w-4 h-4" />
              Reintentar respuesta
            </button>
          </div>
        ) : message.content ? (
          <Markdown text={message.content} />
        ) : (
          loading && <ThinkingStatus waitingLong={waitingLong} />
        )}
        {isLast && !loading && <ContactSummary summary={message.summary} onGenerate={onGenerateSummary} />}
      </div>
    </div>
  );
}

function Intro() {
  return (
    <div className="my-auto flex flex-col items-start gap-6 py-6">
      <span className="w-16 h-[3px] ribbon-gradient" />
      <div className="flex flex-col gap-3">
        <h1 className="font-syne text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.02] text-[var(--e-text)]">
          Contanos qué necesitás
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-[var(--e-body)] max-w-[46ch]">
          Si tenés una empresa y necesitás resolver un tema ambiental, desarrollar una solución de ingeniería o regularizar tu situación normativa, contanos. Si además tenés un proyecto sustentable, queremos conocerlo. También podés consultarnos por cualquier otro tema ambiental.
        </p>
      </div>
      <p className="flex items-start gap-2.5 px-4 py-3 bg-white/70 ring-1 ring-[#1b4a5a1f] text-sm text-[var(--e-body)]">
        <Shield className="w-5 h-5 shrink-0 text-[var(--e-accent)]" />
        {PRIVACY}
      </p>
    </div>
  );
}

/* ── Vista principal ──────────────────────────────────────────────────── */

export function AssistantView({ active = true }) {
  const [messages, setMessages] = useState([]); // { role, content, error? }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const limitReached = userTurns >= MAX_USER_TURNS;

  // Si se cierra la página a mitad de una respuesta, se corta.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Hay una consulta en curso: antes de recargar o cerrar la pestaña, el
  // navegador pregunta si de verdad querés salir (la conversación no se guarda).
  useEffect(() => {
    if (!messages.length) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "Si salís, se borra tu consulta.";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [messages.length > 0]);

  // Siempre mostrar lo último.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // En compu, el cursor arranca en la caja de texto (en celular no, para no abrir el teclado).
  // También al volver desde "Sitio", con la conversación donde había quedado.
  useEffect(() => {
    if (!active) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [active]);

  const autosize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  // Actualiza una respuesta puntual (por id), aunque mientras tanto haya cambiado la lista.
  const patchMessage = (id, patch) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const requestSummary = async (id) => {
    patchMessage(id, { summary: "loading" });
    try {
      const res = await fetch("/api/resumen", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: messages
            .filter((m) => !m.error && m.content)
            .map(({ role, content }) => ({ role, content })),
        }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof data?.resumen !== "string" || !data.resumen.trim()) throw new Error("Respuesta vacía");
      patchMessage(id, { summary: data.resumen.trim() });
    } catch {
      patchMessage(id, { summary: null });
    }
  };

  const send = async (text, retry = null) => {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || loading || (limitReached && !retry)) return;

    const previousMessages = retry ? messages.slice(0, retry.userIndex) : messages;
    const history = [
      ...previousMessages.filter((m) => !m.error && m.content).map(({ role, content }) => ({ role, content })),
      { role: "user", content },
    ];
    const id = retry?.assistantId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (retry) {
      patchMessage(id, { content: "", error: false, summary: undefined });
    } else {
      setMessages([...messages, { role: "user", content }, { role: "assistant", content: "", id }]);
      setInput("");
      requestAnimationFrame(autosize);
    }
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let answer = "";

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
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        patchMessage(id, { content: answer });
      }
      if (!answer.trim()) throw new Error("vacío");
    } catch {
      answer = "";
      if (!controller.signal.aborted) patchMessage(id, { error: true });
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }

  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  // La cruz borra la última pregunta y su respuesta, incluido el resumen generado.
  const deleteLast = (index) => {
    abortRef.current?.abort();
    setLoading(false);
    setMessages(messages.slice(0, index));
  };
  const lastUserIndex = messages.findLastIndex((m) => m.role === "user");

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };


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
            <Intro />
          ) : (
            <>
              <div className="pt-2" />
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="self-end max-w-[85%] flex items-start gap-1.5">
                    {i === lastUserIndex && (
                      <button
                        type="button"
                        onClick={() => deleteLast(i)}
                        aria-label="Borrar esta pregunta y su respuesta"
                        title="Borrar esta pregunta y su respuesta"
                        className="mt-2 grid place-items-center w-7 h-7 shrink-0 text-[var(--e-dim)] ring-1 ring-[#1b4a5a24] bg-white/60 hover:text-[var(--e-text)] hover:bg-white transition-colors cursor-pointer"
                      >
                        <Close className="w-4 h-4" />
                      </button>
                    )}
                    <div className="min-w-0 bg-stone-950 text-white px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <AssistantMessage
                    key={i}
                    message={m}
                    loading={loading && i === messages.length - 1}
                    isLast={i === messages.length - 1}
                    onGenerateSummary={() => requestSummary(m.id)}
                    onRetry={() => {
                      const previous = messages[i - 1];
                      if (previous?.role === "user") send(previous.content, { assistantId: m.id, userIndex: i - 1 });
                    }}
                  />
                ),
              )}
            </>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="shrink-0 bg-[#f4f9fb]/85 backdrop-blur-md border-t border-[#1b4a5a1a]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {limitReached ? (
            <p className="py-2 text-sm text-[var(--e-body)]">
              Llegaste al límite de esta conversación. Podés llamar al equipo o preparar el resumen para enviarlo.
            </p>
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
