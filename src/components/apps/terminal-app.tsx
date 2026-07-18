"use client";

import { CornerDownLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { terminalCommands } from "@/data/terminal-commands";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { executeTerminal } from "@/lib/terminal";
import { useSystemStore } from "@/store/system-store";

interface TerminalEntry {
  id: number;
  command: string;
  lines: string[];
}

export default function TerminalApp() {
  const t = useTranslations("terminal");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const settings = useSystemStore((state) => state.settings);
  const updateSettings = useSystemStore((state) => state.updateSettings);
  const openApp = useSystemStore((state) => state.openApp);
  const openProject = useSystemStore((state) => state.openProject);
  const minimizeWindow = useSystemStore((state) => state.minimizeWindow);
  const recordTerminalCommand = useSystemStore(
    (state) => state.recordTerminalCommand,
  );
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const suggestions = useMemo(() => {
    const normalized = input.trim().toLowerCase();
    if (!normalized) return [];
    return terminalCommands
      .filter(
        (command) => command.startsWith(normalized) && command !== normalized,
      )
      .slice(0, 4);
  }, [input]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [entries]);

  const run = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    const translator = (
      key: string,
      values?: Record<string, string | number>,
    ) => t(key as never, values as never);
    const result = executeTerminal(command, {
      cwd,
      locale,
      theme: settings.theme,
      history,
      t: translator,
    });
    recordTerminalCommand(result.easterEgg ?? false);
    const nextHistory = [...history, command];
    setHistory(nextHistory);
    setHistoryIndex(-1);
    setEntries((current) =>
      result.clear
        ? []
        : [...current, { id: nextId.current++, command, lines: result.lines }],
    );
    if (result.cwd) setCwd(result.cwd);
    if (result.theme) updateSettings({ theme: result.theme });
    if (result.appToOpen) openApp(result.appToOpen);
    if (result.projectToOpen) openProject(result.projectToOpen);
    if (result.externalUrl)
      window.open(result.externalUrl, "_blank", "noopener,noreferrer");
    if (result.locale) {
      updateSettings({ locale: result.locale }, false);
      router.replace(pathname, { locale: result.locale });
    }
    if (result.exit)
      window.setTimeout(() => minimizeWindow("window-terminal"), 350);
    setInput("");
  };

  return (
    <section className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <header>
        <span className="terminal-led" /> <span>{t("title")}</span>
        <small>{t("simulationNotice")}</small>
      </header>
      <div
        className="terminal-output"
        ref={outputRef}
        role="log"
        aria-live="polite"
      >
        <div className="terminal-banner">
          <span className="terminal-glyph" aria-hidden="true">
            Y/
          </span>
          <div>
            <strong>YeldoOS</strong>
            <span>{t("banner")}</span>
          </div>
        </div>
        {entries.map((entry) => (
          <div className="terminal-entry" key={entry.id}>
            <div className="terminal-command">
              <span className="terminal-prompt">yeldo@os</span>
              <span className="muted">:{cwd}$</span> {entry.command}
            </div>
            {entry.lines.map((line, index) => (
              <div className="terminal-line" key={`${entry.id}-${index}`}>
                {line || "\u00a0"}
              </div>
            ))}
          </div>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div className="terminal-suggestions">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={(event) => {
                event.stopPropagation();
                setInput(suggestion);
                inputRef.current?.focus();
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <form
        className="terminal-input"
        onSubmit={(event) => {
          event.preventDefault();
          run(input);
        }}
      >
        <label htmlFor="terminal-command">
          <span>yeldo@os</span>
          <span className="muted">:{cwd}$</span>
        </label>
        <input
          id="terminal-command"
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("promptLabel")}
          autoComplete="off"
          spellCheck={false}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              if (!history.length) return;
              const next =
                historyIndex < 0
                  ? history.length - 1
                  : Math.max(0, historyIndex - 1);
              setHistoryIndex(next);
              setInput(history[next] ?? "");
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (historyIndex < 0) return;
              const next = historyIndex + 1;
              if (next >= history.length) {
                setHistoryIndex(-1);
                setInput("");
              } else {
                setHistoryIndex(next);
                setInput(history[next] ?? "");
              }
            }
            if (event.key === "Tab" && suggestions[0]) {
              event.preventDefault();
              setInput(suggestions[0]);
            }
          }}
        />
        <button type="submit" aria-label={t("promptLabel")}>
          <CornerDownLeft size={17} />
        </button>
      </form>
    </section>
  );
}
