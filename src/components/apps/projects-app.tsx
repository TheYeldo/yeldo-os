"use client";

import {
  ArrowLeft,
  ExternalLink,
  Folder,
  GitFork,
  Grid2X2,
  List,
  Search,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { projects } from "@/data/projects";
import type { Locale } from "@/i18n/routing";
import { useSystemStore } from "@/store/system-store";
import type { ProjectStatus } from "@/types/system";
import { AppHeading } from "./app-heading";

const statusOptions: Array<ProjectStatus | "all"> = [
  "all",
  "released",
  "development",
  "prototype",
  "concept",
  "archived",
];

export default function ProjectsApp() {
  const t = useTranslations("projects");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const selectedProjectId = useSystemStore((state) => state.selectedProjectId);
  const inspectProject = useSystemStore((state) => state.inspectProject);
  const openProject = useSystemStore((state) => state.openProject);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<"featured" | "newest" | "title">("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const selected =
    projects.find((project) => project.slug === selectedProjectId) ?? null;

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects
      .filter((project) => status === "all" || project.status === status)
      .filter(
        (project) =>
          !normalized ||
          [project.title, project.description[locale], ...project.technologies]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
      )
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        if (sort === "newest") return (b.year ?? 0) - (a.year ?? 0);
        return (
          Number(b.featured) - Number(a.featured) ||
          (b.year ?? 0) - (a.year ?? 0)
        );
      });
  }, [locale, query, sort, status]);

  if (selected) {
    return (
      <article className="app-scroll project-detail">
        <button
          className="text-button"
          type="button"
          onClick={() => openProject("")}
        >
          <ArrowLeft size={16} /> {common("back")}
        </button>
        <div className="project-detail__hero">
          <div>
            <span className={`status-badge status-${selected.status}`}>
              {t(selected.status)}
            </span>
            <h1>{selected.title}</h1>
            <p>{selected.description[locale]}</p>
          </div>
          <span className="project-detail__year mono">
            {selected.year ?? t("unknownYear")}
          </span>
        </div>
        <div className="project-visual" data-project={selected.slug}>
          <span className="mono">{selected.slug.toUpperCase()}</span>
          <Folder size={56} strokeWidth={1.2} />
        </div>
        <div className="project-detail__layout">
          <main>
            <section>
              <h2>{t("caseStudy")}</h2>
              <p>{selected.caseStudy[locale]}</p>
            </section>
            <section>
              <h2>{t("challenge")}</h2>
              <p>{selected.challenge[locale]}</p>
            </section>
            <section>
              <h2>{t("solution")}</h2>
              <p>{selected.solution[locale]}</p>
            </section>
            <section>
              <h2>{t("lessons")}</h2>
              <p>{selected.lessons[locale]}</p>
            </section>
            <section>
              <h2>{t("media")}</h2>
              <div className="media-placeholder">
                <span className="mono">MEDIA://PENDING</span>
                <p>{t("mediaPlaceholder")}</p>
              </div>
            </section>
          </main>
          <aside>
            <section>
              <h2>{t("role")}</h2>
              <p>{selected.role[locale]}</p>
            </section>
            <section>
              <h2>{t("technologies")}</h2>
              <div className="tag-list">
                {selected.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </section>
            <div className="stacked-actions">
              {selected.repositoryUrl ? (
                <a
                  className="button"
                  href={selected.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitFork size={16} /> {t("repository")}
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span className="button is-disabled">
                  {t("repositoryUnavailable")}
                </span>
              )}
              {selected.liveUrl ? (
                <a
                  className="button button--primary"
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("liveWebsite")}
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span className="button is-disabled">
                  {t("liveUnavailable")}
                </span>
              )}
            </div>
          </aside>
        </div>
      </article>
    );
  }

  return (
    <section className="app-scroll projects-app">
      <AppHeading title={t("title")} description={t("subtitle")} />
      <div className="project-toolbar">
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">{common("search")}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </label>
        <label>
          <span className="sr-only">{t("filterStatus")}</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectStatus | "all")
            }
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? common("all") : t(item)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">{t("sort")}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
          >
            <option value="featured">{t("sortFeatured")}</option>
            <option value="newest">{t("sortNewest")}</option>
            <option value="title">{t("sortTitle")}</option>
          </select>
        </label>
        <div className="segmented-control">
          <button
            type="button"
            className={view === "grid" ? "is-active" : undefined}
            onClick={() => setView("grid")}
            aria-label={t("iconView")}
          >
            <Grid2X2 size={16} />
          </button>
          <button
            type="button"
            className={view === "list" ? "is-active" : undefined}
            onClick={() => setView("list")}
            aria-label={t("listView")}
          >
            <List size={17} />
          </button>
        </div>
      </div>
      {visible.length ? (
        <div className={view === "grid" ? "project-grid" : "project-list"}>
          {visible.map((project) => (
            <button
              key={project.slug}
              className="project-card"
              type="button"
              onClick={() => inspectProject(project.slug)}
              aria-label={t("openDetail", { project: project.title })}
            >
              <div className="project-card__visual" data-project={project.slug}>
                <span className="mono">
                  {project.slug.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="project-card__body">
                <div className="project-card__meta">
                  <span className={`status-badge status-${project.status}`}>
                    {t(project.status)}
                  </span>
                  <span className="mono">{project.year ?? "—"}</span>
                </div>
                <h2>{project.title}</h2>
                <p>{project.description[locale]}</p>
                <div className="tag-list">
                  {project.technologies.slice(0, 4).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                {project.featured && (
                  <span className="featured-label mono">{t("featured")}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Folder size={34} />
          <p>{t("empty")}</p>
        </div>
      )}
    </section>
  );
}
