// Orbital Traffic Game Types

export interface OrbitConfig {
  radius?: number; // for circular orbits (deprecated, use width/height)
  width: number; // semi-major axis for elliptical orbits
  height: number; // semi-minor axis for elliptical orbits
  angularSpeed: number; // radians per second
  initialAngle: number; // radians
  color: string;
  isShield?: boolean;
  centerOffsetX?: number; // offset from main center
  centerOffsetY?: number; // offset from main center
}

export interface BodyState {
  angle: number;
  speedMultiplier: number;
  speedChangeTime: number; // timestamp when speed was last changed
  shieldActive: boolean;
  shieldCooldownEnd: number; // timestamp when shield cooldown ends
}

export interface LevelConfig {
  id: number;
  name: string;
  durationToSurvive: number; // seconds
  orbits: OrbitConfig[];
  description?: string;
}

export interface GameState {
  currentLevel: number;
  levelStartTime: number;
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  gameWon: boolean;
  gameLost: boolean;
  collisionDetected: boolean;
}

export interface CanvasProps {
  width: number;
  height: number;
  orbits: OrbitConfig[];
  bodyStates?: BodyState[];
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
}

export type GameScreen = 'menu' | 'playing' | 'paused' | 'level-select';

// Constants
export const COLLISION_RADIUS = 25;
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 750;
export const CENTER_X = CANVAS_WIDTH / 2;
export const CENTER_Y = CANVAS_HEIGHT / 2;
export const SPEED_CHANGE_DURATION = 100000; // milliseconds
export const SHIELD_DURATION = 2000; // milliseconds
export const SHIELD_COOLDOWN = 5000; // milliseconds
export const ORBIT_SCALE = 1.35;
export const COMET_DURATION_RANGE = { min: 6000, max: 50000 }; // milliseconds

export const getBodyRadius = (orbit: OrbitConfig, scale = ORBIT_SCALE) => {
  const base = Math.min(orbit.width, orbit.height) * scale;
  return Math.max(10, Math.min(36, base * 0.12));
};