"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import type { AppId } from "@/types/system";

function AppLoading() {
  const t = useTranslations("common");
  return (
    <div className="app-loading">
      <span />
      <span />
      <span />
      <p>{t("loading")}</p>
    </div>
  );
}

const appComponents = {
  about: dynamic(() => import("@/components/apps/about-app"), {
    loading: AppLoading,
  }),
  projects: dynamic(() => import("@/components/apps/projects-app"), {
    loading: AppLoading,
  }),
  github: dynamic(() => import("@/components/apps/github-app"), {
    loading: AppLoading,
  }),
  terminal: dynamic(() => import("@/components/apps/terminal-app"), {
    loading: AppLoading,
  }),
  code: dynamic(() => import("@/components/apps/code-explorer-app"), {
    loading: AppLoading,
  }),
  skills: dynamic(() => import("@/components/apps/skills-app"), {
    loading: AppLoading,
  }),
  timeline: dynamic(() => import("@/components/apps/timeline-app"), {
    loading: AppLoading,
  }),
  contact: dynamic(() => import("@/components/apps/contact-app"), {
    loading: AppLoading,
  }),
  settings: dynamic(() => import("@/components/apps/settings-app"), {
    loading: AppLoading,
  }),
  achievements: dynamic(() => import("@/components/apps/achievements-app"), {
    loading: AppLoading,
  }),
  archive: dynamic(() => import("@/components/apps/archive-app"), {
    loading: AppLoading,
  }),
} satisfies Record<AppId, React.ComponentType>;

export function AppRenderer({ appId }: { appId: AppId }) {
  const Component = appComponents[appId];
  return <Component />;
}
