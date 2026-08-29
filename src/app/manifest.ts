import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "D’Accord — Skincare inteligente",
    short_name: "D’Accord",
    description: "Beleza guiada pela sua pele.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff0f5",
    theme_color: "#9d286f",
    lang: "pt-BR",
  };
}
