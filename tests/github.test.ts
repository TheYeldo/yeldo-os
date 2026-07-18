import { describe, expect, it } from "vitest";

import { createGitHubFallback, normalizeGitHubData } from "@/lib/github";

const profile = {
  login: "TheYeldo",
  name: "Yeldo",
  avatar_url: "https://example.com/avatar.png",
  html_url: "https://github.com/TheYeldo",
  bio: null,
  location: "Almaty",
  public_repos: 3,
  followers: 2,
  following: 1,
};

describe("GitHub data validation", () => {
  it("normalizes valid API data", () => {
    const result = normalizeGitHubData(profile, [], [], {}, 42);
    expect(result.profile.login).toBe("TheYeldo");
    expect(result.rateLimitRemaining).toBe(42);
  });

  it("rejects malformed public counts", () => {
    expect(() =>
      normalizeGitHubData(
        { ...profile, public_repos: "many" },
        [],
        [],
        {},
        null,
      ),
    ).toThrow();
  });

  it("does not fabricate repository metrics in fallback mode", () => {
    const fallback = createGitHubFallback("rate-limit");
    expect(fallback.repositories).toEqual([]);
    expect(fallback.profile.publicRepos).toBeNull();
  });
});
