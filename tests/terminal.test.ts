import { describe, expect, it } from "vitest";

import { executeTerminal } from "@/lib/terminal";

const t = (key: string, values?: Record<string, string | number>) =>
  `${key}${values ? `:${JSON.stringify(values)}` : ""}`;

const context = {
  cwd: "~",
  locale: "en" as const,
  theme: "graphite" as const,
  history: ["whoami"],
  t,
  now: new Date("2026-07-18T12:00:00Z"),
};

describe("executeTerminal", () => {
  it("opens a project through its application", () => {
    const result = executeTerminal("open taytlo", context);
    expect(result.appToOpen).toBe("projects");
    expect(result.projectToOpen).toBe("taytlo");
  });

  it("changes only supported themes", () => {
    expect(executeTerminal("theme oled", context).theme).toBe("oled");
    expect(executeTerminal("theme windows", context).theme).toBeUndefined();
  });

  it("returns real virtual file content", () => {
    const result = executeTerminal("cat about.md", context);
    expect(result.lines.join(" ")).toContain("Yeldo is a frontend developer");
  });

  it("refuses destructive sudo commands and marks the easter egg", () => {
    const result = executeTerminal("sudo rm -rf /", context);
    expect(result.easterEgg).toBe(true);
    expect(result.lines[0]).toBe("sudoDestroy");
  });

  it("clears without producing output", () => {
    expect(executeTerminal("clear", context)).toEqual({
      lines: [],
      clear: true,
    });
  });
});
