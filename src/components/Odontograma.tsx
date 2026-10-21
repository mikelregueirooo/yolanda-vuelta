"use client";

import { motion, useReducedMotion } from "framer-motion";
import { curvaArcada, DIENTES, LIENZO, type Diente } from "@/lib/dientes";

/** Forma de cada pieza vista desde arriba, centrada en 0,0 y alineada con la arcada. */
function Pieza({ d }: { d: Diente }) {
  const w = d.ancho;
  const h = d.fondo;
  switch (d.tipo) {
    case "incisivo":
      return (
        <>
          <ellipse rx={w / 2} ry={h / 2} />
          <path d={`M${-w * 0.32} ${-h * 0.08} Q0 ${-h * 0.2} ${w * 0.32} ${-h * 0.08}`} className="pieza-surco" />
        </>
      );
    case "colmillo":
      return (
        <>
          <path
            d={`M${-w / 2} 0 C${-w / 2} ${-h * 0.42} ${-w * 0.2} ${-h / 2} 0 ${-h / 2} C${w * 0.2} ${-h / 2} ${w / 2} ${-h * 0.42} ${w / 2} 0 C${w / 2} ${h * 0.42} ${w * 0.2} ${h / 2} 0 ${h / 2} C${-w * 0.2} ${h / 2} ${-w / 2} ${h * 0.42} ${-w / 2} 0 Z`}
          />
          <circle r={w * 0.07} className="pieza-cuspide" />
        </>
      );
    case "premolar":
      return (
        <>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.46} />
          <path d={`M${-w * 0.28} 0 Q0 ${h * 0.06} ${w * 0.28} 0`} className="pieza-surco" />
        </>
      );
    default:
      return (
        <>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.32} />
          <path d={`M${-w * 0.3} ${h * 0.02} Q0 ${-h * 0.1} ${w * 0.3} ${h * 0.02}`} className="pieza-surco" />
          <circle cx={-w * 0.17} cy={h * 0.2} r={w * 0.045} className="pieza-cuspide" />
          <circle cx={w * 0.17} cy={h * 0.2} r={w * 0.045} className="pieza-cuspide" />
        </>
      );
  }
}

// Orden de aparición: desde el centro de la boca hacia atrás, como se explora.
const retraso = (d: Diente) => 0.25 + (d.pos - 1) * 0.07 + (d.cuadrante >= 3 ? 0.12 : 0);

// Recorte del dibujo para ver una sola arcada (en el móvil, al doble de tamaño).
const VISTAS = {
  ambas: `0 0 ${LIENZO.ancho} ${LIENZO.alto}`,
  arriba: "44 18 512 330",
  abajo: "44 312 512 334",
} as const;
export type Arcada = keyof typeof VISTAS;

export function Odontograma({
  seleccionado,
  onSeleccionar,
  arcada = "ambas",
}: {
  seleccionado: number | null;
  onSeleccionar: (fdi: number) => void;
  arcada?: Arcada;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox={VISTAS[arcada]}
      className="odontograma h-auto w-full select-none"
      role="group"
      aria-label="Ficha dental: toca el diente que te molesta"
    >
      {/* Trazos de las arcadas */}
      {[true, false].filter((arriba) => arcada === "ambas" || (arcada === "arriba") === arriba).map((arriba, i) => (
        <motion.path
          key={i}
          d={curvaArcada(arriba)}
          fill="none"
          className="stroke-linea"
          strokeWidth="1.5"
          strokeDasharray="1 6"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      ))}

      {/* Línea media y orientación, como en la ficha del dentista */}
      <line x1={LIENZO.ancho / 2} x2={LIENZO.ancho / 2} y1="296" y2="364" className="stroke-linea" strokeWidth="1.5" />
      <text x="72" y="336" className="fill-sonda text-[15px] font-semibold">
        Tu derecha
      </text>
      <text x={LIENZO.ancho - 72} y="336" textAnchor="end" className="fill-sonda text-[15px] font-semibold">
        Tu izquierda
      </text>
      <text x={LIENZO.ancho / 2} y="196" textAnchor="middle" className="fill-sonda text-[13px]">
        Dientes de arriba
      </text>
      <text x={LIENZO.ancho / 2} y="470" textAnchor="middle" className="fill-sonda text-[13px]">
        Dientes de abajo
      </text>

      {DIENTES.filter((d) => arcada === "ambas" || (arcada === "arriba") === d.cuadrante <= 2).map((d) => {
        const activo = seleccionado === d.fdi;
        return (
          <motion.g
            key={d.fdi}
            role="button"
            tabIndex={0}
            aria-pressed={activo}
            aria-label={`${d.nombre} ${d.donde} (${d.fdi})`}
            onClick={() => onSeleccionar(d.fdi)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSeleccionar(d.fdi);
              }
            }}
            className={`diente cursor-pointer outline-none ${activo ? "is-activo" : ""}`}
            initial={reduce ? false : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: retraso(d), ease: [0.2, 0.8, 0.2, 1] }}
            style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
          >
            {/* Zona táctil más grande que la pieza */}
            <circle cx={d.x} cy={d.y} r={Math.max(d.ancho, d.fondo) * 0.62} fill="transparent" />
            <g transform={`translate(${d.x.toFixed(2)} ${d.y.toFixed(2)}) rotate(${d.ang.toFixed(2)})`} className="pieza">
              <Pieza d={d} />
            </g>
            <text
              x={d.etiqueta.x}
              y={d.etiqueta.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="numero text-[12.5px] font-semibold tabular-nums"
            >
              {d.fdi}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
