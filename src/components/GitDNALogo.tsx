import { motion } from "framer-motion";

const GitDNALogo = () => {
  const dots = [
    { cx: 20, cy: 8, strand: 0 },
    { cx: 38, cy: 22, strand: 1 },
    { cx: 18, cy: 36, strand: 0 },
    { cx: 42, cy: 50, strand: 1 },
    { cx: 16, cy: 64, strand: 0 },
    { cx: 44, cy: 78, strand: 1 },
    { cx: 22, cy: 92, strand: 0 },
  ];

  return (
    <motion.div
      className="mb-6 relative"
      animate={{ rotateY: [0, 25, 0, -25, 0], rotateZ: [0, 3, 0, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ perspective: 400, width: 60, height: 100 }}
    >
      <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
        <defs>
          <filter id="glow-c" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Cyan strand */}
        <motion.path
          d="M20 5 Q45 20 18 35 Q-5 50 16 65 Q45 80 22 95"
          stroke="#00d4ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          animate={{ strokeDashoffset: [0, -40] }}
          style={{ strokeDasharray: "8 12" }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        {/* Purple strand */}
        <motion.path
          d="M40 5 Q15 20 42 35 Q65 50 44 65 Q15 80 38 95"
          stroke="#a855f7"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          animate={{ strokeDashoffset: [0, 40] }}
          style={{ strokeDasharray: "8 12" }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Cross bridges - subtle pulse */}
        {[22, 50, 78].map((y, i) => (
          <motion.line
            key={i}
            x1={i % 2 === 0 ? 20 : 42}
            y1={y}
            x2={i % 2 === 0 ? 42 : 20}
            y2={y}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeDasharray="2 3"
            animate={{ opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}

        {/* Sequential pulsing commit dots */}
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r="3.5"
            fill={d.strand === 0 ? "#00d4ff" : "#a855f7"}
            filter="url(#glow-c)"
            animate={{
              scale: [0.8, 1.4, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Glow halos */}
        {dots.map((d, i) => (
          <motion.circle
            key={`g${i}`}
            cx={d.cx}
            cy={d.cy}
            r="7"
            fill={d.strand === 0 ? "rgba(0,212,255,0.15)" : "rgba(168,85,247,0.15)"}
            animate={{ r: [5, 10, 5], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

export default GitDNALogo;
