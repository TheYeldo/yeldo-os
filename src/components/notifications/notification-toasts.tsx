"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useSystemStore } from "@/store/system-store";

export function NotificationToasts() {
  const t = useTranslations("notifications");
  const notifications = useSystemStore((state) => state.notifications);
  const dismiss = useSystemStore((state) => state.dismissNotification);

  useEffect(() => {
    const timers = notifications.map((item) =>
      window.setTimeout(() => dismiss(item.id), 5_500),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [dismiss, notifications]);

  return (
    <div
      className="notification-toasts"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {notifications.slice(0, 3).map((item) => (
        <article key={item.id} className={`toast tone-${item.tone}`}>
          {item.tone === "success" ? (
            <CheckCircle2 size={18} />
          ) : item.tone === "warning" ? (
            <TriangleAlert size={18} />
          ) : (
            <Info size={18} />
          )}
          <p>{t(item.messageKey as never)}</p>
          <button
            type="button"
            onClick={() => dismiss(item.id)}
            aria-label={t("dismiss")}
          >
            <X size={14} />
          </button>
        </article>
      ))}
    </div>
  );
}
