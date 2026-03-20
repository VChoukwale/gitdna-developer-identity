import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fetchGitDNA, getErrorMessage, type GitDNAResult } from "@/lib/github";
import { analyzeGitDNA, type DevDNAProfile } from "@/lib/analysis";
import ResultsCard from "@/components/ResultsCard";
import ConstellationBackground from "@/components/ConstellationBackground";
import GitDNALogo from "@/components/GitDNALogo";
import GitDNATitle from "@/components/GitDNATitle";

const Index = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GitDNAResult | null>(null);
  const [dnaProfile, setDnaProfile] = useState<DevDNAProfile | null>(null);

  const handleDecode = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setDnaProfile(null);
    try {
      const data = await fetchGitDNA(trimmed);
      setResult(data);
      setDnaProfile(analyzeGitDNA(data));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
    setDnaProfile(null);
    setUsername("");
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ConstellationBackground />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, hsl(190 100% 50% / 0.06) 0%, transparent 60%)",
        }}
      />

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center px-4"
          >
            <GitDNALogo />
            <GitDNATitle />
            <motion.p
              className="text-muted-foreground text-lg mb-10"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Your Developer Identity, Decoded!
            </motion.p>

            <div className="w-full max-w-md flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter a GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDecode()}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 font-[family-name:var(--font-heading)] text-sm"
              />
              <button
                onClick={handleDecode}
                disabled={loading || !username.trim()}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm glow-button disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-[family-name:var(--font-heading)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sequencing developer DNA…
                  </>
                ) : (
                  "Decode GitDNA"
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 glass-card px-6 py-4 text-destructive text-sm max-w-md w-full text-center"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center px-4 py-10"
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={async () => {
                  const el = document.getElementById("gitdna-card");
                  if (!el) return;
                  const origWidth = el.style.width;
                  el.style.width = "500px";
                  await document.fonts.ready;
                  await new Promise((r) => setTimeout(r, 500));
                  const html2canvas = (await import("html2canvas")).default;
                  const PAD = 40;
                  const captured = await html2canvas(el, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                  });
                  el.style.width = origWidth;
                  const final_canvas = document.createElement("canvas");
                  final_canvas.width = captured.width + PAD * 2 * 2;
                  final_canvas.height = captured.height + PAD * 2 * 2;
                  const fCtx = final_canvas.getContext("2d")!;
                  fCtx.fillStyle = "#0a0a0f";
                  fCtx.fillRect(0, 0, final_canvas.width, final_canvas.height);
                  fCtx.drawImage(captured, PAD * 2, PAD * 2);
                  const link = document.createElement("a");
                  link.download = `gitdna-${result.profile.login}.png`;
                  link.href = final_canvas.toDataURL("image/png");
                  link.click();
                }}
                className="px-6 py-3 rounded-lg font-semibold text-sm glow-button font-[family-name:var(--font-heading)] flex items-center gap-2"
                style={{
                  backgroundColor: dnaProfile!.archetype.isGradient ? "#a855f7" : dnaProfile!.archetype.accentColor,
                  color: "#111",
                }}
              >
                📥 Download My GitDNA Card
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm glow-button font-[family-name:var(--font-heading)]"
              >
                ← Decode Another GitDNA
              </button>
            </div>
            <ResultsCard data={result} dnaProfile={dnaProfile!} />
          </motion.div>
        )}
      </AnimatePresence>

      {!result && (
        <p className="relative z-10 text-muted-foreground text-xs text-center pb-6">
          Powered by GitHub's public API. No login required.
        </p>
      )}
    </div>
  );
};

export default Index;
