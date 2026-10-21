// Datos de la clínica en un solo sitio. Revisar con la clínica antes de publicar:
// el horario viene de DocDental (2026) y puede haber cambiado.

export const CLINICA = {
  nombre: "Clínica Dental Yolanda Vuelta",
  doctora: "Dra. Yolanda Vuelta Calzada",
  colegiada: "01000153",
  telefono: "945 140 913",
  telefonoHref: "tel:+34945140913",
  movil: "605 712 073",
  movilHref: "tel:+34605712073",
  email: "clinica@yolandavuelta.com",
  direccion: "Paseo Juan Pablo II, 28, bajo",
  cp: "01015",
  ciudad: "Vitoria-Gasteiz",
  barrio: "Zabalgana",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Yolanda+Vuelta+Paseo+Juan+Pablo+II+28+Vitoria-Gasteiz",
  registroSanitario: "01 C.2.5.1. 6958",
  // Confirmar con la clínica que este móvil tiene WhatsApp antes de publicar.
  whatsapp: "34605712073",
  anos: 20,
} as const;

/** Enlace a WhatsApp con el mensaje ya escrito. */
export const waHref = (texto = "Hola, quería pedir cita.") =>
  `https://wa.me/${CLINICA.whatsapp}?text=${encodeURIComponent(texto)}`;

/** Equipo. Solo figura quien consta en registros públicos; añadir al resto con su permiso. */
export const EQUIPO = [
  {
    nombre: "Dra. Yolanda Vuelta Calzada",
    papel: "Dentista y responsable de la clínica",
    colegiada: "01000153",
    texto:
      "Atiende en Zabalgana desde hace más de veinte años. Hace revisiones, implantes, ortodoncia, estética dental y la atención del PADI.",
    iniciales: "YV",
  },
] as const;

// Minutos desde medianoche. Índice 0 = lunes.
type Tramo = [number, number];
const h = (hh: number, mm = 0) => hh * 60 + mm;

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const DIAS_CORTOS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const HORARIO: Tramo[][] = [
  [[h(9, 30), h(13, 30)], [h(16), h(20)]],
  [[h(9, 30), h(12, 30)], [h(15), h(20)]],
  [[h(9, 30), h(13, 30)], [h(16), h(20)]],
  [[h(9, 30), h(12, 30)], [h(15), h(20)]],
  [[h(9, 30), h(17, 30)]],
  [],
  [],
];

export const fmt = (min: number) =>
  `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;

/** Día (0 = lunes) y minuto actuales en hora de Vitoria. Solo en el cliente. */
export function ahoraEnVitoria(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dia = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  return { dia, minuto: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type Estado =
  | { abierto: true; cierra: number }
  | { abierto: false; abreDia: number; abre: number; hoy: boolean; manana: boolean };

export function estadoClinica(dia: number, minuto: number): Estado {
  const tramo = HORARIO[dia].find(([a, b]) => minuto >= a && minuto < b);
  if (tramo) return { abierto: true, cierra: tramo[1] };
  for (let i = 0; i < 8; i++) {
    const d = (dia + i) % 7;
    const siguiente = HORARIO[d].find(([a]) => i > 0 || a > minuto);
    if (siguiente) return { abierto: false, abreDia: d, abre: siguiente[0], hoy: i === 0, manana: i === 1 };
  }
  return { abierto: false, abreDia: 0, abre: h(9, 30), hoy: false, manana: false };
}

export function textoEstado(e: Estado) {
  if (e.abierto) return `Abierto ahora, hasta las ${fmt(e.cierra)}`;
  const cuando = e.hoy ? "hoy" : e.manana ? "mañana" : `el ${DIAS[e.abreDia].toLowerCase()}`;
  return `Ahora cerrado. Abrimos ${cuando} a las ${fmt(e.abre)}`;
}

