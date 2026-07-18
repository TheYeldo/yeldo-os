"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  useEffect(() => console.error(error), [error]);
  return (
    <main className="route-error">
      <span className="mono">SYS://RECOVERY</span>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <button type="button" onClick={reset}>
        {t("retry")}
      </button>
    </main>
  );
}
