import type { Metadata } from "next";
import Link from "next/link";
import { BandaCita, CabeceraPagina } from "@/components/Pagina";
import { TRATAMIENTOS } from "@/lib/tratamientos";

export const metadata: Metadata = {
  title: "Tratamientos",
  description:
    "Implantes, ortodoncia, estética, endodoncia, encías, cirugía oral, prótesis, revisiones y PADI infantil en Zabalgana, Vitoria-Gasteiz.",
};

export default function Tratamientos() {
  return (
    <main>
      <CabeceraPagina
        titulo="Tratamientos"
        entrada="Todo lo que hacemos en la consulta, explicado sin tecnicismos. Si no sabes qué necesitas, llámanos y te orientamos."
      />
      <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-8 sm:pb-28">
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {TRATAMIENTOS.map((t) => (
            <li key={t.slug} className="border-t border-linea">
              <Link href={`/tratamientos/${t.slug}`} className="group flex h-full flex-col py-7">
                <h2 className="t-bloque transition-colors group-hover:text-encia-osc">{t.nombre}</h2>
                <p className="mt-2 leading-relaxed text-sonda">{t.corto}</p>
                <span className="mt-4 text-[0.92rem] font-semibold underline decoration-linea decoration-2 underline-offset-4 transition-colors group-hover:decoration-encia-osc">
                  Ver tratamiento
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-xl text-sonda">
          ¿No sabes por dónde empezar?{" "}
          <Link href="/#ficha" className="font-semibold text-placa underline decoration-linea decoration-2 underline-offset-4 hover:decoration-placa">
            Señala en la ficha dental el diente que te molesta
          </Link>{" "}
          y te contamos qué suele ser.
        </p>
      </section>
      <BandaCita titulo="Pide cita para valorarlo" cta="tratamientos" />
    </main>
  );
}
