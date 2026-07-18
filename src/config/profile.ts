const email = "adikdr606@gmail.com" as string | null;

export const profile = {
  name: "Yeldo",
  role: "Frontend Developer",
  location: "Almaty, Kazakhstan",
  githubUsername: "TheYeldo",
  portfolioUrl: "https://theyeldo.github.io/portfolio/",
  telegram: "@Yeldomr",
  telegramUrl: "https://t.me/Yeldomr",
  email,
  education: null as string | null,
  availability: null as string | null,
  resumeFile: null as string | null,
  socialLinks: [
    { label: "GitHub", url: "https://github.com/TheYeldo" },
    { label: "Telegram", url: "https://t.me/Yeldomr" },
    ...(email ? [{ label: "Email", url: `mailto:${email}` }] : []),
    { label: "Portfolio", url: "https://theyeldo.github.io/portfolio/" },
  ],
} as const;

export type Profile = typeof profile;
