"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { CLINICA } from "@/lib/clinica";
import { Estado, Llamar } from "./ui";

// La escena 3D solo existe en el navegador.
const Escena = dynamic(() => import("./Muela3D"), { ssr: false });

// Tramos del scroll (0–1). La escena 3D usa los mismos cortes en Muela3D.tsx.
export const CAPAS = [
  { nombre: "Esmalte", texto: "La capa más dura del cuerpo. No se regenera: por eso importan las revisiones.", desde: 0.2, hasta: 0.39 },
  { nombre: "Dentina", texto: "Cuando la caries llega aquí, aparece la sensibilidad al frío y al dulce.", desde: 0.41, hasta: 0.59 },
  { nombre: "Pulpa", texto: "El nervio del diente. Si se infecta, una endodoncia lo limpia y salva la pieza.", desde: 0.61, hasta: 0.79 },
  { nombre: "Raíz", texto: "Sujeta el diente al hueso. Si se pierde, un implante hace de raíz nueva.", desde: 0.81, hasta: 1 },
];

const tramos = (c: (typeof CAPAS)[number]) => [c.desde - 0.04, c.desde, c.hasta - 0.03, c.hasta];

function Capa({ progreso, capa }: { progreso: MotionValue<number>; capa: (typeof CAPAS)[number] }) {
  // La última capa se queda visible hasta el final del recorrido.
  const ultima = capa.hasta >= 1;
  const opacity = useTransform(progreso, tramos(capa), [0, 1, 1, ultima ? 1 : 0]);
  const y = useTransform(progreso, tramos(capa), [20, 0, 0, ultima ? 0 : -14]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
      <p className="text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-none tracking-[-0.04em]">{capa.nombre}</p>
      <p className="mt-3 max-w-[22rem] text-[1rem] leading-relaxed text-placa/80 lg:mt-4 lg:text-[1.05rem]">{capa.texto}</p>
    </motion.div>
  );
}

/** Progreso por capas: lista en escritorio, cuatro segmentos en el móvil. */
function Marcador({ progreso, capa, movil }: { progreso: MotionValue<number>; capa: (typeof CAPAS)[number]; movil?: boolean }) {
  const ultima = capa.hasta >= 1;
  const opacity = useTransform(progreso, tramos(capa), [0.3, 1, 1, ultima ? 1 : 0.3]);
  const ancho = useTransform(progreso, tramos(capa), [10, 28, 28, ultima ? 28 : 10]);
  const relleno = useTransform(progreso, [capa.desde - 0.04, capa.hasta - 0.03], [0, 1]);
  if (movil) {
    return (
      <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-linea">
        <motion.span style={{ scaleX: relleno }} className="absolute inset-0 origin-left rounded-full bg-encia" />
      </span>
    );
  }
  return (
    <motion.li style={{ opacity }} className="flex items-center justify-end gap-3 font-semibold">
      {capa.nombre}
      <motion.span style={{ width: ancho }} className="block h-0.5 rounded-full bg-encia" />
    </motion.li>
  );
}

export function Portada() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const textoOpacidad = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const textoY = useTransform(scrollYProgress, [0, 0.1], [0, -32]);
  const indiceOpacidad = useTransform(scrollYProgress, [0.14, 0.2, 0.95, 1], [0, 1, 1, 0]);
  const pistaOpacidad = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const finalOpacidad = useTransform(scrollYProgress, [0.9, 0.97], [0, 1]);

  return (
    <section id="inicio" ref={ref} className="relative h-[300vh] lg:h-[400vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Fondo: un halo frío detrás de la muela */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_68%_52%,#e3ecef_0%,transparent_70%)] max-lg:bg-[radial-gradient(85%_42%_at_50%_45%,#e3ecef_0%,transparent_70%)]"
        />
        <Escena progreso={scrollYProgress} />

        <div className="pointer-events-none relative mx-auto flex h-full max-w-[1280px] flex-col px-4 pt-24 sm:px-8 lg:justify-center lg:pt-0">
          {/* Portada */}
          <motion.div style={{ opacity: textoOpacidad, y: textoY }} className="pointer-events-auto max-w-[34rem]">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="t-portada max-w-[10ch]"
            >
              Tu dentista en Zabalgana
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <p className="mt-5 max-w-[24rem] text-[1.1rem] leading-relaxed text-placa/80">
                Más de {CLINICA.anos} años cuidando dientes en Vitoria-Gasteiz.
              </p>
              <div className="mt-7 flex flex-col items-start gap-3">
                <Llamar cta="llamar-portada" />
                <Estado />
              </div>
            </motion.div>
          </motion.div>

          {/* Capas de la muela. En el móvil van abajo, por encima de la burbuja de WhatsApp. */}
          <div className="relative mt-auto h-44 pb-24 lg:absolute lg:inset-y-0 lg:left-8 lg:mt-0 lg:h-auto lg:w-[24rem] lg:pb-0">
            <motion.div style={{ opacity: indiceOpacidad }} className="absolute inset-x-0 -top-8 flex gap-1.5 lg:hidden" aria-hidden>
              {CAPAS.map((c) => (
                <Marcador key={c.nombre} progreso={scrollYProgress} capa={c} movil />
              ))}
            </motion.div>
            <div className="relative h-full">
              {CAPAS.map((c) => (
                <Capa key={c.nombre} progreso={scrollYProgress} capa={c} />
              ))}
            </div>
          </div>
          <motion.ol style={{ opacity: indiceOpacidad }} className="absolute right-8 top-1/2 hidden -translate-y-1/2 space-y-2 text-right text-[0.9rem] lg:block">
            {CAPAS.map((c) => (
              <Marcador key={c.nombre} progreso={scrollYProgress} capa={c} />
            ))}
          </motion.ol>

          <motion.div style={{ opacity: finalOpacidad }} className="pointer-events-auto absolute bottom-10 right-8 hidden lg:block">
            <Llamar texto="Pedir revisión" cta="llamar-muela" />
          </motion.div>

          <motion.p
            style={{ opacity: pistaOpacidad }}
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[0.85rem] text-sonda lg:block"
          >
            Baja para ver una muela por dentro
          </motion.p>
        </div>
      </div>
    </section>
  );
}
