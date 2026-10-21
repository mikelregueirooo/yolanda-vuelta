import Link from "next/link";
import type { ReactNode } from "react";
import { CLINICA, waHref } from "@/lib/clinica";
import { Llamar } from "./ui";
import { IconoWhatsApp } from "./WhatsApp";

/** Cabecera de las páginas interiores: miga de pan, título y entrada. */
export function CabeceraPagina({
  miga,
  titulo,
  entrada,
  children,
}: {
  miga?: { href: string; texto: string }[];
  titulo: string;
  entrada?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-[1280px] px-4 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-36">
      {miga && (
        <nav aria-label="Estás en" className="mb-6 text-[0.9rem] text-sonda">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-placa">
                Inicio
              </Link>
            </li>
            {miga.map((m) => (
              <li key={m.href} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href={m.href} className="hover:text-placa">
                  {m.texto}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="t-portada max-w-[16ch]">{titulo}</h1>
      {entrada && <p className="mt-6 max-w-[40rem] text-[1.12rem] leading-relaxed text-placa/80">{entrada}</p>}
      {children}
    </header>
  );
}

/** Los dos caminos para pedir cita: llamar o escribir. */
export function BotonesCita({ mensaje, cta }: { mensaje?: string; cta: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Llamar cta={`llamar-${cta}`} />
      <a
        href={waHref(mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        data-cta={`whatsapp-${cta}`}
        className="inline-flex min-h-14 items-center gap-3 rounded-full bg-[#25d366]/15 py-2 pl-2 pr-6 font-semibold text-[#0b5132] transition-colors hover:bg-[#25d366]/25"
      >
        <span className="grid size-10 place-items-center rounded-full bg-[#25d366] text-white">
          <IconoWhatsApp className="size-5" />
        </span>
        <span className="leading-tight">
          <span className="block">Escribir por WhatsApp</span>
          <span className="block text-[0.85rem] font-medium tabular-nums opacity-70">{CLINICA.movil}</span>
        </span>
      </a>
    </div>
  );
}

/** Banda final de llamada a la acción, igual en todas las páginas interiores. */
export function BandaCita({ titulo = "¿Hablamos?", mensaje, cta }: { titulo?: string; mensaje?: string; cta: string }) {
  return (
    <section className="px-3 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8 rounded-[36px] bg-babero px-5 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:px-14">
        <div>
          <h2 className="t-seccion max-w-[14ch]">{titulo}</h2>
          <p className="mt-4 max-w-md text-placa/80">
            Llama en horario de consulta o escríbenos por WhatsApp y te damos cita en {CLINICA.direccion}.
          </p>
        </div>
        <BotonesCita mensaje={mensaje} cta={cta} />
      </div>
    </section>
  );
}
