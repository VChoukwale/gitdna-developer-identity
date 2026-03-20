import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const GitDNATitle = () => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowCursor(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.h1
      className="text-5xl font-extrabold tracking-tight mb-3 relative inline-block cursor-default select-none overflow-hidden"
    >
      {/* Shimmer sweep overlay */}
      <motion.span
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          width: "60%",
        }}
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
      />

      <span style={{ color: "#00d4ff" }}>Git</span>
      <span
        style={{
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        DNA
      </span>

      {showCursor && (
        <motion.span
          className="inline-block w-[3px] h-[1em] ml-1 align-middle"
          style={{ backgroundColor: "#a855f7" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.h1>
  );
};

export default GitDNATitle;
