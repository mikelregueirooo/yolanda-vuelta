import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { CLINICA } from "@/lib/clinica";
import { Nav } from "@/components/Nav";
import { Pie } from "@/components/Secciones";
import { ContactoRapido } from "@/components/WhatsApp";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Clínica Dental Yolanda Vuelta, dentista en Zabalgana (Vitoria-Gasteiz)",
    template: "%s | Clínica Dental Yolanda Vuelta",
  },
  description:
    "Implantes, ortodoncia invisible, brackets y estética dental en Zabalgana (Vitoria-Gasteiz). Más de 20 años de experiencia y PADI de Osakidetza. Llama al 945 140 913.",
  keywords: ["dentista Vitoria", "dentista Zabalgana", "implantes Vitoria", "ortodoncia invisible Vitoria", "PADI Vitoria"],
  openGraph: {
    title: "Clínica Dental Yolanda Vuelta",
    description: "Tu dentista en Zabalgana, Vitoria-Gasteiz. Llama al 945 140 913.",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f9f7",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINICA.nombre,
  telephone: "+34945140913",
  email: CLINICA.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINICA.direccion,
    postalCode: CLINICA.cp,
    addressLocality: CLINICA.ciudad,
    addressRegion: "Álava",
    addressCountry: "ES",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday"], opens: "09:30", closes: "13:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday"], opens: "16:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Thursday"], opens: "09:30", closes: "12:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Thursday"], opens: "15:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:30", closes: "17:30" },
  ],
  medicalSpecialty: "Dentistry",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${schibsted.variable} antialiased`} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Nav />
        {children}
        <Pie />
        <ContactoRapido />
      </body>
    </html>
  );
}
