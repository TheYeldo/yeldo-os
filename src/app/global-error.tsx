"use client";

import { globalErrorMessages } from "@/data/fallback-messages";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const russian =
    typeof window !== "undefined" && window.location.pathname.startsWith("/ru");
  const copy = globalErrorMessages[russian ? "ru" : "en"];
  return (
    <html lang={russian ? "ru" : "en"}>
      <body>
        <main className="route-error">
          <span className="mono">SYS://FATAL</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <button type="button" onClick={reset}>
            {copy.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
