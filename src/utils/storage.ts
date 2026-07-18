import type { StateStorage } from "zustand/middleware";

const memory = new Map<string, string>();

export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return typeof window === "undefined"
        ? (memory.get(name) ?? null)
        : window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      if (typeof window === "undefined") memory.set(name, value);
      else window.localStorage.setItem(name, value);
    } catch {
      // The application remains functional when storage is unavailable.
    }
  },
  removeItem: (name) => {
    try {
      if (typeof window === "undefined") memory.delete(name);
      else window.localStorage.removeItem(name);
    } catch {
      // Ignore unavailable or privacy-restricted storage.
    }
  },
};

export function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
