export interface AchievementDefinition {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

export const achievements: AchievementDefinition[] = [
  {
    id: "first-boot",
    titleKey: "firstBoot",
    descriptionKey: "firstBootDescription",
  },
  {
    id: "explorer",
    titleKey: "explorer",
    descriptionKey: "explorerDescription",
  },
  {
    id: "terminal-user",
    titleKey: "terminalUser",
    descriptionKey: "terminalUserDescription",
  },
  {
    id: "open-source",
    titleKey: "openSource",
    descriptionKey: "openSourceDescription",
  },
  {
    id: "project-hunter",
    titleKey: "projectHunter",
    descriptionKey: "projectHunterDescription",
  },
  {
    id: "keyboard-first",
    titleKey: "keyboardFirst",
    descriptionKey: "keyboardFirstDescription",
  },
  {
    id: "polyglot",
    titleKey: "polyglot",
    descriptionKey: "polyglotDescription",
  },
  {
    id: "administrator",
    titleKey: "administrator",
    descriptionKey: "administratorDescription",
  },
  {
    id: "easter-egg",
    titleKey: "easterEgg",
    descriptionKey: "easterEggDescription",
  },
];
