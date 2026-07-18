"use client";

import {
  Check,
  Copy,
  ExternalLink,
  GitFork,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { profile } from "@/config/profile";
import { useSystemStore } from "@/store/system-store";
import { copyText } from "@/utils/clipboard";
import { AppHeading } from "./app-heading";

export default function ContactApp() {
  const t = useTranslations("contact");
  const notify = useSystemStore((state) => state.notify);
  const [copied, setCopied] = useState<string | null>(null);
  const items = [
    {
      id: "telegram",
      label: t("telegram"),
      value: profile.telegram,
      url: profile.telegramUrl,
      icon: Send,
    },
    {
      id: "github",
      label: t("github"),
      value: `github.com/${profile.githubUsername}`,
      url: `https://github.com/${profile.githubUsername}`,
      icon: GitFork,
    },
    {
      id: "portfolio",
      label: t("portfolio"),
      value: "theyeldo.github.io/portfolio",
      url: profile.portfolioUrl,
      icon: ExternalLink,
    },
    {
      id: "email",
      label: t("email"),
      value: profile.email ?? t("emailPlaceholder"),
      url: profile.email ? `mailto:${profile.email}` : null,
      icon: Mail,
    },
    {
      id: "location",
      label: t("location"),
      value: profile.location,
      url: null,
      icon: MapPin,
    },
  ];

  const copy = async (id: string, value: string) => {
    const success = await copyText(value);
    notify(success ? "copied" : "copyFailed", success ? "success" : "warning");
    if (success) {
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1_600);
    }
  };

  return (
    <section className="app-scroll contact-app">
      <AppHeading title={t("title")} description={t("subtitle")} />
      <div className="contact-list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.id} className="contact-row">
              <span className="contact-row__icon">
                <Icon size={20} />
              </span>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="contact-row__actions">
                <button
                  type="button"
                  onClick={() => copy(item.id, item.value)}
                  aria-label={t("copyValue", { label: item.label })}
                >
                  {copied === item.id ? (
                    <Check size={17} />
                  ) : (
                    <Copy size={17} />
                  )}
                </button>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t("openLink", { label: item.label })}
                  >
                    <ExternalLink size={17} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!profile.email && (
        <p className="contact-note">
          <Mail size={15} /> {t("mailtoNote")}
        </p>
      )}
    </section>
  );
}
