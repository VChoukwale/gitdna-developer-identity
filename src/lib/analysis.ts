import type { GitDNAResult, GitHubRepo } from "./github";

export interface Archetype {
  name: string;
  emoji: string;
  tagline: string;
  accentColor: string;
  isGradient?: boolean;
  score: number;
}

export interface CrownJewel {
  name: string;
  language: string | null;
  stars: number;
  forks: number;
  description: string;
  pitch: string;
}

export interface DevStats {
  totalStars: number;
  totalRepos: number;
  topLanguages: { name: string; percentage: number }[];
  topLanguage: string;
  codingSince: number;
  followers: number;
  originalRepos: number;
  forkedRepos: number;
}

export interface DevDNAProfile {
  archetype: Archetype;
  crownJewel: CrownJewel;
  stats: DevStats;
}

// ── Scoring Helpers ──

function getUniqueLanguages(repos: GitHubRepo[]): Set<string> {
  const langs = new Set<string>();
  for (const r of repos) {
    if (r.language) langs.add(r.language);
  }
  return langs;
}

function getLangRepoCounts(repos: GitHubRepo[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  }
  return counts;
}

function getArchitectRepos(repos: GitHubRepo[]): GitHubRepo[] {
  const keywords = ["framework", "engine", "platform", "system", "api", "sdk", "library", "toolkit", "infrastructure", "core", "cli", "compiler", "runtime"];
  return repos.filter((r) => {
    const text = `${r.name} ${r.description ?? ""}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
}

function hasInfraSignals(repos: GitHubRepo[]): boolean {
  const kw = ["docker", "terraform", "kubernetes", "aws", "ci", "cd", "deploy", "cloud", "nginx", "ansible"];
  return repos.some((r) => {
    const text = `${r.name} ${(r.topics ?? []).join(" ")} ${r.description ?? ""}`.toLowerCase();
    return kw.some((k) => text.includes(k));
  });
}

function hasDbSignals(repos: GitHubRepo[]): boolean {
  const kw = ["sql", "mongodb", "redis", "postgres", "database", "db"];
  return repos.some((r) => {
    const text = `${r.name} ${(r.topics ?? []).join(" ")} ${r.description ?? ""}`.toLowerCase();
    return kw.some((k) => text.includes(k));
  });
}

// ── Score Calculators ──

function scoreDeepSpecialist(languages: { name: string; percentage: number }[], repos: GitHubRepo[]): number {
  let score = 0;
  const topPct = languages[0]?.percentage ?? 0;
  const secondPct = languages[1]?.percentage ?? 0;
  const uniqueLangs = getUniqueLanguages(repos);

  if (topPct >= 80) score += 40;
  else if (topPct >= 60) score += 20;

  if (secondPct < 10) score += 20;

  // Check if 70%+ repos use same primary language
  const langCounts = getLangRepoCounts(repos);
  const topLangCount = Math.max(0, ...Object.values(langCounts));
  if (repos.length > 0 && topLangCount / repos.length >= 0.7) score += 20;

  if (uniqueLangs.size <= 3) score += 15;

  return score;
}

function scorePolyglotWanderer(languages: { name: string; percentage: number }[], repos: GitHubRepo[]): number {
  let score = 0;
  const uniqueLangs = getUniqueLanguages(repos);
  const topPct = languages[0]?.percentage ?? 0;

  score += Math.min(8, uniqueLangs.size) * 12;

  if (topPct <= 40) score += 20;
  else if (topPct <= 50) score += 10;

  if (topPct > 60) score -= 40;

  return score;
}

function scoreOpenSourceChampion(repos: GitHubRepo[]): number {
  let score = 0;
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const avgStars = repos.length > 0 ? totalStars / repos.length : 0;
  const avgForks = repos.length > 0 ? totalForks / repos.length : 0;

  if (avgStars > 500) score += 35;
  else if (avgStars > 100) score += 25;
  else if (avgStars > 50) score += 15;

  if (totalStars > 50000) score += 25;
  else if (totalStars > 10000) score += 15;

  if (totalForks > 5000) score += 15;

  if (avgForks > 20) score += 10;

  return score;
}

function scoreProlificShipper(repos: GitHubRepo[], createdAt: string): number {
  let score = 0;
  const repoCount = repos.length;
  const forkedCount = repos.filter((r) => r.fork).length;
  const originalPct = repoCount > 0 ? (repoCount - forkedCount) / repoCount : 0;
  const accountAge = (Date.now() - new Date(createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const avgStars = repoCount > 0 ? repos.reduce((s, r) => s + r.stargazers_count, 0) / repoCount : 0;

  if (repoCount > 200) score += 35;
  else if (repoCount > 100) score += 25;
  else if (repoCount > 50) score += 15;

  if (originalPct >= 0.7) score += 20;

  if (accountAge < 5 && repoCount > 50) score += 15;

  if (repoCount > 30 && avgStars < 50) score += 15;

  return score;
}

function scoreArchitect(repos: GitHubRepo[]): number {
  let score = 0;
  const matchingRepos = getArchitectRepos(repos);

  score += Math.min(60, matchingRepos.length * 12);

  if (matchingRepos.some((r) => r.stargazers_count >= 500)) score += 20;

  if (repos.length > 0 && matchingRepos.length / repos.length >= 0.3) score += 15;

  return score;
}

function scoreFullStackAlchemist(repos: GitHubRepo[]): number {
  const uniqueLangs = getUniqueLanguages(repos);
  const frontendLangs = new Set(["JavaScript", "TypeScript", "HTML", "CSS"]);
  const backendLangs = new Set(["Python", "Java", "Go", "Ruby", "C#", "PHP", "Rust"]);

  let categories = 0;
  let score = 0;

  const hasFrontend = [...uniqueLangs].some((l) => frontendLangs.has(l));
  const hasBackend = [...uniqueLangs].some((l) => backendLangs.has(l));
  const hasInfra = hasInfraSignals(repos);
  const hasDb = hasDbSignals(repos);

  if (hasFrontend) { score += 25; categories++; }
  if (hasBackend) { score += 25; categories++; }
  if (hasInfra) { score += 25; categories++; }
  if (hasDb) { score += 15; categories++; }

  if (categories >= 3) score += 10;

  return score;
}

function scoreDocumentationPerfectionist(repos: GitHubRepo[]): number {
  if (repos.length === 0) return 0;
  let score = 0;

  const withDesc = repos.filter((r) => r.description && r.description.trim() !== "").length;
  const withTopics = repos.filter((r) => r.topics && r.topics.length > 0).length;
  const descPct = withDesc / repos.length;
  const topicsPct = withTopics / repos.length;

  score += descPct * 40;
  score += topicsPct * 35;

  if (descPct >= 0.9) score += 15;
  if (topicsPct >= 0.8) score += 10;

  return Math.round(score);
}

function scoreWeekendWarrior(repos: GitHubRepo[]): number {
  let score = 0;
  const repoCount = repos.length;
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const ratio = repoCount > 0 ? totalStars / repoCount : 0;

  if (repoCount > 25) score -= 50;

  if (repoCount < 15) score += 30;
  if (repoCount < 10) score += 15;

  if (ratio > 100) score += 30;
  else if (ratio > 20) score += 20;
  else if (ratio > 5) score += 10;

  return score;
}

function scoreCuriousBuilder(repos: GitHubRepo[], createdAt: string, allScores: number[]): number {
  let score = 45;
  const repoCount = repos.length;
  const accountAge = (Date.now() - new Date(createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  if (allScores.every((s) => s < 55)) score += 20;

  if (repoCount >= 3 && repoCount <= 20) score += 10;

  if (accountAge > 2) score += 5;

  return score;
}

// ── Archetype Templates ──

interface ArchetypeTemplate {
  name: string;
  emoji: string;
  tagline: string;
  accentColor: string;
  isGradient?: boolean;
}

const ARCHETYPE_TEMPLATES: ArchetypeTemplate[] = [
  { name: "The Deep Specialist", emoji: "🎯", tagline: "One language to rule them all", accentColor: "#2563eb" },
  { name: "The Polyglot Wanderer", emoji: "🌍", tagline: "Fluent in code, any dialect", accentColor: "linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)", isGradient: true },
  { name: "The Open Source Champion", emoji: "🏆", tagline: "Building for the community", accentColor: "#FFD700" },
  { name: "The Prolific Shipper", emoji: "🚀", tagline: "Ships code like Amazon ships boxes", accentColor: "#00ff88" },
  { name: "The Architect", emoji: "🏗️", tagline: "Building foundations others build on", accentColor: "#8892a0" },
  { name: "The Full Stack Alchemist", emoji: "⚗️", tagline: "Turns coffee into full stack magic", accentColor: "#a855f7" },
  { name: "The Documentation Perfectionist", emoji: "📚", tagline: "Code without docs is just expensive notes", accentColor: "#f59e0b" },
  { name: "The Weekend Warrior", emoji: "⚔️", tagline: "Quality over quantity, always", accentColor: "#dc2626" },
  { name: "The Curious Builder", emoji: "🔮", tagline: "Every repo is an experiment", accentColor: "#8b5cf6" },
];

// ── Main Detection ──

function detectArchetype(repos: GitHubRepo[], languages: { name: string; percentage: number }[], createdAt: string): Archetype {
  // Disqualifier: low-activity profiles forced to Curious Builder
  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  if (repos.length < 10 && totalStars === 0) {
    const curiousIdx = ARCHETYPE_TEMPLATES.findIndex(t => t.name === "The Curious Builder");
    return { ...ARCHETYPE_TEMPLATES[curiousIdx], score: 80 };
  }

  // Calculate first 8 scores (all except Curious Builder)
  const scores = [
    scoreDeepSpecialist(languages, repos),
    scorePolyglotWanderer(languages, repos),
    scoreOpenSourceChampion(repos),
    scoreProlificShipper(repos, createdAt),
    scoreArchitect(repos),
    scoreFullStackAlchemist(repos),
    scoreDocumentationPerfectionist(repos),
    scoreWeekendWarrior(repos),
  ];

  // Curious Builder needs the other scores
  scores.push(scoreCuriousBuilder(repos, createdAt, scores));

  // Find highest score; on tie, first in list wins
  let bestIdx = 0;
  let bestScore = scores[0];
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > bestScore) {
      bestIdx = i;
      bestScore = scores[i];
    }
  }

  const template = ARCHETYPE_TEMPLATES[bestIdx];
  return { ...template, score: bestScore };
}

// ── Crown Jewel ──

function getTopLanguageFromRepos(repos: GitHubRepo[]): string {
  const langCounts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  }
  const sorted = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "—";
}

function pickCrownJewel(repos: GitHubRepo[]): CrownJewel {
  const now = Date.now();
  const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60 * 1000;

  const scored = repos.map((r) => {
    const updatedRecently = new Date(r.updated_at).getTime() > sixMonthsAgo;
    const score =
      r.stargazers_count * 3 +
      r.forks_count * 2 +
      (r.description ? 5 : 0) +
      (r.topics && r.topics.length > 0 ? 3 : 0) +
      (updatedRecently ? 10 : 0);
    return { repo: r, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.repo ?? repos[0];

  const desc = best.description || "No description";
  const pitch = generatePitch(best.name, desc, best.language);

  return {
    name: best.name,
    language: best.language,
    stars: best.stargazers_count,
    forks: best.forks_count,
    description: desc,
    pitch,
  };
}

function generatePitch(name: string, description: string, language: string | null): string {
  const lang = language || "code";
  if (description && description !== "No description") {
    const short = description.length > 60 ? description.slice(0, 60).replace(/\s+\S*$/, "…") : description;
    return `A ${lang} project — ${short}`;
  }
  const humanName = name.replace(/[-_]/g, " ");
  return `A ${lang} project called ${humanName}`;
}

// ── Main Analysis ──

export function analyzeGitDNA(data: GitDNAResult): DevDNAProfile {
  const { profile, repos, languages } = data;

  const archetype = detectArchetype(repos, languages, profile.created_at);
  const crownJewel = repos.length > 0
    ? pickCrownJewel(repos)
    : { name: "—", language: null, stars: 0, forks: 0, description: "No repos found", pitch: "Nothing here yet" };

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const forkedRepos = repos.filter((r) => r.fork).length;
  const topLanguage = languages.length > 0 ? languages[0].name : getTopLanguageFromRepos(repos);

  const stats: DevStats = {
    totalStars,
    totalRepos: profile.public_repos,
    topLanguages: languages.slice(0, 5),
    topLanguage,
    codingSince: new Date(profile.created_at).getFullYear(),
    followers: profile.followers,
    originalRepos: repos.length - forkedRepos,
    forkedRepos,
  };

  return { archetype, crownJewel, stats };
}
