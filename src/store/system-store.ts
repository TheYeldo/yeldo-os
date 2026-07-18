import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { appById } from "@/data/apps";
import { projects } from "@/data/projects";
import type {
  AppId,
  NotificationItem,
  SystemSettings,
  WindowState,
} from "@/types/system";
import { safeStorage } from "@/utils/storage";

const STORAGE_KEY = "yeldo-os-state-v1";

export const defaultSettings: SystemSettings = {
  theme: "graphite",
  accent: "cyan",
  wallpaper: "signal",
  interfaceScale: 1,
  animationIntensity: 0.72,
  reducedMotion: false,
  soundEnabled: false,
  bootEnabled: true,
  locale: "ru",
  clockFormat: "24",
  simplifiedMode: false,
};

interface SystemStore {
  hasHydrated: boolean;
  bootComplete: boolean;
  windows: WindowState[];
  highestZ: number;
  settings: SystemSettings;
  notifications: NotificationItem[];
  unlockedAchievements: string[];
  openedApps: AppId[];
  inspectedFeaturedProjects: string[];
  terminalCommandCount: number;
  selectedProjectId: string | null;
  selectedFilePath: string | null;
  recentActions: string[];
  commandPaletteOpen: boolean;
  notificationCenterOpen: boolean;
  setHasHydrated: (value: boolean) => void;
  finishBoot: () => void;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindow: (id: string, patch: Partial<WindowState>) => void;
  reflowWindows: (viewportWidth: number, viewportHeight: number) => void;
  updateSettings: (patch: Partial<SystemSettings>, track?: boolean) => void;
  openProject: (slug: string) => void;
  inspectProject: (slug: string) => void;
  openFile: (path: string) => void;
  recordTerminalCommand: (easterEgg?: boolean) => void;
  unlockAchievement: (id: string) => void;
  notify: (messageKey: string, tone?: NotificationItem["tone"]) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  addRecentAction: (id: string) => void;
  setCommandPaletteOpen: (open: boolean, keyboard?: boolean) => void;
  setNotificationCenterOpen: (open: boolean) => void;
  resetDesktop: () => void;
  resetAllData: () => void;
}

function notification(
  messageKey: string,
  tone: NotificationItem["tone"] = "info",
): NotificationItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    messageKey,
    tone,
    createdAt: Date.now(),
  };
}

function withAchievement(
  unlockedAchievements: string[],
  id: string,
): Pick<SystemStore, "unlockedAchievements"> | Record<string, never> {
  if (unlockedAchievements.includes(id)) return {};
  return { unlockedAchievements: [...unlockedAchievements, id] };
}

function createWindow(
  appId: AppId,
  index: number,
  zIndex: number,
): WindowState {
  const definition = appById[appId];
  const viewportWidth =
    typeof window === "undefined" ? 1280 : window.innerWidth;
  const viewportHeight =
    typeof window === "undefined" ? 800 : window.innerHeight;
  const availableWidth = Math.max(320, viewportWidth - 40);
  const availableHeight = Math.max(320, viewportHeight - 128);
  const width = Math.min(definition.defaultSize.width, availableWidth);
  const height = Math.min(definition.defaultSize.height, availableHeight);
  const offset = (index * 28) % 96;

  return {
    id: `window-${appId}`,
    appId,
    x: Math.max(8, (viewportWidth - width) / 2 - 18 + offset),
    y: Math.max(8, 22 + (offset % 64)),
    width,
    height,
    zIndex,
    mode: "normal",
  };
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      hasHydrated: false,
      bootComplete: false,
      windows: [],
      highestZ: 20,
      settings: defaultSettings,
      notifications: [],
      unlockedAchievements: [],
      openedApps: [],
      inspectedFeaturedProjects: [],
      terminalCommandCount: 0,
      selectedProjectId: null,
      selectedFilePath: null,
      recentActions: [],
      commandPaletteOpen: false,
      notificationCenterOpen: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      finishBoot: () =>
        set((state) => ({
          bootComplete: true,
          notifications: [
            notification("systemReady", "success"),
            ...state.notifications,
          ].slice(0, 12),
          ...withAchievement(state.unlockedAchievements, "first-boot"),
        })),
      openApp: (appId) =>
        set((state) => {
          const zIndex = state.highestZ + 1;
          const existing = state.windows.find((item) => item.appId === appId);
          const openedApps = state.openedApps.includes(appId)
            ? state.openedApps
            : [...state.openedApps, appId];
          const achievementPatch =
            openedApps.length >= 5
              ? withAchievement(state.unlockedAchievements, "explorer")
              : {};
          const openSourcePatch =
            appId === "github"
              ? withAchievement(
                  "unlockedAchievements" in achievementPatch
                    ? achievementPatch.unlockedAchievements
                    : state.unlockedAchievements,
                  "open-source",
                )
              : {};

          if (existing) {
            return {
              highestZ: zIndex,
              openedApps,
              windows: state.windows.map((item) =>
                item.id === existing.id
                  ? {
                      ...item,
                      zIndex,
                      mode: item.mode === "minimized" ? "normal" : item.mode,
                    }
                  : item,
              ),
              ...achievementPatch,
              ...openSourcePatch,
            };
          }

          return {
            highestZ: zIndex,
            openedApps,
            windows: [
              ...state.windows,
              createWindow(appId, state.windows.length, zIndex),
            ],
            notifications: [
              notification("applicationOpened"),
              ...state.notifications,
            ].slice(0, 12),
            ...achievementPatch,
            ...openSourcePatch,
          };
        }),
      closeWindow: (id) =>
        set((state) => ({
          windows: state.windows.filter((item) => item.id !== id),
        })),
      minimizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((item) =>
            item.id === id ? { ...item, mode: "minimized" } : item,
          ),
        })),
      toggleMaximize: (id) =>
        set((state) => ({
          windows: state.windows.map((item) =>
            item.id === id
              ? {
                  ...item,
                  mode: item.mode === "maximized" ? "normal" : "maximized",
                }
              : item,
          ),
        })),
      focusWindow: (id) =>
        set((state) => {
          const highestZ = state.highestZ + 1;
          return {
            highestZ,
            windows: state.windows.map((item) =>
              item.id === id ? { ...item, zIndex: highestZ } : item,
            ),
          };
        }),
      updateWindow: (id, patch) =>
        set((state) => ({
          windows: state.windows.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        })),
      reflowWindows: (viewportWidth, viewportHeight) =>
        set((state) => ({
          windows: state.windows.map((item) => {
            const width = Math.min(
              item.width,
              Math.max(320, viewportWidth - 24),
            );
            const height = Math.min(
              item.height,
              Math.max(300, viewportHeight - 112),
            );
            return {
              ...item,
              width,
              height,
              x: Math.max(0, Math.min(item.x, viewportWidth - width)),
              y: Math.max(0, Math.min(item.y, viewportHeight - height - 82)),
            };
          }),
        })),
      updateSettings: (patch, track = true) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
          ...(track
            ? withAchievement(state.unlockedAchievements, "administrator")
            : {}),
        })),
      openProject: (slug) => set({ selectedProjectId: slug }),
      inspectProject: (slug) =>
        set((state) => {
          const project = projects.find((item) => item.slug === slug);
          if (
            !project?.featured ||
            state.inspectedFeaturedProjects.includes(slug)
          )
            return { selectedProjectId: slug };
          const inspectedFeaturedProjects = [
            ...state.inspectedFeaturedProjects,
            slug,
          ];
          return {
            selectedProjectId: slug,
            inspectedFeaturedProjects,
            ...(inspectedFeaturedProjects.length ===
            projects.filter((item) => item.featured).length
              ? withAchievement(state.unlockedAchievements, "project-hunter")
              : {}),
          };
        }),
      openFile: (path) => set({ selectedFilePath: path }),
      recordTerminalCommand: (easterEgg = false) =>
        set((state) => {
          const terminalCommandCount = state.terminalCommandCount + 1;
          let unlockedAchievements = state.unlockedAchievements;
          if (
            terminalCommandCount >= 10 &&
            !unlockedAchievements.includes("terminal-user")
          ) {
            unlockedAchievements = [...unlockedAchievements, "terminal-user"];
          }
          if (easterEgg && !unlockedAchievements.includes("easter-egg")) {
            unlockedAchievements = [...unlockedAchievements, "easter-egg"];
          }
          return { terminalCommandCount, unlockedAchievements };
        }),
      unlockAchievement: (id) =>
        set((state) => withAchievement(state.unlockedAchievements, id)),
      notify: (messageKey, tone = "info") =>
        set((state) => ({
          notifications: [
            notification(messageKey, tone),
            ...state.notifications,
          ].slice(0, 12),
        })),
      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((item) => item.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
      addRecentAction: (id) =>
        set((state) => ({
          recentActions: [
            id,
            ...state.recentActions.filter((item) => item !== id),
          ].slice(0, 6),
        })),
      setCommandPaletteOpen: (commandPaletteOpen, keyboard = false) =>
        set((state) => ({
          commandPaletteOpen,
          ...(keyboard && commandPaletteOpen
            ? withAchievement(state.unlockedAchievements, "keyboard-first")
            : {}),
        })),
      setNotificationCenterOpen: (notificationCenterOpen) =>
        set({ notificationCenterOpen }),
      resetDesktop: () =>
        set((state) => ({
          windows: [],
          selectedProjectId: null,
          selectedFilePath: null,
          notifications: [
            notification("layoutReset", "success"),
            ...state.notifications,
          ].slice(0, 12),
        })),
      resetAllData: () => {
        safeStorage.removeItem(STORAGE_KEY);
        set({
          hasHydrated: true,
          bootComplete: true,
          windows: [],
          highestZ: 20,
          settings: defaultSettings,
          notifications: [notification("allDataReset", "success")],
          unlockedAchievements: [],
          openedApps: [],
          inspectedFeaturedProjects: [],
          terminalCommandCount: 0,
          selectedProjectId: null,
          selectedFilePath: null,
          recentActions: [],
          commandPaletteOpen: false,
          notificationCenterOpen: false,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (state) => ({
        windows: state.windows,
        highestZ: state.highestZ,
        settings: state.settings,
        unlockedAchievements: state.unlockedAchievements,
        openedApps: state.openedApps,
        inspectedFeaturedProjects: state.inspectedFeaturedProjects,
        terminalCommandCount: state.terminalCommandCount,
        recentActions: state.recentActions,
      }),
    },
  ),
);
