import { clsx } from "clsx";

export function SystemLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={clsx("system-logo", compact && "system-logo--compact")}
      aria-hidden="true"
    >
      <span className="system-logo__mark">
        <span />
        <span />
        <span />
      </span>
      {!compact && <span className="system-logo__word">YeldoOS</span>}
    </span>
  );
}
