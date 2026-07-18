"use client";

import {
  Activity,
  AlertTriangle,
  ExternalLink,
  GitCommitHorizontal,
  GitFork,
  GitBranch,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { Locale } from "@/i18n/routing";
import type { GitHubDashboard } from "@/lib/github";
import { useSystemStore } from "@/store/system-store";
import { AppHeading } from "./app-heading";

let sessionCache: GitHubDashboard | null = null;
const languageColors = [
  "#45d6df",
  "#9f8cff",
  "#6aa7ff",
  "#65d6ad",
  "#d4a96f",
  "#7f8996",
];
const languageColor = (index: number) =>
  languageColors[index % languageColors.length] ?? "#7f8996";

export default function GitHubApp() {
  const t = useTranslations("github");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const notify = useSystemStore((state) => state.notify);
  const [data, setData] = useState<GitHubDashboard | null>(sessionCache);
  const [loading, setLoading] = useState(!sessionCache);
  const lastRefresh = useRef(0);

  const load = useCallback(
    async (refresh = false) => {
      if (refresh && Date.now() - lastRefresh.current < 30_000) {
        notify("refreshCooldown", "warning");
        return;
      }
      if (refresh) lastRefresh.current = Date.now();
      setLoading(true);
      try {
        const response = await fetch(
          `/api/github${refresh ? "?refresh=1" : ""}`,
        );
        if (!response.ok)
          throw new Error(`GitHub route returned ${response.status}`);
        const dashboard = (await response.json()) as GitHubDashboard;
        sessionCache = dashboard;
        setData(dashboard);
        notify(
          dashboard.source === "live" ? "githubUpdated" : "githubUnavailable",
          dashboard.source === "live" ? "success" : "warning",
        );
      } catch {
        setData(null);
        notify("githubUnavailable", "warning");
      } finally {
        setLoading(false);
      }
    },
    [notify],
  );

  useEffect(() => {
    if (sessionCache) return;
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const languageData = useMemo(() => {
    if (!data) return [];
    const counts = new Map<string, number>();
    data.repositories.forEach((repository) => {
      if (repository.language)
        counts.set(
          repository.language,
          (counts.get(repository.language) ?? 0) + 1,
        );
    });
    return [...counts]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const formatDate = (date: string | null) =>
    date
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
          new Date(date),
        )
      : "—";

  return (
    <section className="app-scroll github-app">
      <div className="github-heading">
        <AppHeading title={t("title")} description={t("subtitle")} />
        <button
          type="button"
          className="button"
          onClick={() => void load(true)}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "is-spinning" : undefined}
          />
          {t("refresh")}
        </button>
      </div>
      {loading && !data ? (
        <div className="github-loading">
          <div className="skeleton skeleton--profile" />
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((item) => (
              <div className="skeleton" key={item} />
            ))}
          </div>
          <span>{t("loading")}</span>
        </div>
      ) : data ? (
        <>
          {data.source === "fallback" && (
            <div className="api-alert">
              <AlertTriangle size={18} />
              <div>
                <strong>
                  {data.error === "rate-limit"
                    ? t("rateLimited")
                    : data.error === "timeout"
                      ? t("timedOut")
                      : t("errorTitle")}
                </strong>
                <p>{t("errorDescription")}</p>
              </div>
              <span className="mono">{t("fallback")}</span>
            </div>
          )}
          <div className="github-profile">
            <Image
              src={data.profile.avatarUrl}
              width={88}
              height={88}
              alt={data.profile.name ?? data.profile.login}
            />
            <div>
              <div className="github-profile__name">
                <div>
                  <h2>{data.profile.name ?? data.profile.login}</h2>
                  <span className="mono">@{data.profile.login}</span>
                </div>
                <span className={`source-badge ${data.source}`}>
                  {data.source === "live" ? t("live") : t("fallback")}
                </span>
              </div>
              <p>{data.profile.bio ?? t("noDescription")}</p>
              <div className="github-profile__stats">
                <span>
                  <strong>{data.profile.publicRepos ?? "—"}</strong>
                  {t("publicRepos")}
                </span>
                <span>
                  <strong>{data.profile.followers ?? "—"}</strong>
                  {t("followers")}
                </span>
                <span>
                  <strong>{data.profile.following ?? "—"}</strong>
                  {t("following")}
                </span>
              </div>
            </div>
            <a
              className="button button--primary"
              href={data.profile.htmlUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch size={16} />
              {t("viewProfile")}
              <ExternalLink size={13} />
            </a>
          </div>

          {data.repositories.length > 0 && (
            <div className="github-overview">
              <section>
                <header>
                  <h2>{t("repositories")}</h2>
                  <span className="mono">{data.repositories.length}</span>
                </header>
                <div className="repo-list">
                  {data.repositories.slice(0, 12).map((repository) => (
                    <article key={repository.id} className="repo-card">
                      <div>
                        <h3>{repository.name}</h3>
                        <a
                          href={repository.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${t("viewRepository")} ${repository.name}`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                      <p>{repository.description ?? t("noDescription")}</p>
                      <footer>
                        <span>{repository.language ?? "—"}</span>
                        <span>
                          <Star size={13} />
                          {repository.stars}
                        </span>
                        <span>
                          <GitFork size={13} />
                          {repository.forks}
                        </span>
                        <time dateTime={repository.updatedAt}>
                          {t("updated", {
                            date: formatDate(repository.updatedAt),
                          })}
                        </time>
                      </footer>
                    </article>
                  ))}
                </div>
              </section>
              <aside>
                <header>
                  <h2>{t("language")}</h2>
                </header>
                {languageData.length > 0 && (
                  <div className="language-chart">
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie
                          data={languageData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={46}
                          outerRadius={72}
                          paddingAngle={3}
                        >
                          {languageData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={languageColor(index)}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#11161d",
                            border: "1px solid #2b333d",
                            borderRadius: 8,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <ul>
                      {languageData.map((item, index) => (
                        <li key={item.name}>
                          <span style={{ background: languageColor(index) }} />
                          {item.name}
                          <strong>{item.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          )}

          <div className="github-lower">
            <section>
              <header>
                <Activity size={18} />
                <h2>{t("recentActivity")}</h2>
              </header>
              {data.events.length ? (
                <ol className="activity-list">
                  {data.events.slice(0, 8).map((event) => (
                    <li key={event.id}>
                      <span className="activity-dot" />
                      <div>
                        <strong>{event.type.replace("Event", "")}</strong>
                        <span>{event.repository}</span>
                      </div>
                      <time dateTime={event.createdAt ?? undefined}>
                        {formatDate(event.createdAt)}
                      </time>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="empty-state">
                  <Users size={28} />
                  <p>{t("noActivity")}</p>
                </div>
              )}
            </section>
            <section>
              <header>
                <GitCommitHorizontal size={18} />
                <h2>{t("latestCommits")}</h2>
              </header>
              {Object.keys(data.commits).length ? (
                <div className="commit-list">
                  {Object.entries(data.commits).flatMap(
                    ([repository, commits]) =>
                      commits.map((commit) => (
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noreferrer"
                          key={`${repository}-${commit.sha}`}
                        >
                          <span className="mono">{commit.sha.slice(0, 7)}</span>
                          <div>
                            <strong>{commit.message}</strong>
                            <small>
                              {repository} · {formatDate(commit.date)}
                            </small>
                          </div>
                        </a>
                      )),
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <GitCommitHorizontal size={28} />
                  <p>{t("noCommits")}</p>
                </div>
              )}
            </section>
          </div>
          <p className="contribution-note">
            <AlertTriangle size={15} />
            {t("contributionsNote")}
          </p>
        </>
      ) : (
        <div className="empty-state">
          <AlertTriangle size={34} />
          <h2>{t("errorTitle")}</h2>
          <p>{t("errorDescription")}</p>
          <button className="button" type="button" onClick={() => void load()}>
            {common("refresh")}
          </button>
        </div>
      )}
    </section>
  );
}
