import type { Project } from "@/types/system";

export const projects: Project[] = [
  {
    title: "Taytlo Anime Platform",
    slug: "taytlo",
    status: "development",
    year: 2026,
    description: {
      ru: "Каталог аниме для поиска тайтлов, сравнения рейтингов и ведения личных списков.",
      en: "An anime catalog for discovering titles, comparing ratings, and managing personal lists.",
    },
    caseStudy: {
      ru: "Taytlo объединяет поиск, фильтрацию, читаемые страницы тайтлов, рейтинги Shikimori, избранное и историю просмотра в одном адаптивном интерфейсе. Проект активно развивается.",
      en: "Taytlo combines search, filtering, readable title pages, Shikimori ratings, favorites, and watch history in one responsive interface. The project is actively evolving.",
    },
    role: { ru: "Независимый разработчик", en: "Independent developer" },
    technologies: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
    challenge: {
      ru: "Сделать большой каталог понятным на мобильных устройствах и сохранить быстрый путь от поиска к карточке тайтла.",
      en: "Keep a large catalog understandable on mobile while preserving a fast path from search to a title page.",
    },
    solution: {
      ru: "Компонентная система фильтров, читаемые URL, адаптивные страницы и локальные пользовательские списки.",
      en: "A component-based filter system, readable URLs, responsive pages, and local personal lists.",
    },
    lessons: {
      ru: "Работа с каталогами требует строгой модели данных, продуманного состояния фильтров и постоянной проверки мобильных сценариев.",
      en: "Catalog products need a disciplined data model, deliberate filter state, and continuous mobile-flow verification.",
    },
    screenshots: [],
    videoUrl: null,
    repositoryUrl: "https://github.com/TheYeldo/taytlo",
    liveUrl: "https://taytlo.com",
    featured: true,
  },
  {
    title: "Echo Protocol Minecraft Mod",
    slug: "echo-protocol",
    status: "prototype",
    year: 2026,
    description: {
      ru: "Alpha-мод Fabric для Minecraft 1.21.1, который записывает короткие маршруты игрока и возвращает их как искажённые Эхо.",
      en: "An alpha Fabric mod for Minecraft 1.21.1 that records short player routes and replays them as distorted Echoes.",
    },
    caseStudy: {
      ru: "Echo Protocol исследует атмосферный хоррор без разрушения мира: ограниченные буферы движения, приватные события для мультиплеера и несколько типов поведения Эхо.",
      en: "Echo Protocol explores atmospheric horror without changing the world: bounded movement buffers, privacy-aware multiplayer events, and several Echo behavior types.",
    },
    role: { ru: "Автор мода", en: "Mod creator" },
    technologies: ["Java", "Fabric", "Gradle", "Minecraft 1.21.1"],
    challenge: {
      ru: "Создать тревожное поведение, не используя тяжёлый поиск пути и не раскрывая приватные события другим игрокам.",
      en: "Create unsettling behavior without heavy pathfinding or leaking private events to unrelated players.",
    },
    solution: {
      ru: "Ограниченная запись движения, серверное управление сущностями, фильтрация видимости и безопасные локальные проверки позиции.",
      en: "Bounded movement recording, server-directed entities, visibility filtering, and safe local position checks.",
    },
    lessons: {
      ru: "Игровая атмосфера сильнее работает через ограничения, тайминг и редкие события, чем через постоянные эффекты.",
      en: "Game atmosphere benefits more from constraints, timing, and rare events than constant effects.",
    },
    screenshots: [],
    videoUrl: null,
    repositoryUrl: "https://github.com/TheYeldo/echo-protocol",
    liveUrl: null,
    featured: true,
  },
  {
    title: "Programming Simulator",
    slug: "programming-simulator",
    status: "released",
    year: 2026,
    description: {
      ru: "Интерактивное портфолио с процедурной 3D-комнатой, браузерным рабочим столом и безопасным симулятором кода.",
      en: "An interactive portfolio with a procedural 3D room, browser desktop, and safe coding simulator.",
    },
    caseStudy: {
      ru: "Проект соединяет управляемую 3D-сцену, оконную систему, Monaco-редактор, sandbox-превью и двуязычные приложения. Мобильная версия отключает дорогой WebGL и сохраняет доступ к контенту.",
      en: "The project combines a controlled 3D scene, window system, Monaco editor, sandbox preview, and bilingual apps. Mobile avoids expensive WebGL while preserving all content.",
    },
    role: {
      ru: "Frontend-разработчик и дизайнер",
      en: "Frontend developer and designer",
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "Zustand",
      "Monaco",
    ],
    challenge: {
      ru: "Удержать сложный интерактивный интерфейс производительным и доступным на разных устройствах.",
      en: "Keep a complex interactive interface performant and accessible across devices.",
    },
    solution: {
      ru: "Динамические чанки, ограниченный DPR, мобильная CSS-версия, семантические элементы и независимые приложения.",
      en: "Dynamic chunks, capped DPR, a mobile CSS path, semantic controls, and isolated applications.",
    },
    lessons: {
      ru: "Визуальная сложность должна иметь лёгкий запасной путь; состояние сцены и пользовательские данные лучше хранить отдельно.",
      en: "Visual complexity needs a lightweight fallback, and scene state should remain separate from user data.",
    },
    screenshots: [],
    videoUrl: null,
    repositoryUrl: "https://github.com/TheYeldo/programming-simulator",
    liveUrl: null,
    featured: true,
  },
  {
    title: "Interactive Hotel Experience",
    slug: "hotel-experience",
    status: "concept",
    year: 2026,
    description: {
      ru: "Независимый кинематографичный концепт отельного сайта с прокруткой через высотный Алматы.",
      en: "An independent cinematic hotel-site concept built around a scroll journey above Almaty.",
    },
    caseStudy: {
      ru: "Концепт Above Almaty исследует, как процедурная башня, управляемая камера и последовательность разделов могут передать пространство отеля. Это не официальный сайт отеля и не система бронирования.",
      en: "The Above Almaty concept explores how a procedural tower, controlled camera, and section journey can communicate a hotel space. It is not an official hotel site or booking system.",
    },
    role: { ru: "Автор концепта", en: "Concept creator" },
    technologies: ["Next.js", "React", "Three.js", "GSAP"],
    challenge: {
      ru: "Сохранить кинематографичный ритм прокрутки без потери управления, доступности и производительности.",
      en: "Preserve cinematic scroll pacing without losing control, accessibility, or performance.",
    },
    solution: {
      ru: "Контролируемая камера, ограниченный DPR, адаптивная детализация и CSS-альтернатива без WebGL.",
      en: "A controlled camera, capped DPR, adaptive detail, and a CSS alternative when WebGL is unavailable.",
    },
    lessons: {
      ru: "Сценарий движения должен поддерживать содержание, а не конкурировать с ним.",
      en: "Motion direction should support the content rather than compete with it.",
    },
    screenshots: [],
    videoUrl: null,
    repositoryUrl: "https://github.com/TheYeldo/above-almaty-concept",
    liveUrl: null,
    featured: false,
  },
  {
    title: "Developer Portfolio",
    slug: "developer-portfolio",
    status: "released",
    year: 2026,
    description: {
      ru: "Лёгкое статическое портфолио с акцентом на адаптивную подачу работ и прямые контакты.",
      en: "A lightweight static portfolio focused on responsive project presentation and direct contact paths.",
    },
    caseStudy: {
      ru: "Первая версия портфолио остаётся простым публичным представлением профиля. YeldoOS развивает эту идею в более глубокий интерактивный формат.",
      en: "The first portfolio remains a simple public profile. YeldoOS expands the idea into a deeper interactive format.",
    },
    role: { ru: "Frontend-разработчик", en: "Frontend developer" },
    technologies: ["HTML", "CSS", "JavaScript"],
    challenge: {
      ru: "Кратко показать профиль и проекты без перегруженной навигации.",
      en: "Present the profile and projects concisely without overloaded navigation.",
    },
    solution: {
      ru: "Статическая архитектура, ясная типографика и короткие пути к проектам и контактам.",
      en: "Static architecture, clear typography, and short paths to projects and contact details.",
    },
    lessons: {
      ru: "Простая версия полезна как быстрый резервный маршрут к основному содержанию.",
      en: "A simple version is valuable as a fast fallback route to the essential content.",
    },
    screenshots: [],
    videoUrl: null,
    repositoryUrl: "https://github.com/TheYeldo/portfolio",
    liveUrl: "https://theyeldo.github.io/portfolio/",
    featured: false,
  },
];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as Record<string, Project>;
