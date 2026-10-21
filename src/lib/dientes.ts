// Odontograma: las dos arcadas vistas desde arriba, con la numeración FDI que usan los dentistas.
// Como en una ficha dental, la derecha del paciente queda a la izquierda del dibujo.

export type Tipo = "incisivo" | "colmillo" | "premolar" | "muela" | "juicio";

export type Diente = {
  fdi: number; // 11–48
  cuadrante: 1 | 2 | 3 | 4;
  pos: number; // 1 (centro) … 8 (muela del juicio)
  tipo: Tipo;
  nombre: string;
  donde: string;
  x: number;
  y: number;
  ang: number; // grados, a lo largo de la arcada
  ancho: number; // a lo largo de la arcada
  fondo: number; // hacia dentro de la boca
  etiqueta: { x: number; y: number };
};

const NOMBRES = [
  "",
  "Incisivo central",
  "Incisivo lateral",
  "Colmillo",
  "Primer premolar",
  "Segundo premolar",
  "Primera muela",
  "Segunda muela",
  "Muela del juicio",
];
const TIPO: Tipo[] = ["incisivo", "incisivo", "incisivo", "colmillo", "premolar", "premolar", "muela", "muela", "juicio"];
const DONDE = { 1: "de arriba, a tu derecha", 2: "de arriba, a tu izquierda", 3: "de abajo, a tu izquierda", 4: "de abajo, a tu derecha" } as const;

// Anchura relativa de cada pieza (de la 1 a la 8) y profundidad respecto a su anchura.
const ANCHO_SUP = [0, 8.6, 6.6, 7.6, 7, 6.6, 10.2, 9.2, 8.6];
const ANCHO_INF = [0, 5.2, 5.8, 7, 7, 7.2, 11, 10.4, 10];
const FONDO: Record<Tipo, number> = { incisivo: 0.62, colmillo: 0.95, premolar: 1.28, muela: 1.05, juicio: 1.02 };

export const LIENZO = { ancho: 600, alto: 660 };
const CX = LIENZO.ancho / 2;
const HUECO = 3.2;

type Arco = { arriba: boolean; vertice: number; A: number; B: number; tMax: number; anchos: number[] };
const ARCOS: Arco[] = [
  { arriba: true, vertice: 46, A: 212, B: 250, tMax: 1.5, anchos: ANCHO_SUP },
  { arriba: false, vertice: 614, A: 196, B: 236, tMax: 1.5, anchos: ANCHO_INF },
];

function punto(a: Arco, t: number) {
  const dy = a.B * (1 - Math.cos(t));
  return { x: a.A * Math.sin(t), y: a.arriba ? a.vertice + dy : a.vertice - dy };
}

/** Coloca las 8 piezas de media arcada repartiendo su anchura por la longitud de la curva. */
function mediaArcada(a: Arco) {
  const N = 600;
  const muestras = Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * a.tMax;
    return { t, ...punto(a, t) };
  });
  const largo = [0];
  for (let i = 1; i <= N; i++) {
    const p = muestras[i - 1];
    const q = muestras[i];
    largo.push(largo[i - 1] + Math.hypot(q.x - p.x, q.y - p.y));
  }
  const total = largo[N];
  const suma = a.anchos.slice(1).reduce((s, v) => s + v, 0);
  const escala = (total - HUECO * 8) / suma;
  const enLargo = (s: number) => {
    const i = Math.max(1, largo.findIndex((l) => l >= s));
    const f = (s - largo[i - 1]) / (largo[i] - largo[i - 1] || 1);
    return a.tMax * ((i - 1 + f) / N);
  };

  let s = HUECO / 2;
  return a.anchos.slice(1).map((w, k) => {
    const ancho = w * escala;
    const t = enLargo(s + ancho / 2);
    s += ancho + HUECO;
    const p = punto(a, t);
    const dx = a.A * Math.cos(t);
    const dy = (a.arriba ? 1 : -1) * a.B * Math.sin(t);
    return { pos: k + 1, ancho, x: p.x, y: p.y, ang: (Math.atan2(dy, dx) * 180) / Math.PI, nx: dy, ny: -dx };
  });
}

function construir(): Diente[] {
  const lista: Diente[] = [];
  for (const a of ARCOS) {
    const mitad = mediaArcada(a);
    for (const lado of [-1, 1] as const) {
      // Lado izquierdo del dibujo = derecha del paciente (cuadrantes 1 y 4).
      const cuadrante = (a.arriba ? (lado === -1 ? 1 : 2) : lado === -1 ? 4 : 3) as Diente["cuadrante"];
      for (const m of mitad) {
        const tipo = TIPO[m.pos];
        const ancho = m.ancho;
        const fondo = ancho * FONDO[tipo];
        const x = CX + lado * m.x;
        // Normal hacia fuera de la boca
        let nx = lado * m.nx;
        let ny = m.ny;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        const centroBoca = { x: CX, y: a.arriba ? a.vertice + a.B : a.vertice - a.B };
        if ((x - centroBoca.x) * nx + (m.y - centroBoca.y) * ny < 0) {
          nx = -nx;
          ny = -ny;
        }
        const dist = fondo / 2 + 13;
        lista.push({
          fdi: cuadrante * 10 + m.pos,
          cuadrante,
          pos: m.pos,
          tipo,
          nombre: NOMBRES[m.pos],
          donde: DONDE[cuadrante],
          x,
          y: m.y,
          ang: lado === -1 ? -m.ang : m.ang,
          ancho,
          fondo,
          etiqueta: { x: x + nx * dist, y: m.y + ny * dist },
        });
      }
    }
  }
  return lista;
}

// Redondeo a dos decimales: servidor y navegador no siempre coinciden en el último decimal.
const r2 = (n: number) => Math.round(n * 100) / 100;
export const DIENTES = construir().map((d) => ({
  ...d,
  x: r2(d.x),
  y: r2(d.y),
  ang: r2(d.ang),
  ancho: r2(d.ancho),
  fondo: r2(d.fondo),
  etiqueta: { x: r2(d.etiqueta.x), y: r2(d.etiqueta.y) },
}));

/** Curva central de cada arcada, para el trazo de fondo. */
export function curvaArcada(arriba: boolean) {
  const a = ARCOS[arriba ? 0 : 1];
  const pts: string[] = [];
  for (let i = -60; i <= 60; i++) {
    const t = (i / 60) * a.tMax;
    const p = punto(a, Math.abs(t));
    pts.push(`${(CX + Math.sign(t) * p.x).toFixed(1)} ${p.y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

/** Qué suele pasar en cada zona, en palabras del paciente. Orientativo. */
export const ZONAS: Record<Tipo, { zona: string; motivos: string[]; tratamientos: string[] }> = {
  incisivo: {
    zona: "Los dientes de delante",
    motivos: ["Se ha roto o astillado", "Tiene una mancha o ha cambiado de color", "Está torcido o separado"],
    tratamientos: ["Estética dental", "Empastes", "Ortodoncia"],
  },
  colmillo: {
    zona: "El colmillo",
    motivos: ["Está montado sobre los de al lado", "Se ha desgastado", "La encía ha bajado y se ve la raíz"],
    tratamientos: ["Ortodoncia", "Periodoncia"],
  },
  premolar: {
    zona: "Los premolares",
    motivos: ["Duele con el frío o con el dulce", "Se ha caído un empaste", "Falta la pieza"],
    tratamientos: ["Empastes", "Endodoncia", "Implantes"],
  },
  muela: {
    zona: "Las muelas",
    motivos: ["Duele al masticar", "Duele sola, sobre todo por la noche", "Falta la muela"],
    tratamientos: ["Endodoncia", "Implantes", "Prótesis"],
  },
  juicio: {
    zona: "La muela del juicio",
    motivos: ["Molesta al salir", "La encía de alrededor se inflama", "Se mete comida y duele"],
    tratamientos: ["Cirugía oral", "Extracción"],
  },
};
