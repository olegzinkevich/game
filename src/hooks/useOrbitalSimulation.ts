import { useState, useCallback, useMemo, useEffect } from 'react';
import { OrbitConfig, BodyState, SPEED_CHANGE_DURATION, SHIELD_DURATION, SHIELD_COOLDOWN, ORBIT_SCALE, getBodyRadius } from '../types';

interface UseOrbitalSimulationOptions {
  orbits: OrbitConfig[];
  onCollision: () => void;
  onSpeedChange?: (orbitIndex: number) => void;
  initialBodyStates?: BodyState[];
  destroyedPlanets?: Set<number>;
}

export const useOrbitalSimulation = ({ orbits, onCollision, onSpeedChange, initialBodyStates, destroyedPlanets = new Set() }: UseOrbitalSimulationOptions) => {
  const [bodyStates, setBodyStates] = useState<BodyState[]>(() =>
    initialBodyStates && initialBodyStates.length === orbits.length
      ? initialBodyStates
      : orbits.map((orbit) => ({
          angle: orbit.initialAngle,
          speedMultiplier: 1,
          speedChangeTime: 0,
          shieldActive: false,
          shieldCooldownEnd: 0,
        }))
  );

  // Auto-sync body states when orbits change (important for level transitions)
  useEffect(() => {
    // Only update if the number of orbits has changed
    if (bodyStates.length !== orbits.length) {
      setBodyStates(orbits.map((orbit) => ({
        angle: orbit.initialAngle,
        speedMultiplier: 1,
        speedChangeTime: 0,
        shieldActive: false,
        shieldCooldownEnd: 0,
      })));
    }
  }, [orbits, bodyStates.length]);

  // Reset body states when orbits change (level change)
  const resetBodies = useCallback(() => {
    setBodyStates(orbits.map((orbit) => ({
      angle: orbit.initialAngle,
      speedMultiplier: 1,
      speedChangeTime: 0,
      shieldActive: false,
      shieldCooldownEnd: 0,
    })));
  }, [orbits]);

  // Update simulation
  const update = useCallback((deltaTime: number) => {
    setBodyStates(prevStates => {
      const newStates = prevStates.map((state, index) => {
        const orbit = orbits[index];
        
        // Safety check: skip if orbit doesn't exist (during level transition)
        if (!orbit) return state;
        
        const currentTime = Date.now();

        // Update angle based on angular speed, size factor, and multiplier
        const sizeBasedSpeedFactor = Math.min(1.4, Math.max(0.6, 16 / getBodyRadius(orbit)));
        let newAngle = state.angle + (orbit.angularSpeed * sizeBasedSpeedFactor * state.speedMultiplier * deltaTime);

        // Normalize angle to 0-2π
        newAngle = newAngle % (2 * Math.PI);
        if (newAngle < 0) newAngle += 2 * Math.PI;

        // Reset speed multiplier after duration
        let speedMultiplier = state.speedMultiplier;
        if (state.speedChangeTime > 0 && currentTime - state.speedChangeTime > SPEED_CHANGE_DURATION) {
          speedMultiplier = 1;
        }

        // Update shield status
        let shieldActive = state.shieldActive;
        let shieldCooldownEnd = state.shieldCooldownEnd;

        if (shieldActive && currentTime >= state.shieldCooldownEnd) {
          shieldActive = false;
          shieldCooldownEnd = currentTime + SHIELD_COOLDOWN;
        }

        return {
          angle: newAngle,
          speedMultiplier,
          speedChangeTime: speedMultiplier !== 1 ? state.speedChangeTime : 0,
          shieldActive,
          shieldCooldownEnd,
        };
      });

      // Check for collisions
      for (let i = 0; i < newStates.length; i++) {
        // Skip destroyed planets
        if (destroyedPlanets.has(i)) continue;
        
        for (let j = i + 1; j < newStates.length; j++) {
          // Skip destroyed planets
          if (destroyedPlanets.has(j)) continue;
          
          const orbit1 = orbits[i];
          const orbit2 = orbits[j];
          
          // Safety check: skip if orbits don't exist (during level transition)
          if (!orbit1 || !orbit2) continue;
          
          const state1 = newStates[i];
          const state2 = newStates[j];

          // Calculate positions (using orbit center offsets and elliptical orbits)
          const centerX1 = (orbit1.centerOffsetX || 0) * ORBIT_SCALE;
          const centerY1 = (orbit1.centerOffsetY || 0) * ORBIT_SCALE;
          const centerX2 = (orbit2.centerOffsetX || 0) * ORBIT_SCALE;
          const centerY2 = (orbit2.centerOffsetY || 0) * ORBIT_SCALE;

          // For elliptical orbits: x = a * cos(θ), y = b * sin(θ)
          const x1 = centerX1 + Math.cos(state1.angle) * (orbit1.width * ORBIT_SCALE);
          const y1 = centerY1 + Math.sin(state1.angle) * (orbit1.height * ORBIT_SCALE);
          const x2 = centerX2 + Math.cos(state2.angle) * (orbit2.width * ORBIT_SCALE);
          const y2 = centerY2 + Math.sin(state2.angle) * (orbit2.height * ORBIT_SCALE);

          // Calculate distance
          const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

          const bodyRadius1 = getBodyRadius(orbit1);
          const bodyRadius2 = getBodyRadius(orbit2);

          // Check collision (skip if either has active shield)
          if (distance < bodyRadius1 + bodyRadius2 && !state1.shieldActive && !state2.shieldActive) {
            onCollision();
            return prevStates; // Don't update if collision detected
          }
        }
      }

      return newStates;
    });
  }, [orbits, onCollision, destroyedPlanets]);

  // Handle orbit click (speed change or shield activation)
  const onOrbitClick = useCallback((orbitIndex: number) => {
    const orbit = orbits[orbitIndex];
    const currentTime = Date.now();

    setBodyStates(prevStates => {
      const newStates = [...prevStates];
      const state = newStates[orbitIndex];

      if (orbit.isShield) {
        // Shield orbit: activate shield if not on cooldown
        if (currentTime >= state.shieldCooldownEnd) {
          newStates[orbitIndex] = {
            ...state,
            shieldActive: true,
            shieldCooldownEnd: currentTime + SHIELD_DURATION,
          };
        }
      } else {
        // Regular orbit: no speed change on canvas click - use panel buttons only
        // Speed changes should only be made through the PlanetsPanel buttons
      }

      return newStates;
    });
  }, [orbits]);

  // External speed change function (for panel controls)
  const changeSpeed = useCallback((orbitIndex: number, speedMultiplier: number) => {
    const orbit = orbits[orbitIndex];
    const currentTime = Date.now();

    if (!orbit || orbit.isShield) return; // Don't allow speed changes on shield orbits

    setBodyStates(prevStates => {
      const newStates = [...prevStates];
      newStates[orbitIndex] = {
        ...newStates[orbitIndex],
        speedMultiplier,
        speedChangeTime: currentTime,
      };
      return newStates;
    });

    // Notify about speed change
    onSpeedChange?.(orbitIndex);
  }, [orbits, onSpeedChange]);

  // Calculate body positions for rendering
  const bodyPositions = useMemo(() => {
    return bodyStates
      .map((state, index) => {
        const orbit = orbits[index];
        
        // Safety check: skip if orbit doesn't exist (during level transition)
        if (!orbit) return null;
        
        const centerX = (orbit.centerOffsetX || 0) * ORBIT_SCALE;
        const centerY = (orbit.centerOffsetY || 0) * ORBIT_SCALE;
        return {
          x: centerX + Math.cos(state.angle) * (orbit.width * ORBIT_SCALE),
          y: centerY + Math.sin(state.angle) * (orbit.height * ORBIT_SCALE),
          color: orbit.color,
          isShield: orbit.isShield,
          shieldActive: state.shieldActive,
          shieldCooldownEnd: state.shieldCooldownEnd,
          speedMultiplier: state.speedMultiplier,
        };
      })
      .filter((pos): pos is NonNullable<typeof pos> => pos !== null);
  }, [bodyStates, orbits]);

  return {
    bodyStates,
    bodyPositions,
    update,
    onOrbitClick,
    changeSpeed,
    resetBodies,
  };
};