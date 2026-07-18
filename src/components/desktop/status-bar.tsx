"use client";

import {
  Bell,
  GitBranch,
  Search,
  SunMoon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { appById } from "@/data/apps";
import { themes } from "@/config/themes";
import { useClock } from "@/hooks/use-clock";
import type { Locale } from "@/i18n/routing";
import { useSystemStore } from "@/store/system-store";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { SystemLogo } from "@/components/ui/system-logo";

export function StatusBar({
  locale,
  online,
}: {
  locale: Locale;
  online: boolean;
}) {
  const t = useTranslations("desktop");
  const common = useTranslations("common");
  const tApps = useTranslations("apps");
  const windows = useSystemStore((state) => state.windows);
  const settings = useSystemStore((state) => state.settings);
  const notifications = useSystemStore((state) => state.notifications);
  const updateSettings = useSystemStore((state) => state.updateSettings);
  const setPalette = useSystemStore((state) => state.setCommandPaletteOpen);
  const notificationOpen = useSystemStore(
    (state) => state.notificationCenterOpen,
  );
  const setNotificationOpen = useSystemStore(
    (state) => state.setNotificationCenterOpen,
  );
  const active = windows
    .filter((item) => item.mode !== "minimized")
    .sort((a, b) => b.zIndex - a.zIndex)[0];
  const activeName = active
    ? tApps(appById[active.appId].nameKey as never)
    : t("noActiveApp");
  const { time, date } = useClock(locale, settings.clockFormat);
  const nextTheme = () => {
    const index = themes.indexOf(settings.theme);
    updateSettings({
      theme: themes[(index + 1) % themes.length] ?? "graphite",
    });
  };

  return (
    <header className="status-bar" aria-label={t("systemControls")}>
      <div className="status-bar__start">
        <button
          type="button"
          className="status-logo"
          onClick={() => setPalette(true)}
          aria-label="YeldoOS"
        >
          <SystemLogo compact />
        </button>
        <span className="active-app-name">{activeName}</span>
      </div>
      <div className="status-bar__end">
        <span
          className={`github-status ${online ? "is-online" : ""}`}
          title={online ? t("githubPending") : common("offline")}
        >
          <GitBranch size={14} />
          <span>{online ? t("githubPending") : common("offline")}</span>
        </span>
        <button
          type="button"
          className="status-search"
          onClick={() => setPalette(true)}
          aria-label={t("openSearch")}
        >
          <Search size={15} />
          <span>{t("openSearch")}</span>
          <kbd>⌘K</kbd>
        </button>
        <LanguageSwitcher compact />
        <button
          type="button"
          onClick={() =>
            updateSettings({ soundEnabled: !settings.soundEnabled })
          }
          aria-label={settings.soundEnabled ? t("soundOn") : t("soundOff")}
        >
          {settings.soundEnabled ? (
            <Volume2 size={16} />
          ) : (
            <VolumeX size={16} />
          )}
        </button>
        <button type="button" onClick={nextTheme} aria-label={t("switchTheme")}>
          <SunMoon size={16} />
        </button>
        <button
          type="button"
          className="notification-button"
          onClick={() => setNotificationOpen(!notificationOpen)}
          aria-label={t("openNotifications")}
        >
          <Bell size={16} />
          {notifications.length > 0 && <span>{notifications.length}</span>}
        </button>
        <time className="status-clock">
          <span>{date}</span>
          <strong className="mono">{time}</strong>
        </time>
      </div>
    </header>
  );
}
