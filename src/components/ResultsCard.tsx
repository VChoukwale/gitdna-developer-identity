import type { GitDNAResult } from "@/lib/github";
import type { DevDNAProfile } from "@/lib/analysis";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsCardProps {
  data: GitDNAResult;
  dnaProfile: DevDNAProfile;
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Ruby: "#701516",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  "C#": "#178600",
  Lua: "#000080",
  Scala: "#c22d40",
  R: "#198CE7",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

function getLangColor(name: string): string {
  return LANG_COLORS[name] || "#8b8b8b";
}

function getAccentCSS(archetype: DevDNAProfile["archetype"]): string {
  return archetype.isGradient ? "#a855f7" : archetype.accentColor;
}

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
  },
};

const ResultsCard = ({ data, dnaProfile }: ResultsCardProps) => {
  const { profile } = data;
  const { archetype, crownJewel, stats } = dnaProfile;
  const accent = getAccentCSS(archetype);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const statsGrid = [
    { label: "Total Stars", value: stats.totalStars.toLocaleString(), emoji: "⭐" },
    { label: "Repos", value: stats.totalRepos.toString(), emoji: "📦" },
    { label: "Coding Since", value: stats.codingSince.toString(), emoji: "📅" },
    { label: "Top Language", value: stats.topLanguage, emoji: "💻" },
    { label: "Followers", value: stats.followers.toLocaleString(), emoji: "👥" },
    { label: "Original / Forked", value: `${stats.originalRepos} / ${stats.forkedRepos}`, emoji: "🔀" },
  ];

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="w-full max-w-md mx-auto"
    >
      {/* Outer card wrapper */}
      <div
        id="gitdna-card"
        className="rounded-2xl overflow-hidden border border-white/[0.08] relative"
        style={{
          background: "linear-gradient(180deg, hsl(220 20% 7% / 0.95) 0%, hsl(220 20% 5% / 0.98) 100%)",
          boxShadow: `0 0 80px ${accent}15, 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
          backdropFilter: "blur(20px)",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {/* Accent glow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-40 opacity-20 pointer-events-none"
          style={{
            background: archetype.isGradient
              ? `linear-gradient(180deg, rgba(168,85,247,0.4) 0%, transparent 100%)`
              : `linear-gradient(180deg, ${accent}66 0%, transparent 100%)`,
          }}
        />

        {/* ── TOP: Profile ── */}
        <motion.div variants={stagger.item} className="relative z-10 flex flex-col items-center pt-8 pb-4 px-6">
          <div
            className="rounded-full p-[3px] mb-4"
            style={{
              background: archetype.isGradient
                ? "linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)"
                : `linear-gradient(135deg, ${accent}, ${accent}88)`,
              boxShadow: `0 0 24px ${accent}40`,
            }}
          >
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="w-20 h-20 rounded-full border-2 border-background"
            />
          </div>
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            {profile.name || profile.login}
          </h2>
          <p className="text-muted-foreground text-sm font-[family-name:var(--font-heading)]">
            @{profile.login}
          </p>
          {profile.bio && (
            <p className="text-muted-foreground text-sm mt-2 italic text-center max-w-xs">
              {profile.bio}
            </p>
          )}
        </motion.div>

        {/* ── ARCHETYPE BANNER ── */}
        <motion.div
          variants={stagger.item}
          className="relative z-10 mx-4 my-3 rounded-xl py-6 px-4 text-center overflow-hidden"
          style={{
            background: archetype.isGradient
              ? "linear-gradient(135deg, rgba(255,0,0,0.15), rgba(255,136,0,0.15), rgba(0,255,0,0.12), rgba(0,136,255,0.15), rgba(136,0,255,0.15))"
              : `linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%)`,
            border: `1px solid ${archetype.isGradient ? "rgba(168,85,247,0.25)" : accent + "30"}`,
          }}
        >
          <span className="text-5xl block mb-2">{archetype.emoji}</span>
          <p
            className="text-lg font-extrabold font-[family-name:var(--font-heading)] uppercase tracking-widest"
            style={
              archetype.isGradient
                ? { background: "linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
                : { color: accent }
            }
          >
            {archetype.name}
          </p>
          <p className="text-muted-foreground text-sm mt-1 italic">"{archetype.tagline}"</p>
        </motion.div>

        {/* ── LANGUAGE BAR ── */}
        {stats.topLanguages.length > 0 && (
          <motion.div variants={stagger.item} className="relative z-10 px-6 py-4">
            <div className="h-3 rounded-full overflow-hidden flex">
              {stats.topLanguages.map((lang) => (
                <div
                  key={lang.name}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: getLangColor(lang.name),
                    minWidth: lang.percentage > 0 ? "4px" : "0",
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {stats.topLanguages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: getLangColor(lang.name) }}
                  />
                  <span className="text-muted-foreground">
                    {lang.name}{" "}
                    <span className="font-[family-name:var(--font-heading)]">{lang.percentage}%</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CROWN JEWEL ── */}
        <motion.div variants={stagger.item} className="relative z-10 mx-4 my-3">
          <div
            className="rounded-xl p-5 border"
            style={{
              background: "hsl(220 20% 8% / 0.8)",
              borderColor: `${accent}20`,
            }}
          >
            <p className="text-xs font-semibold font-[family-name:var(--font-heading)] text-muted-foreground uppercase tracking-wider mb-3">
              👑 Crown Jewel Project
            </p>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <a
                  href={`https://github.com/${profile.login}/${crownJewel.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground font-bold font-[family-name:var(--font-heading)] hover:underline"
                  style={{ color: accent }}
                >
                  {crownJewel.name}
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
                <p className="text-muted-foreground text-xs mt-1 italic leading-relaxed">
                  {crownJewel.pitch}
                </p>
              </div>
              {crownJewel.language && (
                <span
                  className="text-[10px] font-bold font-[family-name:var(--font-heading)] px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider"
                  style={{
                    backgroundColor: getLangColor(crownJewel.language) + "22",
                    color: getLangColor(crownJewel.language),
                    border: `1px solid ${getLangColor(crownJewel.language)}33`,
                  }}
                >
                  {crownJewel.language}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {crownJewel.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {crownJewel.forks.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── STATS GRID ── */}
        <motion.div variants={stagger.item} className="relative z-10 px-4 py-3">
          <div className="grid grid-cols-3 gap-2">
            {statsGrid.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-3 text-center"
                style={{ background: "hsl(220 20% 8% / 0.6)", border: "1px solid hsl(220 15% 18% / 0.5)" }}
              >
                <span className="text-base">{stat.emoji}</span>
                <p className="text-foreground font-bold font-[family-name:var(--font-heading)] text-sm mt-1 leading-tight">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-[10px] mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── FOOTER ── */}
        <motion.div variants={stagger.item} className="relative z-10 text-center py-5 px-4 border-t border-white/[0.05]">
          <p className="text-muted-foreground text-xs font-[family-name:var(--font-heading)]">
            🧬 gitdna.app
          </p>
          <p className="text-muted-foreground/50 text-[10px] mt-1">
            Decoded on {today}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsCard;
