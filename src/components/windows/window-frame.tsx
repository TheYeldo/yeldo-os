"use client";

import { Minus, Square, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Rnd } from "react-rnd";

import { appById } from "@/data/apps";
import { useSystemStore } from "@/store/system-store";
import type { WindowState } from "@/types/system";
import { AppIcon } from "@/components/ui/app-icon";
import { AppRenderer } from "./app-renderer";

export function WindowFrame({
  windowState,
  active,
  disableResize,
  mobile,
}: {
  windowState: WindowState;
  active: boolean;
  disableResize: boolean;
  mobile: boolean;
}) {
  const tApps = useTranslations("apps");
  const tWindow = useTranslations("window");
  const definition = appById[windowState.appId];
  const name = tApps(definition.nameKey as never);
  const closeWindow = useSystemStore((state) => state.closeWindow);
  const minimizeWindow = useSystemStore((state) => state.minimizeWindow);
  const toggleMaximize = useSystemStore((state) => state.toggleMaximize);
  const focusWindow = useSystemStore((state) => state.focusWindow);
  const updateWindow = useSystemStore((state) => state.updateWindow);
  const maximized = windowState.mode === "maximized";
  const fullScreen = maximized || mobile;

  if (windowState.mode === "minimized") return null;

  return (
    <Rnd
      className={`window-frame ${active ? "is-active" : ""} ${fullScreen ? "is-maximized" : ""} ${mobile ? "is-mobile-window" : ""}`}
      style={{ zIndex: windowState.zIndex }}
      size={
        fullScreen
          ? { width: "100%", height: "100%" }
          : { width: windowState.width, height: windowState.height }
      }
      position={
        fullScreen ? { x: 0, y: 0 } : { x: windowState.x, y: windowState.y }
      }
      minWidth={disableResize ? 320 : definition.minSize.width}
      minHeight={disableResize ? 300 : definition.minSize.height}
      bounds="parent"
      dragHandleClassName="window-titlebar__drag"
      disableDragging={fullScreen}
      enableResizing={!fullScreen && !disableResize}
      onMouseDown={() => focusWindow(windowState.id)}
      onDragStart={() => focusWindow(windowState.id)}
      onDragStop={(_event, data) =>
        updateWindow(windowState.id, {
          x: Math.max(0, data.x),
          y: Math.max(0, data.y),
        })
      }
      onResizeStart={() => focusWindow(windowState.id)}
      onResizeStop={(_event, _direction, ref, _delta, position) =>
        updateWindow(windowState.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        })
      }
      aria-label={tWindow("region", { app: name })}
      role="dialog"
    >
      <div className="window-surface">
        <header
          className="window-titlebar"
          onDoubleClick={() => toggleMaximize(windowState.id)}
        >
          <div
            className="window-titlebar__drag"
            aria-label={tWindow("move", { app: name })}
          >
            <span className="window-app-icon">
              <AppIcon icon={definition.icon} size={15} />
            </span>
            <strong>{name}</strong>
            <span className="window-titlebar__mode mono">
              {maximized ? "MAX" : "WND"}
            </span>
          </div>
          <div className="window-controls">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                minimizeWindow(windowState.id);
              }}
              aria-label={tWindow("minimize", { app: name })}
            >
              <Minus size={15} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleMaximize(windowState.id);
              }}
              aria-label={tWindow(maximized ? "restore" : "maximize", {
                app: name,
              })}
            >
              <Square size={12} />
            </button>
            <button
              type="button"
              className="window-control-close"
              onClick={(event) => {
                event.stopPropagation();
                closeWindow(windowState.id);
              }}
              aria-label={tWindow("close", { app: name })}
            >
              <X size={15} />
            </button>
          </div>
        </header>
        <div className="window-content">
          <AppRenderer appId={windowState.appId} />
        </div>
      </div>
    </Rnd>
  );
}
