"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { CLINICA, NECESIDADES } from "@/lib/clinica";
import { ENLACES, Marca } from "./Nav";
import { BotonesCita } from "./Pagina";
import { Estado, HoyHorario } from "./ui";

/** Tratamientos ordenados por lo que le pasa al paciente. */
export function QueTePasa() {
  return (
    <section id="que-te-pasa" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="t-seccion max-w-[12ch]">Cuéntanos qué te pasa</h2>
            <p className="mt-5 max-w-sm leading-relaxed text-sonda">
              No hace falta saber cómo se llama el tratamiento. Estas son las consultas más habituales y lo que hacemos
              en cada caso.
            </p>
            <Link
              href="/tratamientos"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-babero px-5 py-3 font-semibold transition-colors hover:bg-linea"
            >
              Ver todos los tratamientos
            </Link>
          </div>
        </div>
        <ul className="lg:col-span-8">
          {NECESIDADES.map((n) => (
            <li key={n.id} className="grid gap-3 border-t border-linea py-8 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_1.15fr] sm:gap-10">
              <h3 className="t-bloque">{n.titulo}</h3>
              <div>
                <p className="leading-relaxed text-placa/85">{n.texto}</p>
                <p className="mt-3 text-[0.9rem] text-sonda">{n.tratamientos.join(", ")}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Link
                    href={`/tratamientos/${n.slug}`}
                    className="inline-flex items-center gap-2 text-[0.95rem] font-semibold underline decoration-linea decoration-2 underline-offset-4 transition-colors hover:decoration-placa"
                  >
                    Cómo lo tratamos
                  </Link>
                  <a
                    href={CLINICA.telefonoHref}
                    data-cta={`llamar-${n.id}`}
                    className="inline-flex items-center gap-2 text-[0.95rem] font-semibold text-encia-osc underline decoration-encia/40 decoration-2 underline-offset-4 transition-colors hover:decoration-encia-osc"
                  >
                    <Phone className="size-4" strokeWidth={2.2} />
                    Llamar para esto
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="bg-placa pb-28 pt-16 text-bata/70 md:pb-12">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <Marca claro />
          <p className="mt-5 max-w-xs text-[0.92rem]">Implantes, ortodoncia y estética dental en Zabalgana, Vitoria-Gasteiz.</p>
        </div>
        <nav className="text-[0.92rem] leading-relaxed md:col-span-2" aria-label="Pie">
          <p className="mb-2 font-semibold text-bata">Páginas</p>
          <Link href="/" className="block hover:text-bata">
            Inicio
          </Link>
          {ENLACES.map((e) => (
            <Link key={e.href} href={e.href} className="block hover:text-bata">
              {e.texto}
            </Link>
          ))}
        </nav>
        <div className="text-[0.92rem] leading-relaxed md:col-span-2">
          <p className="mb-2 font-semibold text-bata">Teléfonos</p>
          <a href={CLINICA.telefonoHref} className="block tabular-nums hover:text-bata">
            {CLINICA.telefono}
          </a>
          <a href={CLINICA.movilHref} className="block tabular-nums hover:text-bata">
            {CLINICA.movil}
          </a>
          <a href={`mailto:${CLINICA.email}`} className="mt-2 block hover:text-bata">
            {CLINICA.email}
          </a>
        </div>
        <div className="text-[0.92rem] leading-relaxed md:col-span-4">
          <p className="mb-2 font-semibold text-bata">Dirección</p>
          <p>
            {CLINICA.direccion}
            <br />
            {CLINICA.cp} {CLINICA.ciudad} (Álava)
          </p>
          <p className="mt-4 text-[0.8rem] text-bata/45">
            Registro sanitario {CLINICA.registroSanitario}. {CLINICA.doctora}, colegiada {CLINICA.colegiada}.
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Cierre de la portada: si estamos abiertos, el horario de hoy, dónde estamos y cómo pedir cita. */
export function Cierre() {
  return (
    <section id="cita" className="px-3 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto grid max-w-[1320px] gap-10 rounded-[36px] bg-babero px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-14">
        <div className="lg:col-span-6">
          <h2 className="t-seccion max-w-[12ch]">Pide cita en Zabalgana</h2>
          <Estado className="mt-6" />
          <HoyHorario />
          <address className="mt-6 not-italic leading-relaxed">
            {CLINICA.direccion}, {CLINICA.cp} {CLINICA.ciudad}
            <br />
            <a
              href={CLINICA.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-encia-osc underline decoration-encia/40 decoration-2 underline-offset-4 hover:decoration-encia-osc"
            >
              Cómo llegar
            </a>
          </address>
          <div className="mt-8">
            <BotonesCita cta="portada-cierre" />
          </div>
        </div>
        <ul className="self-end lg:col-span-5 lg:col-start-8">
          {[
            { href: "/equipo", titulo: "La doctora", texto: `${CLINICA.doctora}, más de ${CLINICA.anos} años en Zabalgana.` },
            { href: "/tratamientos/infantil", titulo: "PADI para niños", texto: "De 7 a 15 años, la atención dental básica la paga Osakidetza." },
            { href: "/contacto", titulo: "Horario completo", texto: "De lunes a viernes, con tarde hasta las 20:00 de lunes a jueves." },
          ].map((e) => (
            <li key={e.href} className="border-t border-placa/15 first:border-t-0">
              <Link href={e.href} className="group block py-5">
                <span className="t-bloque block transition-colors group-hover:text-encia-osc">{e.titulo}</span>
                <span className="mt-1 block text-placa/75">{e.texto}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
