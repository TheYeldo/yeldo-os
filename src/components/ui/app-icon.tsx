import {
  Archive,
  Award,
  Blocks,
  FileCode2,
  FolderKanban,
  GitBranch,
  Milestone,
  Send,
  SlidersHorizontal,
  SquareTerminal,
  UserRound,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  archive: Archive,
  award: Award,
  blocks: Blocks,
  "file-code-2": FileCode2,
  "folder-kanban": FolderKanban,
  github: GitBranch,
  milestone: Milestone,
  send: Send,
  "sliders-horizontal": SlidersHorizontal,
  "square-terminal": SquareTerminal,
  "user-round": UserRound,
};

export function AppIcon({
  icon,
  size = 22,
  strokeWidth = 1.7,
}: {
  icon: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Icon = icons[icon] ?? FileCode2;
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}
