"use client";

import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { skills } from "@/data/skills";
import type { Locale } from "@/i18n/routing";
import type { Skill } from "@/types/system";
import { AppHeading } from "./app-heading";

const categories: Skill["category"][] = [
  "frontend",
  "ui",
  "tools",
  "modding",
  "learning",
];

export default function SkillsApp() {
  const t = useTranslations("skills");
  const locale = useLocale() as Locale;
  return (
    <section className="app-scroll skills-app">
      <AppHeading title={t("title")} description={t("subtitle")} />
      <div className="skills-groups">
        {categories.map((category, categoryIndex) => (
          <section className="skill-group" key={category}>
            <header>
              <span className="mono">0{categoryIndex + 1}</span>
              <h2>{t(category)}</h2>
              <span>
                {skills.filter((skill) => skill.category === category).length}
              </span>
            </header>
            <div className="skill-grid">
              {skills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <article className="skill-card" key={skill.id}>
                    <div>
                      <h3>{skill.name}</h3>
                      <span className={`skill-status ${skill.status}`}>
                        {t(
                          skill.status === "learning"
                            ? "learningStatus"
                            : "used",
                        )}
                      </span>
                    </div>
                    <p>{skill.context[locale]}</p>
                    <footer>
                      <span>
                        {skill.relatedProjects.length
                          ? `${t("related")}: ${skill.relatedProjects.join(", ")}`
                          : t("noProjects")}
                      </span>
                      {skill.evidenceUrl && (
                        <a
                          href={skill.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${t("evidence")} ${skill.name}`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </footer>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
