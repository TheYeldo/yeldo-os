import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DesktopShell } from "@/components/desktop/desktop-shell";
import { profile } from "@/config/profile";
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
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "YeldoOS browser desktop",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`/${locale}/opengraph-image`],
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
    name: profile.name,
    jobTitle: profile.role,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Almaty",
      addressCountry: "KZ",
    },
    url: profile.portfolioUrl,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    sameAs: profile.socialLinks.map((link) => link.url),
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
