"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { applications } from "@/data/apps";
import { useSystemStore } from "@/store/system-store";
import type { AppId } from "@/types/system";
import { AppIcon } from "@/components/ui/app-icon";

export function DesktopIcons() {
  const t = useTranslations("desktop");
  const tApps = useTranslations("apps");
  const openApp = useSystemStore((state) => state.openApp);
  const [selected, setSelected] = useState<AppId | null>(null);
  const shortcuts = applications.filter((app) => app.desktop);

  return (
    <nav
      className="desktop-icons"
      aria-label={t("desktopIcons")}
      onClick={(event) => {
        if (event.target === event.currentTarget) setSelected(null);
      }}
    >
      {shortcuts.map((app) => (
        <button
          type="button"
          key={app.id}
          className={selected === app.id ? "is-selected" : undefined}
          onClick={() => {
            if (window.matchMedia("(pointer: coarse)").matches) openApp(app.id);
            else setSelected(app.id);
          }}
          onDoubleClick={() => openApp(app.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openApp(app.id);
            }
          }}
          aria-label={`${tApps(app.nameKey as never)}. ${window.matchMedia?.("(pointer: coarse)").matches ? t("singleTapHint") : t("doubleClickHint")}`}
        >
          <span className="desktop-icon__tile">
            <AppIcon icon={app.icon} size={27} />
          </span>
          <span>{tApps(app.nameKey as never)}</span>
        </button>
      ))}
    </nav>
  );
}
