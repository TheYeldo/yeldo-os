"use client";

import { Bell, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSystemStore } from "@/store/system-store";

const ToneIcon = ({ tone }: { tone: "info" | "success" | "warning" }) =>
  tone === "success" ? (
    <CheckCircle2 size={17} />
  ) : tone === "warning" ? (
    <TriangleAlert size={17} />
  ) : (
    <Info size={17} />
  );

export function NotificationCenter() {
  const t = useTranslations("notifications");
  const open = useSystemStore((state) => state.notificationCenterOpen);
  const notifications = useSystemStore((state) => state.notifications);
  const setOpen = useSystemStore((state) => state.setNotificationCenterOpen);
  const dismiss = useSystemStore((state) => state.dismissNotification);
  const clear = useSystemStore((state) => state.clearNotifications);
  if (!open) return null;

  return (
    <aside className="notification-center" aria-label={t("title")}>
      <header>
        <div>
          <Bell size={17} />
          <h2>{t("title")}</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("dismiss")}
        >
          <X size={17} />
        </button>
      </header>
      <div>
        {notifications.length ? (
          notifications.map((item) => (
            <article
              key={item.id}
              className={`notification-item tone-${item.tone}`}
            >
              <ToneIcon tone={item.tone} />
              <p>{t(item.messageKey as never)}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label={t("dismiss")}
              >
                <X size={14} />
              </button>
            </article>
          ))
        ) : (
          <div className="notification-empty">
            <Bell size={28} />
            <p>{t("empty")}</p>
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <button type="button" className="notification-clear" onClick={clear}>
          {t("clearAll")}
        </button>
      )}
    </aside>
  );
}
