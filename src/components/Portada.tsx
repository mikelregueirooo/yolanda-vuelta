"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { CLINICA } from "@/lib/clinica";
import { Estado, Llamar } from "./ui";

// La escena 3D solo existe en el navegador.
const Escena = dynamic(() => import("./Muela3D"), { ssr: false });

const CAPAS = [
  {
    nombre: "Esmalte",
    texto: "La capa más dura del cuerpo humano. Protege el diente, pero no se regenera: por eso importan las revisiones.",
    desde: 0.3,
    hasta: 0.47,
  },
  {
    nombre: "Dentina",
    texto: "Está bajo el esmalte. Cuando la caries llega hasta aquí, aparece la sensibilidad al frío y al dulce.",
    desde: 0.5,
    hasta: 0.67,
  },
  {
    nombre: "Pulpa",
    texto: "El nervio y los vasos del diente. Si se infecta, una endodoncia la limpia y conserva la pieza.",
    desde: 0.7,
    hasta: 0.82,
  },
  {
    nombre: "Raíz",
    texto: "Sujeta el diente al hueso. Si una pieza se pierde, un implante hace de raíz nueva.",
    desde: 0.85,
    hasta: 1,
  },
];

function Capa({ progreso, capa }: { progreso: MotionValue<number>; capa: (typeof CAPAS)[number] }) {
  const { desde, hasta } = capa;
  // La última capa se queda visible hasta el final del recorrido.
  const ultima = hasta >= 1;
  const entrada = [desde - 0.04, desde, hasta - 0.03, hasta];
  const opacity = useTransform(progreso, entrada, [0, 1, 1, ultima ? 1 : 0]);
  const y = useTransform(progreso, entrada, [24, 0, 0, ultima ? 0 : -16]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
      <p className="text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold leading-none tracking-[-0.04em]">{capa.nombre}</p>
      <p className="mt-4 max-w-[24rem] text-[1.05rem] leading-relaxed text-placa/80">{capa.texto}</p>
    </motion.div>
  );
}

function Indice({ progreso }: { progreso: MotionValue<number> }) {
  return (
    <ol className="space-y-2 text-right text-[0.9rem]">
      {CAPAS.map((c) => (
        <IndiceItem key={c.nombre} progreso={progreso} capa={c} />
      ))}
    </ol>
  );
}

function IndiceItem({ progreso, capa }: { progreso: MotionValue<number>; capa: (typeof CAPAS)[number] }) {
  const ultima = capa.hasta >= 1;
  const entrada = [capa.desde - 0.04, capa.desde, capa.hasta - 0.03, capa.hasta];
  const opacity = useTransform(progreso, entrada, [0.35, 1, 1, ultima ? 1 : 0.35]);
  const ancho = useTransform(progreso, entrada, [10, 28, 28, ultima ? 28 : 10]);
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
  const textoOpacidad = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const textoY = useTransform(scrollYProgress, [0, 0.12], [0, -40]);
  const indiceOpacidad = useTransform(scrollYProgress, [0.24, 0.3, 0.95, 1], [0, 1, 1, 0]);
  const pistaOpacidad = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const finalOpacidad = useTransform(scrollYProgress, [0.93, 0.99], [0, 1]);

  return (
    <section id="inicio" ref={ref} className="relative h-[340vh] lg:h-[440vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Fondo: un halo frío detrás de la muela */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_68%_52%,#e3ecef_0%,transparent_70%)] max-lg:bg-[radial-gradient(80%_45%_at_50%_72%,#e3ecef_0%,transparent_70%)]"
        />
        <Escena progreso={scrollYProgress} />

        <div className="pointer-events-none relative mx-auto flex h-full max-w-[1280px] flex-col px-4 pt-24 sm:px-8 lg:justify-center lg:pt-0">
          {/* Portada */}
          <motion.div style={{ opacity: textoOpacidad, y: textoY }} className="pointer-events-auto max-w-[36rem]">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="t-portada"
            >
              Tu dentista en Zabalgana desde hace más de veinte años
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="mt-6 max-w-[30rem] text-[1.12rem] leading-relaxed text-placa/80">
                Implantes, ortodoncia, estética dental y PADI infantil en la consulta de la {CLINICA.doctora}, en el
                Paseo Juan Pablo II.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4">
                <Llamar cta="llamar-portada" />
                <Estado />
              </div>
            </motion.div>
          </motion.div>

          {/* Capas de la muela */}
          <div className="relative mt-auto h-56 pb-8 lg:absolute lg:inset-y-0 lg:left-8 lg:mt-0 lg:h-auto lg:w-[24rem] lg:pb-0">
            {CAPAS.map((c) => (
              <Capa key={c.nombre} progreso={scrollYProgress} capa={c} />
            ))}
          </div>
          <motion.div style={{ opacity: indiceOpacidad }} className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
            <Indice progreso={scrollYProgress} />
          </motion.div>

          <motion.div
            style={{ opacity: finalOpacidad }}
            className="pointer-events-auto absolute bottom-10 right-4 sm:right-8"
          >
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
