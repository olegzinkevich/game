import React, { useRef, useEffect, useCallback, useState } from 'react';
import { OrbitConfig, ORBIT_SCALE, getBodyRadius, COMET_DURATION_RANGE } from '../types';

const PLANET_IMAGE_PATHS = [
  `${process.env.PUBLIC_URL}/planets/planet1.png`,
  `${process.env.PUBLIC_URL}/planets/planet2.png`,
  `${process.env.PUBLIC_URL}/planets/planet3.png`,
  `${process.env.PUBLIC_URL}/planets/planet4.png`,
  `${process.env.PUBLIC_URL}/planets/planet5.png`,
];

interface CanvasProps {
  width: number;
  height: number;
  orbits: OrbitConfig[];
  bodyPositions?: Array<{
    x: number;
    y: number;
    color: string;
    isShield?: boolean;
    shieldActive: boolean;
    shieldCooldownEnd: number;
    speedMultiplier: number;
  }>;
  centerX: number;
  centerY: number;
  collisionRadius: number;
  onOrbitClick: (orbitIndex: number) => void;
  hoveredOrbit?: number;
  collisionDetected?: boolean;
  highlightedPlanet?: number;
  isBackgroundOnly?: boolean;
  backgroundSrc?: string;
  scale?: number; // Scale factor for responsive rendering
  destroyedPlanets?: Set<number>; // Set of destroyed planet indices
}

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  orbits,
  bodyPositions = [],
  centerX,
  centerY,
  collisionRadius,
  onOrbitClick,
  hoveredOrbit,
  collisionDetected = false,
  highlightedPlanet,
  isBackgroundOnly = false,
  backgroundSrc,
  scale = 1, // Default to 1 for backward compatibility
  destroyedPlanets = new Set(), // Default to empty set
}) => {
  // Use the provided scale for all drawing operations
  const drawScale = scale;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const planetImagesRef = useRef<HTMLImageElement[]>([]);
  const [planetsReady, setPlanetsReady] = useState(false);
  const planetSpinRef = useRef<Array<{ speed: number; phase: number }>>([]);
  const cometsRef = useRef<Array<{
    startTime: number;
    duration: number;
    startX: number;
    startY: number;
    velocityX: number;
    velocityY: number;
    length: number;
    width: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const img = new Image();
    img.decoding = 'async';
    const src = backgroundSrc || `${process.env.PUBLIC_URL}/background/background.jpg`;
    setBackgroundReady(false);
    img.src = src;
    img.onload = () => {
      backgroundImageRef.current = img;
      setBackgroundReady(true);
    };
    img.onerror = () => {
      console.warn('Background image failed to load:', img.src);
    };
  }, [backgroundSrc]);

  useEffect(() => {
    const now = performance.now();
    const makeComet = () => {
      const edge = Math.floor(Math.random() * 4);
      const padding = 80;
      let startX = 0;
      let startY = 0;
      let velocityX = 0;
      let velocityY = 0;

      if (edge === 0) {
        startX = -padding;
        startY = Math.random() * height;
        velocityX = 140 + Math.random() * 120;
        velocityY = -60 + Math.random() * 120;
      } else if (edge === 1) {
        startX = width + padding;
        startY = Math.random() * height;
        velocityX = -(140 + Math.random() * 120);
        velocityY = -60 + Math.random() * 120;
      } else if (edge === 2) {
        startX = Math.random() * width;
        startY = -padding;
        velocityX = -60 + Math.random() * 120;
        velocityY = 140 + Math.random() * 120;
      } else {
        startX = Math.random() * width;
        startY = height + padding;
        velocityX = -60 + Math.random() * 120;
        velocityY = -(140 + Math.random() * 120);
      }

      return {
        startTime: now + Math.random() * 4000,
        duration: COMET_DURATION_RANGE.min + Math.random() * (COMET_DURATION_RANGE.max - COMET_DURATION_RANGE.min),
        startX,
        startY,
        velocityX,
        velocityY,
        length: 160 + Math.random() * 160,
        width: 2 + Math.random() * 2.5,
        color: Math.random() > 0.5 ? 'rgba(180, 220, 255, 0.9)' : 'rgba(255, 200, 160, 0.9)',
      };
    };

    cometsRef.current = Array.from({ length: 3 }, makeComet);
  }, [width, height]);

  useEffect(() => {
    let loaded = 0;
    const images = PLANET_IMAGE_PATHS.map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = () => {
        loaded += 1;
        if (loaded === PLANET_IMAGE_PATHS.length) {
          planetImagesRef.current = images;
          setPlanetsReady(true);
        }
      };
      img.onerror = () => {
        console.warn('Planet image failed to load:', src);
      };
      return img;
    });
    planetImagesRef.current = images;
  }, []);

  // Handle mouse events
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    // Find clicked orbit
    for (let i = 0; i < orbits.length; i++) {
      const orbit = orbits[i];
      const orbitCenterX = (orbit.centerOffsetX || 0) * ORBIT_SCALE;
      const orbitCenterY = (orbit.centerOffsetY || 0) * ORBIT_SCALE;
      const width = (orbit.width || orbit.radius || 50) * ORBIT_SCALE;
      const height = (orbit.height || orbit.radius || 50) * ORBIT_SCALE;

      // Check if click is near the elliptical orbit (within tolerance)
      const localX = x - orbitCenterX;
      const localY = y - orbitCenterY;

      // Point on ellipse equation: (x/a)^2 + (y/b)^2 = 1
      const ellipseValue = (localX * localX) / (width * width) + (localY * localY) / (height * height);

      // Check if point is near the ellipse (within tolerance range)
      const orbitRange = 15; // Click tolerance
      const minEllipse = 1 - (orbitRange / Math.max(width, height));
      const maxEllipse = 1 + (orbitRange / Math.max(width, height));

      if (ellipseValue >= minEllipse && ellipseValue <= maxEllipse) {
        onOrbitClick(i);
        break;
      }
    }
  }, [orbits, centerX, centerY, onOrbitClick]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    // Could implement hover detection here if needed
  }, []);

  // Drawing functions
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw background image (cover)
    const img = backgroundImageRef.current;
    if (img && (backgroundReady || img.complete)) {
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > canvasAspect) {
        drawHeight = height;
        drawWidth = height * imgAspect;
        offsetX = (width - drawWidth) / 2;
      } else {
        drawWidth = width;
        drawHeight = width / imgAspect;
        offsetY = (height - drawHeight) / 2;
      }

      ctx.save();
      ctx.globalAlpha = isBackgroundOnly ? 0.6 : 0.4; // Slightly more visible for full-screen background
      ctx.filter = 'blur(0px)';
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.filter = 'none';
      ctx.restore();
    } else {
      ctx.fillStyle = '#02010f';
      ctx.fillRect(0, 0, width, height);
    }

    // Subtle color wash and vignette
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    const vignette = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, Math.max(width, height));
    vignette.addColorStop(0, 'rgba(30, 40, 80, 0.15)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Comets
    const now = performance.now();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    cometsRef.current = cometsRef.current.map((comet) => {
      let updated = comet;
      if (now > comet.startTime + comet.duration) {
        const resetTime = now + 6000 + Math.random() * 6000;
        updated = { ...comet, startTime: resetTime };
      }

      if (now >= updated.startTime) {
        const t = Math.min(1, (now - updated.startTime) / updated.duration);
        const x = updated.startX + updated.velocityX * t;
        const y = updated.startY + updated.velocityY * t;
        const tailX = x - (updated.velocityX * 0.2);
        const tailY = y - (updated.velocityY * 0.2);

        const gradient = ctx.createLinearGradient(x, y, tailX, tailY);
        gradient.addColorStop(0, updated.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = updated.width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX - (updated.velocityX * 0.35), tailY - (updated.velocityY * 0.35));
        ctx.stroke();

        // Bright head
        ctx.fillStyle = updated.color;
        ctx.beginPath();
        ctx.arc(x, y, updated.width + 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      return updated;
    });
    ctx.restore();
  }, [centerX, centerY, width, height, backgroundReady, isBackgroundOnly]);

  const drawStar = useCallback((ctx: CanvasRenderingContext2D) => {
    const t = performance.now() * 0.001;
    const pulse = 0.6 + Math.sin(t * 2.2) * 0.15;
    const rayRotate = t * 0.5;

    // Core
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18 + pulse * 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD36B';
    ctx.fill();

    // Inner glow
    const glow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 55 + pulse * 6);
    glow.addColorStop(0, 'rgba(255, 210, 120, 0.9)');
    glow.addColorStop(1, 'rgba(255, 120, 60, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55 + pulse * 6, 0, 2 * Math.PI);
    ctx.fill();

    // Solar rays
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255, 200, 120, 0.35)';
    ctx.lineWidth = 1.6;
    const rayCount = 18;
    for (let i = 0; i < rayCount; i++) {
      const angle = rayRotate + (Math.PI * 2 * i) / rayCount;
      const inner = 24 + Math.sin(t * 3 + i) * 1.5;
      const outer = 70 + (i % 2) * 12 + Math.sin(t * 2 + i * 0.7) * 5;

      const x1 = centerX + Math.cos(angle) * inner;
      const y1 = centerY + Math.sin(angle) * inner;
      const x2 = centerX + Math.cos(angle) * outer;
      const y2 = centerY + Math.sin(angle) * outer;

      const rayGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      rayGradient.addColorStop(0, 'rgba(255, 220, 160, 0.55)');
      rayGradient.addColorStop(0.6, 'rgba(255, 190, 120, 0.25)');
      rayGradient.addColorStop(1, 'rgba(255, 170, 100, 0)');
      ctx.strokeStyle = rayGradient;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    // Outer bloom
    const bloom = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 160 + pulse * 20);
    bloom.addColorStop(0, `rgba(255, 180, 80, ${0.2 + pulse * 0.1})`);
    bloom.addColorStop(1, 'rgba(255, 120, 60, 0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 160 + pulse * 20, 0, 2 * Math.PI);
    ctx.fill();
  }, [centerX, centerY]);

  const drawOrbit = useCallback((ctx: CanvasRenderingContext2D, orbit: OrbitConfig, index: number) => {
    const orbitCenterX = centerX + (orbit.centerOffsetX || 0) * ORBIT_SCALE;
    const orbitCenterY = centerY + (orbit.centerOffsetY || 0) * ORBIT_SCALE;
    ctx.beginPath();

    // Draw ellipse using bezier curves for better browser support
    const width = (orbit.width || orbit.radius || 50) * ORBIT_SCALE;
    const height = (orbit.height || orbit.radius || 50) * ORBIT_SCALE;

    // Approximate ellipse with 4 cubic bezier curves
    const kappa = 0.5522848; // control point constant
    const ox = width * kappa; // x offset for control points
    const oy = height * kappa; // y offset for control points

    ctx.moveTo(orbitCenterX + width, orbitCenterY); // Start at rightmost point
    ctx.bezierCurveTo(orbitCenterX + width, orbitCenterY - oy, orbitCenterX + ox, orbitCenterY - height, orbitCenterX, orbitCenterY - height);
    ctx.bezierCurveTo(orbitCenterX - ox, orbitCenterY - height, orbitCenterX - width, orbitCenterY - oy, orbitCenterX - width, orbitCenterY);
    ctx.bezierCurveTo(orbitCenterX - width, orbitCenterY + oy, orbitCenterX - ox, orbitCenterY + height, orbitCenterX, orbitCenterY + height);
    ctx.bezierCurveTo(orbitCenterX + ox, orbitCenterY + height, orbitCenterX + width, orbitCenterY + oy, orbitCenterX + width, orbitCenterY);
    ctx.closePath();

    // Orbit style based on type and state
    if (orbit.isShield) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
      ctx.shadowBlur = 8;
    } else {
      ctx.strokeStyle = 'rgba(200, 200, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([]);
      ctx.shadowColor = 'rgba(160, 200, 255, 0.3)';
      ctx.shadowBlur = 6;
    }

    // Highlight if hovered
    if (hoveredOrbit === index) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [centerX, centerY, hoveredOrbit]);

  const drawBody = useCallback((ctx: CanvasRenderingContext2D, position: typeof bodyPositions[0], orbit: OrbitConfig, index: number) => {
    const x = centerX + position.x;
    const y = centerY + position.y;
    const isHighlighted = highlightedPlanet === index;

    // Body size and style
    const bodyRadius = Math.max(collisionRadius / 2, getBodyRadius(orbit));

    // Flash red on collision
    if (collisionDetected) {
      ctx.fillStyle = '#FF0000';
    } else if (position.shieldActive) {
      ctx.fillStyle = '#00FFFF'; // Cyan for active shield
    } else if (orbit.isShield) {
      ctx.fillStyle = '#0080FF'; // Blue for shield orbit (inactive)
    } else {
      ctx.fillStyle = position.color;
    }

    // Draw highlight glow for selected planet
    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(x, y, bodyRadius + 8, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.fill();
    }

    const img = planetImagesRef.current[index % PLANET_IMAGE_PATHS.length];
    const isUsableImage = !!img && (planetsReady || img.complete) && img.naturalWidth > 0 && img.naturalHeight > 0;
    if (isUsableImage) {
      if (!planetSpinRef.current[index]) {
        // Randomize per-planet spin speed (radians/sec) and phase
        const direction = Math.random() > 0.5 ? 1 : -1;
        planetSpinRef.current[index] = {
          speed: direction * (0.1 + Math.random() * 0.6),
          phase: Math.random() * Math.PI * 2,
        };
      }
      const spin = planetSpinRef.current[index];
      const rotation = spin.phase + performance.now() * 0.001 * spin.speed;

      // Draw image planet clipped to circle
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      const hueRotate = index >= PLANET_IMAGE_PATHS.length ? (index - PLANET_IMAGE_PATHS.length + 1) * 45 : 0;
      if (hueRotate > 0) {
        ctx.filter = `hue-rotate(${hueRotate}deg)`;
      }
      ctx.beginPath();
      ctx.arc(0, 0, bodyRadius, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, -bodyRadius, -bodyRadius, bodyRadius * 2, bodyRadius * 2);
      ctx.restore();

      // Add subtle shading overlay
      const overlay = ctx.createRadialGradient(
        x - bodyRadius * 0.35,
        y - bodyRadius * 0.35,
        bodyRadius * 0.2,
        x,
        y,
        bodyRadius
      );
      overlay.addColorStop(0, 'rgba(255,255,255,0.35)');
      overlay.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = overlay;
      ctx.beginPath();
      ctx.arc(x, y, bodyRadius, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Fallback gradient if image not ready
      const baseColor = typeof ctx.fillStyle === 'string' ? ctx.fillStyle : orbit.color;
      const planetGradient = ctx.createRadialGradient(
        x - bodyRadius * 0.35,
        y - bodyRadius * 0.35,
        bodyRadius * 0.2,
        x,
        y,
        bodyRadius
      );
      planetGradient.addColorStop(0, 'rgba(255,255,255,0.95)');
      planetGradient.addColorStop(0.45, baseColor);
      planetGradient.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(x, y, bodyRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Atmospheric rim
    ctx.save();
    ctx.strokeStyle = 'rgba(180, 220, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, bodyRadius + 1, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // Subtle surface highlight
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(x - bodyRadius * 0.25, y - bodyRadius * 0.25, bodyRadius * 0.45, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fill();
    ctx.restore();

    // Highlight border for selected planet
    if (isHighlighted) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, bodyRadius + 2, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Speed indicator
    if (position.speedMultiplier !== 1) {
      ctx.strokeStyle = position.speedMultiplier > 1 ? '#00FF00' : '#FF8800';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, bodyRadius + 3, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Shield cooldown indicator
    if (orbit.isShield && !position.shieldActive && position.shieldCooldownEnd > Date.now()) {
      const cooldownProgress = (position.shieldCooldownEnd - Date.now()) / 5000; // 5 second cooldown
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, bodyRadius + 6, -Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * cooldownProgress));
      ctx.stroke();
    }
  }, [centerX, centerY, collisionRadius, collisionDetected, highlightedPlanet, planetsReady]);

  // Main render function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas and draw background
    drawBackground(ctx);

    // Only draw game elements if not background-only
    if (!isBackgroundOnly) {
      // Draw star
      drawStar(ctx);

      // Draw orbits (skip destroyed planets)
      orbits.forEach((orbit, index) => {
        if (!destroyedPlanets.has(index)) {
          drawOrbit(ctx, orbit, index);
        }
      });

      // Draw bodies (skip destroyed planets)
      bodyPositions.forEach((position, index) => {
        if (!destroyedPlanets.has(index)) {
          drawBody(ctx, position, orbits[index], index);
        }
      });
    }

  }, [width, height, orbits, bodyPositions, hoveredOrbit, collisionDetected, centerX, centerY, collisionRadius, highlightedPlanet, isBackgroundOnly, drawBackground, drawStar, drawOrbit, drawBody, destroyedPlanets]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={isBackgroundOnly ? undefined : handleCanvasClick}
      onMouseMove={isBackgroundOnly ? undefined : handleMouseMove}
      style={{
        width: isBackgroundOnly ? '100vw' : `${width}px`,
        height: isBackgroundOnly ? '100vh' : `${height}px`,
        border: isBackgroundOnly ? 'none' : '1px solid #333',
        cursor: isBackgroundOnly ? 'default' : 'pointer',
        backgroundColor: '#000011',
        position: isBackgroundOnly ? 'absolute' : 'relative',
        top: 0,
        left: 0,
      }}
    />
  );
};