import type { NextConfig } from "next";

// En GitHub Pages la web vive en /<repositorio>; en local, en la raíz.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Sin Cache Components ni Partial Prefetching: no son compatibles con la exportación estática.
  // HTML estático para GitHub Pages (cada ruta en su carpeta con index.html)
  output: "export",
  trailingSlash: true,
  basePath,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
