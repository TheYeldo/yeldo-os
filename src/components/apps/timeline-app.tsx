"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { timeline } from "@/data/timeline";
import type { Locale } from "@/i18n/routing";
import { useSystemStore } from "@/store/system-store";
import type { TimelineEntry } from "@/types/system";
import { AppHeading } from "./app-heading";

export default function TimelineApp() {
  const t = useTranslations("timeline");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<TimelineEntry["category"] | "all">(
    "all",
  );
  const openApp = useSystemStore((state) => state.openApp);
  const openProject = useSystemStore((state) => state.openProject);
  const visible = timeline.filter(
    (entry) => filter === "all" || entry.category === filter,
  );

  return (
    <section className="app-scroll timeline-app">
      <AppHeading title={t("title")} description={t("subtitle")} />
      <div className="filter-tabs" role="tablist">
        {(["all", "learning", "project", "system"] as const).map((item) => (
          <button
            role="tab"
            aria-selected={filter === item}
            className={filter === item ? "is-active" : undefined}
            key={item}
            onClick={() => setFilter(item)}
          >
            {item === "all" ? common("all") : t(item)}
          </button>
        ))}
      </div>
      <ol className="timeline-list">
        {visible.map((entry, index) => (
          <li key={entry.id}>
            <span className="timeline-list__marker">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </span>
            <article>
              <div className="timeline-list__meta">
                <span className="mono">{entry.date[locale]}</span>
                <span>{t(entry.category)}</span>
              </div>
              <h2>{entry.title[locale]}</h2>
              <p>{entry.description[locale]}</p>
              {entry.projectSlug && (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    openProject(entry.projectSlug ?? "");
                    openApp("projects");
                  }}
                >
                  {t("openProject")}
                  <ArrowUpRight size={15} />
                </button>
              )}
            </article>
          </li>
        ))}
      </ol>
      {!visible.length && (
        <div className="empty-state">
          <p>{t("empty")}</p>
        </div>
      )}
    </section>
  );
}
