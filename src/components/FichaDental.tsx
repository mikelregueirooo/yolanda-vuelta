"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DIENTES, ZONAS } from "@/lib/dientes";
import { Odontograma } from "./Odontograma";
import { waHref } from "@/lib/clinica";
import { Llamar } from "./ui";
import { IconoWhatsApp } from "./WhatsApp";

function Ficha({ fdi, onLimpiar }: { fdi: number | null; onLimpiar: () => void }) {
  const d = fdi ? DIENTES.find((x) => x.fdi === fdi) : null;
  return (
    <div aria-live="polite" className="relative min-h-[19rem] rounded-[22px] bg-white p-6 shadow-[0_1px_0_var(--color-linea),0_24px_48px_-32px_rgb(28_43_58/0.35)] sm:p-7">
      <AnimatePresence mode="wait" initial={false}>
        {d ? (
          <motion.div
            key={d.fdi}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-bloque">
                  {d.nombre} {d.donde}
                </p>
                <p className="mt-1 text-[0.9rem] text-sonda">
                  Pieza {d.fdi} de la ficha dental
                </p>
              </div>
              <button onClick={onLimpiar} className="shrink-0 rounded-full px-3 py-1 text-[0.85rem] text-sonda hover:bg-babero">
                Quitar
              </button>
            </div>
            <p className="mt-5 text-[0.95rem] font-semibold">Suele ser porque…</p>
            <ul className="mt-2 space-y-1.5">
              {ZONAS[d.tipo].motivos.map((m) => (
                <li key={m} className="flex gap-3 text-[0.98rem]">
                  <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-encia" />
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.9rem] text-sonda">
              Lo que solemos hacer: {ZONAS[d.tipo].tratamientos.join(", ").toLowerCase()}. Te lo confirmamos en consulta.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Llamar texto="Llamar por este diente" cta={`llamar-diente-${d.fdi}`} />
              <a
                href={waHref(`Hola, me molesta un diente: ${d.nombre.toLowerCase()} ${d.donde} (pieza ${d.fdi}). Quería pedir cita.`)}
                target="_blank"
                rel="noopener noreferrer"
                data-cta={`whatsapp-diente-${d.fdi}`}
                className="inline-flex items-center gap-2 font-semibold text-[#0b5132] underline decoration-[#25d366]/50 decoration-2 underline-offset-4 hover:decoration-[#25d366]"
              >
                <IconoWhatsApp className="size-5 text-[#25d366]" /> o escríbelo por WhatsApp
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="vacio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-full min-h-[16rem] flex-col"
          >
            <p className="t-bloque">Toca un diente del dibujo</p>
            <p className="mt-2 max-w-sm text-sonda">
              Verás qué suele pasar en esa zona y podrás llamarnos directamente. Si no sabes cuál es, llama igualmente.
            </p>
            <Llamar className="mt-auto self-start" cta="llamar-portada" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FichaDental() {
  const [fdi, setFdi] = useState<number | null>(null);
  const fichaMovil = useRef<HTMLDivElement>(null);

  // En el móvil la ficha queda bajo el dibujo: la acercamos al tocar un diente.
  useEffect(() => {
    const el = fichaMovil.current;
    if (!fdi || !el || window.innerWidth >= 1024) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight - 160) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [fdi]);

  return (
    <section id="ficha" className="relative pt-20 sm:pt-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 pb-20 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:pb-28">
        <div className="lg:col-span-5 lg:pt-10">
          <h2 className="t-seccion max-w-[11ch]">¿Qué diente te molesta?</h2>
          <p className="mt-6 max-w-[34rem] text-[1.08rem] leading-relaxed text-placa/80">
            Señálalo en la ficha dental y te contamos qué suele ser. Después nos llamas y te damos cita.
          </p>
          <div className="mt-8 hidden lg:block">
            <Ficha fdi={fdi} onLimpiar={() => setFdi(null)} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="mx-auto max-w-[620px]">
            <Odontograma seleccionado={fdi} onSeleccionar={(n) => setFdi((v) => (v === n ? null : n))} />
          </div>
        </div>

        <div ref={fichaMovil} className="lg:hidden">
          <Ficha fdi={fdi} onLimpiar={() => setFdi(null)} />
        </div>
      </div>
    </section>
  );
}
