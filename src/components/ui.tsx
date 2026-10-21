"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { ahoraEnVitoria, CLINICA, estadoClinica, fmt, HORARIO, textoEstado, type Estado as TEstado } from "@/lib/clinica";

/** Estado abierto/cerrado en hora de Vitoria. null hasta que monta en el cliente. */
export function useEstado() {
  const [estado, setEstado] = useState<TEstado | null>(null);
  useEffect(() => {
    const tick = () => {
      const { dia, minuto } = ahoraEnVitoria();
      setEstado(estadoClinica(dia, minuto));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return estado;
}

export function Estado({ className = "", claro = false }: { className?: string; claro?: boolean }) {
  const estado = useEstado();
  return (
    <p className={`flex min-h-5 items-center gap-2 text-[0.92rem] ${claro ? "text-bata/70" : "text-sonda"} ${className}`}>
      <span
        aria-hidden
        className={`size-2 rounded-full ${estado?.abierto ? "bg-[#3f9b72]" : estado ? "bg-encia" : "bg-linea"}`}
      />
      {estado ? textoEstado(estado) : null}
    </p>
  );
}

/** El horario de hoy en una línea, en hora de Vitoria. */
export function HoyHorario({ className = "" }: { className?: string }) {
  const [dia, setDia] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setDia(ahoraEnVitoria().dia);
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  if (dia === null) return <p className={`mt-2 min-h-6 ${className}`} />;
  const tramos = HORARIO[dia];
  return (
    <p className={`mt-2 min-h-6 font-semibold ${className}`}>
      Hoy: {tramos.length ? tramos.map(([a, b]) => `${fmt(a)} a ${fmt(b)}`).join(" y ") : "cerrado"}
    </p>
  );
}

/** El botón de llamar. Mismo nombre y número en toda la página. */
export function Llamar({
  texto = "Llamar y pedir cita",
  cta = "llamar",
  variante = "solido",
  className = "",
}: {
  texto?: string;
  cta?: string;
  variante?: "solido" | "claro";
  className?: string;
}) {
  const solido = variante === "solido";
  return (
    <a
      href={CLINICA.telefonoHref}
      data-cta={cta}
      className={`group inline-flex min-h-14 items-center gap-4 rounded-full py-2 pl-2 pr-6 font-semibold transition-colors duration-200 ${
        solido ? "bg-placa text-bata hover:bg-placa-2" : "bg-bata text-placa hover:bg-white"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`grid size-10 place-items-center rounded-full transition-transform duration-300 ease-[var(--ease-salida)] group-hover:-rotate-12 ${
          solido ? "bg-encia text-white" : "bg-placa text-bata"
        }`}
      >
        <Phone className="size-[18px]" strokeWidth={2.2} />
      </span>
      <span className="leading-tight">
        <span className="block">{texto}</span>
        <span className={`block text-[0.85rem] font-medium tabular-nums ${solido ? "text-bata/65" : "text-sonda"}`}>
          {CLINICA.telefono}
        </span>
      </span>
    </a>
  );
}
