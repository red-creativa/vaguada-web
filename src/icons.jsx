/**
 * icons.jsx — set de íconos propio de la marca.
 *
 * Mismo lenguaje que el isotipo en cinta: geometría facetada, sin curvas,
 * puntas cuadradas y uniones en ángulo vivo. Cada ícono combina un trazo
 * fino con un plano relleno a baja opacidad (duotono) que le da peso.
 */

function Glyph({ className = "", strokeWidth = 1.4, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Plano de acento del duotono: veladura del mismo color del trazo. */
function Tone({ d }) {
  return <path d={d} fill="currentColor" stroke="none" opacity="0.16" />;
}

/* ── Interfaz ─────────────────────────────────────────────── */

export const ArrowRight = (p) => (
  <Glyph {...p}>
    <path d="M3 12h16M13 6l6 6-6 6" />
  </Glyph>
);

export const ArrowUpRight = (p) => (
  <Glyph {...p}>
    <path d="M6 18L17 7M8 7h9v9" />
  </Glyph>
);

export const ChevronDown = (p) => (
  <Glyph {...p}>
    <path d="M6 9l6 6 6-6" />
  </Glyph>
);

export const ChevronUp = (p) => (
  <Glyph {...p}>
    <path d="M6 15l6-6 6 6" />
  </Glyph>
);

export const ChevronLeft = (p) => (
  <Glyph {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Glyph>
);

export const ChevronRight = (p) => (
  <Glyph {...p}>
    <path d="M9 6l6 6-6 6" />
  </Glyph>
);

export const Check = (p) => (
  <Glyph {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </Glyph>
);

export const Copy = (p) => (
  <Glyph {...p}>
    <Tone d="M8 8h13v13H8z" />
    <path d="M8 8h13v13H8zM16 8V3H3v13h5" />
  </Glyph>
);

/* ── Asistente ────────────────────────────────────────────── */

export const Shield = (p) => (
  <Glyph {...p}>
    <Tone d="M12 2l8 3v7l-3 6-5 4-5-4-3-6V5z" />
    <path d="M12 2l8 3v7l-3 6-5 4-5-4-3-6V5zM8.5 12l2.5 2.5 4.5-5" />
  </Glyph>
);

export const Send = (p) => (
  <Glyph {...p}>
    <Tone d="M3 11L21 3l-6 18-3-7z" />
    <path d="M3 11L21 3l-6 18-3-7zM12 14l9-11" />
  </Glyph>
);

export const Spark = (p) => (
  <Glyph {...p}>
    <Tone d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
    <path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
  </Glyph>
);

/* ── Contacto ─────────────────────────────────────────────── */

export const Mail = (p) => (
  <Glyph {...p}>
    <Tone d="M2 5h20l-10 8z" />
    <path d="M2 5h20v14H2zM2 5l10 8 10-8" />
  </Glyph>
);

export const Chat = (p) => (
  <Glyph {...p}>
    <Tone d="M3 4h18v12h-9l-5 4v-4H3z" />
    <path d="M3 4h18v12h-9l-5 4v-4H3zM7 8h10M7 12h6" />
  </Glyph>
);

export const Phone = (p) => (
  <Glyph {...p}>
    <Tone d="M3 3h5l2 5-3 2 7 7 2-3 5 2v5h-5L3 8z" />
    <path d="M3 3h5l2 5-3 2 7 7 2-3 5 2v5h-5L3 8z" />
  </Glyph>
);

export const Pin = (p) => (
  <Glyph {...p}>
    <Tone d="M12 6l3 3-3 3-3-3z" />
    <path d="M12 22l-7-10V8l3-5h8l3 5v4zM12 6l3 3-3 3-3-3z" />
  </Glyph>
);

export const Graduation = (p) => (
  <Glyph {...p}>
    <Tone d="M2 9l10-5 10 5-10 5z" />
    <path d="M2 9l10-5 10 5-10 5zM6 11v5l6 3 6-3v-5M22 9v6" />
  </Glyph>
);

/* ── Áreas de servicio ────────────────────────────────────── */

export const Diagnosis = (p) => (
  <Glyph {...p}>
    <Tone d="M6 15l3-4 3 3 3-5 3 3v5H6z" />
    <path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M6 15l3-4 3 3 3-5 3 3" />
  </Glyph>
);

export const Compliance = (p) => (
  <Glyph {...p}>
    <Tone d="M14 2v5h5z" />
    <path d="M5 2h9l5 5v15H5zM14 2v5h5M8.5 14l2.5 2.5 4.5-5" />
  </Glyph>
);

export const Water = (p) => (
  <Glyph {...p}>
    <Tone d="M6 11l6 3 6-3-1.5 7-4.5 3-4.5-3z" />
    <path d="M12 2l6 9-1.5 7-4.5 3-4.5-3L6 11zM6 11l6 3 6-3" />
  </Glyph>
);

export const Waste = (p) => (
  <Glyph {...p}>
    <Tone d="M9 3h6v3H9z" />
    <path d="M3 6h18M9 6V3h6v3M5 6l1.5 15h11L19 6M10 10v7M14 10v7" />
  </Glyph>
);

export const Circular = (p) => (
  <Glyph {...p}>
    <Tone d="M12 8.5l3.5 3.5-3.5 3.5-3.5-3.5z" />
    <path d="M4 14V4h12M13 1l3 3-3 3M20 10v10H8M11 17l-3 3 3 3M12 8.5l3.5 3.5-3.5 3.5-3.5-3.5z" />
  </Glyph>
);

export const Emissions = (p) => (
  <Glyph {...p}>
    <Tone d="M4 11h4v10H4z" />
    <path d="M4 21V11h4v10M8 21v-7l5 3v-3l5 3v4M2 21h20M5 8l2-3 2 2 3-4" />
  </Glyph>
);

export const Climate = (p) => (
  <Glyph {...p}>
    <Tone d="M4.5 15L3 12.5 5 9.5h2L9 6h5l2.5 3.5H19l2 3-1.5 2.5z" />
    <path d="M4.5 15L3 12.5 5 9.5h2L9 6h5l2.5 3.5H19l2 3-1.5 2.5zM8 18l-1 3M12 18l-1 3M16 18l-1 3" />
  </Glyph>
);

export const Remediation = (p) => (
  <Glyph {...p}>
    <Tone d="M12 12L5.5 10 4 4l6 2.5z" />
    <path d="M12 21V9M12 12L5.5 10 4 4l6 2.5zM12 15l4.5-5.5H21l-2 4.5zM3 21h18" />
  </Glyph>
);

export const Hydraulics = (p) => (
  <Glyph {...p}>
    <Tone d="M3.5 16h17L18 21H6z" />
    <path d="M2 6l3-2 3 2 3-2 3 2 3-2 3 2 3-2M2 13l4 8h12l4-8" />
  </Glyph>
);

/* ── Sectores ─────────────────────────────────────────────── */

export const Mining = (p) => (
  <Glyph {...p}>
    <Tone d="M4.2 16h14.7L22 20H2z" />
    <path d="M2 20L8 9l4 6 3-4 7 9zM8 9l1.5-3M15 11l1-2" />
  </Glyph>
);

export const Energy = (p) => (
  <Glyph {...p}>
    <Tone d="M13 2L5 13h6l-1 9 8-11h-6z" />
    <path d="M13 2L5 13h6l-1 9 8-11h-6z" />
  </Glyph>
);

export const Oil = (p) => (
  <Glyph {...p}>
    <Tone d="M12 3l1.1 5h-2.2z" />
    <path d="M8 21l4-18 4 18M9.3 15h5.4M10.4 10h3.2M4 21h16" />
  </Glyph>
);

export const Manufacturing = (p) => (
  <Glyph {...p}>
    <Tone d="M17 4h4v7h-4z" />
    <path d="M3 21V11l5 3v-3l5 3v-3l4 2V4h4v17zM7 17h2M11 17h2M15 17h2" />
  </Glyph>
);

export const Agro = (p) => (
  <Glyph {...p}>
    <Tone d="M12 3l2 2-2 2-2-2z" />
    <path d="M12 22V7M12 3l2 2-2 2-2-2zM12 12L8 9V6l4 3M12 12l4-3V6l-4 3M12 17l-4-3v-3l4 3M12 17l4-3v-3l-4 3" />
  </Glyph>
);

export const Infrastructure = (p) => (
  <Glyph {...p}>
    <Tone d="M4 8l6-4v17H4z" />
    <path d="M4 21V8l6-4v17M10 10h10v11M2 21h20M13 13h1M16 13h1M13 17h1M16 17h1" />
  </Glyph>
);

export const Logistics = (p) => (
  <Glyph {...p}>
    <Tone d="M2 6h12v11H2z" />
    <path d="M2 6h12v11H2zM14 9h4l4 4v4h-8M6 17.5L7.5 19 6 20.5 4.5 19zM18 17.5l1.5 1.5-1.5 1.5-1.5-1.5z" />
  </Glyph>
);

export const Facility = (p) => (
  <Glyph {...p}>
    <Tone d="M6 13h12v4H6z" />
    <path d="M2 21V9l10-6 10 6v12M6 21v-8h12v8M6 17h12" />
  </Glyph>
);

export const PublicSector = (p) => (
  <Glyph {...p}>
    <Tone d="M3 9l9-6 9 6z" />
    <path d="M3 9l9-6 9 6zM5 12v6M9.5 12v6M14.5 12v6M19 12v6M3 21h18" />
  </Glyph>
);

/* ── Proceso ──────────────────────────────────────────────── */

export const Design = (p) => (
  <Glyph {...p}>
    <Tone d="M8 16v-4l4 4z" />
    <path d="M4 20V4l16 16zM8 16v-4l4 4zM4 8h2M4 12h2" />
  </Glyph>
);

export const Manage = (p) => (
  <Glyph {...p}>
    <Tone d="M3 3h6v6H3z" />
    <path d="M3 3h6v6H3zM15 3h6v6h-6zM15 15h6v6h-6zM9 6h6M18 9v6" />
  </Glyph>
);

export const Deliver = (p) => (
  <Glyph {...p}>
    <Tone d="M12 2l9 5v10l-9 5-9-5V7z" />
    <path d="M12 2l9 5v10l-9 5-9-5V7zM8 12l3 3 5-6" />
  </Glyph>
);
