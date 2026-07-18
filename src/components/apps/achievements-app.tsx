"use client";

import { Award, LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";

import { achievements } from "@/data/achievements";
import { useSystemStore } from "@/store/system-store";
import { AppHeading } from "./app-heading";

export default function AchievementsApp() {
  const t = useTranslations("achievements");
  const unlocked = useSystemStore((state) => state.unlockedAchievements);
  return (
    <section className="app-scroll achievements-app">
      <AppHeading title={t("title")} description={t("description")} />
      <div className="achievement-progress">
        <span>
          {t("progress", {
            count: unlocked.length,
            total: achievements.length,
          })}
        </span>
        <div>
          <span
            style={{
              width: `${(unlocked.length / achievements.length) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="achievement-grid">
        {achievements.map((achievement, index) => {
          const isUnlocked = unlocked.includes(achievement.id);
          return (
            <article
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? "is-unlocked" : ""}`}
            >
              <div className="achievement-card__icon">
                {isUnlocked ? <Award size={24} /> : <LockKeyhole size={21} />}
              </div>
              <span className="mono">
                A-{String(index + 1).padStart(2, "0")}
              </span>
              <h2>{isUnlocked ? t(achievement.titleKey) : t("locked")}</h2>
              <p>
                {isUnlocked
                  ? t(achievement.descriptionKey)
                  : "••••••••••••••••"}
              </p>
              <small>{isUnlocked ? t("unlocked") : t("locked")}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
