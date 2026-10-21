"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { CLINICA, NECESIDADES } from "@/lib/clinica";
import { ENLACES, Marca } from "./Nav";
import { Llamar } from "./ui";

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

const INCLUYE = ["Una revisión al año", "Selladores de fisuras", "Empastes", "Limpiezas", "Extracciones", "Endodoncias en dientes definitivos"];

export function Padi() {
  return (
    <section id="padi" className="px-3 sm:px-6">
      <div className="mx-auto max-w-[1320px] rounded-[36px] bg-babero px-5 py-16 sm:px-10 sm:py-20 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <h2 className="t-seccion max-w-[16ch]">Si tu hijo tiene entre 7 y 15 años, su dentista lo paga Osakidetza</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-placa/80">
              Somos consulta concertada del PADI, el programa de atención dental infantil del País Vasco. Solo
              necesita tener la tarjeta sanitaria de Osakidetza.
            </p>
            <Llamar texto="Pedir cita del PADI" cta="llamar-padi" className="mt-8" />
          </div>
          <div className="grid content-start gap-8 sm:grid-cols-2 lg:col-span-6">
            <div>
              <h3 className="font-bold">Qué incluye</h3>
              <ul className="mt-3 space-y-2">
                {INCLUYE.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-placa" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold">Qué no incluye</h3>
                <p className="mt-3">La ortodoncia. Si la necesita, te explicamos las opciones en consulta.</p>
              </div>
              <div>
                <h3 className="font-bold">Qué traer</h3>
                <p className="mt-3">La tarjeta sanitaria del niño o la niña.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FICHA = [
  ["Dentista", `${CLINICA.doctora}, colegiada ${CLINICA.colegiada}`],
  ["Dónde", `${CLINICA.direccion}, ${CLINICA.barrio} (${CLINICA.cp} ${CLINICA.ciudad})`],
  ["Acceso", "Entrada adaptada para silla de ruedas y aseo para pacientes"],
  ["Pago", "Atención privada. No trabajamos con aseguradoras"],
  ["Registro sanitario", CLINICA.registroSanitario],
];

export function Clinica() {
  return (
    <section id="clinica" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="t-seccion max-w-[14ch]">Más de veinte años en Zabalgana</h2>
          <p className="mt-6 max-w-[38rem] text-[1.12rem] leading-relaxed text-placa/85">
            La clínica es de la {CLINICA.doctora}. Desde el Paseo Juan Pablo II atiende revisiones, implantes,
            ortodoncia y estética dental, y tiene consulta de tarde hasta las ocho de lunes a jueves.
          </p>
          <dl className="mt-10 max-w-[40rem]">
            {FICHA.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-t border-linea py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-sonda">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="self-center lg:col-span-4 lg:col-start-9">
          <svg viewBox="0 0 40 30" className="h-8 w-auto fill-encia" aria-hidden>
            <path d="M0 30V17C0 7 6 1 16 0v6c-5 1-8 4-8 10h8v14H0Zm24 0V17c0-10 6-16 16-17v6c-5 1-8 4-8 10h8v14H24Z" />
          </svg>
          <blockquote className="mt-5 text-[1.5rem] font-semibold leading-snug tracking-[-0.015em]">
            Muy buena. Me ha realizado empastes, varios implantes y revisiones generales.
          </blockquote>
          <figcaption className="mt-4 text-sonda">Paciente de la clínica, en Doctoralia</figcaption>
          <Link
            href="/equipo"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-babero px-5 py-3 font-semibold transition-colors hover:bg-linea"
          >
            Conoce a la doctora
          </Link>
        </figure>
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
