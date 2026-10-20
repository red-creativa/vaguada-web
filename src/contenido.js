/**
 * contenido.js — textos de la consultora, compartidos por la landing y el asistente.
 * Si cambiás un servicio acá, se actualiza la página y lo que sabe el asistente.
 */

export const BRAND = {
  name: "üilka",
  email: "salvadoresfrancisco@gmail.com",
  tagline: "Soluciones ambientales para industrias e instituciones",
  description: "Desarrollos aplicados al sector industrial, infraestructura y recursos naturales.",
  location: "La Rioja y provincias vecinas, Argentina",
  footerBadge: "ÜILKA — Soluciones ambientales para industrias e instituciones",
};

// `items`: lo que se ejecuta y se entrega (obras, servicios, resultados).
// El diagnóstico vive solo en su tarjeta; el resto va directo a la solución.
export const AREAS = [
  {
    id: "ingenieria-diagnostico",
    title: "Diagnóstico y eficiencia",
    subtitle: "Detectamos pérdidas y oportunidades de ahorro en tu operación.",
    items: [
      "Relevamiento en planta y puntos críticos",
      "Riesgos de multa o clausura, priorizados",
      "Alternativas de solución con costos",
      "Soluciones urgentes, listas para ejecutar",
      "Devolución clara para la dirección",
    ],
  },
  {
    id: "cumplimiento-ambiental",
    title: "Cumplimiento ambiental",
    subtitle: "Permisos en regla sin frenar la operación.",
    items: [
      "Estudios de Impacto Ambiental (EIA)",
      "Permisos, licencias y habilitaciones",
      "Regularización de establecimientos",
      "Planes de gestión ambiental",
    ],
  },
  {
    id: "agua-saneamiento",
    title: "Agua y efluentes",
    subtitle: "Diseño y obra, de la captación al vuelco.",
    items: [
      "Obras de captación y almacenamiento",
      "Plantas potabilizadoras",
      "Plantas de tratamiento de efluentes",
      "Redes de agua y cloacas",
      "Sistemas de reúso de agua",
      "Dragado y limpieza de lagunas",
    ],
  },
  {
    id: "residuos",
    title: "Gestión de residuos",
    subtitle: "Nos hacemos cargo de tus residuos, de la generación a la disposición final.",
    items: [
      "Urbanos, industriales y peligrosos",
      "Orgánicos, de obra y voluminosos",
      "Separación y acopio en tu predio",
      "Retiro y transporte",
      "Reciclado, tratamiento y disposición final",
    ],
  },
  {
    id: "circularidad-sustentabilidad",
    title: "Sustentabilidad Empresarial y Modelos de Negocio Circulares",
    subtitle: "Residuos convertidos en valor y desempeño ambiental medible.",
    items: [
      "Subproductos convertidos en ingresos",
      "Simbiosis con otras empresas, en marcha",
      "Indicadores ambientales medidos",
      "Reportes de sustentabilidad",
      "Certificaciones (ISO, B Corp, etc.)",
    ],
  },
  {
    id: "emisiones-atmosfericas",
    title: "Emisiones atmosféricas",
    subtitle: "Medición, modelación y control.",
    items: [
      "Monitoreo en chimenea y en el entorno",
      "Modelación de dispersión",
      "Sistemas de control y tratamiento instalados",
      "Ajustes de proceso que bajan emisiones",
    ],
  },
  {
    id: "riesgo-climatico",
    title: "Riesgo climático y adaptación",
    subtitle: "Datos climáticos para decidir inversiones.",
    items: [
      "Tendencias y eventos extremos de tu zona",
      "Riesgo físico sobre tus activos",
      "Escenarios de sequía, calor y tormentas",
      "Medidas y obras de adaptación",
    ],
  },
  {
    id: "remediacion-restauracion",
    title: "Remediación y restauración",
    subtitle: "Suelos, aguas y ecosistemas afectados.",
    items: [
      "Delimitación de la zona afectada",
      "Tratamiento de suelos in situ y ex situ",
      "Saneamiento de aguas superficiales y subterráneas",
      "Restauración y revegetación",
      "Cierre con muestreo de verificación",
    ],
  },
  {
    id: "modelado-hidraulico",
    title: "Modelado hidráulico e hidrológico",
    // ‑: guion que no se separa de línea.
    subtitle: "Crecidas y escurrimientos simulados con HEC‑RAS y HEC‑HMS.",
    items: [
      "Estudios de inundabilidad con mapas",
      "Caudales de diseño para tus obras",
      "Modelación 1D y 2D",
      "Líneas de ribera",
      "Drenaje pluvial",
    ],
  },
];

export const SECTORS = {
  title: "Sectores de aplicación",
  items: [
    { id: "mineria", name: "Minería" },
    { id: "energia", name: "Energía" },
    { id: "hidrocarburos", name: "Hidrocarburos" },
    { id: "industria", name: "Industria manufacturera" },
    { id: "agroindustria", name: "Agroindustria" },
    { id: "infraestructura", name: "Infraestructura y construcción" },
    { id: "logistica", name: "Logística" },
    { id: "grandes-instalaciones", name: "Parques y grandes instalaciones" },
    { id: "sector-publico", name: "Sector público" },
  ],
};

export const TEAM = {
  title: "Quiénes somos",
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

export const CONTACT = {
  title: "Contanos tu proyecto",
  email: "salvadoresfrancisco@gmail.com",
  phoneDisplay: "+54 3804 49-4798",
  phoneHref: "tel:+543804494798",
  whatsappUrl: "https://wa.me/543804494798",
  location: "La Rioja y provincias vecinas, Argentina",
  signature: "ÜILKA — Soluciones ambientales para industrias e instituciones",
};
