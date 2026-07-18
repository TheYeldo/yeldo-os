import { beforeEach, describe, expect, it } from "vitest";

import { useSystemStore } from "@/store/system-store";

describe("window state", () => {
  beforeEach(() => {
    useSystemStore.getState().resetAllData();
  });

  it("opens one window per application and focuses an existing window", () => {
    const store = useSystemStore.getState();
    store.openApp("projects");
    const firstZ = useSystemStore.getState().windows[0]?.zIndex;
    useSystemStore.getState().openApp("projects");
    expect(useSystemStore.getState().windows).toHaveLength(1);
    expect(useSystemStore.getState().windows[0]?.zIndex).toBeGreaterThan(
      firstZ ?? 0,
    );
  });

  it("minimizes, restores, maximizes, and closes a window", () => {
    const store = useSystemStore.getState();
    store.openApp("terminal");
    store.minimizeWindow("window-terminal");
    expect(useSystemStore.getState().windows[0]?.mode).toBe("minimized");
    useSystemStore.getState().openApp("terminal");
    expect(useSystemStore.getState().windows[0]?.mode).toBe("normal");
    useSystemStore.getState().toggleMaximize("window-terminal");
    expect(useSystemStore.getState().windows[0]?.mode).toBe("maximized");
    useSystemStore.getState().closeWindow("window-terminal");
    expect(useSystemStore.getState().windows).toHaveLength(0);
  });
});
