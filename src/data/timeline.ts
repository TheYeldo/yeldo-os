import type { TimelineEntry } from "@/types/system";

export const timeline: TimelineEntry[] = [
  {
    id: "start-web",
    date: { ru: "Ранее", en: "Earlier" },
    title: { ru: "Начало веб-разработки", en: "Started web development" },
    description: {
      ru: "Первые адаптивные интерфейсы на HTML, CSS и JavaScript.",
      en: "First responsive interfaces with HTML, CSS, and JavaScript.",
    },
    category: "learning",
    projectSlug: null,
  },
  {
    id: "early-projects",
    date: { ru: "До 2026", en: "Before 2026" },
    title: { ru: "Ранние frontend-проекты", en: "Early frontend projects" },
    description: {
      ru: "Практика компонентного подхода, UI-деталей и понятной структуры кода.",
      en: "Practiced component thinking, UI detail, and maintainable code structure.",
    },
    category: "learning",
    projectSlug: "developer-portfolio",
  },
  {
    id: "taytlo",
    date: { ru: "2026", en: "2026" },
    title: { ru: "Развитие Taytlo", en: "Taytlo development" },
    description: {
      ru: "Каталог, фильтры, рейтинги, личные списки и адаптивные страницы аниме.",
      en: "Catalog, filters, ratings, personal lists, and responsive anime pages.",
    },
    category: "project",
    projectSlug: "taytlo",
  },
  {
    id: "domain",
    date: { ru: "2026", en: "2026" },
    title: { ru: "Домен и развёртывание", en: "Domain and deployment" },
    description: {
      ru: "Настройка публичного домена taytlo.com и production-потока приложения.",
      en: "Configured the public taytlo.com domain and the application's production workflow.",
    },
    category: "system",
    projectSlug: "taytlo",
  },
  {
    id: "minecraft",
    date: { ru: "2026", en: "2026" },
    title: { ru: "Minecraft modding", en: "Minecraft modding" },
    description: {
      ru: "Echo Protocol: Fabric, Java, ограниченные записи движения и мультиплеерная приватность.",
      en: "Echo Protocol: Fabric, Java, bounded movement recording, and multiplayer privacy.",
    },
    category: "project",
    projectSlug: "echo-protocol",
  },
  {
    id: "linux",
    date: { ru: "Недавно", en: "Recently" },
    title: { ru: "Работа в Linux", en: "Working with Linux" },
    description: {
      ru: "Linux стал частью повседневной среды разработки и автоматизации.",
      en: "Linux became part of the everyday development and automation environment.",
    },
    category: "learning",
    projectSlug: null,
  },
  {
    id: "yeldo-os",
    date: { ru: "2026", en: "2026" },
    title: { ru: "Создание YeldoOS", en: "Created YeldoOS" },
    description: {
      ru: "Портфолио переосмыслено как доступная браузерная система с приложениями и реальными данными GitHub.",
      en: "The portfolio was reworked as an accessible browser system with applications and real GitHub data.",
    },
    category: "system",
    projectSlug: null,
  },
];
