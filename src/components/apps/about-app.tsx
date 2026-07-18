"use client";

import { GitFork, MapPin, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { profile } from "@/config/profile";
import { AppHeading } from "./app-heading";

export default function AboutApp() {
  const t = useTranslations("about");

  return (
    <article className="app-scroll about-app">
      <div className="about-hero">
        <div
          className="about-portrait"
          role="img"
          aria-label={t("portraitAlt")}
        >
          <span>Y</span>
          <div className="about-portrait__scan" />
        </div>
        <div>
          <AppHeading
            eyebrow={t("eyebrow")}
            title={profile.name}
            description={t("intro")}
          />
          <dl className="about-meta">
            <div>
              <dt>{t("roleLabel")}</dt>
              <dd>{profile.role}</dd>
            </div>
            <div>
              <dt>{t("locationLabel")}</dt>
              <dd>
                <MapPin size={15} /> {profile.location}
              </dd>
            </div>
          </dl>
          <div className="button-row">
            <a
              className="button button--primary"
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noreferrer"
            >
              <GitFork size={16} /> GitHub
            </a>
            <a
              className="button"
              href={profile.telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Send size={16} /> Telegram
            </a>
          </div>
        </div>
      </div>

      <div className="content-grid content-grid--two">
        <section className="panel-section panel-section--wide">
          <span className="section-index mono">02</span>
          <h2>{t("biographyTitle")}</h2>
          <p>{t("biography")}</p>
        </section>
        <section className="panel-section">
          <span className="section-index mono">03</span>
          <h2>{t("focusTitle")}</h2>
          <ul className="signal-list">
            <li>{t("focus1")}</li>
            <li>{t("focus2")}</li>
            <li>{t("focus3")}</li>
          </ul>
        </section>
        <section className="panel-section">
          <span className="section-index mono">04</span>
          <h2>{t("philosophyTitle")}</h2>
          <p>{t("philosophy")}</p>
        </section>
        <section className="panel-section">
          <span className="section-index mono">05</span>
          <h2>{t("educationTitle")}</h2>
          <p className="muted">
            {profile.education ?? t("educationPlaceholder")}
          </p>
        </section>
        <section className="panel-section">
          <span className="section-index mono">06</span>
          <h2>{t("availabilityTitle")}</h2>
          <p className="muted">
            {profile.availability ?? t("availabilityPlaceholder")}
          </p>
        </section>
        <section className="panel-section panel-section--wide">
          <span className="section-index mono">07</span>
          <h2>{t("interestsTitle")}</h2>
          <p>{t("interests")}</p>
        </section>
      </div>
    </article>
  );
}
