import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TENSES } from "@/data/tenses";
import { STORIES } from "@/data/stories";

const BASE_URL = "";

interface SitemapEntry { path: string; changefreq?: string; priority?: string }

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/tenses", changefreq: "monthly", priority: "0.9" },
          
          { path: "/quiz", changefreq: "monthly", priority: "0.8" },
          { path: "/cerita", changefreq: "monthly", priority: "0.7" },
          { path: "/progress", changefreq: "monthly", priority: "0.5" },
          { path: "/reference", changefreq: "monthly", priority: "0.4" },
          ...TENSES.map<SitemapEntry>((t) => ({ path: `/formula/${t.slug}`, changefreq: "monthly", priority: "0.7" })),
          ...STORIES.map<SitemapEntry>((s) => ({ path: `/cerita/${s.slug}`, changefreq: "monthly", priority: "0.6" })),
        ];

        const urls = entries.map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    ${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}\n    ${e.priority ? `<priority>${e.priority}</priority>` : ""}\n  </url>`);
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
