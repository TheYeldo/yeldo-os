"use client";

import { Award, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { achievements } from "@/data/achievements";
import { useSystemStore } from "@/store/system-store";

export function AchievementToast() {
  const t = useTranslations("achievements");
  const notifications = useTranslations("notifications");
  const unlocked = useSystemStore((state) => state.unlockedAchievements);
  const previous = useRef(unlocked);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const added = unlocked.find((id) => !previous.current.includes(id));
    previous.current = unlocked;
    if (!added) return;
    setCurrent(added);
    const timer = window.setTimeout(() => setCurrent(null), 5_000);
    return () => window.clearTimeout(timer);
  }, [unlocked]);

  const achievement = achievements.find((item) => item.id === current);
  if (!achievement) return null;
  return (
    <aside className="achievement-toast" role="status">
      <span>
        <Award size={20} />
      </span>
      <div>
        <small>{notifications("achievementUnlocked")}</small>
        <strong>{t(achievement.titleKey as never)}</strong>
        <p>{t(achievement.descriptionKey as never)}</p>
      </div>
      <button
        type="button"
        onClick={() => setCurrent(null)}
        aria-label={notifications("dismiss")}
      >
        <X size={14} />
      </button>
    </aside>
  );
}
