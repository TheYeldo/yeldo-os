"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("error");
  return (
    <main className="route-error">
      <span className="mono">404 / ROUTE_MISSING</span>
      <h1>{t("notFoundTitle")}</h1>
      <p>{t("notFoundDescription")}</p>
      <Link href="/">{t("home")}</Link>
    </main>
  );
}
