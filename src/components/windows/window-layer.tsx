"use client";

import { useEffect } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useSystemStore } from "@/store/system-store";
import { WindowFrame } from "./window-frame";

export function WindowLayer() {
  const windows = useSystemStore((state) => state.windows);
  const reflowWindows = useSystemStore((state) => state.reflowWindows);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 1023px)");
  const activeWindow = windows
    .filter((item) => item.mode !== "minimized")
    .sort((a, b) => b.zIndex - a.zIndex)[0];

  useEffect(() => {
    const reflow = () => reflowWindows(window.innerWidth, window.innerHeight);
    reflow();
    window.addEventListener("resize", reflow);
    return () => window.removeEventListener("resize", reflow);
  }, [reflowWindows]);

  return (
    <div className="window-layer">
      {(isMobile
        ? windows.filter((item) => item.id === activeWindow?.id)
        : windows
      ).map((windowState) => (
        <WindowFrame
          key={windowState.id}
          windowState={windowState}
          active={windowState.id === activeWindow?.id}
          disableResize={isTablet}
          mobile={isMobile}
        />
      ))}
    </div>
  );
}
