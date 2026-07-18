"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { useSystemStore } from "@/store/system-store";
import { LanguageSwitcher } from "./language-switcher";
import { SystemLogo } from "./system-logo";

export function BootScreen() {
  const t = useTranslations("boot");
  const settings = useSystemStore((state) => state.settings);
  const finishBoot = useSystemStore((state) => state.finishBoot);
  const [step, setStep] = useState(0);
  const messages = useMemo(
    () => [
      t("message1"),
      t("message2"),
      t("message3"),
      t("message4"),
      t("message5"),
      t("message6"),
    ],
    [t],
  );

  useEffect(() => {
    const alreadyBooted =
      window.sessionStorage.getItem("yeldo-os-booted") === "1";
    if (!settings.bootEnabled || alreadyBooted) {
      const immediate = window.setTimeout(
        finishBoot,
        settings.reducedMotion ? 0 : 180,
      );
      return () => window.clearTimeout(immediate);
    }

    const duration = settings.reducedMotion ? 450 : 1_450;
    const interval = window.setInterval(
      () => setStep((value) => Math.min(messages.length - 1, value + 1)),
      duration / messages.length,
    );
    const complete = window.setTimeout(() => {
      window.sessionStorage.setItem("yeldo-os-booted", "1");
      finishBoot();
    }, duration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(complete);
    };
  }, [
    finishBoot,
    messages.length,
    settings.bootEnabled,
    settings.reducedMotion,
  ]);

  return (
    <motion.section
      className="boot-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-live="polite"
    >
      <div className="boot-screen__top">
        <span className="mono">SYS://BOOT</span>
        <LanguageSwitcher compact />
      </div>
      <div className="boot-screen__center">
        <div aria-label={t("logoLabel")}>
          <SystemLogo />
        </div>
        <div className="boot-screen__readout">
          <span className="boot-screen__index mono">0{step + 1}</span>
          <p>{messages[step]}</p>
        </div>
        <div
          className="boot-screen__track"
          role="progressbar"
          aria-label={t("progress")}
          aria-valuenow={Math.round(((step + 1) / messages.length) * 100)}
        >
          <motion.span
            animate={{ width: `${((step + 1) / messages.length) * 100}%` }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.18 }}
          />
        </div>
      </div>
      <button
        type="button"
        className="boot-screen__skip"
        onClick={() => {
          window.sessionStorage.setItem("yeldo-os-booted", "1");
          finishBoot();
        }}
      >
        {t("skip")}
        <span aria-hidden="true">↗</span>
      </button>
    </motion.section>
  );
}
