import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 90;
const MAX_DIST = 140;
const MOUSE_RADIUS = 160;
const MOUSE_FORCE = 0.8;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseSpeed: number;
  glow: boolean;
  alpha: number;
  pulseOffset: number;
}

const ConstellationBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const sizeRoll = Math.random();
        let r: number, glow: boolean, alpha: number;
        if (sizeRoll > 0.92) {
          r = 2.5 + Math.random() * 1.5; // medium 3-4px
          glow = true;
          alpha = 0.7;
        } else if (sizeRoll > 0.5) {
          r = 1.2 + Math.random() * 0.8; // small 1.2-2px
          glow = false;
          alpha = 0.45;
        } else {
          r = 0.6 + Math.random() * 0.5; // tiny ~1px
          glow = false;
          alpha = 0.3;
        }
        const baseSpeed = 0.15 + Math.random() * 0.35;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * baseSpeed,
          vy: (Math.random() - 0.5) * baseSpeed,
          r,
          baseSpeed,
          glow,
          alpha,
          pulseOffset: Math.random() * Math.PI * 2,
        };
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    let time = 0;
    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Radial gradient spotlight in center
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.4;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.6);
      grad.addColorStop(0, "rgba(0, 212, 255, 0.03)");
      grad.addColorStop(0.3, "rgba(0, 140, 180, 0.015)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Update particles
      for (const p of particles) {
        // Mouse interaction
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const mDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (mDist < MOUSE_RADIUS && mDist > 0) {
          const force = (1 - mDist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dmx / mDist) * force * 0.1;
          p.vy += (dmy / mDist) * force * 0.1;
        }

        // Dampen velocity back toward base speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = p.baseSpeed * 3;
        if (speed > maxSpeed) {
          p.vx *= 0.97;
          p.vy *= 0.97;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw glow
        if (p.glow) {
          const pulse = 0.6 + Math.sin(time * 1.5 + p.pulseOffset) * 0.4;
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          glowGrad.addColorStop(0, `rgba(0, 212, 255, ${0.15 * pulse})`);
          glowGrad.addColorStop(1, "transparent");
          ctx.fillStyle = glowGrad;
          ctx.fillRect(p.x - p.r * 5, p.y - p.r * 5, p.r * 10, p.r * 10);
        }

        // Draw dot
        const dotAlpha = p.glow
          ? p.alpha * (0.7 + Math.sin(time * 1.5 + p.pulseOffset) * 0.3)
          : p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${dotAlpha})`;
        ctx.fill();
      }

      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default ConstellationBackground;
