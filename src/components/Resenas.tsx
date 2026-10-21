"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { CLINICA } from "@/lib/clinica";
import { CLAVE_MAPS, pedirResenas, type FichaGoogle, type Resena } from "@/lib/google";

type Estado = { tipo: "esperando" } | { tipo: "cargando" } | { tipo: "listo"; ficha: FichaGoogle } | { tipo: "sin-datos" };

function Estrellas({ nota, tam = "size-4" }: { nota: number; tam?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${nota.toLocaleString("es-ES", { maximumFractionDigits: 1 })} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const relleno = Math.max(0, Math.min(1, nota - (i - 1)));
        return (
          <span key={i} className={`relative ${tam}`} aria-hidden>
            <Star className={`absolute inset-0 ${tam} text-linea`} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${relleno * 100}%` }}>
              <Star className={`${tam} text-[#f2b01e]`} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Tarjeta({ r }: { r: Resena }) {
  const inicial = r.autor.trim().charAt(0).toUpperCase();
  return (
    <figure className="flex h-full w-[82vw] max-w-[24rem] shrink-0 snap-start flex-col rounded-[24px] bg-white p-6 shadow-[0_1px_0_var(--color-linea)] sm:w-auto sm:max-w-none">
      <div className="flex items-center justify-between gap-3">
        <Estrellas nota={r.nota} />
        <span className="text-[0.82rem] text-sonda">{r.cuando}</span>
      </div>
      <blockquote className="mt-4 line-clamp-[7] flex-1 whitespace-pre-line leading-relaxed text-placa/90">{r.texto}</blockquote>
      <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-linea pt-4">
        {/* Atribución del autor: foto, nombre y enlace a su perfil, como exige Google */}
        <a href={r.autorUrl} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-3 hover:underline">
          {r.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.foto} alt="" width={36} height={36} referrerPolicy="no-referrer" className="size-9 shrink-0 rounded-full bg-babero" />
          ) : (
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-babero font-bold">{inicial}</span>
          )}
          <span className="truncate font-semibold">{r.autor}</span>
        </a>
        {r.url && (
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[0.85rem] font-semibold text-sonda underline underline-offset-4 hover:text-placa">
            Ver en Google
          </a>
        )}
      </figcaption>
    </figure>
  );
}

function Esqueleto() {
  return (
    <div className="flex gap-4 overflow-hidden sm:grid sm:grid-cols-2" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="h-64 w-[82vw] max-w-[24rem] shrink-0 animate-pulse rounded-[24px] bg-white/70 sm:w-auto sm:max-w-none" />
      ))}
    </div>
  );
}

/** Apartado de reseñas reales de Google Maps. Sin clave o si falla, enlaza a la ficha de Google. */
export function Resenas() {
  const ref = useRef<HTMLElement>(null);
  const [estado, setEstado] = useState<Estado>({ tipo: "esperando" });

  // Solo se pide a Google cuando el apartado está cerca de verse.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!CLAVE_MAPS) {
      const id = requestAnimationFrame(() => setEstado({ tipo: "sin-datos" }));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setEstado({ tipo: "cargando" });
        pedirResenas()
          .then((ficha) => setEstado(ficha.resenas.length || ficha.nota ? { tipo: "listo", ficha } : { tipo: "sin-datos" }))
          .catch(() => setEstado({ tipo: "sin-datos" }));
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ficha = estado.tipo === "listo" ? estado.ficha : null;
  const urlGoogle = ficha?.url ?? CLINICA.mapsHref;

  return (
    <section ref={ref} id="opiniones" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-4">
          <h2 className="t-seccion max-w-[11ch]">Lo que dicen los pacientes</h2>
          {ficha?.nota ? (
            <div className="mt-8">
              <p className="flex items-end gap-3">
                <span className="text-[4.5rem] font-extrabold leading-none tracking-[-0.05em]">
                  {ficha.nota.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </span>
                <span className="pb-2">
                  <Estrellas nota={ficha.nota} tam="size-5" />
                  {ficha.total ? <span className="mt-1 block text-[0.9rem] text-sonda">{ficha.total} reseñas</span> : null}
                </span>
              </p>
            </div>
          ) : (
            <p className="mt-6 max-w-sm leading-relaxed text-placa/80">
              Opiniones reales de pacientes de la clínica, tal y como aparecen en Google Maps.
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={urlGoogle}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-placa px-5 py-3 font-semibold text-bata transition-colors hover:bg-placa-2"
            >
              Ver todas en Google Maps
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-8">
          {estado.tipo === "listo" && ficha && ficha.resenas.length > 0 ? (
            <>
              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
                {ficha.resenas.map((r, i) => (
                  <Tarjeta key={`${r.autor}-${i}`} r={r} />
                ))}
              </div>
              <p className="mt-5 text-[0.82rem] text-sonda">
                Reseñas de <span className="font-semibold text-placa">Google Maps</span>. Se muestran las que Google destaca como más relevantes.
              </p>
            </>
          ) : estado.tipo === "sin-datos" ? (
            <div className="rounded-[24px] bg-babero p-8">
              <p className="t-bloque max-w-md">Las opiniones de los pacientes están en Google Maps.</p>
              <p className="mt-2 max-w-md text-placa/75">Puedes leerlas o dejar la tuya en la ficha de la clínica.</p>
            </div>
          ) : (
            <Esqueleto />
          )}
        </div>
      </div>
    </section>
  );
}
