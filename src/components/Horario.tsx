"use client";

import { useEffect, useState } from "react";
import { ahoraEnVitoria, CLINICA, DIAS, DIAS_CORTOS, fmt, HORARIO } from "@/lib/clinica";
import { BotonesCita } from "./Pagina";
import { Estado } from "./ui";

const INICIO = 9 * 60;
const FIN = 20 * 60 + 30;
const pos = (m: number) => ((m - INICIO) / (FIN - INICIO)) * 100;

function useAhora() {
  const [ahora, setAhora] = useState<{ dia: number; minuto: number } | null>(null);
  useEffect(() => {
    const tick = () => setAhora(ahoraEnVitoria());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return ahora;
}

/** La semana como una agenda: los tramos abiertos y una marca en la hora actual. */
function Semana() {
  const ahora = useAhora();
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-[0_1px_0_var(--color-linea)] sm:p-8">
      <div className="flex gap-4 pb-3">
        <span className="w-10 shrink-0 sm:w-24" />
        <div className="relative h-4 flex-1 text-[0.75rem] tabular-nums text-sonda">
          {[9, 12, 15, 18].map((h) => (
            <span key={h} className="absolute -translate-x-1/2" style={{ left: `${pos(h * 60)}%` }}>
              {h}:00
            </span>
          ))}
        </div>
      </div>
      <ul className="space-y-1.5">
        {HORARIO.map((tramos, d) => {
          const hoy = ahora?.dia === d;
          return (
            <li key={d} className={`flex flex-wrap items-center gap-x-4 rounded-xl py-2 ${hoy ? "bg-babero/70" : ""}`}>
              <span className={`w-10 shrink-0 pl-2 text-[0.92rem] sm:w-24 ${hoy ? "font-bold" : "text-sonda"}`}>
                <span className="sm:hidden">{DIAS_CORTOS[d]}</span>
                <span className="hidden sm:inline">{hoy ? "Hoy" : DIAS[d]}</span>
              </span>
              <div className="relative h-8 flex-1">
                {tramos.length === 0 && <span className="absolute inset-y-0 left-0 flex items-center text-[0.88rem] text-sonda">Cerrado</span>}
                {tramos.map(([a, b], i) => (
                  <div
                    key={i}
                    className={`absolute inset-y-1 flex items-center justify-center rounded-md text-[0.75rem] font-semibold tabular-nums ${
                      hoy ? "bg-placa text-bata" : "bg-babero text-placa"
                    }`}
                    style={{ left: `${pos(a)}%`, width: `${pos(b) - pos(a)}%` }}
                  >
                    <span className="hidden truncate px-1 md:inline">
                      {fmt(a)} a {fmt(b)}
                    </span>
                  </div>
                ))}
                {hoy && ahora && ahora.minuto >= INICIO && ahora.minuto <= FIN && (
                  <div className="absolute -inset-y-1 z-10 w-0.5 rounded-full bg-encia" style={{ left: `${pos(ahora.minuto)}%` }} aria-hidden />
                )}
              </div>
              {tramos.length > 0 && (
                <span className="basis-full pl-[3.5rem] pt-1 text-[0.8rem] tabular-nums text-sonda md:hidden">
                  {tramos.map(([a, b]) => `${fmt(a)} a ${fmt(b)}`).join(" y ")}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 flex items-center gap-2 text-[0.82rem] text-sonda">
        <span aria-hidden className="inline-block h-3.5 w-0.5 rounded-full bg-encia" /> Hora actual en Vitoria-Gasteiz
      </p>
    </div>
  );
}

export function Horario({ principal = false }: { principal?: boolean }) {
  const Titulo = principal ? "h1" : "h2";
  return (
    <section id="horario" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Titulo className={`${principal ? "t-portada" : "t-seccion"} max-w-[13ch]`}>Cuándo llamarnos y cómo llegar</Titulo>
          <Estado className="mt-6" />
          <p className="mt-6 max-w-md leading-relaxed text-placa/85">
            Llama al fijo en horario de consulta o escríbenos por WhatsApp al móvil de la clínica.
          </p>
          <div className="mt-8">
            <BotonesCita cta="horario" />
          </div>
          <p className="mt-5 pl-2 text-[0.95rem]">
            Correo:{" "}
            <a href={`mailto:${CLINICA.email}`} className="font-semibold underline decoration-linea decoration-2 underline-offset-4 hover:decoration-placa">
              {CLINICA.email}
            </a>
          </p>
          <address className="mt-12 not-italic leading-relaxed">
            <span className="font-bold">{CLINICA.direccion}</span>
            <br />
            {CLINICA.cp} {CLINICA.ciudad}, barrio de {CLINICA.barrio}
            <br />
            <a
              href={CLINICA.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-semibold text-encia-osc underline decoration-encia/40 decoration-2 underline-offset-4 hover:decoration-encia-osc"
            >
              Abrir en Google Maps
            </a>
          </address>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <Semana />
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-babero">
            <iframe
              title="Mapa de la Clínica Dental Yolanda Vuelta"
              src="https://maps.google.com/maps?q=Paseo%20Juan%20Pablo%20II%2028%2C%2001015%20Vitoria-Gasteiz&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 saturate-[0.35]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
