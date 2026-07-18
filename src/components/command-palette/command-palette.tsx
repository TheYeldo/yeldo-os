"use client";

import Fuse from "fuse.js";
import { ArrowRight, Command, CornerDownLeft, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { applications } from "@/data/apps";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { terminalCommands } from "@/data/terminal-commands";
import { timeline } from "@/data/timeline";
import { virtualFiles } from "@/data/virtual-files";
import { profile } from "@/config/profile";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useSystemStore } from "@/store/system-store";
import type { AppId, SearchEntry, ThemeId } from "@/types/system";
import { copyText } from "@/utils/clipboard";
import { AppIcon } from "@/components/ui/app-icon";

interface PaletteItem extends SearchEntry {
  groupKey:
    | "applications"
    | "projects"
    | "skills"
    | "files"
    | "timeline"
    | "commands"
    | "contacts"
    | "actions";
  run: () => void | Promise<void>;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function CommandPalette() {
  const t = useTranslations("palette");
  const tApps = useTranslations("apps");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const open = useSystemStore((state) => state.commandPaletteOpen);
  const setOpen = useSystemStore((state) => state.setCommandPaletteOpen);
  const openApp = useSystemStore((state) => state.openApp);
  const openProject = useSystemStore((state) => state.inspectProject);
  const openFile = useSystemStore((state) => state.openFile);
  const updateSettings = useSystemStore((state) => state.updateSettings);
  const settings = useSystemStore((state) => state.settings);
  const resetDesktop = useSystemStore((state) => state.resetDesktop);
  const notify = useSystemStore((state) => state.notify);
  const recentActions = useSystemStore((state) => state.recentActions);
  const addRecentAction = useSystemStore((state) => state.addRecentAction);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closePalette = () => {
    setQuery("");
    setSelected(0);
    setOpen(false);
  };

  const items = useMemo<PaletteItem[]>(() => {
    const runApp = (appId: AppId) => () => openApp(appId);
    const appItems: PaletteItem[] = applications.map((app) => ({
      id: `app:${app.id}`,
      type: "app",
      groupKey: "applications",
      title: tApps(app.nameKey as never),
      subtitle: tApps(app.descriptionKey as never),
      keywords: [app.id, app.icon],
      appId: app.id,
      run: runApp(app.id),
    }));
    const projectItems: PaletteItem[] = projects.map((project) => ({
      id: `project:${project.slug}`,
      type: "project",
      groupKey: "projects",
      title: project.title,
      subtitle: project.description[locale],
      keywords: [project.slug, project.status, ...project.technologies],
      appId: "projects",
      target: project.slug,
      run: () => {
        openProject(project.slug);
        openApp("projects");
      },
    }));
    const skillItems: PaletteItem[] = skills.map((skill) => ({
      id: `skill:${skill.id}`,
      type: "skill",
      groupKey: "skills",
      title: skill.name,
      subtitle: skill.context[locale],
      keywords: [skill.category, ...skill.relatedProjects],
      appId: "skills",
      run: runApp("skills"),
    }));
    const fileItems: PaletteItem[] = virtualFiles.map((file) => ({
      id: `file:${file.path}`,
      type: "file",
      groupKey: "files",
      title: file.name,
      subtitle: file.path,
      keywords: [file.language, file.content[locale].slice(0, 160)],
      appId: "code",
      target: file.path,
      run: () => {
        openFile(file.path);
        openApp("code");
      },
    }));
    const timelineItems: PaletteItem[] = timeline.map((entry) => ({
      id: `timeline:${entry.id}`,
      type: "timeline",
      groupKey: "timeline",
      title: entry.title[locale],
      subtitle: entry.description[locale],
      keywords: [entry.category, entry.date[locale]],
      appId: "timeline",
      run: runApp("timeline"),
    }));
    const commandItems: PaletteItem[] = terminalCommands.map((command) => ({
      id: `command:${command}`,
      type: "command",
      groupKey: "commands",
      title: command,
      subtitle: t("commands"),
      keywords: ["terminal", "shell"],
      appId: "terminal",
      run: runApp("terminal"),
    }));
    const system: PaletteItem[] = [
      {
        id: "action:github",
        type: "contact",
        groupKey: "contacts",
        title: t("openGithub"),
        subtitle: `github.com/${profile.githubUsername}`,
        keywords: ["social", "profile"],
        run: () => {
          window.open(
            `https://github.com/${profile.githubUsername}`,
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
      {
        id: "action:portfolio",
        type: "contact",
        groupKey: "contacts",
        title: t("openPortfolio"),
        subtitle: profile.portfolioUrl,
        keywords: ["website", "live"],
        run: () => {
          window.open(profile.portfolioUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "action:telegram",
        type: "contact",
        groupKey: "contacts",
        title: t("copyTelegram"),
        subtitle: profile.telegram,
        keywords: ["copy", "contact"],
        run: async () => {
          const success = await copyText(profile.telegram);
          notify(
            success ? "copied" : "copyFailed",
            success ? "success" : "warning",
          );
        },
      },
      {
        id: "action:email",
        type: "contact",
        groupKey: "contacts",
        title: t("copyEmail"),
        subtitle: profile.email ?? "",
        keywords: ["copy", "contact", "email", "mail"],
        run: async () => {
          if (!profile.email) return;
          const success = await copyText(profile.email);
          notify(
            success ? "copied" : "copyFailed",
            success ? "success" : "warning",
          );
        },
      },
      ...(["graphite", "oled", "midnight", "light"] as ThemeId[]).map(
        (theme) => ({
          id: `action:theme:${theme}`,
          type: "command" as const,
          groupKey: "actions" as const,
          title: t(`theme${theme[0]?.toUpperCase()}${theme.slice(1)}` as never),
          subtitle: theme,
          keywords: ["theme", "appearance"],
          run: () => {
            updateSettings({ theme });
            notify("themeChanged", "success");
          },
        }),
      ),
      {
        id: "action:language:ru",
        type: "command",
        groupKey: "actions",
        title: t("languageRu"),
        subtitle: "Русский",
        keywords: ["locale", "language"],
        run: () => router.replace(pathname, { locale: "ru" }),
      },
      {
        id: "action:language:en",
        type: "command",
        groupKey: "actions",
        title: t("languageEn"),
        subtitle: "English",
        keywords: ["locale", "language"],
        run: () => router.replace(pathname, { locale: "en" }),
      },
      {
        id: "action:reset",
        type: "command",
        groupKey: "actions",
        title: t("resetLayout"),
        subtitle: "WINDOWS://DEFAULT",
        keywords: ["desktop", "restore"],
        run: resetDesktop,
      },
      {
        id: "action:motion",
        type: "command",
        groupKey: "actions",
        title: t("toggleMotion"),
        subtitle: settings.reducedMotion ? "ON" : "OFF",
        keywords: ["animation", "accessibility"],
        run: () => updateSettings({ reducedMotion: !settings.reducedMotion }),
      },
    ];
    return [
      ...appItems,
      ...projectItems,
      ...skillItems,
      ...fileItems,
      ...timelineItems,
      ...commandItems,
      ...system,
    ];
  }, [
    locale,
    notify,
    openApp,
    openFile,
    openProject,
    pathname,
    resetDesktop,
    router,
    settings.reducedMotion,
    t,
    tApps,
    updateSettings,
  ]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 0.45 },
          { name: "subtitle", weight: 0.25 },
          { name: "keywords", weight: 0.3 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [items],
  );
  const visible = useMemo(() => {
    if (query.trim())
      return fuse
        .search(query)
        .slice(0, 24)
        .map((result) => result.item);
    const recent = recentActions
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is PaletteItem => Boolean(item));
    return recent.length
      ? recent
      : items.filter((item) => item.groupKey === "applications").slice(0, 8);
  }, [fuse, items, query, recentActions]);
  const groups = useMemo(
    () => [...new Set(visible.map((item) => item.groupKey))],
    [visible],
  );

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const run = async (item: PaletteItem) => {
    addRecentAction(item.id);
    await item.run();
    closePalette();
  };

  if (!open) return null;

  return (
    <div
      className="palette-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePalette();
      }}
    >
      <div
        className="command-palette"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closePalette();
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelected((value) => Math.min(visible.length - 1, value + 1));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelected((value) => Math.max(0, value - 1));
          }
          if (event.key === "Enter" && visible[selected]) {
            event.preventDefault();
            void run(visible[selected]);
          }
          if (event.key === "Tab") {
            const focusable =
              dialogRef.current?.querySelectorAll<HTMLElement>("input,button");
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <header>
          <div>
            <Command size={17} />
            <span>{t("title")}</span>
          </div>
          <button type="button" onClick={closePalette} aria-label={t("title")}>
            <X size={17} />
          </button>
        </header>
        <label className="palette-search">
          <Search size={19} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            placeholder={t("placeholder")}
          />
          <kbd>ESC</kbd>
        </label>
        <div className="palette-results">
          {visible.length ? (
            groups.map((group) => (
              <section key={group}>
                <h2>
                  {!query && recentActions.length ? t("recent") : t(group)}
                </h2>
                {visible
                  .filter((item) => item.groupKey === group)
                  .map((item) => {
                    const index = visible.indexOf(item);
                    const app = item.appId
                      ? applications.find(
                          (candidate) => candidate.id === item.appId,
                        )
                      : null;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={
                          selected === index ? "is-selected" : undefined
                        }
                        onMouseEnter={() => setSelected(index)}
                        onClick={() => void run(item)}
                      >
                        <span className="palette-item__icon">
                          {app ? (
                            <AppIcon icon={app.icon} size={17} />
                          ) : (
                            <ArrowRight size={16} />
                          )}
                        </span>
                        <span>
                          <strong>
                            <Highlight text={item.title} query={query} />
                          </strong>
                          <small>
                            <Highlight text={item.subtitle} query={query} />
                          </small>
                        </span>
                        {selected === index && <CornerDownLeft size={14} />}
                      </button>
                    );
                  })}
              </section>
            ))
          ) : (
            <div className="palette-empty">
              <Search size={28} />
              <p>{t("empty")}</p>
            </div>
          )}
        </div>
        <footer>
          <span>{t("hint")}</span>
          <span className="mono">{t("shortcut")}</span>
        </footer>
      </div>
    </div>
  );
}
