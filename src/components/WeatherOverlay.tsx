import React, { useEffect, useRef } from 'react';
import { GameTime } from '../types/game';

interface WeatherOverlayProps {
  isRaining: boolean;
  time: GameTime;
  className?: string;
}

interface RainParticle {
  x: number;
  y: number;
  speed: number;
  len: number;
  alpha: number;
}

interface CondensationDroplet {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  trail: number;
  slideSpeed: number;
}

interface SunMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({
  isRaining,
  time,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rain particles
    const rainParticles: RainParticle[] = [];
    const maxRain = 140;
    for (let i = 0; i < maxRain; i++) {
      rainParticles.push({
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height,
        speed: 16 + Math.random() * 10,
        len: 18 + Math.random() * 14,
        alpha: 0.25 + Math.random() * 0.45,
      });
    }

    // Condensation glass droplets (wet lens effect)
    const droplets: CondensationDroplet[] = [];
    for (let i = 0; i < 28; i++) {
      droplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 2 + Math.random() * 3.5,
        alpha: 0.15 + Math.random() * 0.35,
        trail: 0,
        slideSpeed: 0.15 + Math.random() * 0.4,
      });
    }

    // Floating sunny sun motes / golden pollen
    const sunMotes: SunMote[] = [];
    for (let i = 0; i < 35; i++) {
      sunMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.3,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const hour = time.hour;
      const isMorning = hour >= 6 && hour < 9;
      const isGoldenHour = (hour >= 6 && hour < 8) || (hour >= 16 && hour < 18);
      const isNight = hour >= 19 || hour < 6;

      if (isRaining) {
        // -------------------------------------------------------------
        // 1. RAIN & MOUNTAIN STORM OVERLAY
        // -------------------------------------------------------------

        // A. Atmospheric Cool Mist Veil
        const mistGrad = ctx.createLinearGradient(0, 0, 0, height);
        mistGrad.addColorStop(0, 'rgba(15, 23, 42, 0.25)');
        mistGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
        mistGrad.addColorStop(1, 'rgba(15, 23, 42, 0.35)');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, 0, width, height);

        // B. Slanted Rain Streaks
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.55)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (const r of rainParticles) {
          r.x += 3.5;
          r.y += r.speed;

          if (r.y > height + 20) {
            r.y = -r.len;
            r.x = Math.random() * (width + 200) - 100;
          }
          if (r.x > width + 100) {
            r.x = -50;
          }

          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + 4, r.y + r.len);
        }
        ctx.stroke();
        ctx.restore();

        // C. Rolling Mountain Mist Waves (Halimun Hujan)
        ctx.save();
        const mistTime = frame * 0.008;
        const mistWaveCount = 2;
        for (let m = 0; m < mistWaveCount; m++) {
          const yBase = height * (0.65 + m * 0.18);
          ctx.fillStyle = `rgba(241, 245, 249, ${0.07 + m * 0.04})`;
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 40) {
            const waveY =
              yBase +
              Math.sin(x * 0.004 + mistTime + m) * 25 +
              Math.cos(x * 0.008 - mistTime * 0.7) * 15;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // D. Glass Condensation Droplets (Beading water on lens)
        ctx.save();
        for (const drop of droplets) {
          drop.y += drop.slideSpeed;
          if (drop.y > height + 10) {
            drop.y = -10;
            drop.x = Math.random() * width;
          }

          // Outer glassy glow
          ctx.fillStyle = `rgba(255, 255, 255, ${drop.alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.radius + 1, 0, Math.PI * 2);
          ctx.fill();

          // Droplet highlight
          ctx.fillStyle = `rgba(255, 255, 255, ${drop.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(drop.x - drop.radius * 0.3, drop.y - drop.radius * 0.3, drop.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else {
        // -------------------------------------------------------------
        // 2. SUNNY & MOUNTAIN MIST (HALIMUN ENJING) OVERLAY
        // -------------------------------------------------------------

        // A. Morning Mountain Mist (06:00 - 08:30)
        if (isMorning) {
          const morningFogAlpha = Math.max(0, 0.18 - ((hour - 6) * 60 + time.minute) / 900);
          if (morningFogAlpha > 0.01) {
            const fogGrad = ctx.createLinearGradient(0, 0, 0, height);
            fogGrad.addColorStop(0, `rgba(254, 240, 138, ${morningFogAlpha * 0.4})`);
            fogGrad.addColorStop(0.6, `rgba(248, 250, 252, ${morningFogAlpha})`);
            fogGrad.addColorStop(1, `rgba(226, 232, 240, ${morningFogAlpha * 1.2})`);
            ctx.fillStyle = fogGrad;
            ctx.fillRect(0, 0, width, height);

            // Gently drifting fog bank
            const fogTime = frame * 0.005;
            ctx.fillStyle = `rgba(255, 255, 255, ${morningFogAlpha * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let x = 0; x <= width; x += 50) {
              const fy = height * 0.7 + Math.sin(x * 0.003 + fogTime) * 35;
              ctx.lineTo(x, fy);
            }
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();
          }
        }

        // B. God Rays / Sunbeams (Crepuscular Rays piercing through mountains)
        if (isGoldenHour && !isNight) {
          ctx.save();
          const sunOriginX = width * 0.25;
          const sunOriginY = -40;
          const rayTime = frame * 0.006;
          const rayCount = 5;

          for (let i = 0; i < rayCount; i++) {
            const angleOffset = Math.sin(rayTime + i * 1.2) * 0.06;
            const baseAngle = 0.65 + i * 0.16 + angleOffset;
            const rayWidth = 60 + Math.sin(rayTime * 1.5 + i) * 20;

            const rGrad = ctx.createRadialGradient(
              sunOriginX,
              sunOriginY,
              50,
              sunOriginX,
              sunOriginY,
              height * 1.2
            );
            const rayAlpha = 0.08 + Math.sin(rayTime + i) * 0.04;
            rGrad.addColorStop(0, `rgba(254, 240, 138, ${rayAlpha * 1.5})`);
            rGrad.addColorStop(0.5, `rgba(251, 191, 36, ${rayAlpha})`);
            rGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

            ctx.fillStyle = rGrad;
            ctx.beginPath();
            ctx.moveTo(sunOriginX, sunOriginY);
            ctx.lineTo(
              sunOriginX + Math.cos(baseAngle - 0.05) * height * 1.5 - rayWidth,
              sunOriginY + Math.sin(baseAngle - 0.05) * height * 1.5
            );
            ctx.lineTo(
              sunOriginX + Math.cos(baseAngle + 0.05) * height * 1.5 + rayWidth,
              sunOriginY + Math.sin(baseAngle + 0.05) * height * 1.5
            );
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }

        // C. Golden Pollen & Highland Flora Motes
        if (!isNight) {
          ctx.save();
          for (const mote of sunMotes) {
            mote.x += mote.vx;
            mote.y += mote.vy;
            if (mote.y < -10) {
              mote.y = height + 10;
              mote.x = Math.random() * width;
            }
            if (mote.x < -10) mote.x = width + 10;
            if (mote.x > width + 10) mote.x = -10;

            const pulse = 0.7 + Math.sin(frame * 0.05 + mote.x) * 0.3;
            ctx.fillStyle = `rgba(254, 240, 138, ${mote.alpha * pulse * 0.8})`;
            ctx.beginPath();
            ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isRaining, time]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-20 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
