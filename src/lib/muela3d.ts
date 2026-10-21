// Geometría de una muela inferior (primer molar) hecha por código: corona con cuatro cúspides
// y dos raíces. Cada capa (esmalte, dentina, pulpa) es la misma forma a otra escala.
import { BufferGeometry, LatheGeometry, SphereGeometry, Vector2 } from "three";

const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const CUSPIDES = [
  [0.44, 0.38],
  [-0.44, 0.38],
  [0.42, -0.4],
  [-0.46, -0.36],
  [0.02, 0.48], // cúspide distal pequeña
];

/** Corona: esfera deformada con cúspides, fisura central y cuello estrecho. */
export function corona(escala = 1, detalle = 1): BufferGeometry {
  const g = new SphereGeometry(1, Math.round(180 * detalle), Math.round(130 * detalle));
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i);
    let y = p.getY(i);
    let z = p.getZ(i);
    // Forma de base algo cuadrada vista desde arriba
    const r = Math.hypot(x, z);
    if (r > 0) {
      const cuadr = 1 + 0.12 * Math.pow(Math.abs(Math.sin(2 * Math.atan2(z, x))), 1.5);
      x *= cuadr;
      z *= cuadr;
    }
    x *= 1.06;
    z *= 0.98;
    y *= 0.78;
    // Abombado en el tercio inferior de la corona, como una muela real
    const panza = 1 + 0.08 * Math.exp(-((y + 0.18) ** 2) / 0.08);
    x *= panza;
    z *= panza;
    // Cúspides y fisuras en la cara de masticar
    const arriba = suave(0.1, 0.7, y / 0.78);
    if (arriba > 0) {
      let h = 0;
      for (const [cx, cz] of CUSPIDES) h += Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / 0.09) * 0.24;
      h -= Math.exp(-(z * z) / 0.008) * 0.12 * suave(0.9, 0.2, Math.abs(x));
      h -= Math.exp(-(x * x) / 0.01) * 0.07 * suave(0.8, 0.1, Math.abs(z));
      y += h * arriba;
    }
    // Cuello: estrecha la base para unirse a las raíces
    const abajo = suave(-0.2, -0.78, y);
    x *= 1 - 0.26 * abajo;
    z *= 1 - 0.2 * abajo;
    p.setXYZ(i, x * escala, y * escala, z * escala);
  }
  g.computeVertexNormals();
  return g;
}

/** Raíz: torno con forma de cono curvado. `lado` = -1 mesial, 1 distal. */
export function raiz(lado: -1 | 1, grosor = 1, largo = 1.7): BufferGeometry {
  const perfil: Vector2[] = [];
  const N = 56;
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    const radio = (0.4 * Math.pow(1 - t, 0.62) + 0.04) * grosor;
    perfil.push(new Vector2(t === 1 ? 0 : radio, -t * largo));
  }
  const g = new LatheGeometry(perfil, 72);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const t = -y / largo;
    // Juntas arriba (tronco común), se separan y la punta vuelve un poco hacia dentro
    const separacion = 0.16 + 0.26 * suave(0.05, 0.6, t) - 0.06 * suave(0.75, 1, t);
    p.setX(i, p.getX(i) * 1.18 + lado * separacion);
    p.setZ(i, p.getZ(i) * 0.82);
  }
  g.translate(0, -0.32, 0);
  g.computeVertexNormals();
  return g;
}

/** Conducto de la pulpa dentro de cada raíz. */
export function conducto(lado: -1 | 1): BufferGeometry {
  const g = raiz(lado, 0.24, 1.6);
  return g;
}
