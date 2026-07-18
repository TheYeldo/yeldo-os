import type { VirtualFile } from "@/types/system";

export const virtualFiles: VirtualFile[] = [
  {
    path: "yeldo-portfolio/README.md",
    name: "README.md",
    language: "markdown",
    content: {
      ru: "# YeldoOS\n\nИнтерактивное портфолио Yeldo, frontend-разработчика из Алматы. Откройте проекты, терминал, GitHub и настройки как приложения браузерной операционной системы.\n\n## Принципы\n\n- честный статус каждого проекта;\n- доступность до декоративных эффектов;\n- строгие типы и разделённые модули;\n- полноценная русская и английская локализация.",
      en: "# YeldoOS\n\nThe interactive portfolio of Yeldo, a frontend developer in Almaty. Explore projects, the terminal, GitHub, and settings as applications inside a browser operating system.\n\n## Principles\n\n- honest status for every project;\n- accessibility before decoration;\n- strict types and separated modules;\n- complete Russian and English localization.",
    },
  },
  {
    path: "yeldo-portfolio/about/biography.md",
    name: "biography.md",
    language: "markdown",
    content: {
      ru: "# Биография\n\nYeldo — frontend-разработчик из Алматы. Он создаёт адаптивные React- и Next.js-интерфейсы, исследует браузерные рабочие пространства и разрабатывает независимые проекты: от аниме-каталога до Minecraft-мода.\n\nПрофессиональная история не дополнена вымышленными работодателями или клиентами.",
      en: "# Biography\n\nYeldo is a frontend developer in Almaty. He builds responsive React and Next.js interfaces, explores browser workspaces, and develops independent projects ranging from an anime catalog to a Minecraft mod.\n\nNo fictional employers or clients are added to this profile.",
    },
  },
  {
    path: "yeldo-portfolio/about/education.md",
    name: "education.md",
    language: "markdown",
    content: {
      ru: "# Образование\n\nИнформация об образовании пока не опубликована. Обновите `src/config/profile.ts`, когда данные будут готовы.",
      en: "# Education\n\nEducation details have not been published yet. Update `src/config/profile.ts` when the information is ready.",
    },
  },
  {
    path: "yeldo-portfolio/about/goals.md",
    name: "goals.md",
    language: "markdown",
    content: {
      ru: "# Текущий фокус\n\n- углублённый TypeScript;\n- архитектура frontend-приложений;\n- доступная 3D-графика в браузере;\n- основы backend-разработки и API.",
      en: "# Current focus\n\n- advanced TypeScript;\n- frontend application architecture;\n- accessible 3D graphics in the browser;\n- backend and API fundamentals.",
    },
  },
  {
    path: "yeldo-portfolio/about/contact.json",
    name: "contact.json",
    language: "json",
    content: {
      ru: '{\n  "name": "Yeldo",\n  "location": "Almaty, Kazakhstan",\n  "github": "https://github.com/TheYeldo",\n  "telegram": "@Yeldomr",\n  "email": null\n}',
      en: '{\n  "name": "Yeldo",\n  "location": "Almaty, Kazakhstan",\n  "github": "https://github.com/TheYeldo",\n  "telegram": "@Yeldomr",\n  "email": null\n}',
    },
  },
  {
    path: "yeldo-portfolio/skills/frontend.json",
    name: "frontend.json",
    language: "json",
    content: {
      ru: '{\n  "used": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],\n  "measurement": "project context, not percentages"\n}',
      en: '{\n  "used": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],\n  "measurement": "project context, not percentages"\n}',
    },
  },
  {
    path: "yeldo-portfolio/skills/tools.json",
    name: "tools.json",
    language: "json",
    content: {
      ru: '{\n  "workflow": ["Git", "GitHub", "Vercel", "Linux"],\n  "modding": ["Java", "Fabric", "Gradle"]\n}',
      en: '{\n  "workflow": ["Git", "GitHub", "Vercel", "Linux"],\n  "modding": ["Java", "Fabric", "Gradle"]\n}',
    },
  },
  {
    path: "yeldo-portfolio/skills/learning.json",
    name: "learning.json",
    language: "json",
    content: {
      ru: '{\n  "learning": ["Advanced TypeScript", "Frontend architecture", "3D web development", "Backend fundamentals"]\n}',
      en: '{\n  "learning": ["Advanced TypeScript", "Frontend architecture", "3D web development", "Backend fundamentals"]\n}',
    },
  },
  {
    path: "yeldo-portfolio/projects/taytlo.md",
    name: "taytlo.md",
    language: "markdown",
    content: {
      ru: "# Taytlo\n\n**Статус:** в разработке\n\nАниме-каталог с поиском, фильтрами, рейтингами Shikimori, избранным, историей и адаптивными страницами.",
      en: "# Taytlo\n\n**Status:** in development\n\nAn anime catalog with search, filters, Shikimori ratings, favorites, history, and responsive title pages.",
    },
  },
  {
    path: "yeldo-portfolio/projects/echo-protocol.md",
    name: "echo-protocol.md",
    language: "markdown",
    content: {
      ru: "# Echo Protocol\n\n**Статус:** alpha-прототип\n\nFabric-мод 1.21.1 с ограниченной записью маршрутов, несколькими типами Эхо и приватными мультиплеерными событиями.",
      en: "# Echo Protocol\n\n**Status:** alpha prototype\n\nA Fabric 1.21.1 mod with bounded route recording, multiple Echo types, and privacy-aware multiplayer events.",
    },
  },
  {
    path: "yeldo-portfolio/projects/hotel-experience.md",
    name: "hotel-experience.md",
    language: "markdown",
    content: {
      ru: "# Above Almaty\n\n**Статус:** независимый концепт\n\nПрокручиваемая 3D-история отеля. Не официальный сайт и не настоящая система бронирования.",
      en: "# Above Almaty\n\n**Status:** independent concept\n\nA scroll-driven 3D hotel story. It is not an official site or a real booking system.",
    },
  },
  {
    path: "yeldo-portfolio/projects/programming-simulator.md",
    name: "programming-simulator.md",
    language: "markdown",
    content: {
      ru: "# Programming Simulator\n\n**Статус:** выпущен\n\nNext.js-портфолио с 3D-комнатой, оконной системой, Monaco и sandbox-превью.",
      en: "# Programming Simulator\n\n**Status:** released\n\nA Next.js portfolio with a 3D room, window system, Monaco, and sandbox preview.",
    },
  },
  {
    path: "yeldo-portfolio/system/changelog.md",
    name: "changelog.md",
    language: "markdown",
    content: {
      ru: "# Changelog\n\n## 1.0.0\n\n- браузерный рабочий стол;\n- 11 приложений;\n- русский и английский;\n- GitHub API с fallback;\n- терминал, поиск и палитра команд.",
      en: "# Changelog\n\n## 1.0.0\n\n- browser desktop;\n- 11 applications;\n- Russian and English;\n- GitHub API with fallback;\n- terminal, search, and command palette.",
    },
  },
  {
    path: "yeldo-portfolio/system/roadmap.md",
    name: "roadmap.md",
    language: "markdown",
    content: {
      ru: "# Roadmap\n\n- добавить подтверждённые данные об образовании;\n- подготовить PDF-резюме;\n- добавить лицензированные скриншоты проектов;\n- расширить автоматические E2E-проверки.",
      en: "# Roadmap\n\n- add verified education details;\n- prepare a PDF resume;\n- add licensed project screenshots;\n- expand automated end-to-end checks.",
    },
  },
];

export const fileByPath = Object.fromEntries(
  virtualFiles.map((file) => [file.path, file]),
) as Record<string, VirtualFile>;
