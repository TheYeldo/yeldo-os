"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { applications } from "@/data/apps";
import type { Locale } from "@/i18n/routing";
import { useSystemStore } from "@/store/system-store";
import { BootScreen } from "@/components/ui/boot-screen";
import { PwaRegistration } from "@/components/ui/pwa-registration";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { NotificationToasts } from "@/components/notifications/notification-toasts";
import { AchievementToast } from "@/components/notifications/achievement-toast";
import { WindowLayer } from "@/components/windows/window-layer";
import { AppDock } from "./app-dock";
import { DesktopIcons } from "./desktop-icons";
import { MobileLauncher } from "./mobile-launcher";
import { StatusBar } from "./status-bar";

export function DesktopShell({ locale }: { locale: Locale }) {
  const tAccessibility = useTranslations("accessibility");
  const hasHydrated = useSystemStore((state) => state.hasHydrated);
  const bootComplete = useSystemStore((state) => state.bootComplete);
  const settings = useSystemStore((state) => state.settings);
  const setHasHydrated = useSystemStore((state) => state.setHasHydrated);
  const notify = useSystemStore((state) => state.notify);
  const setPalette = useSystemStore((state) => state.setCommandPaletteOpen);
  const setNotificationCenter = useSystemStore(
    (state) => state.setNotificationCenterOpen,
  );
  const openApp = useSystemStore((state) => state.openApp);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    void Promise.resolve(useSystemStore.persist.rehydrate()).finally(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion)
        useSystemStore
          .getState()
          .updateSettings({ reducedMotion: true }, false);
      useSystemStore.getState().updateSettings({ locale }, false);
      setHasHydrated(true);
    });
  }, [locale, setHasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.accent = settings.accent;
    document.documentElement.dataset.wallpaper = settings.wallpaper;
    document.documentElement.style.setProperty(
      "--interface-scale",
      String(settings.interfaceScale),
    );
    document.documentElement.classList.toggle(
      "reduced-motion",
      settings.reducedMotion,
    );
  }, [hasHydrated, settings]);

  useEffect(() => {
    const update = () => {
      const next = navigator.onLine;
      setOnline(next);
      notify(next ? "online" : "offline", next ? "success" : "warning");
    };
    const initial = window.setTimeout(() => setOnline(navigator.onLine), 0);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [notify]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing = target?.matches(
        "input, textarea, [contenteditable='true']",
      );
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette(true, true);
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "`") {
        event.preventDefault();
        openApp("terminal");
        return;
      }
      if (event.altKey && /^[1-9]$/.test(event.key) && !editing) {
        const app = applications.filter((item) => item.dock)[
          Number(event.key) - 1
        ];
        if (app) {
          event.preventDefault();
          openApp(app.id);
        }
      }
      if (event.key === "Escape" && !editing) {
        setPalette(false);
        setNotificationCenter(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openApp, setNotificationCenter, setPalette]);

  if (!hasHydrated)
    return (
      <div className="initial-loader" aria-hidden="true">
        <span />
      </div>
    );

  return (
    <>
      <PwaRegistration />
      <a className="skip-link" href="#desktop-content">
        {tAccessibility("skipToDesktop")}
      </a>
      <AnimatePresence mode="wait">
        {!bootComplete ? (
          <BootScreen key="boot" />
        ) : (
          <motion.main
            key="desktop"
            id="desktop-content"
            className="desktop-shell"
            initial={
              settings.reducedMotion ? false : { opacity: 0, scale: 1.01 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: settings.reducedMotion
                ? 0
                : 0.45 * settings.animationIntensity,
            }}
          >
            <StatusBar locale={locale} online={online} />
            <div className="desktop-workspace">
              <div className="wallpaper-art" aria-hidden="true">
                <span />
                <span />
                <span />
                <div className="wallpaper-word">Y/OS</div>
              </div>
              <DesktopIcons />
              <MobileLauncher />
              <WindowLayer />
            </div>
            <AppDock />
            <CommandPalette />
            <NotificationCenter />
            <NotificationToasts />
            <AchievementToast />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
