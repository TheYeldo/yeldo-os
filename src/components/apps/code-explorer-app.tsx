"use client";

import {
  Check,
  ChevronRight,
  Copy,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { fileByPath, virtualFiles } from "@/data/virtual-files";
import type { Locale } from "@/i18n/routing";
import { useSystemStore } from "@/store/system-store";
import { copyText } from "@/utils/clipboard";

function CodeLines({ content, json }: { content: string; json: boolean }) {
  return (
    <pre className={`code-lines ${json ? "is-json" : ""}`}>
      {content.split("\n").map((line, index) => (
        <span className="code-line" key={index}>
          <span className="line-number">{index + 1}</span>
          <code>
            {json
              ? line
                  .split(
                    /(".*?"(?=\s*:)|".*?"|\b(?:true|false|null)\b|\b\d+\b)/g,
                  )
                  .map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      className={
                        token.startsWith('"')
                          ? token.endsWith('"') && line.includes(`${token}:`)
                            ? "token-key"
                            : "token-string"
                          : /^(true|false|null|\d+)$/.test(token)
                            ? "token-value"
                            : undefined
                      }
                    >
                      {token}
                    </span>
                  ))
              : line}
          </code>
        </span>
      ))}
    </pre>
  );
}

export default function CodeExplorerApp() {
  const t = useTranslations("code");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const requestedPath = useSystemStore((state) => state.selectedFilePath);
  const setRequestedPath = useSystemStore((state) => state.openFile);
  const notify = useSystemStore((state) => state.notify);
  const [openTabs, setOpenTabs] = useState<string[]>([
    virtualFiles[0]?.path ?? "",
  ]);
  const [localActivePath, setLocalActivePath] = useState(
    virtualFiles[0]?.path ?? "",
  );
  const [copied, setCopied] = useState(false);
  const fileButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const activePath =
    requestedPath && fileByPath[requestedPath]
      ? requestedPath
      : localActivePath;
  const visibleTabs =
    requestedPath &&
    fileByPath[requestedPath] &&
    !openTabs.includes(requestedPath)
      ? [...openTabs, requestedPath]
      : openTabs;
  const active = fileByPath[activePath];

  const groups = useMemo(() => {
    const grouped = new Map<string, typeof virtualFiles>();
    virtualFiles.forEach((file) => {
      const relative = file.path.replace("yeldo-portfolio/", "");
      const group = relative.includes("/")
        ? (relative.split("/")[0] ?? "root")
        : "root";
      grouped.set(group, [...(grouped.get(group) ?? []), file]);
    });
    return [...grouped.entries()];
  }, []);

  const open = (path: string) => {
    setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]));
    setLocalActivePath(path);
    setRequestedPath(path);
  };
  const close = (path: string) => {
    const remaining = visibleTabs.filter((tab) => tab !== path);
    setOpenTabs(remaining);
    if (activePath === path) {
      setRequestedPath("");
      setLocalActivePath(remaining[remaining.length - 1] ?? "");
    }
  };

  return (
    <section className="code-explorer">
      <aside className="file-sidebar">
        <header>
          <Folder size={16} /> <span>{t("tree")}</span>
          <small>{common("readOnly")}</small>
        </header>
        <nav aria-label={t("tree")}>
          {groups.map(([group, files]) => (
            <section key={group}>
              <h2>
                <ChevronRight size={13} />
                {group === "root" ? "yeldo-portfolio" : group}
              </h2>
              {files.map((file) => {
                const index = virtualFiles.findIndex(
                  (item) => item.path === file.path,
                );
                const Icon = file.language === "json" ? FileJson : FileText;
                return (
                  <button
                    ref={(node) => {
                      fileButtons.current[index] = node;
                    }}
                    type="button"
                    key={file.path}
                    className={
                      activePath === file.path ? "is-active" : undefined
                    }
                    onClick={() => open(file.path)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "ArrowDown" ||
                        event.key === "ArrowUp"
                      ) {
                        event.preventDefault();
                        const next =
                          event.key === "ArrowDown"
                            ? Math.min(virtualFiles.length - 1, index + 1)
                            : Math.max(0, index - 1);
                        fileButtons.current[next]?.focus();
                      }
                    }}
                  >
                    <Icon size={14} />
                    {file.name}
                  </button>
                );
              })}
            </section>
          ))}
        </nav>
      </aside>
      <main className="editor-pane">
        <div className="file-tabs" role="tablist" aria-label={t("tabs")}>
          {visibleTabs.map((path) => {
            const file = fileByPath[path];
            if (!file) return null;
            return (
              <div
                role="tab"
                aria-selected={path === activePath}
                className={path === activePath ? "is-active" : undefined}
                key={path}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLocalActivePath(path);
                    setRequestedPath(path);
                  }}
                >
                  <FileCode2 size={13} />
                  {file.name}
                </button>
                <button
                  type="button"
                  onClick={() => close(path)}
                  aria-label={t("closeTab", { file: file.name })}
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
        {active ? (
          <>
            <div className="editor-toolbar">
              <div className="breadcrumbs" aria-label={t("breadcrumb")}>
                {active.path.split("/").map((part, index, parts) => (
                  <span key={`${part}-${index}`}>
                    {part}
                    {index < parts.length - 1 && <ChevronRight size={12} />}
                  </span>
                ))}
              </div>
              <div>
                <span className="read-only-indicator">
                  {common("readOnly")}
                </span>
                <button
                  type="button"
                  aria-label={t("copyFile")}
                  onClick={async () => {
                    const success = await copyText(active.content[locale]);
                    notify(
                      success ? "copied" : "copyFailed",
                      success ? "success" : "warning",
                    );
                    if (success) {
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1_500);
                    }
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>
            <div className="editor-content">
              {active.language === "markdown" ? (
                <div className="markdown-preview">
                  <ReactMarkdown>{active.content[locale]}</ReactMarkdown>
                </div>
              ) : (
                <CodeLines content={active.content[locale]} json />
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <FileCode2 size={34} />
            <p>{t("empty")}</p>
            <small>{t("readOnlyDescription")}</small>
          </div>
        )}
      </main>
    </section>
  );
}
