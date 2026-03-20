export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  created_at: string;
  updated_at: string;
  topics: string[];
  size: number;
}

export interface LanguageBreakdown {
  [language: string]: number;
}

export interface GitDNAResult {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  languages: { name: string; percentage: number }[];
}

class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function ghFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (res.status === 404) throw new GitHubError(404, "not_found");
  if (res.status === 403 || res.status === 429) throw new GitHubError(403, "rate_limit");
  if (!res.ok) throw new GitHubError(res.status, "unknown");
  return res.json();
}

async function avatarToBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

export async function fetchGitDNA(username: string): Promise<GitDNAResult> {
  // Step 1 & 2 in parallel
  const [profile, repos] = await Promise.all([
    ghFetch<GitHubProfile>(`https://api.github.com/users/${encodeURIComponent(username)}`),
    ghFetch<GitHubRepo[]>(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`),
  ]);

  // Convert avatar to base64 for html2canvas compatibility
  profile.avatar_url = await avatarToBase64(profile.avatar_url);

  // Step 3: top 3 repos by stars → fetch language breakdown
  const top3 = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);

  const langResults = await Promise.all(
    top3.map((repo) =>
      ghFetch<LanguageBreakdown>(
        `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/languages`
      )
    )
  );

  // Combine all language bytes
  const totalBytes: Record<string, number> = {};
  for (const langMap of langResults) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      totalBytes[lang] = (totalBytes[lang] || 0) + bytes;
    }
  }

  const grandTotal = Object.values(totalBytes).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(totalBytes)
    .map(([name, bytes]) => ({ name, percentage: Math.round((bytes / grandTotal) * 1000) / 10 }))
    .sort((a, b) => b.percentage - a.percentage);

  return { profile, repos, languages };
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof GitHubError) {
    if (err.status === 404) return "Developer not found. Check the username and try again.";
    if (err.status === 403 || err.status === 429) return "Too many requests. Please wait a moment and try again.";
  }
  return "Something went wrong. Please try again.";
}
