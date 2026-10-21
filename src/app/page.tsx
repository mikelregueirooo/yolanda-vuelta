import { FichaDental } from "@/components/FichaDental";
import { Horario } from "@/components/Horario";
import { Portada } from "@/components/Portada";
import { Clinica, Padi, QueTePasa } from "@/components/Secciones";

export default function Home() {
  return (
    <main>
      <Portada />
      <QueTePasa />
      <FichaDental />
      <Padi />
      <Clinica />
      <Horario />
    </main>
  );
}
