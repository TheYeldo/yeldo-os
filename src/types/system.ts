import type { Locale } from "@/i18n/routing";

export const appIds = [
  "about",
  "projects",
  "github",
  "terminal",
  "code",
  "skills",
  "timeline",
  "contact",
  "settings",
  "achievements",
  "archive",
] as const;

export type AppId = (typeof appIds)[number];
export type ThemeId = "graphite" | "oled" | "midnight" | "light";
export type AccentId = "cyan" | "violet" | "blue" | "mint";
export type WallpaperId = "signal" | "grid" | "quiet";
export type WindowMode = "normal" | "minimized" | "maximized";

export interface WindowState {
  id: string;
  appId: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  mode: WindowMode;
}

export interface SystemSettings {
  theme: ThemeId;
  accent: AccentId;
  wallpaper: WallpaperId;
  interfaceScale: number;
  animationIntensity: number;
  reducedMotion: boolean;
  soundEnabled: boolean;
  bootEnabled: boolean;
  locale: Locale;
  clockFormat: "12" | "24";
  simplifiedMode: boolean;
}

export interface NotificationItem {
  id: string;
  messageKey: string;
  tone: "info" | "success" | "warning";
  createdAt: number;
}

export type ProjectStatus =
  "released" | "development" | "prototype" | "concept" | "archived";

export interface LocalizedText {
  ru: string;
  en: string;
}

export interface Project {
  title: string;
  slug: string;
  status: ProjectStatus;
  year: number | null;
  description: LocalizedText;
  caseStudy: LocalizedText;
  role: LocalizedText;
  technologies: string[];
  challenge: LocalizedText;
  solution: LocalizedText;
  lessons: LocalizedText;
  screenshots: string[];
  videoUrl: string | null;
  repositoryUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "ui" | "tools" | "modding" | "learning";
  context: LocalizedText;
  relatedProjects: string[];
  status: "used" | "learning";
  evidenceUrl: string | null;
}

export interface TimelineEntry {
  id: string;
  date: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  category: "learning" | "project" | "system";
  projectSlug: string | null;
}

export interface VirtualFile {
  path: string;
  name: string;
  language: "markdown" | "json";
  content: LocalizedText;
}

export interface AppDefinition {
  id: AppId;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  dock: boolean;
  desktop: boolean;
}

export interface SearchEntry {
  id: string;
  type:
    "app" | "project" | "skill" | "file" | "timeline" | "command" | "contact";
  title: string;
  subtitle: string;
  keywords: string[];
  appId?: AppId;
  target?: string;
}
