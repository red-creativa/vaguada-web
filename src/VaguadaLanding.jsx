/**
 * VaguadaLanding.jsx
 *
 * Reconstrucción legible del componente publicado en el artifact
 * "VAGUADA | Soluciones ambientales para la gestión y la industria".
 * Se descompiló a partir del bundle de Vite ya minificado, así que los nombres
 * de componentes y variables son nuevos. El marcado, las clases de Tailwind,
 * los textos y el comportamiento son los mismos que en la página publicada.
 *
 * Requisitos:
 *   - React 18+ (el original usaba React 19)
 *   - Tailwind CSS v4
 *   - lucide-react
 *   - vaguada.css (clases propias: slides, scroll-snap, fuentes y tema)
 *
 * Imágenes: todas son marcadores de posición (ver IMAGES más abajo).
 * Coloca tus archivos en /public/images/ con esos nombres o cambia las rutas.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CloudRain,
  Compass,
  Copy,
  Droplet,
  Earth,
  Factory,
  FileCheck2,
  Fuel,
  Gauge,
  GraduationCap,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Pickaxe,
  Recycle,
  Search,
  SlidersVertical,
  Sprout,
  Truck,
  Warehouse,
  Waves,
  Wind,
  Workflow,
  Zap,
} from "lucide-react";
import "./vaguada.css";

/* ────────────────────────────────────────────────────────────────────────── */
/* Imágenes (marcadores de posición)                                          */
/* ────────────────────────────────────────────────────────────────────────── */

const IMAGES = {
  heroBg: "/images/hero.jpg",
  processBg: "/images/proceso.jpg",
  sectorsBg: "/images/sectores.jpg",
  contactBg: "/images/contacto.jpg",
  areas: {
    "ingenieria-diagnostico": "/images/areas/diagnostico.jpg",
    "cumplimiento-ambiental": "/images/areas/cumplimiento.jpg",
    "agua-saneamiento": "/images/areas/agua.jpg",
    "residuos-economia-circular": "/images/areas/residuos.jpg",
    "emisiones-atmosfericas": "/images/areas/emisiones.jpg",
    "sustentabilidad-eficiencia": "/images/areas/sustentabilidad.jpg",
    "riesgo-climatico": "/images/areas/riesgo-climatico.jpg",
    "remediacion-restauracion": "/images/areas/remediacion.jpg",
    "modelado-hidraulico": "/images/areas/modelado-hidraulico.jpg",
  },
  team: {
    "francisco-salvadores": "/images/equipo/francisco-salvadores.jpg",
    "luca-parquet": "/images/equipo/luca-parquet.jpg",
  },
};

const bgImage = (url) => (url ? { backgroundImage: `url('${url}')` } : undefined);

/* ────────────────────────────────────────────────────────────────────────── */
/* Contenido                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

const BRAND = {
  name: "wilkha",
  email: "contacto@wilkha.com",
  tagline: "Soluciones ambientales para industrias e instituciones.",
  description: "Desarrollos aplicados al sector industrial, infraestructura y recursos naturales.",
  location: "La Rioja y Provincias Aledañas, Argentina",
  footerBadge: "WILKHA — Soluciones ambientales para industrias e instituciones",
};

const AREAS = [
  {
    id: "ingenieria-diagnostico",
    title: "Diagnósticos y Recomendaciones",
    subtitle: "Entendimiento técnico de la operación como punto de partida.",
    items: [
      "Diagnósticos ambientales integrales",
      "Evaluación de procesos",
      "Identificación de riesgos",
      "Análisis de consumos y pérdidas",
      "Balances de materia y energía",
      "Oportunidades de mejora",
      "Evaluación técnico-económica",
    ],
  },
  {
    id: "cumplimiento-ambiental",
    title: "Cumplimiento ambiental",
    subtitle:
      'Art. 41 CN — "Todos los habitantes gozan del derecho a un ambiente sano, equilibrado, apto para el desarrollo humano."',
    items: [
      "Evaluaciones de Impacto Ambiental",
      "Declaraciones de Impacto Ambiental",
      "Estudios y documentación",
      "Permisos",
      "Licencias",
      "Planes de gestión ambiental",
      "Regularización",
    ],
  },
  {
    id: "agua-saneamiento",
    title: "Agua y efluentes",
    subtitle: "Infraestructura de agua y tratamiento de efluentes, de punta a punta.",
    items: [
      "Captación, bombeo y almacenamiento",
      "Potabilización",
      "Plantas de tratamiento",
      "Redes de distribución",
      "Redes cloacales",
      "Reutilización de agua",
    ],
  },
  {
    id: "residuos-economia-circular",
    title: "Residuos y economía circular",
    subtitle: "Gestión de residuos y modelos de valorización.",
    items: [
      "Gestión de residuos",
      "Residuos peligrosos",
      "Almacenamiento",
      "Trazabilidad",
      "Transporte y disposición",
      "Valorización",
      "Recuperación de materiales",
      "Economía circular",
    ],
  },
  {
    id: "emisiones-atmosfericas",
    title: "Emisiones atmosféricas",
    subtitle: "Caracterización, modelación y control de emisiones.",
    items: ["Monitoreo", "Caracterización", "Modelación", "Control", "Tratamiento", "Optimización de procesos"],
  },
  {
    id: "sustentabilidad-eficiencia",
    title: "Sustentabilidad empresarial",
    subtitle: "Cultura ambiental, indicadores y datos para la gestión diaria.",
    items: [
      "Cultura ambiental corporativa",
      "Capacitaciones técnicas",
      "KPIs Ambientales",
      "Eficiencia energética e hídrica",
      "Soluciones y diagnósticos",
    ],
  },
  {
    id: "riesgo-climatico",
    title: "Riesgo climático y adaptación",
    subtitle: "De datos climáticos a decisiones de inversión.",
    items: [
      "Tendencias climáticas",
      "Eventos extremos",
      "Sequías",
      "Olas de calor",
      "Precipitaciones y viento",
      "Riesgo físico compuesto",
      "Evaluación de vulnerabilidad",
      "Medidas de adaptación",
    ],
  },
  {
    id: "remediacion-restauracion",
    title: "Remediación y restauración",
    subtitle: "Suelos, aguas y ecosistemas.",
    items: [
      "Estado de situación",
      "Delimitación",
      "Evaluación de riesgo",
      "Tratamientos in situ y ex situ",
      "Aguas superficiales y subterráneas",
      "Restauración ecológica",
      "Revegetación",
    ],
  },
  {
    id: "modelado-hidraulico",
    title: "Modelado hidráulico e hidrológico",
    subtitle: "Simulación de crecidas y escurrimientos con HEC-RAS y HEC-HMS para decidir con datos.",
    items: [
      "Estudios de inundabilidad",
      "Modelación hidrológica de cuencas",
      "Caudales de diseño y crecidas",
      "Modelación hidráulica 1D y 2D",
      "Líneas de ribera y planicies de inundación",
      "Drenaje pluvial urbano",
    ],
  },
];

const AREA_ICONS = {
  "ingenieria-diagnostico": Compass,
  "cumplimiento-ambiental": FileCheck2,
  "agua-saneamiento": Droplet,
  "residuos-economia-circular": Recycle,
  "emisiones-atmosfericas": Wind,
  "sustentabilidad-eficiencia": Gauge,
  "riesgo-climatico": CloudRain,
  "remediacion-restauracion": Sprout,
  "modelado-hidraulico": Waves,
};

const SECTORS = {
  title: "Sectores de aplicación",
  subtitle: "Industrias en las que trabajamos",
  items: [
    { id: "mineria", name: "Minería", icon: Pickaxe },
    { id: "energia", name: "Energía", icon: Zap },
    { id: "industria", name: "Industria y manufactura", icon: Factory },
    { id: "infraestructura", name: "Infraestructura y construcción", icon: Building2 },
    { id: "hidrocarburos", name: "Hidrocarburos y combustibles", icon: Fuel },
    { id: "agroindustria", name: "Industria agro-ganadera", icon: Sprout },
    { id: "logistica", name: "Logística", icon: Truck },
    { id: "grandes-instalaciones", name: "Grandes instalaciones", icon: Warehouse },
    { id: "sector-publico", name: "Sector público y gobiernos", icon: Landmark },
  ],
};

const TEAM = {

  subtitle: "Equipo",
  members: [
    {
      id: "francisco-salvadores",
      name: "Francisco Salvadores",
      role: "Responsable de Operaciones",
      credential: "Ingeniero Ambiental — Universidad Nacional del Litoral",
      linkedin: "https://linkedin.com/in/fransalva2res/",
      bio: "Experiencia en evaluación de impacto ambiental, líneas de base, gestión integral de residuos y sistemas de gestión ISO 14001 / ISO 9001. Coordinación de equipos interdisciplinarios y articulación con organismos públicos y privados.",
    },
    {
      id: "luca-parquet",
      name: "Luca Parquet",
      displayName: "Luca PARQUET",
      role: "Responsable de SIG y Modelado",
      credential: "Ingénieur — École des Ponts ParisTech, Francia · Ingeniero en Recursos Hídricos, UNL",
      linkedin: "https://linkedin.com/in/luca-parquet/",
      bio: "Especialista en modelación hidráulica e hidrológica (HEC-RAS, HEC-HMS, TELEMAC-MASCARET) y sistemas de información geográfica. Experiencia en Francia y Argentina en dimensionamiento de obras y gestión del riesgo de inundación.",
    },
  ],
};

const CONTACT = {
  title: "Contacto",
  email: "contacto@wilkha.com",
  phoneDisplay: "+54 3804 49-4798",
  phoneHref: "tel:+543804494798",
  whatsappUrl: "https://wa.me/543804494798",
  location: "La Rioja y Provincias Aledañas, Argentina",
  signature: "WILKHA — Soluciones ambientales para industrias e instituciones",
};

const PROCESS_STEPS = [
  { icon: Search, lead: "Relevamos el problema o necesidad", rest: " en el lugar: técnico, normativo u operativo." },
  { icon: SlidersVertical, lead: "Diseñamos la solución a medida", rest: ": ingeniería, balances o documentación normativa." },
  { icon: Workflow, lead: "Gestionamos compras, proveedores y trámites", rest: " hasta la ejecución." },
  { icon: CircleCheck, lead: "Entregamos la solución funcionando", rest: ": permiso aprobado u obra operando." },
];

const AREAS_PER_SLIDE = 3;
const AREAS_PAGE_COUNT = Math.ceil(AREAS.length / AREAS_PER_SLIDE);
const SLIDE_LABELS = [
  "Inicio",
  ...Array.from({ length: AREAS_PAGE_COUNT }).map((_, i) => `Áreas ${i + 1}/${AREAS_PAGE_COUNT}`),
  "Llave en Mano",
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
  return [ids, toggle];
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

function VaguadaLogo({ className = "", size = "md", variant = "dark", bubbles = true }) {
  return (
    <div
      className={`rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group-hover:scale-105 ${LOGO_SIZES[size]} ${LOGO_VARIANTS[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-teal-400/20 pointer-events-none" />
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
function SectionBackdrop({ image, imageClass, gradientClass }) {
  return (
    <>
      <div className={`absolute inset-0 bg-cover bg-center pointer-events-none ${imageClass}`} style={bgImage(image)} />
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
    icon: "w-5 h-5",
    front: "shadow-md",
    frontBody: "p-4 sm:p-5",
    number: "text-[11px]",
    frontIconBox: "w-9 h-9",
    titleWrap: "px-2",
    title: "text-xl sm:text-2xl",
    back: "shadow-md bg-white p-4 sm:p-5",
    backHeader: "gap-2.5 pb-2.5 mb-2.5",
    backIconBox: "w-8 h-8",
    backTitle: "text-xs sm:text-sm",
    subtitle: "text-[11px] mb-2.5",
    list: "grid grid-cols-1 gap-1",
    item: "text-[11px]",
  },
  mobile: {
    icon: "w-4 h-4",
    front: "",
    frontBody: "p-3.5",
    number: "text-[10px]",
    frontIconBox: "w-8 h-8",
    titleWrap: "px-1",
    title: "text-lg",
    back: "bg-white p-3.5",
    backHeader: "gap-2 pb-2 mb-2",
    backIconBox: "w-7 h-7",
    backTitle: "text-[11px]",
    subtitle: "text-[10px] mb-2",
    list: "flex flex-col gap-1",
    item: "text-[10px]",
  },
};

function AreaFlipCard({ area, index, flipped, onToggle, variant = "desktop" }) {
  const s = FLIP_CARD_STYLES[variant];
  const Icon = AREA_ICONS[area.id] ?? Compass;
  const icon = <Icon className={s.icon} />;

  return (
    <div
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      role="button"
      tabIndex={0}
      className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
    >
      {/* Frente */}
      <div className={`absolute inset-0 [backface-visibility:hidden] border-2 border-stone-800 overflow-hidden ${s.front}`}>
        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={bgImage(IMAGES.areas[area.id])} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/55 to-stone-950/15" />
        <div className={`relative z-10 h-full flex flex-col ${s.frontBody}`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono-code text-white/70 font-bold ${s.number}`}>0{index + 1}</span>
            <div className={`bg-white/15 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center ${s.frontIconBox}`}>
              {icon}
            </div>
          </div>
          <div className={`flex-1 flex items-center justify-center text-center ${s.titleWrap}`}>
            <h3 className={`font-syne font-bold uppercase text-white leading-tight ${s.title}`}>{area.title}</h3>
          </div>
          {variant === "desktop" ? (
            <div className="text-center">
              <span className="font-mono-code text-[10px] text-white/75 uppercase tracking-wider">Click para ver detalle →</span>
            </div>
          ) : (
            <span className="text-center font-mono-code text-[9px] text-white/75 uppercase tracking-wider">Tocá para ver detalle</span>
          )}
        </div>
      </div>

      {/* Dorso */}
      <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-stone-800 flex flex-col overflow-hidden ${s.back}`}>
        <div className={`flex items-center border-b-2 border-stone-800 shrink-0 ${s.backHeader}`}>
          <div className={`bg-stone-950 text-white flex items-center justify-center shrink-0 ${s.backIconBox}`}>{icon}</div>
          <h3 className={`font-syne font-bold uppercase text-stone-950 leading-tight ${s.backTitle}`}>{area.title}</h3>
        </div>
        <p className={`text-stone-600 leading-relaxed shrink-0 ${s.subtitle}`}>{area.subtitle}</p>
        <div className={`overflow-y-auto no-scrollbar flex-1 ${s.list}`}>
          {area.items.map((item, i) => (
            <div key={i} className={`flex items-center gap-1.5 font-mono-code text-stone-800 ${s.item}`}>
              <span className="text-emerald-700 font-bold shrink-0">›</span>
              <span className="truncate">{item}</span>
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

/** Flechas de navegación de las slides móviles: tocables, marcan si se puede subir y/o bajar. */
function MobileSlideArrows({ up = false, down = false, onUp, onDown }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between py-3 pointer-events-none text-stone-400">
      <div className="flex justify-center">
        {up && (
          <button type="button" onClick={onUp} aria-label="Sección anterior" className="pointer-events-auto p-2 animate-bounce">
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex justify-center">
        {down && (
          <button type="button" onClick={onDown} aria-label="Siguiente sección" className="pointer-events-auto p-2 animate-bounce">
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
  "slide-section flex flex-col border-b-4 border-stone-800 px-4 sm:px-6 lg:px-8 relative overflow-hidden";

function HeroSlide() {
  return (
    <section className={`${SLIDE_BASE} justify-between bg-[#FAF6EE] py-8 sm:py-12 text-stone-900`}>
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.20] pointer-events-none scale-105" style={bgImage(IMAGES.heroBg)} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EE] via-[#FAF6EE]/90 to-[#FAF6EE]/65 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE] via-transparent to-[#FAF6EE]/80 pointer-events-none" />
      <div className="absolute right-[-2%] bottom-[-5%] w-[480px] sm:w-[620px] lg:w-[750px] opacity-[0.08] text-stone-900 pointer-events-none z-0">
        <ValleyMark />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col">
        {/* Marca + titular */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-12 w-full max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <VaguadaLogo
                size="lg"
                variant="dark"
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 border-2 border-stone-900 bg-stone-950 text-emerald-400 shadow-md shrink-0"
              />
              <div className="text-center">
                <div className="flex items-center justify-center gap-2.5">
                  <span className="font-extrabold tracking-tight text-stone-950 text-4xl sm:text-5xl lg:text-6xl font-syne uppercase">
                    {BRAND.name}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-stone-950 uppercase leading-[1.05] text-center md:text-left">
              {BRAND.tagline}
            </h1>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-stone-800 flex items-center justify-center gap-2 text-stone-700 animate-pulse text-[11px] font-mono-code font-bold uppercase tracking-wider">
          <span>Desliza para conocer más</span>
          <ChevronDown className="w-4 h-4 text-emerald-700" />
        </div>
      </div>
    </section>
  );
}

function AreasSlide({ pageIndex, pageCount, flippedIds, onToggle }) {
  const areas = AREAS.slice(pageIndex * AREAS_PER_SLIDE, pageIndex * AREAS_PER_SLIDE + AREAS_PER_SLIDE);

  return (
    <section className={`${SLIDE_BASE} justify-center bg-[#F4EFE6] py-8 sm:py-10`}>
      <div className="absolute inset-0 opacity-[0.045] pointer-events-none flex flex-wrap gap-20 p-8 justify-around items-center text-stone-900 select-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <ValleyMark key={i} className="w-24 h-24" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
          <span className="font-mono-code text-[11px] sm:text-xs font-bold uppercase tracking-widest text-stone-500">
            Conocé nuestros servicios
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {areas.map((area) => (
            <div key={area.id} className="[perspective:1400px] h-72 sm:h-80">
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
                className={`h-1.5 transition-all duration-300 rounded-full ${i === pageIndex ? "w-6 bg-emerald-700" : "w-1.5 bg-stone-300"}`}
              />
            ))}
          </div>
          {pageIndex < pageCount - 1 && (
            <span className="flex items-center gap-1 text-[10px] font-mono-code text-stone-400 uppercase tracking-wider">
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
    <section className={`${SLIDE_BASE} justify-center bg-[#FAF6EE] py-8 sm:py-10`}>
      <SectionBackdrop
        image={IMAGES.processBg}
        imageClass="opacity-[0.14]"
        gradientClass="bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/85 to-[#FAF6EE]"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] opacity-[0.05] pointer-events-none text-stone-900">
        <ValleyMark />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center gap-3 pb-4 mb-8 border-b-2 border-stone-800">
          <span className="w-10 h-px bg-emerald-600/70" />
          <h2 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-950 tracking-tight leading-none">
            Nos encargamos de todo.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-0 mb-6">
          {PROCESS_STEPS.map((step, i) => {
            const isLast = i === PROCESS_STEPS.length - 1;
            return (
              <div key={i} className="flex items-stretch flex-1">
                <div className="bg-white border-2 border-stone-800 p-6 sm:p-7 flex flex-col items-center justify-center text-center flex-1 shadow-xs">
                  <span className="font-mono-code text-[11px] font-bold text-stone-400 mb-3">0{i + 1}</span>
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light max-w-[26ch]">
                    <span className="font-bold text-stone-950">{step.lead}</span>
                    {step.rest}
                  </p>
                </div>
                {!isLast && (
                  <>
                    <div className="hidden md:flex items-center justify-center w-10 shrink-0 text-stone-800">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                    <div className="flex md:hidden items-center justify-center h-8 w-full text-stone-800 rotate-90 -my-1">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <ScrollArrowHint />
    </section>
  );
}

function SectorsSlide() {
  return (
    <section className={`${SLIDE_BASE} justify-center bg-[#F4EFE6] py-8 sm:py-10`}>
      <SectionBackdrop
        image={IMAGES.sectorsBg}
        imageClass="opacity-[0.10]"
        gradientClass="bg-gradient-to-r from-[#F4EFE6] via-[#F4EFE6]/90 to-[#F4EFE6]/60"
      />
      <div className="absolute -right-10 -bottom-10 w-80 h-80 opacity-[0.05] pointer-events-none text-stone-900">
        <ValleyMark />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center gap-3 pb-4 mb-6 border-b-2 border-stone-800">
          <span className="w-10 h-px bg-emerald-600/70" />
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight">
            {SECTORS.title}
          </h2>
          <div className="font-mono-code text-xs text-stone-600 font-bold">09 INDUSTRIAS PRODUCTIVAS</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {SECTORS.items.map(({ id, name, icon: Icon }) => (
            <div
              key={id}
              className="bg-white/95 border-2 border-stone-800 p-3.5 flex items-center justify-between hover:bg-stone-100 transition-all shadow-2xs group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-stone-950 text-white flex items-center justify-center group-hover:bg-emerald-700 transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne text-xs sm:text-sm font-bold uppercase text-stone-950 group-hover:text-emerald-900 transition-colors">
                    {name}
                  </h3>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors" />
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
    <section className={`${SLIDE_BASE} justify-center bg-[#FAF6EE] py-8 sm:py-10`}>
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TEAM.members.map((member) => (
            <div key={member.id} className="bg-white/95 border-2 border-stone-800 p-6 flex flex-col shadow-xs">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-cover bg-center border-2 border-stone-300 shadow-sm shrink-0"
                  style={bgImage(IMAGES.team[member.id])}
                />
                <div>
                  <h3 className="font-syne text-lg sm:text-xl font-bold uppercase text-stone-950 leading-tight">
                    {member.displayName ?? member.name}
                  </h3>
                  <span className="font-mono-code text-[11px] sm:text-xs font-bold uppercase tracking-wide text-emerald-800 block mt-0.5">
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 pb-3 mb-4 border-b border-stone-200">
                <GraduationCap className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-600 font-mono-code leading-relaxed">{member.credential}</span>
              </div>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-mono-code font-bold text-stone-500 hover:text-emerald-700 transition-colors uppercase tracking-wide"
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

function ContactCardHeader({ label, icon: Icon, accent = false }) {
  return (
    <div className="flex items-center justify-between pb-3 border-b-2 border-stone-200 mb-4">
      <span className="font-mono-code text-[11px] text-stone-500 uppercase font-bold">{label}</span>
      <div className={`w-7 h-7 ${accent ? "bg-emerald-700" : "bg-stone-950"} text-white flex items-center justify-center`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

function ContactSlide({ onCopyEmail, copied }) {
  const card = "bg-white/95 border-2 border-stone-800 p-6 flex flex-col justify-between shadow-xs";

  return (
    <section className="slide-section flex flex-col justify-between bg-[#FAF6EE] px-4 sm:px-6 lg:px-8 pt-8 pb-4 relative overflow-hidden">
      <SectionBackdrop
        image={IMAGES.contactBg}
        imageClass="opacity-[0.1]"
        gradientClass="bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/90 to-[#FAF6EE]"
      />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3 pb-4 mb-6 border-b-2 border-stone-800">
          <span className="w-10 h-px bg-emerald-600/70" />
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight">
            {CONTACT.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Correo */}
          <div className={card}>
            <div>
              <ContactCardHeader label="01 / CORREO OFICIAL" icon={Mail} />
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-mono-code text-sm sm:text-base font-bold text-stone-950 hover:text-emerald-700 transition-colors break-all block mb-2"
              >
                {CONTACT.email}
              </a>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-300 flex items-center gap-3 relative">
              <button
                onClick={onCopyEmail}
                type="button"
                className="px-3.5 py-2.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-mono-code transition-colors cursor-pointer"
              >
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>

          {/* WhatsApp / teléfono */}
          <div className={card}>
            <div>
              <ContactCardHeader label="02 / CANAL DIRECTO" icon={MessageCircle} accent />
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-code text-sm sm:text-base font-bold text-stone-950 hover:text-emerald-700 transition-colors block mb-2"
              >
                {CONTACT.phoneDisplay}
              </a>
              <p className="text-xs text-stone-500 font-mono-code uppercase tracking-wide">WhatsApp y llamadas</p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-300 flex items-center gap-2">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-between px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-syne font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href={CONTACT.phoneHref}
                target="_top"
                className="flex-1 inline-flex items-center justify-between px-4 py-2.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-syne font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Llamar</span>
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Ubicación */}
          <div className={card}>
            <div>
              <ContactCardHeader label="03 / CON PRESENCIA EN" icon={Earth} />
              <div className="font-syne text-lg sm:text-xl font-bold uppercase text-stone-950 mb-2">{CONTACT.location}</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto w-full pt-4 border-t-2 border-stone-800 text-xs font-mono-code text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
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

function DesktopSlides({ onCopyEmail, copied }) {
  const [flippedIds, toggleFlipped] = useToggleSet();
  const pageCount = AREAS_PAGE_COUNT;

  return (
    <div className="bg-[#FAF6EE] text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      <HeroSlide />
      {Array.from({ length: pageCount }).map((_, i) => (
        <AreasSlide key={i} pageIndex={i} pageCount={pageCount} flippedIds={flippedIds} onToggle={toggleFlipped} />
      ))}
      <ProcessSlide />
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
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 bg-[#FAF6EE]/90 backdrop-blur-xs p-2 rounded-full border border-stone-300 shadow-md"
    >
      {SLIDE_LABELS.map((label, i) => {
        const active = activeIndex === i;
        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            type="button"
            className="group relative flex items-center justify-center p-1 cursor-pointer"
            title={`Ir a la sección 0${i + 1}: ${label}`}
          >
            <span
              className={`transition-all duration-300 rounded-full ${
                active
                  ? "w-3 h-3 bg-stone-950 ring-2 ring-emerald-600 ring-offset-2 ring-offset-[#FAF6EE]"
                  : "w-2 h-2 bg-stone-400 group-hover:bg-stone-700"
              }`}
            />
            <span className="pointer-events-none absolute right-7 px-2 py-1 bg-stone-900 text-white font-mono-code text-[10px] uppercase font-bold tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
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

function MobileHero() {
  return (
    <section className="relative px-10 pt-10 pb-6 border-b-2 border-stone-800 overflow-hidden">
      <SectionBackdrop
        image={IMAGES.heroBg}
        imageClass="opacity-[0.16]"
        gradientClass="bg-gradient-to-b from-[#FAF6EE]/70 via-[#FAF6EE]/92 to-[#FAF6EE]"
      />
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <VaguadaLogo
            size="lg"
            variant="dark"
            bubbles={false}
            className="w-24 h-24 border-2 border-stone-900 bg-stone-950 text-emerald-400 shrink-0 shadow-lg"
          />
          <span className="font-extrabold tracking-tight text-stone-950 text-4xl font-syne uppercase">{BRAND.name}</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-px bg-emerald-600/70" />
          <h1 className="font-syne text-[22px] font-extrabold text-stone-950 leading-snug text-center max-w-[24ch] mx-auto">
            {BRAND.tagline}
          </h1>
        </div>
      </div>
    </section>
  );
}

function MobileAreasCarousel() {
  const [flippedIds, toggleFlipped] = useToggleSet();
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
    <section className="px-4 py-5 border-b-2 border-stone-800">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 pb-2 touch-pan-x"
        style={{ paddingLeft: "calc((100vw - 256px) / 2)", paddingRight: "calc((100vw - 256px) / 2)" }}
      >
        {AREAS.map((area, i) => (
          <div
            key={area.id}
            data-area-card
            className={`shrink-0 w-64 snap-center [perspective:1200px] h-64 transition-opacity duration-300 ${activeIndex === i ? "opacity-100" : "opacity-35"}`}
          >
            <AreaFlipCard
              area={area}
              index={i}
              flipped={flippedIds.includes(area.id)}
              onToggle={() => toggleFlipped(area.id)}
              variant="mobile"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileProcess() {
  return (
    <section className="px-4 py-8 border-b-2 border-stone-800">
      <div className="flex flex-col items-center text-center gap-3 mb-5">
        <span className="w-10 h-px bg-emerald-600/70" />
        <h2 className="font-syne text-3xl font-extrabold text-stone-950 tracking-tight leading-tight">
          Nos encargamos de todo.
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {PROCESS_STEPS.map(({ icon: Icon, lead, rest }, i) => (
          <div key={i} className="bg-white border-2 border-stone-800 p-4 flex gap-3 items-start">
            <div className="w-9 h-9 bg-stone-950 text-emerald-400 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-[13px] text-stone-700 leading-relaxed font-light pt-1.5">
              <span className="font-bold text-stone-950">{lead}</span>
              {rest}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileSectors() {
  return (
    <section className="relative px-4 py-8 border-b-2 border-stone-800 overflow-hidden">
      <SectionBackdrop
        image={IMAGES.sectorsBg}
        imageClass="opacity-[0.10]"
        gradientClass="bg-gradient-to-b from-[#FAF6EE]/75 via-[#FAF6EE]/90 to-[#FAF6EE]"
      />
      <div className="relative z-10 flex flex-col items-center text-center gap-3 mb-4">
        <span className="w-10 h-px bg-emerald-600/70" />
        <h2 className="font-syne text-2xl font-extrabold text-stone-950 tracking-tight">
          {SECTORS.title}
        </h2>
      </div>
      <div className="relative z-10 grid grid-cols-2 gap-2.5">
        {SECTORS.items.map(({ id, name, icon: Icon }) => (
          <div key={id} className="bg-white border-2 border-stone-800 p-3 flex flex-col gap-2">
            <div className="w-8 h-8 bg-stone-950 text-white flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-syne text-[12px] font-bold uppercase text-stone-950 leading-tight">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileTeam() {
  return (
    <section className="px-4 py-8 border-b-2 border-stone-800">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
        <span className="font-mono-code text-[10px] font-bold uppercase tracking-widest text-stone-500">{TEAM.subtitle}</span>
      </div>
      <h2 className="font-syne text-2xl font-extrabold uppercase text-stone-950 tracking-tight mb-4">{TEAM.title}</h2>

      <div className="flex flex-col gap-3">
        {TEAM.members.map((member) => (
          <div key={member.id} className="bg-white border-2 border-stone-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-stone-300 shadow-sm shrink-0"
                style={bgImage(IMAGES.team[member.id])}
              />
              <div>
                <h3 className="font-syne text-sm font-bold uppercase text-stone-950 leading-tight">
                  {member.displayName ?? member.name}
                </h3>
                <span className="font-mono-code text-[10px] font-bold uppercase tracking-wide text-emerald-800 block mt-0.5">
                  {member.role}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 pb-2.5 mb-3 border-b border-stone-200">
              <GraduationCap className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-stone-600 font-mono-code leading-relaxed">{member.credential}</span>
            </div>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono-code font-bold text-stone-500 uppercase tracking-wide"
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
    <section className="relative px-4 py-8 pb-12 overflow-hidden">
      <SectionBackdrop
        image={IMAGES.contactBg}
        imageClass="opacity-[0.10]"
        gradientClass="bg-gradient-to-b from-[#FAF6EE]/80 via-[#FAF6EE]/92 to-[#FAF6EE]"
      />
      <div className="relative z-10 flex flex-col items-center text-center gap-3 mb-5">
        <span className="w-10 h-px bg-emerald-600/70" />
        <h2 className="font-syne text-2xl font-extrabold text-stone-950 tracking-tight">
          {CONTACT.title}
        </h2>
        <p className="text-xs text-stone-600">{CONTACT.signature}</p>
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Correo */}
        <div className="bg-white border-2 border-stone-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-code text-[10px] text-stone-500 uppercase font-bold">Correo oficial</span>
            <Mail className="w-4 h-4 text-stone-900" />
          </div>
          <a href={`mailto:${CONTACT.email}`} className="font-mono-code text-sm font-bold text-stone-950 break-all block mb-3">
            {CONTACT.email}
          </a>
          <div className="flex gap-2">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 bg-stone-950 text-white font-syne font-bold text-xs uppercase tracking-wider"
            >
              <Mail className="w-4 h-4" />
              Enviar
            </a>
            <button
              type="button"
              onClick={onCopyEmail}
              className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border-2 border-stone-800 text-stone-800 font-syne font-bold text-xs uppercase tracking-wider"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>

        {/* WhatsApp / teléfono */}
        <div className="bg-white border-2 border-stone-800 p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono-code text-[10px] text-stone-500 uppercase font-bold block">Canal directo</span>
              <span className="font-syne text-sm font-bold text-stone-950 block">{CONTACT.phoneDisplay}</span>
              <span className="text-[10px] text-stone-500 font-mono-code uppercase tracking-wide">WhatsApp y llamadas</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3 py-2.5 bg-emerald-700 text-white font-syne font-bold text-xs uppercase tracking-wider"
            >
              WhatsApp
            </a>
            <a
              href={CONTACT.phoneHref}
              target="_top"
              className="flex-1 text-center px-3 py-2.5 bg-white border-2 border-stone-800 text-stone-800 font-syne font-bold text-xs uppercase tracking-wider"
            >
              Llamar
            </a>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white border-2 border-stone-800 p-4 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-stone-950 text-white flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono-code text-[10px] text-stone-500 uppercase font-bold block">Con presencia en</span>
            <span className="font-syne text-sm font-bold text-stone-950">{CONTACT.location}</span>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-center text-[11px] text-stone-500 font-mono-code mt-8">{BRAND.footerBadge}</p>
    </section>
  );
}

const MOBILE_SLIDE_COUNT = 5;
const MOBILE_SWIPE_THRESHOLD = 45;

function MobileLanding({ onCopyEmail, copied }) {
  const [slide, setSlide] = useState(0);
  const touchStartY = useRef(null);

  const goTo = useCallback((next) => {
    setSlide((prev) => {
      const target = typeof next === "function" ? next(prev) : next;
      return Math.min(MOBILE_SLIDE_COUNT - 1, Math.max(0, target));
    });
  }, []);

  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (Math.abs(delta) < MOBILE_SWIPE_THRESHOLD) return;
    goTo((prev) => prev + (delta > 0 ? 1 : -1));
  };

  // Cada slide es absoluta y ocupa toda la pantalla: cambiar de sección es un
  // fundido (se esfuma la actual, aparece la otra ya centrada), no un scroll físico.
  const slideClass = (i, center = true) =>
    `mobile-slide no-scrollbar ${center ? "mobile-slide--center" : ""} ${
      slide === i
        ? "opacity-100 scale-100 z-10 pointer-events-auto"
        : "opacity-0 scale-[0.96] z-0 pointer-events-none"
    }`;

  return (
    <div
      className="mobile-slides-container bg-[#FAF6EE] text-stone-900"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={slideClass(0, false)}>
        <MobileHero />
        <MobileAreasCarousel />
        <MobileSlideArrows down onDown={() => goTo(1)} />
      </div>
      <div className={slideClass(1)}>
        <MobileProcess />
        <MobileSlideArrows up down onUp={() => goTo(0)} onDown={() => goTo(2)} />
      </div>
      <div className={slideClass(2)}>
        <MobileSectors />
        <MobileSlideArrows up down onUp={() => goTo(1)} onDown={() => goTo(3)} />
      </div>
      <div className={slideClass(3)}>
        <MobileTeam />
        <MobileSlideArrows up down onUp={() => goTo(2)} onDown={() => goTo(4)} />
      </div>
      <div className={slideClass(4)}>
        <MobileContact onCopyEmail={onCopyEmail} copied={copied} />
      </div>
      {copied && (
        <CopiedToast className="fixed bottom-5 left-4 right-4 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-stone-950 text-white font-syne font-bold rounded-md shadow-2xl text-xs uppercase tracking-wider border-2 border-stone-900" />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Componente principal                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export default function VaguadaLanding() {
  const [copied, setCopied] = useState(false);
  const scrollerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  // Tablets táctiles: página continua sin scroll-snap ni navegación lateral.
  const isTouchTablet = !isMobile && isTouch;

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(BRAND.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, []);

  // Sigue la diapositiva visible para la navegación lateral.
  useEffect(() => {
    if (isMobile || isTouchTablet) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => setActiveSlide(Math.round(scroller.scrollTop / window.innerHeight));
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [isMobile, isTouchTablet]);

  const goToSlide = (index) => {
    scrollerRef.current?.scrollTo({ top: index * window.innerHeight, behavior: "smooth" });
  };

  if (isMobile) {
    return <MobileLanding onCopyEmail={copyEmail} copied={copied} />;
  }

  return (
    <div
      className={`w-screen font-sans bg-[#FAF6EE] text-stone-900 selection:bg-emerald-200 selection:text-emerald-950 ${
        isTouchTablet ? "min-h-screen" : "h-screen overflow-hidden flex flex-col"
      }`}
    >
      <div ref={scrollerRef} className={`slides-container no-scrollbar ${isTouchTablet ? "no-snap" : "flex-1"}`}>
        <DesktopSlides onCopyEmail={copyEmail} copied={copied} />
      </div>

      {!isTouchTablet && <SlideNav activeIndex={activeSlide} onNavigate={goToSlide} />}

      {copied && (
        <CopiedToast className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-stone-950 text-white font-syne font-bold rounded-md shadow-2xl text-xs uppercase tracking-wider animate-bounce border-2 border-stone-900" />
      )}
    </div>
  );
}
