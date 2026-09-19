import React, { useEffect, useRef } from 'react';

/**
 * Romantic Confetti burst with pink hearts, sparkling stars, and pastel ribbons.
 * Optimized with offscreen sprite caching, balanced spread, and adjustable origin.
 */
export default function Confetti({
  trigger = true,
  duration = 4500,
  originX = 0.48, // 0.5 is center; 0.48 nudges it slightly to the left
  originY = 0.42, // Burst height (around the card's top / envelope)
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = document.documentElement.clientWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      // clientWidth excludes the scrollbar so it aligns with centered CSS cards
      width = document.documentElement.clientWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = ['#FF4F81', '#FF8FAB', '#FFD6E0', '#FFB3C6', '#FFF0F3', '#FFCCD5', '#FFE5EC'];
    const heartSymbols = ['💗', '💖', '💕', '✨', '🌸'];

    // Pre-render emoji sprites onto offscreen canvases once
    const spriteSize = 64;
    const emojiSprites = heartSymbols.map((char) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = spriteSize;
      offscreen.height = spriteSize;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.font = `${Math.floor(spriteSize * 0.65)}px serif`;
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(char, spriteSize / 2, spriteSize / 2);
      }
      return offscreen;
    });

    const count = 120;
    const particles = [];
    const centerX = width * originX;
    const centerY = height * originY;

    for (let i = 0; i < count; i++) {
      const isHeart = Math.random() < 0.35;
      // Alternate sides to ensure an even, symmetrical burst instead of clustering right
      const side = i % 2 === 0 ? -1 : 1;
      const vx = side * (Math.random() * 7.5 + 0.5) + (Math.random() - 0.5) * 2;

      particles.push({
        x: centerX + (Math.random() * 80 - 40),
        y: centerY + (Math.random() * 60 - 30),
        vx: vx,
        vy: (Math.random() - 0.72) * 18 - 4,
        size: isHeart ? 18 + Math.random() * 10 : 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: ((Math.random() - 0.5) * 10 * Math.PI) / 180,
        isHeart: isHeart,
        sprite: isHeart ? emojiSprites[Math.floor(Math.random() * emojiSprites.length)] : null,
        opacity: 1,
        gravity: 0.38 + Math.random() * 0.15,
        drag: 0.985,
      });
    }

    const startTime = performance.now();
    let lastTime = startTime;

    const render = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const dt = delta * 60;
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.vx *= Math.pow(p.drag, dt);
        p.rotation += p.rotationSpeed * dt;

        if (elapsed > duration * 0.6) {
          p.opacity = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
        }

        if (p.opacity > 0.01 && p.y < height + 50) {
          activeParticles++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;

          if (p.isHeart && p.sprite) {
            ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          }
          ctx.restore();
        }
      }

      if (elapsed < duration && activeParticles > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [trigger, duration, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}