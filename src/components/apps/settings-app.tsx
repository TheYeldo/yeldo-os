"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { accents, themes, wallpapers } from "@/config/themes";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useSystemStore } from "@/store/system-store";
import type { AccentId, ThemeId, WallpaperId } from "@/types/system";
import { AppHeading } from "./app-heading";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? "is-on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

export default function SettingsApp() {
  const t = useTranslations("settings");
  const settings = useSystemStore((state) => state.settings);
  const updateSettings = useSystemStore((state) => state.updateSettings);
  const resetDesktop = useSystemStore((state) => state.resetDesktop);
  const resetAllData = useSystemStore((state) => state.resetAllData);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <section className="app-scroll settings-app">
      <AppHeading title={t("title")} />
      <div className="settings-section">
        <h2>{t("appearance")}</h2>
        <div className="setting-row setting-row--stack">
          <div>
            <strong>{t("theme")}</strong>
          </div>
          <div className="theme-options">
            {themes.map((theme) => (
              <button
                type="button"
                key={theme}
                className={settings.theme === theme ? "is-active" : undefined}
                onClick={() => updateSettings({ theme: theme as ThemeId })}
              >
                <span className={`theme-swatch theme-swatch--${theme}`} />
                {t(theme)}
              </button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <div>
            <strong>{t("accent")}</strong>
          </div>
          <div className="accent-options">
            {accents.map((accent) => (
              <button
                type="button"
                key={accent}
                className={settings.accent === accent ? "is-active" : undefined}
                onClick={() => updateSettings({ accent: accent as AccentId })}
                aria-label={t(accent)}
              >
                <span data-accent={accent} />
              </button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <div>
            <strong>{t("wallpaper")}</strong>
          </div>
          <select
            value={settings.wallpaper}
            onChange={(event) =>
              updateSettings({ wallpaper: event.target.value as WallpaperId })
            }
          >
            {wallpapers.map((wallpaper) => (
              <option value={wallpaper} key={wallpaper}>
                {t(wallpaper)}
              </option>
            ))}
          </select>
        </div>
        <label className="setting-row">
          <div>
            <strong>{t("scale")}</strong>
            <span className="mono">
              {Math.round(settings.interfaceScale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.9"
            max="1.1"
            step="0.05"
            value={settings.interfaceScale}
            onChange={(event) =>
              updateSettings({ interfaceScale: Number(event.target.value) })
            }
          />
        </label>
        <label className="setting-row">
          <div>
            <strong>{t("animation")}</strong>
            <span className="mono">
              {Math.round(settings.animationIntensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.animationIntensity}
            onChange={(event) =>
              updateSettings({ animationIntensity: Number(event.target.value) })
            }
          />
        </label>
      </div>

      <div className="settings-section">
        <h2>{t("behavior")}</h2>
        <div className="setting-row">
          <div>
            <strong>{t("sound")}</strong>
            <p>{t("soundDescription")}</p>
          </div>
          <Toggle
            checked={settings.soundEnabled}
            onChange={(soundEnabled) => updateSettings({ soundEnabled })}
            label={t("sound")}
          />
        </div>
        <div className="setting-row">
          <div>
            <strong>{t("boot")}</strong>
            <p>{t("bootDescription")}</p>
          </div>
          <Toggle
            checked={settings.bootEnabled}
            onChange={(bootEnabled) => updateSettings({ bootEnabled })}
            label={t("boot")}
          />
        </div>
        <div className="setting-row">
          <div>
            <strong>{t("clock")}</strong>
          </div>
          <select
            value={settings.clockFormat}
            onChange={(event) =>
              updateSettings({ clockFormat: event.target.value as "12" | "24" })
            }
          >
            <option value="12">{t("clock12")}</option>
            <option value="24">{t("clock24")}</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>{t("accessibility")}</h2>
        <div className="setting-row">
          <div>
            <strong>{t("reducedMotion")}</strong>
            <p>{t("reducedMotionDescription")}</p>
          </div>
          <Toggle
            checked={settings.reducedMotion}
            onChange={(reducedMotion) => updateSettings({ reducedMotion })}
            label={t("reducedMotion")}
          />
        </div>
        <div className="setting-row">
          <div>
            <strong>{t("simplified")}</strong>
            <p>{t("simplifiedDescription")}</p>
          </div>
          <Toggle
            checked={settings.simplifiedMode}
            onChange={(simplifiedMode) => updateSettings({ simplifiedMode })}
            label={t("simplified")}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>{t("language")}</h2>
        <div className="setting-row">
          <strong>{t("systemLanguage")}</strong>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="settings-section settings-section--danger">
        <h2>{t("reset")}</h2>
        <div className="setting-row">
          <div>
            <strong>{t("resetLayout")}</strong>
            <p>{t("resetLayoutDescription")}</p>
          </div>
          <button type="button" className="button" onClick={resetDesktop}>
            <RotateCcw size={16} />
            {t("resetLayout")}
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>{t("resetAll")}</strong>
            <p>{t("resetAllDescription")}</p>
          </div>
          {confirmReset ? (
            <button
              type="button"
              className="button button--danger"
              onClick={() => {
                resetAllData();
                setConfirmReset(false);
              }}
            >
              <Trash2 size={16} />
              {t("confirmReset")}
            </button>
          ) : (
            <button
              type="button"
              className="button"
              onClick={() => setConfirmReset(true)}
            >
              {t("resetAll")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
