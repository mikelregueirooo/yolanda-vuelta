import { FichaDental } from "@/components/FichaDental";
import { Portada } from "@/components/Portada";
import { Cierre, QueTePasa } from "@/components/Secciones";

export default function Home() {
  return (
    <main>
      <Portada />
      <QueTePasa />
      <FichaDental />
      <Cierre />
    </main>
  );
}
