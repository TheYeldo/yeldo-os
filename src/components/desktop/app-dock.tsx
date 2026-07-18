"use client";

import { useTranslations } from "next-intl";

import { applications } from "@/data/apps";
import { useSystemStore } from "@/store/system-store";
import { AppIcon } from "@/components/ui/app-icon";

export function AppDock() {
  const t = useTranslations("desktop");
  const tApps = useTranslations("apps");
  const windows = useSystemStore((state) => state.windows);
  const openApp = useSystemStore((state) => state.openApp);
  const active = windows
    .filter((item) => item.mode !== "minimized")
    .sort((a, b) => b.zIndex - a.zIndex)[0];
  const dockApps = applications.filter((app) => app.dock);

  return (
    <nav className="app-dock" aria-label={t("dock")}>
      {dockApps.map((app, index) => {
        const isOpen = windows.some((item) => item.appId === app.id);
        const isActive = active?.appId === app.id;
        return (
          <button
            type="button"
            key={app.id}
            className={`${isOpen ? "is-open" : ""} ${isActive ? "is-active" : ""}`}
            onClick={() => openApp(app.id)}
            aria-label={tApps(app.nameKey as never)}
          >
            <span className="dock-tooltip">{tApps(app.nameKey as never)}</span>
            <span className="dock-icon">
              <AppIcon icon={app.icon} size={22} />
            </span>
            <span className="dock-indicator" />
            {index < 9 && <kbd>{index + 1}</kbd>}
          </button>
        );
      })}
    </nav>
  );
}
