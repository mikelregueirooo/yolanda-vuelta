# Clínica Dental Yolanda Vuelta

Web de la Clínica Dental Yolanda Vuelta (Zabalgana, Vitoria-Gasteiz).

- Next.js 16, React 19, Tailwind 4, framer-motion y three.js.
- Datos de la clínica en `src/lib/clinica.ts` y tratamientos en `src/lib/tratamientos.ts`.
- Publicación en GitHub Pages solo a mano, desde la pestaña Actions (`.github/workflows/pages.yml`).

Reseñas de Google: copia `.env.example` como `.env.local` y pon una clave de Google Maps
(Maps JavaScript API + Places API (New), restringida al dominio). Sin clave, el apartado
enlaza a la ficha de Google Maps.

```bash
npm install
npm run dev
```
