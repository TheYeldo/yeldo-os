import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeldo-os.vercel.app";
  return ["ru", "en"].map((locale) => ({
    url: `${site}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: locale === "ru" ? 1 : 0.9,
    alternates: { languages: { ru: `${site}/ru`, en: `${site}/en` } },
  }));
}
