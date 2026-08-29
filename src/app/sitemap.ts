import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/analise", "/questionario", "/recomendacoes", "/produtos", "/sobre", "/privacidade", "/contato"];

  return routes.map((route, index) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/analise" ? 0.9 : 0.6,
  }));
}
