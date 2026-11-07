import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  type: 'spark' | 'petal';
  angle?: number;
  spinSpeed?: number;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
}

export const ParticleBackground: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Golden sparks & subtle marigold petals
    const particleCount = Math.min(width > 768 ? 55 : 25, 60);
    const particles: Particle[] = [];
    const fireworks: FireworkParticle[] = [];

    const sparkColors = ['#D4AF37', '#FFD700', '#FFA500', '#FFF3DC', '#F5D77F'];
    const petalColors = ['#FF9933', '#E67300', '#FFB74D', '#D84315'];

    for (let i = 0; i < particleCount; i++) {
      const isPetal = i % 4 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPetal ? 5 + Math.random() * 5 : 1.2 + Math.random() * 2.5,
        speedY: isPetal ? 0.6 + Math.random() * 0.8 : -(0.3 + Math.random() * 0.7),
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: 0.2 + Math.random() * 0.65,
        color: isPetal ? petalColors[Math.floor(Math.random() * petalColors.length)] : sparkColors[Math.floor(Math.random() * sparkColors.length)],
        type: isPetal ? 'petal' : 'spark',
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.03,
      });
    }

    // Click to spawn festive golden firework sparkles
    const handleClick = (e: MouseEvent) => {
      if (!interactive) return;
      const x = e.clientX;
      const y = e.clientY;
      const colors = ['#FFD700', '#FFAA33', '#FFF8E7', '#FF6600', '#D4AF37'];

      for (let i = 0; i < 32; i++) {
        const angle = (Math.PI * 2 * i) / 32 + (Math.random() - 0.5) * 0.2;
        const speed = 1.5 + Math.random() * 4.5;
        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          size: 2 + Math.random() * 2.5,
        });
      }
    };

    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update ambient particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.type === 'spark') {
          // Floating golden embers rising
          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
        } else {
          // Drifting marigold petals falling
          if (p.y > height + 20) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.angle !== undefined && p.spinSpeed !== undefined) {
            p.angle += p.spinSpeed;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);
          ctx.globalAlpha = p.opacity;

          // Draw marigold petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      // Render & update interactive fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += 0.05; // gravity
        fw.vx *= 0.98; // friction
        fw.alpha -= fw.decay;

        if (fw.alpha <= 0) {
          fireworks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.globalAlpha = fw.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = fw.color;
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
};

