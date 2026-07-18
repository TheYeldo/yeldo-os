import { terminalDirectories } from "@/data/terminal-commands";
import { virtualFiles } from "@/data/virtual-files";
import { profile } from "@/config/profile";
import type { AppId, ThemeId } from "@/types/system";
import type { Locale } from "@/i18n/routing";

type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export interface TerminalContext {
  cwd: string;
  locale: Locale;
  theme: ThemeId;
  history: string[];
  t: Translate;
  now?: Date;
}

export interface TerminalResult {
  lines: string[];
  cwd?: string;
  clear?: boolean;
  appToOpen?: AppId;
  projectToOpen?: string;
  theme?: ThemeId;
  locale?: Locale;
  externalUrl?: string;
  exit?: boolean;
  easterEgg?: boolean;
}

const appAliases: Record<string, AppId> = {
  about: "about",
  projects: "projects",
  github: "github",
  terminal: "terminal",
  code: "code",
  "code-explorer": "code",
  skills: "skills",
  timeline: "timeline",
  contact: "contact",
  settings: "settings",
  achievements: "achievements",
  archive: "archive",
};

const projectAliases: Record<string, string> = {
  taytlo: "taytlo",
  echo: "echo-protocol",
  "echo-protocol": "echo-protocol",
  simulator: "programming-simulator",
  "programming-simulator": "programming-simulator",
  hotel: "hotel-experience",
  "hotel-experience": "hotel-experience",
  portfolio: "developer-portfolio",
};

function resolveFile(cwd: string, input: string) {
  const aliases: Record<string, string> = {
    "about.md": "yeldo-portfolio/about/biography.md",
    "README.md": "yeldo-portfolio/README.md",
  };
  const normalized = input.replace(/^\.\//, "");
  const candidate =
    aliases[normalized] ??
    (normalized.startsWith("yeldo-portfolio/")
      ? normalized
      : `yeldo-portfolio/${cwd === "~" ? "" : `${cwd}/`}${normalized}`);
  return virtualFiles.find((file) => file.path === candidate);
}

export function executeTerminal(
  input: string,
  context: TerminalContext,
): TerminalResult {
  const trimmed = input.trim();
  const normalized = trimmed.replace(/\s+/g, " ");
  const [command = "", ...args] = normalized.split(" ");
  const t = context.t;

  if (!trimmed) return { lines: [] };
  if (normalized === "sudo rm -rf /") {
    return { lines: [t("sudoDestroy")], easterEgg: true };
  }
  if (normalized === "sudo make me coffee") {
    return { lines: [t("coffee")], easterEgg: true };
  }
  if (normalized === "hack nasa") {
    return { lines: [t("nasa")], easterEgg: true };
  }
  if (normalized === "git status") return { lines: t("gitStatus").split("\n") };
  if (normalized === "git log") return { lines: t("gitLog").split("\n") };
  if (normalized === "npm run dev") return { lines: t("npmDev").split("\n") };

  switch (command.toLowerCase()) {
    case "help":
      return { lines: [t("help")] };
    case "clear":
      return { lines: [], clear: true };
    case "pwd":
      return {
        lines: [t("pwd", { path: context.cwd === "~" ? "" : context.cwd })],
      };
    case "ls": {
      const key =
        context.cwd === "~"
          ? "lsRoot"
          : `ls${context.cwd[0]?.toUpperCase()}${context.cwd.slice(1)}`;
      return { lines: [t(key)] };
    }
    case "cd": {
      const target = args[0] ?? "~";
      if (target === ".." || target === "~" || target === "/home/yeldo")
        return { lines: [], cwd: "~" };
      const clean = target.replace(/\/$/, "");
      if (terminalDirectories.includes(clean)) return { lines: [], cwd: clean };
      return { lines: [t("directoryMissing", { path: target })] };
    }
    case "cat": {
      const target = args.join(" ");
      const file = resolveFile(context.cwd, target);
      if (!file) return { lines: [t("fileMissing", { path: target })] };
      return { lines: file.content[context.locale].split("\n") };
    }
    case "whoami":
      return { lines: [t("whoami")] };
    case "about":
      return { lines: [t("about")] };
    case "projects":
      return { lines: t("projects").split("\n"), appToOpen: "projects" };
    case "skills":
      return { lines: t("skills").split("\n"), appToOpen: "skills" };
    case "github":
      return { lines: [t("github")], appToOpen: "github" };
    case "contact":
      return {
        lines: t("contact", { email: profile.email ?? "—" }).split("\n"),
        appToOpen: "contact",
      };
    case "history":
      return {
        lines: context.history.length
          ? context.history.map((item, index) => `${index + 1}  ${item}`)
          : [t("historyEmpty")],
      };
    case "theme": {
      const theme = args[0] as ThemeId | undefined;
      if (!theme) return { lines: [t("themeUsage")] };
      if (!["graphite", "oled", "midnight", "light"].includes(theme))
        return { lines: [t("themeInvalid", { theme })] };
      return { lines: [t("themeChanged", { theme })], theme };
    }
    case "language": {
      const locale = args[0] as Locale | undefined;
      if (!locale) return { lines: [t("languageUsage")] };
      if (!(["ru", "en"] as string[]).includes(locale))
        return { lines: [t("languageInvalid")] };
      return { lines: [t("languageChanged", { language: locale })], locale };
    }
    case "open": {
      const target = (args[0] ?? "").toLowerCase();
      if (!target) return { lines: [t("openUsage")] };
      if (target === "portfolio") {
        return {
          lines: [t("opening", { target })],
          externalUrl: "https://theyeldo.github.io/portfolio/",
        };
      }
      const appId = appAliases[target];
      if (appId) return { lines: [t("opening", { target })], appToOpen: appId };
      const projectToOpen = projectAliases[target];
      if (projectToOpen)
        return {
          lines: [t("opening", { target })],
          appToOpen: "projects",
          projectToOpen,
        };
      return { lines: [t("openInvalid", { target })] };
    }
    case "date": {
      const date = new Intl.DateTimeFormat(context.locale, {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(context.now ?? new Date());
      return { lines: [t("date", { date })] };
    }
    case "echo":
      return { lines: [args.join(" ") || t("echoEmpty")] };
    case "neofetch":
      return {
        lines: t("neofetch", {
          locale: context.locale,
          theme: context.theme,
        }).split("\n"),
      };
    case "sudo":
      return { lines: [t("sudoRefusal")] };
    case "exit":
      return { lines: [t("exit")], exit: true };
    default:
      return { lines: [t("unknown", { command: trimmed })] };
  }
}
