/**
 * decoracion.jsx — guiños de proceso compartidos por la landing y el asistente:
 * burbujas de oxigenación y fondo de microscopio. Puramente decorativos.
 */

/** Generador pseudoaleatorio con semilla: el dibujo sale siempre igual. */
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BUBBLES = (() => {
  const r = seeded(7);
  return Array.from({ length: 14 }, () => ({
    left: 3 + r() * 94,
    size: 5 + Math.round(r() * 12),
    duration: 14 + r() * 14,
    delay: -r() * 28, // negativas: al cargar ya hay burbujas a distintas alturas
    drift: Math.round((r() - 0.5) * 28),
    opacity: 0.5 + r() * 0.35,
  }));
})();

/** Burbujas de oxigenación que suben despacio, como en un reactor aireado. */
export function Bubbles({ className = "" }) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            "--drift": `${b.drift}px`,
            "--bubble-opacity": b.opacity,
          }}
        />
      ))}
    </div>
  );
}

/** Formas de la muestra: bacilos, cadenas de cocos, flóculos y partículas sueltas. */
const MICROSCOPE_SHAPES = (() => {
  const r = seeded(21);
  const W = 600;
  const H = 400;
  const bacilli = Array.from({ length: 30 }, () => {
    const h = 4 + r() * 2.5;
    return { x: r() * W, y: r() * H, a: r() * 180, l: 12 + r() * 16, h };
  });
  const chains = Array.from({ length: 9 }, () => {
    const n = 3 + Math.floor(r() * 4);
    const a = r() * Math.PI * 2;
    const bend = (r() - 0.5) * 0.5;
    const x0 = r() * W;
    const y0 = r() * H;
    return Array.from({ length: n }, (_, k) => ({
      x: x0 + Math.cos(a + bend * k) * 6.6 * k,
      y: y0 + Math.sin(a + bend * k) * 6.6 * k,
    }));
  });
  const flocs = Array.from({ length: 4 }, () => {
    const cx = r() * W;
    const cy = r() * H;
    return {
      cx,
      cy,
      rx: 18 + r() * 14,
      ry: 12 + r() * 10,
      a: r() * 180,
      cells: Array.from({ length: 14 }, () => {
        const ang = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * 20;
        return { x: cx + Math.cos(ang) * d, y: cy + Math.sin(ang) * d * 0.7, rad: 1.5 + r() * 2.5 };
      }),
    };
  });
  const dots = Array.from({ length: 45 }, () => ({ x: r() * W, y: r() * H, rad: 0.7 + r() * 1.1 }));
  return { W, H, bacilli, chains, flocs, dots };
})();

/** Fondo tipo microscopio: una muestra con bacterias trabajando, muy tenue y quieta. */
export function Microscope({ className = "" }) {
  const { W, H, bacilli, chains, flocs, dots } = MICROSCOPE_SHAPES;
  return (
    <div aria-hidden="true" className={`microscope absolute inset-0 overflow-hidden pointer-events-none opacity-[0.16] text-[var(--e-teal)] ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full" fill="currentColor" stroke="currentColor">
        {flocs.map((f, i) => (
          <g key={`f${i}`}>
            <ellipse cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry} transform={`rotate(${f.a} ${f.cx} ${f.cy})`} fillOpacity="0.12" strokeOpacity="0.35" strokeWidth="0.8" />
            {f.cells.map((c, k) => (
              <circle key={k} cx={c.x} cy={c.y} r={c.rad} fillOpacity="0.45" stroke="none" />
            ))}
          </g>
        ))}
        {bacilli.map((b, i) => (
          <rect
            key={`b${i}`}
            x={b.x - b.l / 2}
            y={b.y - b.h / 2}
            width={b.l}
            height={b.h}
            rx={b.h / 2}
            transform={`rotate(${b.a} ${b.x} ${b.y})`}
            fillOpacity="0.3"
            strokeOpacity="0.8"
            strokeWidth="0.9"
          />
        ))}
        {chains.map((c, i) => (
          <g key={`c${i}`} fillOpacity="0.35" strokeOpacity="0.8" strokeWidth="0.8">
            {c.map((p, k) => (
              <circle key={k} cx={p.x} cy={p.y} r="3" />
            ))}
          </g>
        ))}
        {dots.map((d, i) => (
          <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.rad} fillOpacity="0.6" stroke="none" />
        ))}
      </svg>
    </div>
  );
}

