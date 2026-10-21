import { FichaDental } from "@/components/FichaDental";
import { Portada } from "@/components/Portada";
import { Resenas } from "@/components/Resenas";
import { Cierre } from "@/components/Secciones";

export default function Home() {
  return (
    <main>
      <Portada />
      <FichaDental />
      <Resenas />
      <Cierre />
    </main>
  );
}
