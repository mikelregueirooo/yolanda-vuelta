"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Phone } from "lucide-react";
import { CLINICA, waHref } from "@/lib/clinica";
import { IconoWhatsApp } from "./WhatsApp";

export const ENLACES = [
  { href: "/tratamientos", texto: "Tratamientos" },
  { href: "/equipo", texto: "Equipo" },
  { href: "/tratamientos/infantil", texto: "PADI" },
  { href: "/contacto", texto: "Horario y contacto" },
];

/** Marca: una arcada mínima y el nombre. */
export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Clínica Dental Yolanda Vuelta, inicio">
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <path
          d="M5 9 C5 24 27 24 27 9"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="3.2 2.6"
          className={claro ? "stroke-bata" : "stroke-placa"}
        />
        <circle cx="16" cy="20.5" r="2.6" className="fill-encia" />
      </svg>
      <span className="leading-none">
        <span className={`block text-[1.08rem] font-extrabold tracking-[-0.02em] ${claro ? "text-bata" : "text-placa"}`}>
          Yolanda Vuelta
        </span>
        <span className={`mt-0.5 block text-[0.78rem] ${claro ? "text-bata/60" : "text-sonda"}`}>Clínica dental</span>
      </span>
    </Link>
  );
}

function Enlaces({ onNavegar, movil = false }: { onNavegar?: () => void; movil?: boolean }) {
  const ruta = usePathname();
  const activo = (href: string) => (href === "/tratamientos" ? ruta === href || (ruta.startsWith("/tratamientos/") && !ruta.endsWith("/infantil")) : ruta === href);
  if (movil) {
    return (
      <>
        {ENLACES.map((e) => (
          <li key={e.href}>
            <Link
              href={e.href}
              onClick={onNavegar}
              aria-current={activo(e.href) ? "page" : undefined}
              className={`block border-b border-linea py-4 text-[1.7rem] font-extrabold tracking-[-0.03em] ${activo(e.href) ? "text-encia-osc" : ""}`}
            >
              {e.texto}
            </Link>
          </li>
        ))}
      </>
    );
  }
  return (
    <>
      {ENLACES.map((e) => (
        <li key={e.href}>
          <Link
            href={e.href}
            aria-current={activo(e.href) ? "page" : undefined}
            className={`rounded-full px-3.5 py-2 text-[0.93rem] font-medium transition-colors hover:bg-babero hover:text-placa ${
              activo(e.href) ? "bg-babero text-placa" : "text-placa/75"
            }`}
          >
            {e.texto}
          </Link>
        </li>
      ))}
    </>
  );
}

function EnlacesSinRuta() {
  return (
    <>
      {ENLACES.map((e) => (
        <li key={e.href}>
          <Link href={e.href} className="rounded-full px-3.5 py-2 text-[0.93rem] font-medium text-placa/75">
            {e.texto}
          </Link>
        </li>
      ))}
    </>
  );
}

export function Nav() {
  const { scrollY } = useScroll();
  const [fondo, setFondo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setFondo(y > 16));

  // Bloquea el scroll de la página con el menú abierto
  useEffect(() => {
    document.documentElement.style.overflow = abierto ? "hidden" : "";
  }, [abierto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 transition-[background-color,box-shadow] duration-300 ${abierto ? "z-[70]" : "z-40"} ${
        fondo || abierto ? "bg-bata/92 shadow-[0_1px_0_var(--color-linea)] backdrop-blur-md" : ""
      }`}
    >
      <nav className="mx-auto flex h-[4.25rem] max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-8">
        <Marca />
        <ul className="hidden items-center gap-1 lg:flex">
          <Suspense fallback={<EnlacesSinRuta />}>
            <Enlaces />
          </Suspense>
        </ul>
        <div className="flex items-center gap-2">
          <a
            href={CLINICA.telefonoHref}
            data-cta="llamar-nav"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-placa pl-1.5 pr-1.5 text-[0.9rem] font-semibold tabular-nums text-bata transition-colors hover:bg-placa-2 sm:pr-4"
            aria-label={`Llamar al ${CLINICA.telefono}`}
          >
            <span className="grid size-7 place-items-center rounded-full bg-encia text-white">
              <Phone className="size-3.5" strokeWidth={2.4} />
            </span>
            <span className="hidden sm:inline">{CLINICA.telefono}</span>
          </a>
          <button
            onClick={() => setAbierto((v) => !v)}
            className="grid size-10 place-items-center rounded-full ring-1 ring-linea lg:hidden"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 top-0 h-0.5 w-4 rounded bg-placa transition-transform duration-300 ${abierto ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-4 rounded bg-placa transition-transform duration-300 ${abierto ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-[calc(100svh-4.25rem)] overflow-y-auto bg-bata px-4 pb-10 pt-2 sm:px-8 lg:hidden"
          >
            <ul>
              <li>
                <Link href="/" onClick={() => setAbierto(false)} className="block border-b border-linea py-4 text-[1.7rem] font-extrabold tracking-[-0.03em]">
                  Inicio
                </Link>
              </li>
              <Suspense fallback={null}>
                <Enlaces movil onNavegar={() => setAbierto(false)} />
              </Suspense>
            </ul>
            <div className="mt-8 grid gap-3">
              <a href={CLINICA.telefonoHref} data-cta="llamar-menu" className="flex items-center justify-between rounded-2xl bg-placa px-5 py-4 font-semibold text-bata">
                Llamar
                <span className="tabular-nums text-bata/70">{CLINICA.telefono}</span>
              </a>
              <a
                href={waHref()}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="whatsapp-menu"
                className="flex items-center justify-between rounded-2xl bg-[#25d366] px-5 py-4 font-semibold text-[#0b3d22]"
              >
                <span className="flex items-center gap-2">
                  <IconoWhatsApp className="size-5" /> Escribir por WhatsApp
                </span>
              </a>
            </div>
            <p className="mt-6 text-[0.9rem] text-sonda">
              {CLINICA.direccion}, {CLINICA.cp} {CLINICA.ciudad}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
