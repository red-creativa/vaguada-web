/**
 * UilkaLanding.jsx — landing de ÜILKA.
 *
 * Escritorio: diapositivas a pantalla completa con scroll-snap.
 * Móvil: diapositivas apiladas que cambian con un fundido al deslizar.
 *
 * Requisitos:
 *   - React 18+
 *   - Tailwind CSS v4
 *   - uilka.css (slides, scroll-snap, fuentes y tema)
 *
 * Imágenes: WebP generadas con `npm run imagenes` a partir de
 * /imagenes-originales (ver scripts/optimizar-imagenes.mjs).
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Agro,
  ArrowRight,
  ArrowUpRight,
  Chat,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circular,
  Climate,
  Compliance,
  Copy,
  Deliver,
  Design,
  Diagnosis,
  Emissions,
  Energy,
  Facility,
  Graduation,
  Hydraulics,
  Infrastructure,
  Logistics,
  Mail,
  Manage,
  Manufacturing,
  Mining,
  Oil,
  Phone,
  Pin,
  PublicSector,
  Remediation,
  Waste,
  Water,
} from "./icons";
import { AREAS, BRAND, CONTACT, SECTORS, TEAM } from "./contenido";
import { Bubbles, Microscope } from "./decoracion";
import { AssistantToggle, AssistantView } from "./asistente/Asistente";
import "./uilka.css";

/* ────────────────────────────────────────────────────────────────────────── */
/* Imágenes                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

const IMAGES = {
  heroBg: "/images/hero.webp",
  heroBgMobile: "/images/hero-mobile.webp",
  processBg: "/images/proceso.webp",
  processBgMobile: "/images/proceso-mobile.webp",
  sectorsBg: "/images/sectores.webp",
  sectorsBgMobile: "/images/sectores-mobile.webp",
  contactBg: "/images/contacto.webp",
  contactBgMobile: "/images/contacto-mobile.webp",
  areas: {
    "ingenieria-diagnostico": "/images/areas/diagnostico.webp",
    "cumplimiento-ambiental": "/images/areas/cumplimiento.webp",
    "agua-saneamiento": "/images/areas/agua.webp",
    residuos: "/images/areas/residuos.webp",
    "circularidad-sustentabilidad": "/images/areas/sustentabilidad.webp",
    "emisiones-atmosfericas": "/images/areas/emisiones.webp",
    "riesgo-climatico": "/images/areas/riesgo-climatico.webp",
    "remediacion-restauracion": "/images/areas/remediacion.webp",
    "modelado-hidraulico": "/images/areas/modelado-hidraulico.webp",
  },
  team: {
    "francisco-salvadores": "/images/equipo/francisco-salvadores.webp",
    "luca-parquet": "/images/equipo/luca-parquet.webp",
  },
};

const bgImage = (url) => (url ? { backgroundImage: `url('${url}')` } : undefined);
/* ────────────────────────────────────────────────────────────────────────── */
/* Íconos del contenido (los textos están en contenido.js)                    */
/* ────────────────────────────────────────────────────────────────────────── */

const AREA_ICONS = {
  "ingenieria-diagnostico": Diagnosis,
  "cumplimiento-ambiental": Compliance,
  "agua-saneamiento": Water,
  residuos: Waste,
  "circularidad-sustentabilidad": Circular,
  "emisiones-atmosfericas": Emissions,
  "riesgo-climatico": Climate,
  "remediacion-restauracion": Remediation,
  "modelado-hidraulico": Hydraulics,
};

// Ícono de cada sector (los nombres están en contenido.js).
const SECTOR_ICONS = {
  mineria: Mining,
  energia: Energy,
  hidrocarburos: Oil,
  industria: Manufacturing,
  agroindustria: Agro,
  infraestructura: Infrastructure,
  logistica: Logistics,
  "grandes-instalaciones": Facility,
  "sector-publico": PublicSector,
};
const SECTOR_ITEMS = SECTORS.items.map((s) => ({ ...s, icon: SECTOR_ICONS[s.id] }));

const PROCESS_STEPS = [
  { icon: Design, lead: "Diseño", rest: ": ingeniería y documentación a medida." },
  { icon: Manage, lead: "Gestión", rest: ": compras, proveedores y trámites." },
  { icon: Deliver, lead: "Entrega", rest: ": permiso aprobado u obra en marcha." },
];

const AREAS_PER_SLIDE = 3;
const AREAS_PAGE_COUNT = Math.ceil(AREAS.length / AREAS_PER_SLIDE);
// Llave en mano va antes de las áreas: primero se entiende cómo trabajamos,
// después qué áreas coordinamos.
const SLIDE_LABELS = [
  "Inicio",
  "Llave en Mano",
  ...Array.from({ length: AREAS_PAGE_COUNT }).map((_, i) => `Áreas ${i + 1}/${AREAS_PAGE_COUNT}`),
  "Sectores",
  "Equipo",
  "Contacto",
];
const MOBILE_QUERY = "(max-width: 767px)";

/* ────────────────────────────────────────────────────────────────────────── */
/* Hooks                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function useIsTouchDevice() {
  const detect = () =>
    typeof navigator !== "undefined" && (navigator.maxTouchPoints > 0 || "ontouchstart" in window);
  const [isTouch, setIsTouch] = useState(detect);

  useEffect(() => {
    setIsTouch(detect());
  }, []);

  return isTouch;
}

function useToggleSet() {
  const [ids, setIds] = useState([]);
  const toggle = useCallback(
    (id) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );
  const reset = useCallback(() => setIds([]), []);
  return [ids, toggle, reset];
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Piezas gráficas                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

const LOGO_SIZES = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12", xl: "w-16 h-16" };
const LOGO_VARIANTS = {
  dark: "bg-slate-950 text-emerald-400 border border-slate-800 shadow-sm",
  light: "bg-white text-emerald-700 border border-slate-200/90 shadow-sm",
  emerald: "bg-emerald-600 text-white shadow-md",
  ghost: "bg-transparent text-emerald-600 border border-emerald-500/20",
};
const LOGO_SVG_CLASS =
  "w-[72%] h-[72%] relative z-10 transition-transform duration-300 group-hover:scale-110";

/** Isotipo "cinta" de la marca: cinco segmentos en zigzag ascendente. */
function RibbonMark({ className }) {
  return (
    <svg viewBox="-62 -42 159 99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon points="-60,-40 -40,-40 -15,20 -35,20" fill="currentColor" />
      <path d="M -35,20 L -15,20 Q 0,55 15,20 L -5,20 Q -10,35 -35,20 Z" fill="currentColor" opacity="0.55" />
      <polygon points="-5,20 15,20 40,-30 20,-30" fill="currentColor" opacity="0.8" />
      <polygon points="20,-30 40,-30 80,45 60,45" fill="currentColor" />
      <polygon points="60,45 80,45 95,20 75,20" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

/**
 * Relleno del isotipo para el logo: degradé de 4 tonos + partículas que
 * representan la depuración de un efluente (ingreso con sólidos en
 * suspensión → decantación → oxigenación con burbujas → salida limpia).
 * La forma de la cinta es la misma que RibbonMark, solo cambia el relleno.
 */
function RibbonLogoArt({ className, bubbles = true }) {
  const uid = useId();
  const id = (n) => `ribbon-art-${uid}-${n}`;

  return (
    <svg viewBox="-62 -42 159 99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={id("g1")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#705b41" />
          <stop offset="100%" stopColor="#4e6b45" />
        </linearGradient>
        <linearGradient id={id("g2")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3d5e41" />
          <stop offset="100%" stopColor="#2a666b" />
        </linearGradient>
        <linearGradient id={id("g3")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a666b" />
          <stop offset="100%" stopColor="#429db5" />
        </linearGradient>
        <linearGradient id={id("g4")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#429db5" />
          <stop offset="100%" stopColor="#75cbe3" />
        </linearGradient>
        <linearGradient id={id("g5")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#75cbe3" />
          <stop offset="100%" stopColor="#d4f6ff" />
        </linearGradient>
        <clipPath id={id("clip1")}>
          <polygon points="-60,-40 -40,-40 -15,20 -35,20" />
        </clipPath>
        <clipPath id={id("clip3")}>
          <polygon points="-5,20 15,20 40,-30 20,-30" />
        </clipPath>
      </defs>

      {/* Efluente crudo: sólidos en suspensión */}
      <g style={{ mixBlendMode: "multiply" }}>
        <polygon points="-60,-40 -40,-40 -15,20 -35,20" fill={`url(#${id("g1")})`} />
        <g clipPath={`url(#${id("clip1")})`} fill="#3a2f1f">
          <circle cx="-52" cy="-32" r="1.6" />
          <circle cx="-46" cy="-20" r="1" />
          <circle cx="-49" cy="-8" r="1.8" />
          <circle cx="-40" cy="2" r="1.3" />
          <circle cx="-42" cy="12" r="2" />
          <circle cx="-30" cy="16" r="1.4" />
          <circle cx="-24" cy="15" r="1.7" />
        </g>
      </g>

      {/* Zona de choque / decantación */}
      <path d="M -35,20 L -15,20 Q 0,55 15,20 L -5,20 Q -10,35 -35,20 Z" fill={`url(#${id("g2")})`} />

      {/* Primera clarificación: burbujas de oxigenación */}
      <g>
        <polygon points="-5,20 15,20 40,-30 20,-30" fill={`url(#${id("g3")})`} />
        {bubbles && (
          <g clipPath={`url(#${id("clip3")})`} fill="#ffffff" opacity="0.6">
            <circle cx="8" cy="-20" r="1" />
            <circle cx="18" cy="-14" r="1.6" />
            <circle cx="12" cy="-5" r="0.8" />
            <circle cx="24" cy="-2" r="1.3" />
            <circle cx="20" cy="8" r="1.9" />
            <circle cx="30" cy="12" r="1" />
          </g>
        )}
      </g>

      {/* Depuración final */}
      <polygon points="20,-30 40,-30 80,45 60,45" fill={`url(#${id("g4")})`} />

      {/* Salida limpia */}
      <polygon points="60,45 80,45 95,20 75,20" fill={`url(#${id("g5")})`} />
    </svg>
  );
}

function UilkaLogo({ className = "", size = "md", variant = "dark", bubbles = true }) {
  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 relative overflow-hidden group-hover:scale-105 ${LOGO_SIZES[size]} ${LOGO_VARIANTS[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#d4f6ff]/0 via-[#d4f6ff]/25 to-[#75cbe3]/30 pointer-events-none" />
      <RibbonLogoArt className={LOGO_SVG_CLASS} bubbles={bubbles} />
    </div>
  );
}

/** Marca de agua decorativa: el isotipo en cinta, repetible a baja opacidad. */
function ValleyMark({ className = "w-full h-full" }) {
  return <RibbonMark className={className} />;
}

/** Ícono de LinkedIn (lucide ya no garantiza los íconos de marcas). */
function LinkedinIcon({ className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/** Imagen de fondo + degradado encima. */
function SectionBackdrop({ image, imageClass, gradientClass, imageBoxClass = "absolute top-0 bottom-0" }) {
  return (
    <>
      <div
        className={`${imageBoxClass} left-1/2 -translate-x-1/2 w-screen bg-cover bg-center pointer-events-none ${imageClass}`}
        style={bgImage(image)}
      />
      <div className={`absolute inset-0 pointer-events-none ${gradientClass}`} />
    </>
  );
}

function CopiedToast({ className }) {
  return (
    <div className={className}>
      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
      <span>{BRAND.email} copiado</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Tarjeta de área (gira al hacer clic)                                       */
/* ────────────────────────────────────────────────────────────────────────── */

const FLIP_CARD_STYLES = {
  desktop: {
    icon: "w-7 h-7",
    front: "shadow-md",
    frontBody: "p-4 sm:p-5",
    number: "text-xs",
    titleWrap: "px-2",
    // Escala con el ancho de la tarjeta para que la palabra más larga entre entera.
    title: "text-[length:min(1.5rem,10.5cqi)]",
    frontSubtitle: "text-[13px]",
    back: "shadow-md bg-white p-4 sm:p-5",
    backHeader: "gap-2.5 pb-2.5 mb-2.5",
    backTitle: "text-sm",
    subtitle: "text-[13px] mb-1",
    item: "text-[13px] lg:text-sm",
    hint: "Ver servicios →",
  },
  mobile: {
    icon: "w-7 h-7",
    front: "",
    frontBody: "p-5",
    number: "text-xs",
    titleWrap: "px-2",
    title: "text-[length:min(1.5rem,10.5cqi)]",
    frontSubtitle: "text-sm",
    back: "bg-white p-5",
    backHeader: "gap-2.5 pb-3 mb-3",
    backTitle: "text-sm",
    subtitle: "text-sm mb-1",
    item: "text-sm",
    hint: "Tocá para ver servicios",
  },
};

function AreaFlipCard({ area, index, flipped, onToggle, variant = "desktop" }) {
  const s = FLIP_CARD_STYLES[variant];
  const Icon = AREA_ICONS[area.id] ?? Diagnosis;
  const icon = <Icon className={s.icon} />;

  return (
    <div
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); // la barra espaciadora no debe desplazar la página
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${area.title}: ${flipped ? "ocultar" : "ver"} servicios`}
      className={`group relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--e-accent)] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
    >
      {/* Frente */}
      <div className={`absolute inset-0 [backface-visibility:hidden] border-2 border-stone-800 overflow-hidden ${s.front}`}>
        <img
          src={IMAGES.areas[area.id]}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b2630]/95 via-[#0f2f3b]/55 to-[#1d5566]/15" />
        <div className={`relative z-10 h-full flex flex-col ${s.frontBody}`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono-code text-white/75 font-bold ${s.number}`}>0{index + 1}</span>
            <div className="text-white">{icon}</div>
          </div>
          <div className={`@container flex-1 flex flex-col items-center justify-center gap-3 text-center ${s.titleWrap}`}>
            <h3 className={`font-syne font-bold uppercase text-white leading-tight ${s.title}`}>{area.title}</h3>
            <p className={`text-white/85 leading-snug max-w-[30ch] ${s.frontSubtitle}`}>{area.subtitle}</p>
          </div>
          <span className="text-center font-mono-code text-[11px] text-white/80 uppercase tracking-wider">{s.hint}</span>
        </div>
      </div>

      {/* Dorso */}
      <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-stone-800 flex flex-col overflow-hidden ${s.back}`}>
        <div className={`flex items-center border-b-2 border-stone-800 shrink-0 ${s.backHeader}`}>
          <div className="text-[var(--e-icon)] shrink-0">{icon}</div>
          <h3 className={`font-syne font-bold uppercase text-stone-950 leading-tight ${s.backTitle}`}>{area.title}</h3>
        </div>
        <p className={`text-stone-600 leading-relaxed shrink-0 ${s.subtitle}`}>{area.subtitle}</p>
        {/* Las filas se reparten todo el alto disponible: sin huecos al pie de la tarjeta. */}
        <div className="overflow-y-auto no-scrollbar flex-1 flex flex-col">
          {area.items.map((item, i) => (
            <div
              key={i}
              className={`flex-1 flex items-center gap-2 py-1.5 border-t border-stone-200 font-mono-code text-stone-800 leading-snug ${s.item}`}
            >
              <span className="text-emerald-700 font-bold shrink-0">›</span>
              <span className="min-w-0">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Indicador de scroll solo con flechas (sin texto), para slides intermedias. */
function ScrollArrowHint({ className = "" }) {
  return (
    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 text-stone-400 pointer-events-none ${className}`}>
      <ChevronDown className="w-4 h-4 animate-bounce" />
      <ChevronDown className="w-4 h-4 -mt-2.5 opacity-50 animate-bounce [animation-delay:100ms]" />
    </div>
  );
}

const MOBILE_ARROW_BTN = "pointer-events-auto p-2 animate-bounce";

/**
 * Flechas de navegación de las slides móviles: tocables, marcan si se puede
 * subir y/o bajar. Van fijas a la pantalla (fuera de cada slide) y por encima
 * del contenido, así nunca quedan tapadas ni se desplazan con él.
 */
function MobileSlideArrows({ up = false, down = false, onUp, onDown }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between py-3 pointer-events-none text-stone-400">
      <div className="flex justify-center">
        {up && (
          <button type="button" onClick={onUp} aria-label="Sección anterior" className={MOBILE_ARROW_BTN}>
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex justify-center">
        {down && (
          <button type="button" onClick={onDown} aria-label="Siguiente sección" className={MOBILE_ARROW_BTN}>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Escritorio: diapositivas a pantalla completa                               */
/* ────────────────────────────────────────────────────────────────────────── */

const SLIDE_BASE =
  "slide-section flex flex-col px-4 sm:px-6 lg:px-8 relative overflow-hidden";

/** Ubicación + botón de contacto de la portada. */
function HeroContact({ onContact, align = "start" }) {
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center" : "items-center md:items-start"}`}>
      <span className="inline-flex items-center gap-2 font-mono-code text-xs sm:text-[13px] text-stone-600">
        <Pin className="w-4 h-4 text-[var(--e-icon)] shrink-0" />
        {BRAND.location}
      </span>
      <button
        type="button"
        onClick={onContact}
        className="group inline-flex items-center gap-3 px-5 py-3 bg-stone-950 hover:bg-emerald-700 text-white font-syne font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
      >
        Contacto
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

function HeroSlide({ onContact }) {
  return (
    <section className={`${SLIDE_BASE} justify-between slide-bg-light py-8 sm:py-12 text-stone-900`}>
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-screen bg-cover bg-center opacity-[0.38] pointer-events-none scale-105" style={bgImage(IMAGES.heroBg)} />
      <div className="absolute inset-0 bg-[#f4f9fb]/55 pointer-events-none" />
      {/* La foto se funde abajo con el tono base, para que el paso a la siguiente slide sea gradual. */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#f4f9fb] pointer-events-none" />
      <div className="absolute right-[-2%] bottom-[-5%] w-[480px] sm:w-[620px] lg:w-[750px] opacity-[0.08] text-stone-900 pointer-events-none z-0">
        <ValleyMark />
      </div>

      <div className="slide-content max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col">
        {/* Marca + titular */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-12 w-full max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <UilkaLogo
                size="lg"
                variant="light"
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 shadow-md shrink-0"
              />
              <div className="text-center">
                <div className="flex items-center justify-center gap-2.5">
                  <span className="font-extrabold tracking-tight text-stone-950 text-4xl sm:text-5xl lg:text-6xl font-syne uppercase">
                    {BRAND.name}
                  </span>
                  <span className="w-2.5 h-2.5 ribbon-gradient animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-7">
              <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-stone-950 uppercase leading-[1.05] text-center md:text-left">
                {BRAND.tagline}
              </h1>
              <HeroContact onContact={onContact} />
            </div>
          </div>
        </div>

        <div className="pt-4 ribbon-rule flex items-center justify-center gap-2 text-stone-700 animate-pulse text-xs font-mono-code font-bold uppercase tracking-wider">
          <span>Deslizá para conocer más</span>
          <ChevronDown className="w-4 h-4 text-emerald-700" />
        </div>
      </div>
    </section>
  );
}

function AreasSlide({ pageIndex, pageCount, flippedIds, onToggle }) {
  const areas = AREAS.slice(pageIndex * AREAS_PER_SLIDE, pageIndex * AREAS_PER_SLIDE + AREAS_PER_SLIDE);

  return (
    <section className={`${SLIDE_BASE} justify-center slide-bg-tint py-8 sm:py-10`}>
      <Bubbles />
      <div className="absolute inset-0 opacity-[0.045] pointer-events-none flex flex-wrap gap-20 p-8 justify-around items-center text-stone-900 select-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <ValleyMark key={i} className="w-24 h-24" />
        ))}
      </div>

      <div className="slide-content max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-[3px] ribbon-gradient" />
          <span className="font-mono-code text-xs sm:text-[13px] font-bold uppercase tracking-widest text-stone-500">
            Servicios
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {areas.map((area) => (
            // Alto pensado para que entre la lista completa del dorso.
            <div key={area.id} className="[perspective:1400px] h-80 sm:h-[30rem] lg:h-[26rem] xl:h-[24rem]">
              <AreaFlipCard
                area={area}
                index={AREAS.indexOf(area)}
                flipped={flippedIds.includes(area.id)}
                onToggle={() => onToggle(area.id)}
                variant="desktop"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 pt-6">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: pageCount }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 transition-all duration-300 ${i === pageIndex ? "w-8 ribbon-gradient" : "w-1.5 bg-[#c5dce5]"}`}
              />
            ))}
          </div>
          {pageIndex < pageCount - 1 && (
            <span className="flex items-center gap-1 text-[11px] font-mono-code text-stone-500 uppercase tracking-wider">
              <ChevronDown className="w-3 h-3 animate-bounce" />
              Más
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function ProcessSlide() {
  return (
    <section className={`${SLIDE_BASE} justify-center slide-bg-light py-8 sm:py-10`}>
      <SectionBackdrop
        image={IMAGES.processBg}
        imageClass="opacity-[0.32]"
        gradientClass="bg-gradient-to-b from-[#f4f9fb] via-[#f4f9fb]/85 to-[#f4f9fb]"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] opacity-[0.05] pointer-events-none text-stone-900">
        <ValleyMark />
      </div>

      <div className="slide-content max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center gap-4 mb-14 lg:mb-16">
          <span className="font-mono-code text-xs sm:text-[13px] font-bold uppercase tracking-widest text-stone-500">
            Llave en mano
          </span>
          <h2 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-950 tracking-tight leading-none">
            Nos encargamos de todo.
          </h2>
        </div>

        {/* Línea de tiempo: la cinta del logo une los tres pasos, sin cajas ni números. */}
        <ol className="relative grid md:grid-cols-3 gap-10 md:gap-8 mb-6">
          <span aria-hidden="true" className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-[2px] ribbon-gradient" />
          {PROCESS_STEPS.map(({ icon: Icon, lead, rest }) => (
            <li key={lead} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 grid place-items-center w-12 h-12 bg-[#f4f9fb] ring-1 ring-[#1b4a5a24] shadow-sm">
                <Icon className="w-7 h-7 text-[var(--e-accent)]" />
              </span>
              <h3 className="mt-6 font-syne text-2xl lg:text-3xl font-extrabold text-stone-950 tracking-tight">{lead}</h3>
              <p className="mt-2 text-base lg:text-[17px] text-stone-600 leading-relaxed max-w-[28ch] first-letter:uppercase">
                {rest.replace(/^:\s*/, "")}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <ScrollArrowHint />
    </section>
  );
}

function SectorsSlide() {
  return (
    <section className={`${SLIDE_BASE} justify-center slide-bg-tint py-8 sm:py-10`}>
      <SectionBackdrop
        image={IMAGES.sectorsBg}
        imageClass="opacity-[0.28]"
        // Velo horizontal de siempre + fundido arriba y abajo hacia el tono base.
        gradientClass="bg-[linear-gradient(to_bottom,#f4f9fb,transparent_22%,transparent_78%,#f4f9fb),linear-gradient(to_right,#e8f3f7,rgb(232_243_247/0.9)_50%,rgb(232_243_247/0.6))]"
      />
      <div className="absolute -right-10 -bottom-10 w-80 h-80 opacity-[0.05] pointer-events-none text-stone-900">
        <ValleyMark />
      </div>

      <div className="slide-content max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center gap-3 pb-4 mb-6 border-b-2 border-stone-800">
          <span className="w-16 h-[3px] ribbon-gradient" />
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight">
            {SECTORS.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {SECTOR_ITEMS.map(({ id, name, icon: Icon }) => (
            <div
              key={id}
              className="bg-white/95 border-2 border-stone-800 p-3.5 flex items-center gap-3 hover:bg-stone-100 transition-all shadow-2xs group cursor-default"
            >
              <Icon className="w-8 h-8 text-[var(--e-icon)] shrink-0" />
              <h3 className="font-syne text-sm font-bold uppercase text-stone-950 group-hover:text-emerald-900 transition-colors">
                {name}
              </h3>
            </div>
          ))}
        </div>
      </div>
      <ScrollArrowHint />
    </section>
  );
}

function TeamSlide() {
  return (
    <section className={`${SLIDE_BASE} justify-center slide-bg-light py-8 sm:py-10`}>
      <Microscope />
      <div className="slide-content max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center gap-3 pb-4 mb-6 border-b-2 border-stone-800">
          <span className="w-16 h-[3px] ribbon-gradient" />
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight">
            {TEAM.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TEAM.members.map((member) => (
            <div key={member.id} className="bg-white/95 border-2 border-stone-800 p-6 flex flex-col shadow-xs">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={IMAGES.team[member.id]}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover border-2 border-stone-300 shadow-sm shrink-0"
                />
                <div>
                  <h3 className="font-syne text-lg sm:text-xl font-bold uppercase text-stone-950 leading-tight">
                    {member.displayName ?? member.name}
                  </h3>
                  <span className="font-mono-code text-xs sm:text-[13px] font-bold uppercase tracking-wide text-emerald-800 block mt-0.5">
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 pb-3 mb-4 border-b border-stone-200">
                <Graduation className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-stone-600 font-mono-code leading-relaxed">{member.credential}</span>
              </div>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-mono-code font-bold text-stone-500 hover:text-emerald-700 transition-colors uppercase tracking-wide"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>
      <ScrollArrowHint />
    </section>
  );
}

/**
 * Contacto: una sola acción principal (WhatsApp) y el resto como datos grandes
 * y tocables, separados por líneas finas. Sin cajas ni numeración.
 */
function WhatsAppButton({ className = "" }) {
  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-stone-950 hover:brightness-125 text-white font-syne font-bold text-sm uppercase tracking-wider transition ${className}`}
    >
      <Chat className="w-5 h-5 text-emerald-400" />
      Escribinos por WhatsApp
      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function ContactRow({ label, href, external, value, note, action }) {
  return (
    <div className="group flex items-center gap-4 py-5 border-t border-[#1b4a5a24] first:border-t-0 sm:first:border-t">
      <span className="hidden sm:block w-24 shrink-0 font-mono-code text-xs uppercase text-[var(--e-dim)]">{label}</span>
      <div className="min-w-0 flex-1">
        <span className="sm:hidden block mb-1 font-mono-code text-[11px] uppercase text-[var(--e-dim)]">{label}</span>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { target: "_top" })}
          className="font-syne text-lg sm:text-2xl text-[var(--e-text)] hover:text-[var(--e-accent)] transition-colors break-all sm:break-normal"
        >
          {value}
        </a>
        {note && <p className="mt-1 text-sm text-[var(--e-dim)]">{note}</p>}
      </div>
      {action}
    </div>
  );
}

function ContactList({ onCopyEmail, copied }) {
  return (
    <div className="flex flex-col">
      <ContactRow
        label="Correo"
        href={`mailto:${CONTACT.email}`}
        value={CONTACT.email}
        action={
          <button
            type="button"
            onClick={onCopyEmail}
            aria-label={copied ? "Correo copiado" : "Copiar correo"}
            title={copied ? "Copiado" : "Copiar"}
            className="shrink-0 grid place-items-center w-10 h-10 text-[var(--e-dim)] hover:text-[var(--e-accent)] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-5 h-5 text-[var(--e-accent)]" /> : <Copy className="w-5 h-5" />}
          </button>
        }
      />
      <ContactRow
        label="Teléfono"
        href={CONTACT.phoneHref}
        value={CONTACT.phoneDisplay}
        note="WhatsApp y llamadas"
        action={
          <a
            href={CONTACT.phoneHref}
            target="_top"
            aria-label="Llamar"
            title="Llamar"
            className="shrink-0 grid place-items-center w-10 h-10 text-[var(--e-dim)] hover:text-[var(--e-accent)] transition-colors"
          >
            <Phone className="w-5 h-5" />
          </a>
        }
      />
    </div>
  );
}

function ContactSlide({ onCopyEmail, copied }) {
  return (
    <section className="slide-section flex flex-col justify-between slide-bg-light px-4 sm:px-6 lg:px-8 pt-8 pb-4 relative overflow-hidden">
      <SectionBackdrop
        image={IMAGES.contactBg}
        imageClass="opacity-[0.26]"
        gradientClass="bg-gradient-to-t from-[#f4f9fb] via-[#f4f9fb]/90 to-[#f4f9fb]"
      />

      <div className="slide-content max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col items-start gap-6">
            <span className="w-16 h-[3px] ribbon-gradient" />
            <h2 className="font-syne text-5xl lg:text-6xl font-extrabold text-stone-950 tracking-tight leading-[1.02]">
              {CONTACT.title}
            </h2>
            <WhatsAppButton className="mt-2" />
          </div>
          <ContactList onCopyEmail={onCopyEmail} copied={copied} />
        </div>
      </div>

      <footer className="max-w-7xl mx-auto w-full pt-4 ribbon-rule text-xs font-mono-code text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-syne font-bold uppercase text-stone-950">{BRAND.name}</span>
          <span>—</span>
          <span>{BRAND.tagline}</span>
        </div>
        <div>{BRAND.location}</div>
      </footer>
    </section>
  );
}

function DesktopSlides({ onCopyEmail, copied, onContact }) {
  const [flippedIds, toggleFlipped] = useToggleSet();
  const pageCount = AREAS_PAGE_COUNT;

  // El orden tiene que coincidir con SLIDE_LABELS.
  return (
    <div className="bg-[#f4f9fb] text-stone-900 selection:bg-[#bfe9f5] selection:text-[#0f2a33]">
      <HeroSlide onContact={onContact} />
      <ProcessSlide />
      {Array.from({ length: pageCount }).map((_, i) => (
        <AreasSlide key={i} pageIndex={i} pageCount={pageCount} flippedIds={flippedIds} onToggle={toggleFlipped} />
      ))}
      <SectorsSlide />
      <TeamSlide />
      <ContactSlide onCopyEmail={onCopyEmail} copied={copied} />
    </div>
  );
}

function SlideNav({ activeIndex, onNavigate }) {
  return (
    <aside
      aria-label="Navegación de diapositivas"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 bg-[#f4f9fb]/90 backdrop-blur-xs p-2 border border-stone-300 shadow-md"
    >
      {SLIDE_LABELS.map((label, i) => {
        const active = activeIndex === i;
        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            type="button"
            aria-label={`Ir a la sección 0${i + 1}: ${label}`}
            aria-current={active ? "true" : undefined}
            className="group relative flex items-center justify-center p-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--e-accent)]"
          >
            <span
              className={`transition-all duration-300 ${
                active
                  ? "w-3 h-3 bg-stone-950 ring-2 ring-[var(--e-blue)] ring-offset-2 ring-offset-[#f4f9fb]"
                  : "w-2 h-2 bg-stone-400 group-hover:bg-stone-700"
              }`}
            />
            <span className="pointer-events-none absolute right-7 px-2 py-1 bg-stone-900 text-white font-mono-code text-[11px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
              0{i + 1} · {label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Móvil: página continua                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

function MobileHero({ onContact }) {
  return (
    <section className="relative min-h-full flex flex-col justify-center px-8 pt-8 pb-14 overflow-hidden">
      <SectionBackdrop
        image={IMAGES.heroBgMobile}
        imageClass="opacity-[0.4] scale-105"
        gradientClass="bg-gradient-to-b from-[#f4f9fb]/55 via-[#f4f9fb]/80 to-[#f4f9fb]"
      />
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <UilkaLogo
            size="lg"
            variant="light"
            bubbles={false}
            className="w-36 h-36 shrink-0 shadow-lg"
          />
          <div className="flex items-center justify-center gap-2.5">
            <span className="font-extrabold tracking-tight text-stone-950 text-6xl font-syne uppercase">{BRAND.name}</span>
            <span className="w-2.5 h-2.5 ribbon-gradient animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="w-16 h-[3px] ribbon-gradient" />
          <h1 className="font-syne text-3xl font-extrabold text-stone-950 leading-snug text-center max-w-[20ch] mx-auto">
            {BRAND.tagline}
          </h1>
          <div className="mt-4">
            <HeroContact onContact={onContact} align="center" />
          </div>
        </div>
      </div>
    </section>
  );
}

const MOBILE_AREA_CARD_WIDTH = 300;

function MobileAreasCarousel() {
  const [flippedIds, toggleFlipped, resetFlipped] = useToggleSet();
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Al deslizar a otra tarjeta, las que quedaron dadas vuelta vuelven a su frente.
  useEffect(() => {
    resetFlipped();
  }, [activeIndex, resetFlipped]);

  // Detecta qué tarjeta está centrada para resaltarla.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cardStep = () => {
      const cards = scroller.querySelectorAll("[data-area-card]");
      const first = cards[0];
      const second = cards[1];
      if (!first) return 1;
      return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    };

    const onScroll = () => {
      const step = cardStep();
      if (!step) return;
      setActiveIndex(Math.round(scroller.scrollLeft / step));
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative px-4 py-14">
      <Bubbles />
      <div className="absolute inset-0 overflow-hidden opacity-[0.045] pointer-events-none flex flex-wrap gap-8 p-4 justify-around items-center text-stone-900 select-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <ValleyMark key={i} className="w-16 h-16" />
        ))}
      </div>
      <div className="relative z-10 flex items-center justify-center gap-2 mb-8 px-4">
        <span className="w-5 h-[3px] ribbon-gradient shrink-0" />
        <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-stone-500 text-center">
          Servicios
        </span>
      </div>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="relative z-10 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 pb-2 touch-pan-x"
          style={{
            paddingLeft: `calc((100vw - ${MOBILE_AREA_CARD_WIDTH}px) / 2)`,
            paddingRight: `calc((100vw - ${MOBILE_AREA_CARD_WIDTH}px) / 2)`,
          }}
        >
          {AREAS.map((area, i) => (
            <div
              key={area.id}
              data-area-card
              style={{ width: MOBILE_AREA_CARD_WIDTH, height: MOBILE_AREA_CARD_WIDTH * 1.45 }}
              className={`shrink-0 snap-center [perspective:1200px] transition-opacity duration-300 ${activeIndex === i ? "opacity-100" : "opacity-35"}`}
            >
              <AreaFlipCard
                area={area}
                index={i}
                flipped={flippedIds.includes(area.id)}
                onToggle={() =>
                  activeIndex === i
                    ? toggleFlipped(area.id)
                    : scrollerRef.current
                        ?.querySelectorAll("[data-area-card]")
                        [i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
                }
                variant="mobile"
              />
            </div>
          ))}
        </div>
        {/* Flechas laterales: pegadas al borde de la tarjeta activa y siempre
            dentro de la pantalla (el contenedor arranca 16 px adentro). */}
        {activeIndex > 0 && (
          <div
            className="absolute inset-y-0 flex items-center pointer-events-none z-20 text-stone-800 animate-swipe-left drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]"
            style={{ left: `max(-10px, calc((100vw - ${MOBILE_AREA_CARD_WIDTH}px) / 2 - 50px))` }}
          >
            <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
          </div>
        )}
        {activeIndex < AREAS.length - 1 && (
          <div
            className="absolute inset-y-0 flex items-center pointer-events-none z-20 text-stone-800 animate-swipe-right drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]"
            style={{ right: `max(-10px, calc((100vw - ${MOBILE_AREA_CARD_WIDTH}px) / 2 - 50px))` }}
          >
            <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </section>
  );
}

function MobileProcess() {
  return (
    <section className="relative min-h-full flex flex-col justify-center px-4 py-14 overflow-hidden">
      <SectionBackdrop
        image={IMAGES.processBgMobile}
        imageClass="opacity-[0.26]"
        gradientClass="bg-gradient-to-b from-[#f4f9fb]/80 via-[#f4f9fb]/92 to-[#f4f9fb]"
      />
      <div className="relative z-10 flex flex-col items-center text-center gap-2 mb-6">
        <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-stone-500">Llave en mano</span>
        <h2 className="font-syne text-[2.5rem] font-extrabold text-stone-950 tracking-tight leading-[1.02]">
          Nos encargamos de todo.
        </h2>
      </div>

      {/* Los tres pasos, con alto según la pantalla, unidos por una línea fina
          a la altura de los íconos. */}
      <ol className="relative z-10 flex flex-col gap-5">
        {PROCESS_STEPS.map(({ icon: Icon, lead, rest }, i) => {
          const isLast = i === PROCESS_STEPS.length - 1;
          const text = rest.replace(/^:\s*/, "");
          return (
            <li key={lead} className="relative h-[clamp(7rem,18dvh,10rem)] flex flex-col">
              <div className="relative flex-1 flex items-center gap-4 py-4 px-4 bg-white border-2 border-stone-800 overflow-hidden">
                <Icon className="w-10 h-10 shrink-0 text-[var(--e-accent)]" />
                <div className="min-w-0">
                  <h3 className="font-syne text-[1.4rem] font-extrabold leading-none text-stone-950">{lead}</h3>
                  <p className="mt-1.5 text-[15px] leading-snug first-letter:uppercase text-stone-600">{text}</p>
                </div>
              </div>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute left-9 top-full h-5 w-0.5 -translate-x-1/2 ribbon-gradient opacity-70"
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function MobileSectors() {
  return (
    <section className="relative min-h-full flex flex-col justify-center px-4 py-14 overflow-hidden">
      <SectionBackdrop
        image={IMAGES.sectorsBgMobile}
        imageClass="opacity-[0.28]"
        gradientClass="bg-gradient-to-b from-[#f4f9fb]/75 via-[#f4f9fb]/90 to-[#f4f9fb]"
      />
      <div className="relative z-10 flex flex-col items-center text-center gap-3 mb-4">
        <span className="w-16 h-[3px] ribbon-gradient" />
        <h2 className="font-syne text-2xl font-extrabold text-stone-950 tracking-tight">
          {SECTORS.title}
        </h2>
      </div>
      <div className="relative z-10 grid grid-cols-2 gap-2.5">
        {SECTOR_ITEMS.map(({ id, name, icon: Icon }) => (
          <div key={id} className="bg-white border-2 border-stone-800 p-3 flex flex-col gap-2">
            <Icon className="w-8 h-8 text-[var(--e-icon)]" />
            <h3 className="font-syne text-[13px] font-bold uppercase text-stone-950 leading-tight">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileTeam() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-14">
      <Microscope className="-z-10" />
      <div className="flex items-center gap-2 mb-1">
        <span className="w-5 h-[3px] ribbon-gradient" />
        <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-stone-500">{TEAM.subtitle}</span>
      </div>
      <h2 className="font-syne text-2xl font-extrabold uppercase text-stone-950 tracking-tight mb-4">{TEAM.title}</h2>

      <div className="flex flex-col gap-3">
        {TEAM.members.map((member) => (
          <div key={member.id} className="bg-white border-2 border-stone-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={IMAGES.team[member.id]}
                alt={member.name}
                loading="lazy"
                decoding="async"
                className="w-20 h-20 object-cover border-2 border-stone-300 shadow-sm shrink-0"
              />
              <div>
                <h3 className="font-syne text-[15px] font-bold uppercase text-stone-950 leading-tight">
                  {member.displayName ?? member.name}
                </h3>
                <span className="font-mono-code text-[11px] font-bold uppercase tracking-wide text-emerald-800 block mt-0.5">
                  {member.role}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 pb-2.5 mb-3 border-b border-stone-200">
              <Graduation className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
              <span className="text-xs text-stone-600 font-mono-code leading-relaxed">{member.credential}</span>
            </div>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1 text-xs font-mono-code font-bold text-stone-500 uppercase tracking-wide"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileContact({ onCopyEmail, copied }) {
  return (
    <section className="relative min-h-full flex flex-col justify-center px-4 py-14 overflow-hidden">
      <SectionBackdrop
        image={IMAGES.contactBgMobile}
        imageClass="opacity-[0.26]"
        gradientClass="bg-gradient-to-b from-[#f4f9fb]/80 via-[#f4f9fb]/92 to-[#f4f9fb]"
      />
      <div className="relative z-10 flex flex-col items-start gap-4 mb-6">
        <span className="w-16 h-[3px] ribbon-gradient" />
        <h2 className="font-syne text-[2.5rem] font-extrabold text-stone-950 tracking-tight leading-[1.02]">
          {CONTACT.title}
        </h2>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <WhatsAppButton className="w-full !text-[13px] !px-4" />
        <ContactList onCopyEmail={onCopyEmail} copied={copied} />
      </div>

      <footer className="relative z-10 mt-8 pt-4 ribbon-rule text-center text-[11px] text-stone-500 font-mono-code flex flex-col gap-1">
        <span>{BRAND.footerBadge}</span>
        <span>{BRAND.location}</span>
      </footer>
    </section>
  );
}

const MOBILE_SLIDE_COUNT = 6;
const MOBILE_SWIPE_THRESHOLD = 45;

function MobileLanding({ onCopyEmail, copied }) {
  const [slide, setSlide] = useState(0);
  const slideRefs = useRef([]);
  // Al empezar el gesto: dónde estaba el dedo y si la slide ya estaba en su
  // borde superior / inferior (si no entra en pantalla, primero se desplaza).
  const touchStart = useRef(null);

  const goTo = useCallback((next) => {
    setSlide((prev) => {
      const target = typeof next === "function" ? next(prev) : next;
      return Math.min(MOBILE_SLIDE_COUNT - 1, Math.max(0, target));
    });
  }, []);

  // Cada slide nueva arranca desde arriba.
  useEffect(() => {
    slideRefs.current[slide]?.scrollTo({ top: 0 });
  }, [slide]);

  const onTouchStart = (e) => {
    const el = slideRefs.current[slide];
    touchStart.current = {
      y: e.touches[0].clientY,
      atTop: !el || el.scrollTop <= 1,
      atBottom: !el || el.scrollTop + el.clientHeight >= el.scrollHeight - 1,
    };
  };

  const onTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const delta = start.y - e.changedTouches[0].clientY;
    if (Math.abs(delta) < MOBILE_SWIPE_THRESHOLD) return;
    if (delta > 0 && start.atBottom) goTo((prev) => prev + 1);
    if (delta < 0 && start.atTop) goTo((prev) => prev - 1);
  };

  const slideRef = (i) => (el) => {
    slideRefs.current[i] = el;
  };

  // Cada slide es absoluta y ocupa toda la pantalla: cambiar de sección es un
  // fundido (se esfuma la actual, aparece la otra ya centrada), no un scroll físico.
  const slideClass = (i, center = true) =>
    `mobile-slide no-scrollbar ${center ? "mobile-slide--center" : ""} ${
      slide === i
        ? "opacity-100 scale-100 z-10 pointer-events-auto"
        : "opacity-0 scale-[0.985] z-0 pointer-events-none"
    }`;

  return (
    <div
      className={`mobile-slides-container bg-[#f4f9fb] text-stone-900 ${slide === 0 ? "mobile-slides--refreshable" : ""}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div ref={slideRef(0)} className={slideClass(0, false)} aria-hidden={slide !== 0}>
        <MobileHero onContact={() => goTo(MOBILE_SLIDE_COUNT - 1)} />
      </div>
      <div ref={slideRef(1)} className={slideClass(1)} aria-hidden={slide !== 1}>
        <MobileProcess />
      </div>
      <div ref={slideRef(2)} className={slideClass(2)} aria-hidden={slide !== 2}>
        <MobileAreasCarousel />
      </div>
      <div ref={slideRef(3)} className={slideClass(3)} aria-hidden={slide !== 3}>
        <MobileSectors />
      </div>
      <div ref={slideRef(4)} className={slideClass(4)} aria-hidden={slide !== 4}>
        <MobileTeam />
      </div>
      <div ref={slideRef(5)} className={slideClass(5)} aria-hidden={slide !== 5}>
        <MobileContact onCopyEmail={onCopyEmail} copied={copied} />
      </div>
      <MobileSlideArrows
        up={slide > 0}
        down={slide < MOBILE_SLIDE_COUNT - 1}
        onUp={() => goTo((prev) => prev - 1)}
        onDown={() => goTo((prev) => prev + 1)}
      />
      {copied && (
        <CopiedToast className="fixed bottom-5 left-4 right-4 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-stone-950 text-white font-syne font-bold shadow-2xl text-xs uppercase tracking-wider border-2 border-stone-900" />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Componente principal                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export default function UilkaLanding() {
  const [copied, setCopied] = useState(false);
  const scrollerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  // Tablets táctiles: página continua sin scroll-snap ni navegación lateral.
  const isTouchTablet = !isMobile && isTouch;

  // Modo Asistente: la página se transforma en un chat. Se puede abrir
  // directo con el enlace …/#asistente.
  const [assistant, setAssistant] = useState(() => window.location.hash === "#asistente");
  const toggleAssistant = useCallback((on) => {
    setAssistant(on);
    const url = on ? "#asistente" : window.location.pathname + window.location.search;
    window.history.replaceState(null, "", url);
  }, []);

  const copyEmail = useCallback(() => {
    navigator.clipboard
      ?.writeText(BRAND.email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {});
  }, []);

  const slides = () => scrollerRef.current?.querySelectorAll(".slide-section") ?? [];

  // Sigue la diapositiva visible para la navegación lateral. Se calcula por
  // la posición real de cada slide, porque en pantallas bajas pueden medir
  // más que la ventana.
  useEffect(() => {
    if (isMobile || isTouchTablet) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const probe = scroller.scrollTop + scroller.clientHeight / 2;
        let index = 0;
        slides().forEach((el, i) => {
          if (el.offsetTop <= probe) index = i;
        });
        setActiveSlide(index);
      });
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [isMobile, isTouchTablet, assistant]);

  // Entrada suave del contenido de cada slide al llegar a ella.
  useEffect(() => {
    if (isMobile || isTouchTablet) return;
    const scroller = scrollerRef.current;
    if (!scroller || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.target.dataset.visible = String(e.isIntersecting))),
      { root: scroller, threshold: 0.3 },
    );
    slides().forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile, isTouchTablet, assistant]);

  const goToSlide = (index) => {
    const target = slides()[index];
    if (!target) return;
    if (isTouchTablet) target.scrollIntoView({ behavior: "smooth" });
    else scrollerRef.current.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  };

  const toggle = <AssistantToggle active={assistant} onChange={toggleAssistant} />;

  if (assistant) {
    return (
      <>
        <AssistantView />
        {toggle}
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <MobileLanding onCopyEmail={copyEmail} copied={copied} />
        {toggle}
      </>
    );
  }

  return (
    <div
      className={`w-screen font-sans bg-[#f4f9fb] text-stone-900 selection:bg-[#bfe9f5] selection:text-[#0f2a33] ${
        isTouchTablet ? "min-h-screen" : "h-screen overflow-hidden flex flex-col"
      }`}
    >
      <div ref={scrollerRef} className={`slides-container no-scrollbar ${isTouchTablet ? "no-snap" : "flex-1"}`}>
        <DesktopSlides onCopyEmail={copyEmail} copied={copied} onContact={() => goToSlide(SLIDE_LABELS.length - 1)} />
      </div>

      {!isTouchTablet && <SlideNav activeIndex={activeSlide} onNavigate={goToSlide} />}
      {toggle}

      {copied && (
        <CopiedToast className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-stone-950 text-white font-syne font-bold shadow-2xl text-xs uppercase tracking-wider animate-bounce border-2 border-stone-900" />
      )}
    </div>
  );
}
