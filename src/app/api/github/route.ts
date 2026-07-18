import { NextResponse, type NextRequest } from "next/server";

import { createGitHubFallback, normalizeGitHubData } from "@/lib/github";

const API = "https://api.github.com";
const USERNAME = "TheYeldo";

class GitHubRequestError extends Error {
  constructor(
    public readonly kind: "rate-limit" | "timeout" | "unavailable",
    message: string,
  ) {
    super(message);
  }
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "YeldoOS-Portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function requestGitHub(path: string, refresh: boolean) {
  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      headers: githubHeaders(),
      signal: AbortSignal.timeout(7_000),
      ...(refresh
        ? { cache: "no-store" as const }
        : { next: { revalidate: 1_800, tags: ["github-dashboard"] } }),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      throw new GitHubRequestError("timeout", error.message);
    }
    throw new GitHubRequestError("unavailable", "GitHub request failed");
  }

  if (response.status === 403 || response.status === 429) {
    throw new GitHubRequestError("rate-limit", "GitHub rate limit reached");
  }
  if (!response.ok) {
    throw new GitHubRequestError(
      "unavailable",
      `GitHub returned ${response.status}`,
    );
  }

  return {
    json: (await response.json()) as unknown,
    remaining: Number(response.headers.get("x-ratelimit-remaining")) || null,
  };
}

export async function GET(request: NextRequest) {
  const refresh = request.nextUrl.searchParams.get("refresh") === "1";

  try {
    const [profileResponse, reposResponse, eventsResponse] = await Promise.all([
      requestGitHub(`/users/${USERNAME}`, refresh),
      requestGitHub(
        `/users/${USERNAME}/repos?per_page=30&sort=updated`,
        refresh,
      ),
      requestGitHub(`/users/${USERNAME}/events/public?per_page=12`, refresh),
    ]);

    const repositories = Array.isArray(reposResponse.json)
      ? reposResponse.json.slice(0, 30)
      : [];
    const commitTargets = repositories
      .filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object"),
      )
      .filter((item) => item.fork === false && typeof item.name === "string")
      .slice(0, 4);

    const commitPairs = await Promise.all(
      commitTargets.map(async (repository) => {
        const name = String(repository.name);
        try {
          const response = await requestGitHub(
            `/repos/${USERNAME}/${name}/commits?per_page=3`,
            refresh,
          );
          return [name, response.json] as const;
        } catch {
          return [name, []] as const;
        }
      }),
    );

    const dashboard = normalizeGitHubData(
      profileResponse.json,
      reposResponse.json,
      eventsResponse.json,
      Object.fromEntries(commitPairs),
      profileResponse.remaining,
    );

    return NextResponse.json(dashboard, {
      headers: {
        "Cache-Control": refresh
          ? "private, no-store"
          : "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const kind =
      error instanceof GitHubRequestError ? error.kind : "unavailable";
    return NextResponse.json(createGitHubFallback(kind), {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  }
}
