"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Phone, Send, X } from "lucide-react";
import { CLINICA, waHref } from "@/lib/clinica";

export function IconoWhatsApp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.24 8.24 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

const RAPIDOS = [
  "Hola, quería pedir cita.",
  "Hola, tengo dolor de muelas.",
  "Hola, quería información sobre el PADI.",
  "Hola, quería pedir presupuesto de un tratamiento.",
];

function Panel({ onCerrar }: { onCerrar: () => void }) {
  const [texto, setTexto] = useState("");
  const campo = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onCerrar]);

  return (
    <motion.div
      role="dialog"
      aria-label="Escribir por WhatsApp"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed inset-x-3 bottom-3 z-[60] origin-bottom-right overflow-hidden rounded-[26px] bg-white shadow-[0_30px_80px_-20px_rgb(28_43_58/0.45)] ring-1 ring-linea sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[23rem]"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-start justify-between gap-3 bg-[#075e54] px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white/15">
            <IconoWhatsApp className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-bold">Clínica Yolanda Vuelta</p>
            <p className="text-[0.82rem] text-white/75">WhatsApp {CLINICA.movil}</p>
          </div>
        </div>
        <button onClick={onCerrar} className="grid size-8 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar">
          <X className="size-4" />
        </button>
      </div>
      <div className="bg-[#efeae2] px-4 py-4">
        <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-[0.93rem] shadow-sm">
          Hola. Elige un mensaje o escribe el tuyo y se abrirá WhatsApp para enviárnoslo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {RAPIDOS.map((r) => (
            <a
              key={r}
              href={waHref(r)}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="whatsapp-rapido"
              className="rounded-full bg-white px-3 py-1.5 text-[0.85rem] font-medium text-[#075e54] ring-1 ring-[#075e54]/15 transition-colors hover:bg-[#d9fdd3]"
            >
              {r.replace("Hola, ", "").replace(/\.$/, "").replace(/^\w/, (c) => c.toUpperCase())}
            </a>
          ))}
        </div>
      </div>
      <form
        className="flex items-end gap-2 border-t border-linea bg-white p-3"
        onSubmit={(e) => {
          e.preventDefault();
          window.open(waHref(texto.trim() || RAPIDOS[0]), "_blank", "noopener,noreferrer");
        }}
      >
        <label htmlFor="wa-texto" className="sr-only">
          Tu mensaje
        </label>
        <textarea
          id="wa-texto"
          ref={campo}
          rows={1}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu mensaje"
          className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl bg-bata px-4 py-2.5 text-[0.95rem] outline-none focus:ring-2 focus:ring-[#25d366]"
        />
        <button type="submit" className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25d366] text-[#0b3d22]" aria-label="Abrir WhatsApp con el mensaje">
          <Send className="size-[18px]" />
        </button>
      </form>
      <p className="bg-white px-4 pb-3 text-[0.75rem] text-sonda">
        ¿Prefieres hablar?{" "}
        <a href={CLINICA.telefonoHref} className="font-semibold text-placa underline underline-offset-2">
          Llama al {CLINICA.telefono}
        </a>
      </p>
    </motion.div>
  );
}

/**
 * Contacto rápido: burbuja de WhatsApp en escritorio y, en el móvil,
 * una barra con Llamar y WhatsApp que aparece al pasar la portada.
 */
export function ContactoRapido() {
  const [abierto, setAbierto] = useState(false);
  const [barra, setBarra] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const portada = document.getElementById("inicio");
    const fin = portada ? portada.offsetHeight - window.innerHeight * 0.9 : window.innerHeight * 0.5;
    setBarra(y > fin);
  });

  return (
    <>
      {/* Burbuja (escritorio siempre; móvil solo mientras no hay barra) */}
      <AnimatePresence>
        {!abierto && (
          <motion.button
            key="burbuja"
            onClick={() => setAbierto(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 26, delay: 0.6 }}
            className={`fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_34px_-10px_rgb(7_94_84/0.7)] sm:bottom-6 sm:right-6 ${
              barra ? "max-md:hidden" : ""
            }`}
            aria-label="Escribir por WhatsApp"
            data-cta="whatsapp-burbuja"
          >
            <IconoWhatsApp className="size-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Barra del móvil */}
      <AnimatePresence>
        {barra && !abierto && (
          <motion.div
            initial={{ y: "130%" }}
            animate={{ y: 0 }}
            exit={{ y: "130%" }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-x-3 z-50 flex gap-2 md:hidden"
            style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <a
              href={CLINICA.telefonoHref}
              data-cta="llamar-barra"
              className="flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-placa font-semibold text-bata shadow-[0_18px_40px_-16px_rgb(28_43_58/0.6)]"
            >
              <span className="grid size-8 place-items-center rounded-full bg-encia text-white">
                <Phone className="size-4" strokeWidth={2.4} />
              </span>
              Llamar al {CLINICA.telefono}
            </a>
            <button
              onClick={() => setAbierto(true)}
              className="grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_18px_40px_-16px_rgb(7_94_84/0.7)]"
              aria-label="Escribir por WhatsApp"
              data-cta="whatsapp-barra"
            >
              <IconoWhatsApp className="size-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{abierto && <Panel onCerrar={() => setAbierto(false)} />}</AnimatePresence>
    </>
  );
}
