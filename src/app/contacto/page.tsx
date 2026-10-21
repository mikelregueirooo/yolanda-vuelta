import type { Metadata } from "next";
import { Horario } from "@/components/Horario";

export const metadata: Metadata = {
  title: "Horario y contacto",
  description: "Horario, teléfono, WhatsApp y dirección de la Clínica Dental Yolanda Vuelta, Paseo Juan Pablo II 28, Vitoria-Gasteiz.",
};

export default function Contacto() {
  return (
    <main className="pt-12 sm:pt-16">
      <Horario principal />
    </main>
  );
}
