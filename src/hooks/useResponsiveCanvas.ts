import { useState, useEffect } from 'react';

interface CanvasDimensions {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  scale: number;
}

export const useResponsiveCanvas = (): CanvasDimensions => {
  const [dimensions, setDimensions] = useState<CanvasDimensions>(() => {
    return calculateDimensions();
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};

function calculateDimensions(): CanvasDimensions {
  const baseWidth = 1000;
  const baseHeight = 750;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let width: number;
  let height: number;
  let scale: number;

  // Mobile - full screen with bottom controls
  if (viewportWidth < 768) {
    // Reserve space for bottom controls (40vh)
    const availableHeight = viewportHeight * 0.6; // 60% for canvas
    width = viewportWidth;
    height = availableHeight;
  }
  // Tablet - side panel (180px)
  else if (viewportWidth < 1024) {
    const availableWidth = viewportWidth - 200; // 180px panel + 20px margin
    const availableHeight = viewportHeight - 80; // HUD space
    
    width = availableWidth;
    height = availableHeight;
  }
  // Desktop - side panel (220px)
  else {
    const availableWidth = viewportWidth - 250; // 220px panel + 30px margin
    const availableHeight = viewportHeight - 100; // HUD space
    
    // Use full available space
    width = availableWidth;
    height = availableHeight;
  }

  // Calculate scale based on the smaller ratio to ensure everything fits
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;
  scale = Math.min(scaleX, scaleY);

  return {
    width,
    height,
    centerX: width / 2,
    centerY: height / 2,
    scale,
  };
}
