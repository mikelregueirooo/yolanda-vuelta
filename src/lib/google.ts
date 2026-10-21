// Reseñas reales de Google con la API de Maps JavaScript (Places).
// Se piden en el navegador de cada visitante: Google no permite guardar el contenido
// de las reseñas, solo el identificador del lugar.
//
// Necesita NEXT_PUBLIC_GOOGLE_MAPS_KEY: clave con "Maps JavaScript API" y "Places API (New)"
// activadas y restringida por dominio (referentes HTTP) a la web.

export const CLAVE_MAPS = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";
// Opcional: si se conoce el place ID se ahorra la búsqueda (sí se puede guardar).
export const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "";
const BUSQUEDA = "Clínica Dental Yolanda Vuelta, Paseo Juan Pablo II 28, Vitoria-Gasteiz";

export type Resena = {
  autor: string;
  autorUrl?: string;
  foto?: string;
  nota: number;
  texto: string;
  cuando: string;
  url?: string;
};

export type FichaGoogle = {
  nota?: number;
  total?: number;
  url?: string;
  resenas: Resena[];
};

// Tipos mínimos de lo que usamos de google.maps.places
type LocalizedText = { text?: string } | string | null | undefined;
type GReview = {
  rating?: number | null;
  text?: LocalizedText;
  relativePublishTimeDescription?: string | null;
  authorAttribution?: { displayName?: string; uri?: string; photoURI?: string } | null;
  googleMapsURI?: string | null;
};
type GPlace = {
  rating?: number | null;
  userRatingCount?: number | null;
  googleMapsURI?: string | null;
  reviews?: GReview[] | null;
  fetchFields: (o: { fields: string[] }) => Promise<unknown>;
};
type PlacesLib = {
  Place: (new (o: { id: string; requestedLanguage?: string }) => GPlace) & {
    searchByText: (o: { textQuery: string; fields: string[]; language?: string; maxResultCount?: number }) => Promise<{ places: { id: string }[] }>;
  };
};
type GoogleGlobal = { maps?: { importLibrary?: (n: string) => Promise<unknown> } };

let cargando: Promise<PlacesLib> | null = null;

/** Carga el cargador oficial de la API de Maps una sola vez y devuelve la librería de Places. */
function cargarPlaces(): Promise<PlacesLib> {
  if (cargando) return cargando;
  cargando = new Promise<PlacesLib>((resolve, reject) => {
    const w = window as unknown as { google?: GoogleGlobal };
    const listo = () => {
      const imp = w.google?.maps?.importLibrary;
      if (!imp) return reject(new Error("Maps JavaScript API no disponible"));
      imp("places").then((lib) => resolve(lib as PlacesLib), reject);
    };
    if (w.google?.maps?.importLibrary) return listo();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(CLAVE_MAPS)}&v=weekly&loading=async&language=es&region=ES&callback=__yvMaps`;
    s.async = true;
    (window as unknown as Record<string, unknown>).__yvMaps = listo;
    s.onerror = () => reject(new Error("No se pudo cargar Google Maps"));
    document.head.appendChild(s);
  });
  cargando.catch(() => {
    cargando = null;
  });
  return cargando;
}

const texto = (t: LocalizedText) => (typeof t === "string" ? t : (t?.text ?? ""));

export async function pedirResenas(): Promise<FichaGoogle> {
  const { Place } = await cargarPlaces();
  let id = PLACE_ID;
  if (!id) {
    const { places } = await Place.searchByText({ textQuery: BUSQUEDA, fields: ["id"], language: "es", maxResultCount: 1 });
    id = places[0]?.id;
    if (!id) throw new Error("No se encontró la clínica en Google");
  }
  const lugar = new Place({ id, requestedLanguage: "es" });
  await lugar.fetchFields({ fields: ["rating", "userRatingCount", "reviews", "googleMapsURI"] });
  return {
    nota: lugar.rating ?? undefined,
    total: lugar.userRatingCount ?? undefined,
    url: lugar.googleMapsURI ?? undefined,
    resenas: (lugar.reviews ?? [])
      .map((r) => ({
        autor: r.authorAttribution?.displayName ?? "Usuario de Google",
        autorUrl: r.authorAttribution?.uri,
        foto: r.authorAttribution?.photoURI,
        nota: r.rating ?? 0,
        texto: texto(r.text),
        cuando: r.relativePublishTimeDescription ?? "",
        url: r.googleMapsURI ?? undefined,
      }))
      .filter((r) => r.texto.trim().length > 0),
  };
}
