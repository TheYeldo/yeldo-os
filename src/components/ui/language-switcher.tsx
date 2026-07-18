"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useSystemStore } from "@/store/system-store";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("accessibility");
  const router = useRouter();
  const pathname = usePathname();
  const updateSettings = useSystemStore((state) => state.updateSettings);
  const unlockAchievement = useSystemStore((state) => state.unlockAchievement);
  const notify = useSystemStore((state) => state.notify);

  const change = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    updateSettings({ locale: nextLocale }, false);
    unlockAchievement("polyglot");
    notify("languageChanged", "success");
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t("languageSwitcher")}
    >
      {(["ru", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className={locale === item ? "is-active" : undefined}
          onClick={() => change(item)}
          aria-pressed={locale === item}
        >
          {compact ? item.toUpperCase() : item === "ru" ? "Рус" : "Eng"}
        </button>
      ))}
    </div>
  );
}
