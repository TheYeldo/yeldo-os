import { z } from "zod";

export const githubProfileSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.url(),
  html_url: z.url(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
});

export const githubRepositorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  fork: z.boolean(),
  updated_at: z.iso.datetime(),
  pushed_at: z.iso.datetime().nullable(),
});

export const githubEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  repo: z.object({ name: z.string() }),
  created_at: z.iso.datetime().nullable(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const githubCommitSchema = z.object({
  sha: z.string(),
  html_url: z.url(),
  commit: z.object({
    message: z.string(),
    author: z.object({ date: z.iso.datetime().nullable() }).nullable(),
  }),
});

export interface GitHubDashboard {
  source: "live" | "fallback";
  fetchedAt: string;
  profile: {
    login: string;
    name: string | null;
    avatarUrl: string;
    htmlUrl: string;
    bio: string | null;
    location: string | null;
    publicRepos: number | null;
    followers: number | null;
    following: number | null;
  };
  repositories: Array<{
    id: number;
    name: string;
    fullName: string;
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    isFork: boolean;
    updatedAt: string;
  }>;
  events: Array<{
    id: string;
    type: string;
    repository: string;
    createdAt: string | null;
  }>;
  commits: Record<
    string,
    Array<{ sha: string; url: string; message: string; date: string | null }>
  >;
  error: "rate-limit" | "timeout" | "unavailable" | null;
  rateLimitRemaining: number | null;
}

export function normalizeGitHubData(
  profileInput: unknown,
  repositoriesInput: unknown,
  eventsInput: unknown,
  commitsInput: Record<string, unknown>,
  rateLimitRemaining: number | null,
): GitHubDashboard {
  const profile = githubProfileSchema.parse(profileInput);
  const repositories = z.array(githubRepositorySchema).parse(repositoriesInput);
  const events = z.array(githubEventSchema).parse(eventsInput);
  const commits = Object.fromEntries(
    Object.entries(commitsInput).map(([repository, value]) => [
      repository,
      z
        .array(githubCommitSchema)
        .parse(value)
        .map((commit) => ({
          sha: commit.sha,
          url: commit.html_url,
          message:
            commit.commit.message.split("\n")[0] ?? commit.commit.message,
          date: commit.commit.author?.date ?? null,
        })),
    ]),
  );

  return {
    source: "live",
    fetchedAt: new Date().toISOString(),
    profile: {
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      htmlUrl: profile.html_url,
      bio: profile.bio,
      location: profile.location,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
    },
    repositories: repositories.map((repository) => ({
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      url: repository.html_url,
      description: repository.description,
      language: repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      isFork: repository.fork,
      updatedAt: repository.updated_at,
    })),
    events: events.map((event) => ({
      id: event.id,
      type: event.type,
      repository: event.repo.name,
      createdAt: event.created_at,
    })),
    commits,
    error: null,
    rateLimitRemaining,
  };
}

export function createGitHubFallback(
  error: GitHubDashboard["error"] = "unavailable",
): GitHubDashboard {
  return {
    source: "fallback",
    fetchedAt: new Date().toISOString(),
    profile: {
      login: "TheYeldo",
      name: "Yeldo",
      avatarUrl: "https://github.com/TheYeldo.png",
      htmlUrl: "https://github.com/TheYeldo",
      bio: null,
      location: "Almaty, Kazakhstan",
      publicRepos: null,
      followers: null,
      following: null,
    },
    repositories: [],
    events: [],
    commits: {},
    error,
    rateLimitRemaining: null,
  };
}
