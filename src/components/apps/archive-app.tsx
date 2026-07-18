"use client";

import { Archive } from "lucide-react";
import { useTranslations } from "next-intl";

import { projects } from "@/data/projects";
import { AppHeading } from "./app-heading";

export default function ArchiveApp() {
  const t = useTranslations("archive");
  const archived = projects.filter((project) => project.status === "archived");
  return (
    <section className="app-scroll archive-app">
      <AppHeading title={t("title")} description={t("description")} />
      {archived.length ? (
        <ul>
          {archived.map((project) => (
            <li key={project.slug}>{project.title}</li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <Archive size={38} strokeWidth={1.4} />
          <p>{t("empty")}</p>
        </div>
      )}
    </section>
  );
}
