import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BandaCita, BotonesCita, CabeceraPagina } from "@/components/Pagina";
import { porSlug, TRATAMIENTOS } from "@/lib/tratamientos";

export function generateStaticParams() {
  return TRATAMIENTOS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/tratamientos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const t = porSlug(slug);
  if (!t) return {};
  return { title: t.nombre, description: `${t.resumen} En Zabalgana, Vitoria-Gasteiz.` };
}

/** Esqueleto mientras llega el tratamiento (la estructura común se puede precargar). */
function Esqueleto() {
  return (
    <main aria-busy="true" className="mx-auto max-w-[1280px] px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="h-4 w-40 rounded bg-babero" />
      <div className="mt-6 h-16 w-3/4 max-w-xl rounded-xl bg-babero" />
      <div className="mt-6 h-5 w-full max-w-2xl rounded bg-babero/70" />
      <div className="mt-3 h-5 w-2/3 max-w-xl rounded bg-babero/70" />
    </main>
  );
}

export default function PaginaTratamiento(props: PageProps<"/tratamientos/[slug]">) {
  return (
    <Suspense fallback={<Esqueleto />}>
      <Contenido params={props.params} />
    </Suspense>
  );
}

async function Contenido({ params }: { params: PageProps<"/tratamientos/[slug]">["params"] }) {
  const { slug } = await params;
  const t = porSlug(slug);
  if (!t) notFound();
  const relacionados = t.relacionados.map(porSlug).filter((r) => r !== undefined);

  return (
    <main>
      <CabeceraPagina miga={[{ href: "/tratamientos", texto: "Tratamientos" }]} titulo={t.nombre} entrada={t.resumen}>
        <div className="mt-8">
          <BotonesCita mensaje={t.mensaje} cta={t.slug} />
        </div>
      </CabeceraPagina>

      <section className="mx-auto grid max-w-[1280px] gap-14 px-4 pb-20 sm:px-8 sm:pb-24 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="t-bloque">Puede ser para ti si…</h2>
          <ul className="mt-5 space-y-3">
            {t.cuando.map((c) => (
              <li key={c} className="flex gap-3 text-[1.05rem]">
                <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-encia" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <h2 className="t-bloque">Cómo es el tratamiento</h2>
          <ol className="mt-6">
            {t.pasos.map((p, i) => (
              <li key={p.titulo} className="relative grid grid-cols-[2.75rem_1fr] pb-7 last:pb-0">
                {i < t.pasos.length - 1 && <span aria-hidden className="absolute bottom-0 left-[1.05rem] top-9 w-px bg-linea" />}
                <span className="grid size-9 place-items-center rounded-full bg-babero text-[0.9rem] font-bold tabular-nums">{i + 1}</span>
                <div className="pt-1">
                  <p className="font-bold">{p.titulo}</p>
                  <p className="mt-1 leading-relaxed text-placa/80">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-8 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 className="t-seccion lg:col-span-4">Preguntas frecuentes</h2>
          <div className="lg:col-span-8">
            {t.preguntas.map((q) => (
              <details key={q.p} className="group border-t border-linea py-5 last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.1rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {q.p}
                  <span aria-hidden className="relative size-4 shrink-0">
                    <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-placa" />
                    <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded bg-placa transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="mt-3 max-w-[42rem] leading-relaxed text-placa/80">{q.r}</p>
              </details>
            ))}
            <p className="mt-6 text-[0.88rem] text-sonda">Información orientativa. Cada caso se valora en consulta.</p>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-8">
          <h2 className="t-bloque">También te puede interesar</h2>
          <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
            {relacionados.map((r) => (
              <li key={r.slug} className="border-t border-linea">
                <Link href={`/tratamientos/${r.slug}`} className="group flex items-center justify-between gap-6 py-5">
                  <span>
                    <span className="block font-bold group-hover:text-encia-osc">{r.nombre}</span>
                    <span className="mt-1 block text-[0.95rem] text-sonda">{r.corto}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <BandaCita titulo="Pide cita para valorarlo" mensaje={t.mensaje} cta={`${t.slug}-final`} />
    </main>
  );
}
