import type { Metadata } from "next";
import { BandaCita, CabeceraPagina } from "@/components/Pagina";
import { CLINICA, EQUIPO } from "@/lib/clinica";

export const metadata: Metadata = {
  title: "Equipo",
  description: "La Dra. Yolanda Vuelta Calzada y su consulta dental en Zabalgana, Vitoria-Gasteiz.",
};

const COMO = [
  { titulo: "Te escuchamos", texto: "Nos cuentas qué te pasa y qué te preocupa antes de mirar nada." },
  { titulo: "Exploramos", texto: "Revisamos la boca y, si hace falta, hacemos pruebas de imagen." },
  { titulo: "Te explicamos las opciones", texto: "Con palabras claras, qué recomendamos y por qué, antes de empezar." },
  { titulo: "Hacemos seguimiento", texto: "Revisiones para comprobar que todo va bien después del tratamiento." },
];

const CONSULTA = [
  ["Dónde", `${CLINICA.direccion}, barrio de ${CLINICA.barrio}`],
  ["Acceso", "Entrada adaptada para silla de ruedas y aseo para pacientes"],
  ["Pago", "Atención privada. No trabajamos con aseguradoras"],
  ["PADI", "Consulta concertada con Osakidetza para niños de 7 a 15 años"],
  ["Registro sanitario", CLINICA.registroSanitario],
];

export default function Equipo() {
  return (
    <main>
      <CabeceraPagina
        titulo="Quién te atiende"
        entrada="Una consulta de barrio en Zabalgana con más de veinte años de experiencia."
      />

      <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-8 sm:pb-28">
        {EQUIPO.map((p) => (
          <article key={p.nombre} className="grid gap-8 rounded-[32px] bg-white p-6 shadow-[0_1px_0_var(--color-linea),0_30px_60px_-40px_rgb(28_43_58/0.4)] sm:p-10 lg:grid-cols-12 lg:gap-12">
            {/* Hueco para la foto de la doctora. Mientras no haya foto real, sus iniciales. */}
            <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[24px] bg-babero sm:aspect-[4/3] lg:col-span-4 lg:aspect-[4/5]">
              <svg viewBox="0 0 200 250" className="absolute inset-0 size-full opacity-60" aria-hidden>
                <path d="M30 70 C30 190 170 190 170 70" fill="none" stroke="#d5dde1" strokeWidth="10" strokeLinecap="round" strokeDasharray="14 12" />
              </svg>
              <span className="relative text-[4rem] font-extrabold sm:text-[5rem] tracking-[-0.05em] text-placa/80">{p.iniciales}</span>
            </div>
            <div className="flex flex-col lg:col-span-8 lg:py-4">
              <p className="text-[0.95rem] font-semibold text-encia-osc">{p.papel}</p>
              <h2 className="t-seccion mt-3">{p.nombre}</h2>
              <p className="mt-6 max-w-[38rem] text-[1.1rem] leading-relaxed text-placa/85">{p.texto}</p>
              <dl className="mt-8 grid max-w-[38rem] grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
                <div>
                  <dt className="text-[0.88rem] text-sonda">Experiencia</dt>
                  <dd className="mt-1 text-[1.6rem] font-extrabold tracking-[-0.03em]">+{CLINICA.anos} años</dd>
                </div>
                <div>
                  <dt className="text-[0.88rem] text-sonda">Colegiada</dt>
                  <dd className="mt-1 text-[1.6rem] font-extrabold tracking-[-0.03em] tabular-nums">{p.colegiada}</dd>
                </div>
                <div>
                  <dt className="text-[0.88rem] text-sonda">Consulta</dt>
                  <dd className="mt-1 text-[1.6rem] font-extrabold tracking-[-0.03em]">Zabalgana</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 className="t-seccion lg:col-span-4">Cómo trabajamos</h2>
          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {COMO.map((c, i) => (
              <li key={c.titulo} className="border-t-2 border-placa pt-5">
                <p className="text-[0.9rem] font-bold tabular-nums text-encia-osc">Paso {i + 1}</p>
                <p className="t-bloque mt-2">{c.titulo}</p>
                <p className="mt-2 leading-relaxed text-placa/80">{c.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="t-seccion">La consulta</h2>
          </div>
          <div className="lg:col-span-8">
            <dl>
              {CONSULTA.map(([k, v]) => (
                <div key={k} className="grid gap-1 border-t border-linea py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-sonda">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <figure className="mt-12 max-w-[34rem]">
              <blockquote className="text-[1.45rem] font-semibold leading-snug tracking-[-0.015em]">
                «Muy buena. Me ha realizado empastes, varios implantes y revisiones generales.»
              </blockquote>
              <figcaption className="mt-3 text-sonda">Paciente de la clínica, en Doctoralia</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <BandaCita titulo="Pide cita con la doctora" cta="equipo" />
    </main>
  );
}
