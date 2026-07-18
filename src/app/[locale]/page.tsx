import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DesktopShell } from "@/components/desktop/desktop-shell";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { ru: "/ru", en: "/en", "x-default": "/ru" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
      siteName: "YeldoOS",
      url: `/${locale}`,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "YeldoOS browser desktop",
        },
      ],
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yeldo",
    jobTitle: "Frontend Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Almaty",
      addressCountry: "KZ",
    },
    url: "https://theyeldo.github.io/portfolio/",
    sameAs: ["https://github.com/TheYeldo", "https://t.me/Yeldomr"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DesktopShell locale={locale} />
    </>
  );
}
