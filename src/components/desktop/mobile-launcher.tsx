"use client";

import { useTranslations } from "next-intl";

import { applications } from "@/data/apps";
import { useSystemStore } from "@/store/system-store";
import { AppIcon } from "@/components/ui/app-icon";

export function MobileLauncher() {
  const t = useTranslations("desktop");
  const tApps = useTranslations("apps");
  const settings = useSystemStore((state) => state.settings);
  const openApp = useSystemStore((state) => state.openApp);
  return (
    <section
      className={`mobile-launcher ${settings.simplifiedMode ? "is-simplified" : ""}`}
      aria-label={t("mobileHome")}
    >
      <header>
        <span className="mono">YELDO / WORKSPACE</span>
        <h1>{settings.simplifiedMode ? t("simplifiedTitle") : "YeldoOS"}</h1>
        <p>
          {settings.simplifiedMode
            ? t("simplifiedDescription")
            : t("workspace")}
        </p>
      </header>
      <div>
        {applications.map((app) => (
          <button type="button" key={app.id} onClick={() => openApp(app.id)}>
            <span>
              <AppIcon
                icon={app.icon}
                size={settings.simplifiedMode ? 20 : 25}
              />
            </span>
            <div>
              <strong>{tApps(app.nameKey as never)}</strong>
              {settings.simplifiedMode && (
                <small>{tApps(app.descriptionKey as never)}</small>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
