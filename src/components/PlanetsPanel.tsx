import React, { useState } from 'react';
import { OrbitConfig, getBodyRadius } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

// Custom styles for the speed sliders + responsive layout
const sliderStyles = `
  .speed-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 20px;
    background: transparent;
    cursor: pointer;
  }

  .speed-slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 16px;
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(255, 80, 80, 0.6) 0%, rgba(255, 211, 107, 0.8) 50%, rgba(80, 255, 150, 0.6) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .speed-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFD36B, #FFA500);
    border: 2px solid rgba(255, 255, 255, 0.9);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(255, 211, 107, 0.5);
    transition: all 0.2s ease;
    margin-top: -1px;
  }

  .speed-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 10px rgba(255, 211, 107, 0.7);
  }

  .speed-slider::-moz-range-track {
    width: 100%;
    height: 16px;
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(255, 80, 80, 0.6) 0%, rgba(255, 211, 107, 0.8) 50%, rgba(80, 255, 150, 0.6) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .speed-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFD36B, #FFA500);
    border: 2px solid rgba(255, 255, 255, 0.9);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(255, 211, 107, 0.5);
    transition: all 0.2s ease;
  }

  .speed-slider::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 10px rgba(255, 211, 107, 0.7);
  }

  .speed-slider:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .speed-slider:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }

  .speed-slider:disabled::-moz-range-thumb {
    cursor: not-allowed;
  }

  /* Planet destruction animation */
  @keyframes planetDestroy {
    0% {
      transform: scale(1);
      opacity: 1;
      filter: brightness(1);
    }
    20% {
      transform: scale(1.3);
      filter: brightness(2) saturate(0);
      background: #fff;
    }
    40% {
      transform: scale(1.5);
      opacity: 0.8;
      filter: brightness(3);
    }
    60% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    80% {
      transform: scale(0.3);
      opacity: 0.2;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
  }

  @keyframes rowDestroy {
    0% {
      transform: translateX(0);
      opacity: 1;
      max-height: 60px;
    }
    30% {
      transform: translateX(5px);
      background: rgba(255, 100, 100, 0.3);
    }
    50% {
      transform: translateX(-5px);
    }
    70% {
      transform: translateX(3px);
      opacity: 0.5;
    }
    100% {
      transform: translateX(0);
      opacity: 0;
      max-height: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
  }

  .planet-destroying {
    animation: rowDestroy 0.6s ease-out forwards;
  }

  .planet-icon-destroying {
    animation: planetDestroy 0.5s ease-out forwards;
  }

  @keyframes explosionParticle {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--tx), var(--ty)) scale(0);
      opacity: 0;
    }
  }

  /* Responsive layout for planets panel */
  .planets-panel {
    position: fixed;
    right: 20px;
    top: 20px;
    bottom: 20px;
    width: 290px;
    background: linear-gradient(180deg, rgba(15, 20, 45, 0.95), rgba(8, 10, 25, 0.95));
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 16px;
    overflow: hidden !important;
    overflow-y: hidden !important;
    overflow-x: hidden !important;
    color: white;
    font-family: Arial, sans-serif;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(120, 180, 255, 0.2);
    backdrop-filter: blur(8px);
    z-index: 100;
  }

  .planets-panel * {
    overflow: hidden !important;
  }

  /* Mobile phones - bottom sheet */
  @media (max-width: 767px) {
    .planets-panel {
      position: fixed !important;
      right: 0 !important;
      left: 0 !important;
      top: auto !important;
      bottom: 0 !important;
      width: 100% !important;
      height: 40vh !important;
      max-height: 40vh !important;
      border-radius: 16px 16px 0 0 !important;
      padding: 12px !important;
      border-bottom: none !important;
      background: linear-gradient(180deg, rgba(15, 20, 45, 0.98), rgba(8, 10, 25, 0.98)) !important;
      overflow: hidden !important;
      overflow-y: hidden !important;
      overflow-x: hidden !important;
    }
  }

  /* Tablets */
  @media (min-width: 768px) and (max-width: 1024px) {
    .planets-panel {
      width: 280px;
      right: 10px;
      padding: 12px;
      overflow: hidden !important;
      overflow-y: hidden !important;
      overflow-x: hidden !important;
    }
  }
`;

const PLANET_IMAGE_PATHS = [
  `${process.env.PUBLIC_URL}/planets/planet1.png`,
  `${process.env.PUBLIC_URL}/planets/planet2.png`,
  `${process.env.PUBLIC_URL}/planets/planet3.png`,
  `${process.env.PUBLIC_URL}/planets/planet4.png`,
  `${process.env.PUBLIC_URL}/planets/planet5.png`,
];

interface PlanetsPanelProps {
  orbits: OrbitConfig[];
  bodyStates: Array<{
    speedMultiplier: number;
  }>;
  onSpeedChange: (orbitIndex: number, speedMultiplier: number) => void;
  highlightedPlanet?: number;
  gameOverCount: number;
  destroyedPlanets: Set<number>;
  onDestroyPlanet: (orbitIndex: number) => void;
}

export const PlanetsPanel: React.FC<PlanetsPanelProps> = ({
  orbits,
  bodyStates,
  onSpeedChange,
  highlightedPlanet,
  gameOverCount,
  destroyedPlanets,
  onDestroyPlanet,
}) => {
  const { t, translate } = useTranslation();
  const [destroyingPlanet, setDestroyingPlanet] = useState<number | null>(null);

  const handleDestroyClick = (index: number) => {
    setDestroyingPlanet(index);
    // After animation completes, actually destroy the planet
    setTimeout(() => {
      onDestroyPlanet(index);
      setDestroyingPlanet(null);
    }, 600);
  };

  const getSpeedLabel = (multiplier: number) => {
    if (multiplier === 0.25) return t.speedVerySlow;
    if (multiplier === 0.5) return t.speedSlow;
    if (multiplier === 1) return t.speedNormal;
    if (multiplier === 2) return t.speedFast;
    if (multiplier === 4) return t.speedSuperFast;
    return `${multiplier}x`;
  };

  // Convert speed multiplier to slider value (0-100)
  const speedToSlider = (speed: number): number => {
    const speeds = [0.25, 0.5, 1, 2, 4];
    const positions = [0, 25, 50, 75, 100];

    // Find the closest speed points for interpolation
    if (speed <= speeds[0]) return positions[0];
    if (speed >= speeds[speeds.length - 1]) return positions[positions.length - 1];

    for (let i = 0; i < speeds.length - 1; i++) {
      if (speed >= speeds[i] && speed <= speeds[i + 1]) {
        // Linear interpolation between two speed points
        const ratio = (speed - speeds[i]) / (speeds[i + 1] - speeds[i]);
        return positions[i] + ratio * (positions[i + 1] - positions[i]);
      }
    }

    return 50; // Default to 50 (normal speed)
  };

  // Convert slider value (0-100) to speed multiplier
  const sliderToSpeed = (sliderValue: number): number => {
    const speeds = [0.25, 0.5, 1, 2, 4];
    const positions = [0, 25, 50, 75, 100];

    if (sliderValue <= positions[0]) return speeds[0];
    if (sliderValue >= positions[positions.length - 1]) return speeds[speeds.length - 1];

    for (let i = 0; i < positions.length - 1; i++) {
      if (sliderValue >= positions[i] && sliderValue <= positions[i + 1]) {
        // Linear interpolation between two position points
        const ratio = (sliderValue - positions[i]) / (positions[i + 1] - positions[i]);
        return speeds[i] + ratio * (speeds[i + 1] - speeds[i]);
      }
    }

    return 1; // Default to 1 (normal speed)
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      <div className="planets-panel">
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '16px',
        textAlign: 'center',
        color: '#FFD18B',
        letterSpacing: '0.5px',
        textShadow: '0 0 10px rgba(255, 200, 120, 0.5)',
      }}>
        {t.planetControl}
      </h3>
      
      {/* Game Over Counter */}
      {gameOverCount > 0 && (
        <div style={{
          marginBottom: '12px',
          padding: '6px 8px',
          backgroundColor: 'rgba(255, 100, 100, 0.15)',
          borderRadius: '6px',
          fontSize: '10px',
          color: '#ffaaaa',
          textAlign: 'center',
          border: '1px solid rgba(255, 100, 100, 0.3)',
        }}>
          💀 {t.gameOvers}: {gameOverCount}
          {gameOverCount >= 5 && <span style={{ color: '#ffdd77', marginLeft: '6px' }}>🔓 {t.unlockedDestroyers}</span>}
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {orbits.map((orbit, index) => {
          const bodyState = bodyStates[index];
          
          // Safety check: skip if bodyState is not yet initialized
          if (!bodyState) return null;
          
          // Skip destroyed planets
          if (destroyedPlanets.has(index)) return null;
          
          const isHighlighted = highlightedPlanet === index;
          const planetSize = Math.max(10, Math.min(28, getBodyRadius(orbit) * 2.2));
          const planetImage = PLANET_IMAGE_PATHS[index % PLANET_IMAGE_PATHS.length];
          const hueRotate = index >= PLANET_IMAGE_PATHS.length ? (index - PLANET_IMAGE_PATHS.length + 1) * 45 : 0;
          
          // Check if destroy button should be unlocked for this planet
          // After 5 game overs: unlock planet 0 (index 0)
          // After 10 game overs: unlock planet 1 (index 1)
          // After 15 game overs: unlock planet 2 (index 2), etc.
          const canDestroy = gameOverCount >= (index + 1) * 5;

          const isDestroying = destroyingPlanet === index;

          return (
            <div
              key={index}
              className={isDestroying ? 'planet-destroying' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 10px',
                background: isDestroying
                  ? 'linear-gradient(90deg, rgba(255, 100, 100, 0.3), rgba(255, 50, 50, 0.2))'
                  : isHighlighted
                    ? 'linear-gradient(90deg, rgba(255, 200, 80, 0.22), rgba(255, 255, 255, 0.08))'
                    : 'linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
                borderRadius: '8px',
                border: isDestroying
                  ? '1px solid rgba(255, 100, 100, 0.8)'
                  : isHighlighted ? '1px solid rgba(255, 209, 139, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)',
                transition: isDestroying ? 'none' : 'all 0.3s ease',
                boxShadow: isDestroying
                  ? '0 0 20px rgba(255, 100, 100, 0.5)'
                  : isHighlighted ? '0 0 16px rgba(255, 200, 120, 0.25)' : 'none',
                gap: '8px',
              }}
            >
              {/* Planet Icon */}
              <div
                className={isDestroying ? 'planet-icon-destroying' : ''}
                style={{
                  width: `${planetSize}px`,
                  height: `${planetSize}px`,
                  borderRadius: '50%',
                  backgroundImage: `url(${planetImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: orbit.color,
                  filter: hueRotate > 0 ? `hue-rotate(${hueRotate}deg)` : 'none',
                  border: orbit.isShield ? '2px solid rgba(0, 255, 255, 0.8)' : '2px solid rgba(255, 255, 255, 0.25)',
                  flexShrink: 0,
                  boxShadow: isDestroying
                    ? '0 0 25px rgba(255, 100, 50, 0.8)'
                    : isHighlighted
                      ? '0 0 12px rgba(255, 220, 140, 0.6)'
                      : '0 0 6px rgba(255, 255, 255, 0.15)',
                  transform: isHighlighted && !isDestroying ? 'scale(1.12)' : 'scale(1)',
                  transition: isDestroying ? 'none' : 'all 0.3s ease',
                }}>
                {orbit.isShield && (
                  <div style={{
                    position: 'relative',
                    top: '-6px',
                    right: '-12px',
                    fontSize: '10px',
                  }}>🛡️</div>
                )}
              </div>

              {/* Speed Display */}
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#b8c2ff',
                minWidth: '42px',
                textAlign: 'center',
                flexShrink: 0,
              }}>
                {bodyState.speedMultiplier.toFixed(2)}x
              </div>

              {/* Speed Slider */}
              <div style={{
                flex: 1,
                minWidth: '50px',
              }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={speedToSlider(bodyState.speedMultiplier)}
                  onChange={(e) => onSpeedChange(index, sliderToSpeed(Number(e.target.value)))}
                  className="speed-slider"
                  style={{
                    width: '100%',
                    height: '20px',
                    outline: 'none',
                    cursor: orbit.isShield ? 'not-allowed' : 'pointer',
                  }}
                  title={translate('speedTooltip', { speed: bodyState.speedMultiplier.toFixed(2) })}
                  disabled={orbit.isShield}
                />
              </div>

              {/* Destroy Button - Unlocked after multiple game overs */}
              {canDestroy && !isDestroying && (
                <button
                  onClick={() => handleDestroyClick(index)}
                  style={{
                    background: 'linear-gradient(135deg, #ff4d4d, #c41e3a)',
                    border: '1px solid rgba(255, 100, 100, 0.6)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px',
                    padding: '4px 6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(255, 77, 77, 0.3)',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 77, 77, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 77, 77, 0.3)';
                  }}
                  title={`${translate('removePlanet', { index: index + 1 })} (${translate('unlockedAfter', { count: (index + 1) * 5 })})`}
                >
                  💥
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '15px',
        padding: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: '6px',
        fontSize: '11px',
        color: '#cbd4ff',
        textAlign: 'center',
      }}>
        {t.dragSlidersHint}
      </div>
    </div>
    </>
  );
};