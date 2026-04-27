import { LevelConfig } from './types';

// Color palette for orbits
const colors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Light Purple
];

export const levels: LevelConfig[] = [
  {
    id: 1,
    name: 'First Contact',
    durationToSurvive: 60,
    description: 'Learn the basics with crossing elliptical orbits',
    orbits: [
      {
        width: 80,
        height: 60,
        angularSpeed: 1.0,
        initialAngle: 0,
        color: colors[0],
      },
      {
        width: 120,
        height: 90,
        angularSpeed: 0.8,
        initialAngle: Math.PI,
        color: colors[1],
        centerOffsetX: 30,
        centerOffsetY: -20,
      },
      {
        width: 100,
        height: 140,
        angularSpeed: 1.2,
        initialAngle: Math.PI / 2,
        color: colors[2],
        centerOffsetX: -40,
        centerOffsetY: 30,
      },
    ],
  },
  {
    id: 2,
    name: 'Close Encounters',
    durationToSurvive: 60,
    description: 'Faster orbits with crossing elliptical paths',
    orbits: [
      {
        width: 100,
        height: 70,
        angularSpeed: 1.8, // Increased from 1.2 to create more crossings
        initialAngle: 0, // Start at 0°
        color: colors[0],
      },
      {
        width: 140,
        height: 100,
        angularSpeed: 1.4, // Increased from 0.9 for more challenge
        initialAngle: Math.PI / 2, // Start at 90°
        color: colors[1],
        centerOffsetX: 50, // Reduced offset to create more crossing zones
        centerOffsetY: -30,
      },
      {
        width: 120,
        height: 180,
        angularSpeed: 1.1, // Increased from 0.7 for more dynamic gameplay
        initialAngle: Math.PI, // Start at 180°
        color: colors[2],
        centerOffsetX: -60, // Reduced offset for tighter interactions
        centerOffsetY: 40,
      },
      {
        width: 160,
        height: 120,
        angularSpeed: 1.5, // Increased from 1.0 to force speed management
        initialAngle: 3 * Math.PI / 2, // Start at 270°
        color: colors[3],
        centerOffsetX: 25,
        centerOffsetY: -60,
      },
    ],
  },
  {
    id: 3,
    name: 'Orbital Dance',
    durationToSurvive: 60,
    description: 'Complex timing with multiple elliptical crossings',
    orbits: [
      {
        width: 90,
        height: 65,
        angularSpeed: 1.4,
        initialAngle: 0, // Start at 0°
        color: colors[0],
      },
      {
        width: 130,
        height: 95,
        angularSpeed: 1.1,
        initialAngle: Math.PI * 2 / 5, // Start at 72°
        color: colors[1],
        centerOffsetX: 50,
        centerOffsetY: -30,
      },
      {
        width: 110,
        height: 170,
        angularSpeed: 0.8,
        initialAngle: Math.PI * 4 / 5, // Start at 144°
        color: colors[2],
        centerOffsetX: -60,
        centerOffsetY: 40,
      },
      {
        width: 150,
        height: 110,
        angularSpeed: 0.6,
        initialAngle: Math.PI * 6 / 5, // Start at 216°
        color: colors[3],
        centerOffsetX: 35,
        centerOffsetY: -50,
      },
      {
        width: 190,
        height: 130,
        angularSpeed: 1.2,
        initialAngle: Math.PI * 8 / 5, // Start at 288°
        color: colors[4],
        centerOffsetX: -25,
        centerOffsetY: 55,
      },
    ],
  },
  {
    id: 4,
    name: 'Shield Protocol',
    durationToSurvive: 60,
    description: 'Introducing shield orbits for emergency protection',
    orbits: [
      {
        width: 85,
        height: 60,
        angularSpeed: 2.0,
        initialAngle: 0,
        color: colors[0],
      },
      {
        width: 125,
        height: 90,
        angularSpeed: 1.5,
        initialAngle: Math.PI * 0.4,
        color: colors[1],
        centerOffsetX: 45,
        centerOffsetY: -28,
      },
      {
        width: 105,
        height: 165,
        angularSpeed: 1.2,
        initialAngle: Math.PI * 0.9,
        color: colors[2],
        centerOffsetX: -55,
        centerOffsetY: 38,
      },
      {
        width: 145,
        height: 105,
        angularSpeed: 0.8,
        initialAngle: Math.PI * 1.4,
        color: colors[3],
        centerOffsetX: 25,
        centerOffsetY: -50,
        isShield: true,
      },
      {
        width: 185,
        height: 125,
        angularSpeed: 1.7,
        initialAngle: Math.PI * 1.8,
        color: colors[4],
        centerOffsetX: -15,
        centerOffsetY: 55,
      },
    ],
  },
  {
    id: 5,
    name: 'Critical Mass',
    durationToSurvive: 60,
    description: 'Maximum challenge with shields and complex elliptical orbits',
    orbits: [
      {
        width: 100,
        height: 100, // Inner circle
        angularSpeed: 1.1,
        initialAngle: 0, // Starts at right
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 160,
        height: 160, // Outer circle - large gap
        angularSpeed: 0.6,
        initialAngle: Math.PI, // Starts opposite (180°)
        color: colors[1],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 80,
        height: 70, // Upper sector
        angularSpeed: 1.0,
        initialAngle: 3 * Math.PI / 2, // Starts at bottom of orbit
        color: colors[2],
        centerOffsetX: 0,
        centerOffsetY: -100, // Far up
      },
      {
        width: 75,
        height: 80, // Right sector
        angularSpeed: 0.9,
        initialAngle: Math.PI, // Starts at left of orbit
        color: colors[3],
        centerOffsetX: 105, // Far right
        centerOffsetY: 0,
      },
      {
        width: 85,
        height: 75, // Lower-left sector with shield
        angularSpeed: 0.8,
        initialAngle: Math.PI / 4, // Starts at 45°
        color: colors[4],
        centerOffsetX: -90, // Far left
        centerOffsetY: 90, // Far down
        isShield: true,
      },
    ],
  },
  {
    id: 6,
    name: 'Master Control',
    durationToSurvive: 60,
    description: 'The ultimate orbital traffic challenge with elliptical orbits',
    orbits: [
      {
        width: 65,
        height: 65, // Small inner circle
        angularSpeed: 0.4, // ULTRA slow
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 180,
        height: 180, // VERY large outer circle - huge gap
        angularSpeed: 0.3, // ULTRA slow
        initialAngle: Math.PI, // Opposite side
        color: colors[1],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 55,
        height: 55, // Top sector - tiny, very far
        angularSpeed: 0.35,
        initialAngle: 3 * Math.PI / 2, // Start at bottom of its orbit (away from center)
        color: colors[2],
        centerOffsetX: 0,
        centerOffsetY: -150, // EXTREMELY far up
      },
      {
        width: 55,
        height: 55, // Right sector - tiny, very far
        angularSpeed: 0.32,
        initialAngle: Math.PI, // Start at left of its orbit (away from center)
        color: colors[3],
        centerOffsetX: 150, // EXTREMELY far right
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 55,
        height: 55, // Bottom sector - tiny, very far
        angularSpeed: 0.38,
        initialAngle: Math.PI / 2, // Start at top of its orbit (away from center)
        color: colors[4],
        centerOffsetX: 0,
        centerOffsetY: 150, // EXTREMELY far down
      },
      {
        width: 55,
        height: 55, // Left sector - tiny, very far
        angularSpeed: 0.3,
        initialAngle: 0, // Start at right of its orbit (away from center)
        color: colors[5],
        centerOffsetX: -150, // EXTREMELY far left
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 120,
        height: 120, // Medium circle - between inner and outer
        angularSpeed: 0.35,
        initialAngle: Math.PI / 2, // 90°
        color: colors[6],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
    ],
  },
  {
    id: 7,
    name: 'Master Challenge',
    durationToSurvive: 60,
    description: 'The ultimate test of orbital traffic mastery with 8 planets',
    orbits: [
      {
        width: 85,
        height: 55,
        angularSpeed: 0.75, // Increased from 0.25 for more challenge
        initialAngle: 0, // Start at 0°
        color: colors[0],
        centerOffsetX: 0, // Center planet - no offset
        centerOffsetY: 0,
      },
      {
        width: 120,
        height: 80,
        angularSpeed: 0.60, // Increased from 0.20
        initialAngle: Math.PI / 4, // Start at 45°
        color: colors[1],
        centerOffsetX: 70, // Increased from 40 for better spacing
        centerOffsetY: -45, // Increased from -25
      },
      {
        width: 95,
        height: 140,
        angularSpeed: 0.50, // Increased from 0.15
        initialAngle: Math.PI / 2, // Start at 90°
        color: colors[2],
        centerOffsetX: -75, // Increased from -45
        centerOffsetY: 55, // Increased from 30
      },
      {
        width: 135,
        height: 90,
        angularSpeed: 0.42, // Increased from 0.12
        initialAngle: 3 * Math.PI / 4, // Start at 135°
        color: colors[3],
        centerOffsetX: 85, // Increased from 50
        centerOffsetY: -60, // Increased from -35
        isShield: true,
      },
      {
        width: 110,
        height: 160,
        angularSpeed: 0.35, // Increased from 0.10
        initialAngle: Math.PI, // Start at 180°
        color: colors[4],
        centerOffsetX: -90, // Increased from -55
        centerOffsetY: 70, // Increased from 40
      },
      {
        width: 150,
        height: 105,
        angularSpeed: 0.58, // Increased from 0.18
        initialAngle: 5 * Math.PI / 4, // Start at 225°
        color: colors[5],
        centerOffsetX: 60, // Increased from 35
        centerOffsetY: -70, // Increased from -45
        isShield: true,
      },
      {
        width: 175,
        height: 120,
        angularSpeed: 0.68, // Increased from 0.22
        initialAngle: 3 * Math.PI / 2, // Start at 270°
        color: colors[6],
        centerOffsetX: -65, // Increased from -30
        centerOffsetY: 80, // Increased from 50
      },
      {
        width: 200,
        height: 135,
        angularSpeed: 0.82, // Increased from 0.28
        initialAngle: 7 * Math.PI / 4, // Start at 315°
        color: colors[0],
        centerOffsetX: 50, // Increased from 25
        centerOffsetY: -85, // Increased from -55
      },
    ],
  },
  {
    id: 8,
    name: 'Orbital Mastery',
    durationToSurvive: 60,
    description: 'Advanced orbital control with strategic shield placement',
    orbits: [
      {
        width: 90,
        height: 70, // Inner elongated orbit
        angularSpeed: 0.6,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 130,
        height: 95, // Medium inner orbit - offset
        angularSpeed: 0.45,
        initialAngle: Math.PI / 3,
        color: colors[1],
        centerOffsetX: 40,
        centerOffsetY: 25,
      },
      {
        width: 160,
        height: 110, // Large outer orbit
        angularSpeed: 0.32,
        initialAngle: Math.PI,
        color: colors[2],
        centerOffsetX: 0,
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 85,
        height: 60, // Upper left cluster
        angularSpeed: 0.5,
        initialAngle: 4 * Math.PI / 3,
        color: colors[3],
        centerOffsetX: -80,
        centerOffsetY: -60,
      },
      {
        width: 75,
        height: 85, // Lower right cluster
        angularSpeed: 0.4,
        initialAngle: Math.PI / 6,
        color: colors[4],
        centerOffsetX: 75,
        centerOffsetY: 55,
      },
      {
        width: 140,
        height: 85, // Upper right cluster
        angularSpeed: 0.35,
        initialAngle: 2 * Math.PI / 3,
        color: colors[5],
        centerOffsetX: 65,
        centerOffsetY: -75,
      },
      {
        width: 95,
        height: 130, // Lower left cluster
        angularSpeed: 0.48,
        initialAngle: 5 * Math.PI / 6,
        color: colors[6],
        centerOffsetX: -70,
        centerOffsetY: 45,
      },
    ],
  },
  {
    id: 9,
    name: 'Speed Demons',
    durationToSurvive: 60,
    description: 'Fast-moving planets require constant attention',
    orbits: [
      {
        width: 85,
        height: 85, // Inner circle
        angularSpeed: 0.9, // Much slower
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 60,
        height: 55, // NE corner - very far
        angularSpeed: 1.0,
        initialAngle: Math.PI / 4, // 45° start
        color: colors[1],
        centerOffsetX: 125, // VERY far
        centerOffsetY: -110,
      },
      {
        width: 55,
        height: 60, // SW corner - very far
        angularSpeed: 0.95,
        initialAngle: 5 * Math.PI / 4, // 225° start
        color: colors[2],
        centerOffsetX: -125,
        centerOffsetY: 110,
      },
      {
        width: 170,
        height: 170, // Outer circle - much larger
        angularSpeed: 0.5, // Much slower
        initialAngle: Math.PI, // Opposite
        color: colors[3],
        centerOffsetX: 0,
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 60,
        height: 60, // NW corner - very far
        angularSpeed: 1.05,
        initialAngle: 3 * Math.PI / 4, // 135° start
        color: colors[4],
        centerOffsetX: -120,
        centerOffsetY: -115,
      },
    ],
  },
  {
    id: 10,
    name: 'Eccentric Paths',
    durationToSurvive: 120,
    description: 'Highly elliptical orbits create unpredictable crossings',
    orbits: [
      {
        width: 100,
        height: 100, // Center circular orbit
        angularSpeed: 0.8,
        initialAngle: 0, // Starts at right
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 150, // Wide horizontal ellipse - crosses center
        height: 80,
        angularSpeed: 0.6,
        initialAngle: Math.PI, // Starts at left (safe from center planet)
        color: colors[1],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 80, // Tall vertical ellipse - crosses center
        height: 150,
        angularSpeed: 0.7,
        initialAngle: Math.PI / 2, // Starts at top (safe position)
        color: colors[2],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 120, // Diagonal ellipse - offset to create crossing
        height: 100,
        angularSpeed: 0.65,
        initialAngle: 3 * Math.PI / 4, // Starts at upper-left
        color: colors[3],
        centerOffsetX: 40,
        centerOffsetY: -30,
        isShield: true,
      },
      {
        width: 110, // Another crossing orbit
        height: 130,
        angularSpeed: 0.75,
        initialAngle: 5 * Math.PI / 4, // Starts at lower-left (safe)
        color: colors[4],
        centerOffsetX: -35,
        centerOffsetY: 40,
      },
    ],
  },
  {
    id: 11,
    name: 'Nested Chaos',
    durationToSurvive: 120,
    description: 'Concentric orbits with different speeds',
    orbits: [
      {
        width: 60,
        height: 60,
        angularSpeed: 3.2, // Much faster to increase difficulty
        initialAngle: 0,
        color: colors[0],
      },
      {
        width: 100,
        height: 100,
        angularSpeed: 2.5, // Much faster
        initialAngle: Math.PI / 3,
        color: colors[1],
      },
      {
        width: 140,
        height: 140,
        angularSpeed: 1.9, // Much faster
        initialAngle: 2 * Math.PI / 3,
        color: colors[2],
      },
      {
        width: 180,
        height: 180,
        angularSpeed: 1.4, // Much faster
        initialAngle: Math.PI,
        color: colors[3],
        isShield: true,
      },
      {
        width: 220,
        height: 220,
        angularSpeed: 1.0, // Much faster
        initialAngle: 4 * Math.PI / 3,
        color: colors[4],
      },
      {
        width: 260,
        height: 260,
        angularSpeed: 0.8, // Faster
        initialAngle: 5 * Math.PI / 3,
        color: colors[5],
      },
    ],
  },
  {
    id: 12,
    name: 'Cosmic Dance',
    durationToSurvive: 120,
    description: 'Elegant figure-8 patterns with intersecting orbital flows',
    orbits: [
      {
        width: 140,
        height: 85, // Horizontal figure-8 base - wider
        angularSpeed: 0.7,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 85,
        height: 140, // Vertical figure-8 crossing - wider
        angularSpeed: 0.7,
        initialAngle: Math.PI / 2,
        color: colors[1],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 190,
        height: 115, // Large horizontal ellipse - much wider
        angularSpeed: 0.5,
        initialAngle: Math.PI,
        color: colors[2],
        centerOffsetX: 0,
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 115,
        height: 190, // Large vertical ellipse - much wider
        angularSpeed: 0.45,
        initialAngle: 3 * Math.PI / 2,
        color: colors[3],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 165,
        height: 100, // Offset horizontal ellipse - wider
        angularSpeed: 0.6,
        initialAngle: Math.PI / 4,
        color: colors[4],
        centerOffsetX: 70,
        centerOffsetY: 40,
      },
      {
        width: 100,
        height: 165, // Offset vertical ellipse - wider
        angularSpeed: 0.55,
        initialAngle: 5 * Math.PI / 4,
        color: colors[5],
        centerOffsetX: -70,
        centerOffsetY: -40,
      },
    ],
  },
  {
    id: 14,
    name: 'Shield Symphony',
    durationToSurvive: 120,
    description: 'Multiple shields - use them wisely!',
    orbits: [
      {
        width: 100,
        height: 100, // Small inner circle - isolated
        angularSpeed: 1.2,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 120,
        height: 90, // Upper-right region
        angularSpeed: 1.0,
        initialAngle: Math.PI / 6,
        color: colors[1],
        centerOffsetX: 120,
        centerOffsetY: -80,
      },
      {
        width: 110,
        height: 130, // Lower-right region
        angularSpeed: 0.5,
        initialAngle: 4 * Math.PI / 6,
        color: colors[2],
        centerOffsetX: 130,
        centerOffsetY: 70,
      },
      {
        width: 90,
        height: 120, // Lower-left region
        angularSpeed: 0.6,
        initialAngle: 8 * Math.PI / 6,
        color: colors[3],
        centerOffsetX: -110,
        centerOffsetY: 85,
      },
      {
        width: 130,
        height: 95, // Upper-left region
        angularSpeed: 0.1,
        initialAngle: 10 * Math.PI / 6,
        color: colors[4],
        centerOffsetX: -125,
        centerOffsetY: -75,
        isShield: true,
      },
      {
        width: 280,
        height: 280, // Massive outer shield circle
        angularSpeed: 0.4,
        initialAngle: Math.PI,
        color: colors[5],
        centerOffsetX: 0,
        centerOffsetY: 0,
        isShield: true,
      },
    ],
  },
  {
    id: 15,
    name: 'Asymmetric Assault',
    durationToSurvive: 140,
    description: 'All planets clustered to one side',
    orbits: [
      {
        width: 80,
        height: 60,
        angularSpeed: 1.7,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 70,
        centerOffsetY: 50,
      },
      {
        width: 100,
        height: 140,
        angularSpeed: 1.9,
        initialAngle: 2 * Math.PI / 7,
        color: colors[1],
        centerOffsetX: 85,
        centerOffsetY: 30,
      },
      {
        width: 120,
        height: 85,
        angularSpeed: 1.5,
        initialAngle: 4 * Math.PI / 7,
        color: colors[2],
        centerOffsetX: 100,
        centerOffsetY: 60,
      },
      {
        width: 140,
        height: 110,
        angularSpeed: 2.0,
        initialAngle: 6 * Math.PI / 7,
        color: colors[3],
        centerOffsetX: 75,
        centerOffsetY: 75,
        isShield: true,
      },
      {
        width: 160,
        height: 120,
        angularSpeed: 1.6,
        initialAngle: 8 * Math.PI / 7,
        color: colors[4],
        centerOffsetX: 95,
        centerOffsetY: 45,
      },
      {
        width: 180,
        height: 95,
        angularSpeed: 2.2,
        initialAngle: 10 * Math.PI / 7,
        color: colors[5],
        centerOffsetX: 80,
        centerOffsetY: 65,
      },
      {
        width: 200,
        height: 130,
        angularSpeed: 1.4,
        initialAngle: 12 * Math.PI / 7,
        color: colors[6],
        centerOffsetX: 105,
        centerOffsetY: 55,
      },
    ],
  },
  {
    id: 16,
    name: 'Time Pressure',
    durationToSurvive: 140,
    description: 'Endurance test - survive for a full minute!',
    orbits: [
      {
        width: 90,
        height: 70,
        angularSpeed: 1.3,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: -70,
        centerOffsetY: 50,
      },
      {
        width: 115,
        height: 155,
        angularSpeed: 0.3,
        initialAngle: 2 * Math.PI / 7,
        color: colors[1],
        centerOffsetX: 65,
        centerOffsetY: -55,
      },
      {
        width: 135,
        height: 95,
        angularSpeed: 1.2,
        initialAngle: 4 * Math.PI / 7,
        color: colors[2],
        centerOffsetX: -75,
        centerOffsetY: -60,
        isShield: true,
      },
      {
        width: 160,
        height: 115,
        angularSpeed: 0.7,
        initialAngle: 6 * Math.PI / 7,
        color: colors[3],
        centerOffsetX: 80,
        centerOffsetY: 65,
      },
      {
        width: 180,
        height: 125,
        angularSpeed: 1.6,
        initialAngle: 8 * Math.PI / 7,
        color: colors[4],
        centerOffsetX: -60,
        centerOffsetY: 75,
        isShield: true,
      },
      {
        width: 205,
        height: 140,
        angularSpeed: 1.8,
        initialAngle: 10 * Math.PI / 7,
        color: colors[5],
        centerOffsetX: 85,
        centerOffsetY: -75,
      },
      {
        width: 225,
        height: 105,
        angularSpeed: 1.2,
        initialAngle: 12 * Math.PI / 7,
        color: colors[6],
        centerOffsetX: -65,
        centerOffsetY: 80,
      },
    ],
  },
  {
    id: 17,
    name: 'Velocity Variance',
    durationToSurvive: 140,
    description: 'Mix of very slow and super fast orbits',
    orbits: [
      {
        width: 85,
        height: 65,
        angularSpeed: 0.4, // Very slow
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: -95,
        centerOffsetY: 65,
      },
      {
        width: 110,
        height: 150,
        angularSpeed: 1.0, // Fast (reduced from 1.2)
        initialAngle: 2 * Math.PI / 7,
        color: colors[1],
        centerOffsetX: 85,
        centerOffsetY: -75,
      },
      {
        width: 130,
        height: 90,
        angularSpeed: 0.6, // Slow
        initialAngle: 4 * Math.PI / 7,
        color: colors[2],
        centerOffsetX: -100,
        centerOffsetY: -80,
      },
      {
        width: 155,
        height: 110,
        angularSpeed: 2.4, // Fast (reduced from 2.1)
        initialAngle: 6 * Math.PI / 7,
        color: colors[3],
        centerOffsetX: 100,
        centerOffsetY: 85,
        isShield: true,
      },
      {
        width: 175,
        height: 125,
        angularSpeed: 0.5, // Slow
        initialAngle: 8 * Math.PI / 7,
        color: colors[4],
        centerOffsetX: -80,
        centerOffsetY: 100,
      },
      {
        width: 200,
        height: 135,
        angularSpeed: 0.7, // Moderate (reduced from 1.0)
        initialAngle: 10 * Math.PI / 7,
        color: colors[5],
        centerOffsetX: 110,
        centerOffsetY: -95,
      },
      {
        width: 220,
        height: 100,
        angularSpeed: 0.1, // Slow
        initialAngle: 12 * Math.PI / 7,
        color: colors[6],
        centerOffsetX: -90,
        centerOffsetY: 110,
      },
    ],
  },
  {
    id: 18,
    name: 'Figure Eight',
    durationToSurvive: 140,
    description: 'Fast-paced figure-eight patterns with dynamic crossings',
    orbits: [
      {
        width: 120,
        height: 90, // Wider base ellipse
        angularSpeed: 1.4, // Increased for more challenge
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: -100, // Further left
        centerOffsetY: 80, // Higher up
      },
      {
        width: 120,
        height: 90, // Matching base ellipse
        angularSpeed: 1.3, // Increased for balance
        initialAngle: Math.PI, // Opposite side
        color: colors[1],
        centerOffsetX: 100, // Further right
        centerOffsetY: -80, // Lower down
      },
      {
        width: 160,
        height: 120, // Larger crossing ellipse
        angularSpeed: 1.8, // Increased for dynamic action
        initialAngle: Math.PI / 2,
        color: colors[2],
        centerOffsetX: -80, // Left side
        centerOffsetY: -90, // Bottom left
      },
      {
        width: 160,
        height: 120, // Matching crossing ellipse
        angularSpeed: 1.8, // Increased for dynamic action
        initialAngle: 3 * Math.PI / 2, // Opposite
        color: colors[3],
        centerOffsetX: 80, // Right side
        centerOffsetY: 90, // Top right
      },
      {
        width: 200,
        height: 130, // Large shield orbit
        angularSpeed: 1.4, // Increased but still controlled
        initialAngle: Math.PI / 4,
        color: colors[4],
        centerOffsetX: -110, // Far left
        centerOffsetY: -60, // Mid-left
        isShield: true,
      },
      {
        width: 200,
        height: 130, // Large shield orbit
        angularSpeed: 1.4, // Increased but still controlled
        initialAngle: 5 * Math.PI / 4, // Opposite diagonal
        color: colors[5],
        centerOffsetX: 110, // Far right
        centerOffsetY: 60, // Mid-right
        isShield: true,
      },
      {
        width: 140,
        height: 180, // Tall center ellipse
        angularSpeed: 2.1, // Significantly increased for center action
        initialAngle: 3 * Math.PI / 4,
        color: colors[6],
        centerOffsetX: 0, // Center
        centerOffsetY: 0, // Center
      },
    ],
  },
  {
    id: 19,
    name: 'Rush Hour',
    durationToSurvive: 140,
    description: 'Controlled regional zones - master precise orbital timing',
    orbits: [
      {
        width: 100,
        height: 70, // Compact inner orbit
        angularSpeed: 1.8, // Much slower for safety
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: -90,
        centerOffsetY: 60,
      },
      {
        width: 120,
        height: 85, // Medium upper-left orbit
        angularSpeed: 1.7, // Reduced for control
        initialAngle: Math.PI / 6,
        color: colors[1],
        centerOffsetX: -120,
        centerOffsetY: -70,
      },
      {
        width: 140,
        height: 95, // Large lower-left orbit
        angularSpeed: 1.6, // Reduced significantly
        initialAngle: Math.PI / 3,
        color: colors[2],
        centerOffsetX: -140,
        centerOffsetY: 80,
      },
      {
        width: 110,
        height: 140, // Tall upper-right orbit
        angularSpeed: 1.9, // Reduced but still active
        initialAngle: 2 * Math.PI / 3,
        color: colors[3],
        centerOffsetX: 110,
        centerOffsetY: -90,
      },
      {
        width: 160,
        height: 105, // Wide lower-right orbit
        angularSpeed: 1.5, // Very slow for safety
        initialAngle: 5 * Math.PI / 6,
        color: colors[4],
        centerOffsetX: 130,
        centerOffsetY: 70,
        isShield: true,
      },
      {
        width: 130,
        height: 170, // Very tall right orbit
        angularSpeed: 1.8, // Reduced for control
        initialAngle: 4 * Math.PI / 6,
        color: colors[5],
        centerOffsetX: 100,
        centerOffsetY: 90,
      },
      {
        width: 180,
        height: 115, // Large horizontal orbit
        angularSpeed: 0.4, // Very slow
        initialAngle: 5 * Math.PI / 6,
        color: colors[6],
        centerOffsetX: -100,
        centerOffsetY: -85,
      },
      {
        width: 200,
        height: 125, // Massive outer shield
        angularSpeed: 1.3, // Very slow boundary
        initialAngle: Math.PI,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
        isShield: true,
      },
    ],
  },
  {
    id: 20,
    name: 'Orbital Harmony',
    durationToSurvive: 140,
    description: 'Balanced 8-planet system - find the perfect orbital rhythm',
    orbits: [
      {
        width: 100,
        height: 80, // Inner circle
        angularSpeed: 1.3,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 140,
        height: 100, // Upper-left orbit
        angularSpeed: 1.6,
        initialAngle: Math.PI / 4,
        color: colors[1],
        centerOffsetX: -120,
        centerOffsetY: -80,
      },
      {
        width: 120,
        height: 160, // Tall left orbit
        angularSpeed: 1.4,
        initialAngle: Math.PI / 2,
        color: colors[2],
        centerOffsetX: -100,
        centerOffsetY: 90,
        isShield: true,
      },
      {
        width: 160,
        height: 110, // Upper-right orbit
        angularSpeed: 1.1,
        initialAngle: 3 * Math.PI / 4,
        color: colors[3],
        centerOffsetX: 130,
        centerOffsetY: -70,
      },
      {
        width: 180,
        height: 120, // Lower-right orbit
        angularSpeed: 0.9,
        initialAngle: Math.PI,
        color: colors[4],
        centerOffsetX: 110,
        centerOffsetY: 85,
      },
      {
        width: 130,
        height: 140, // Lower-left orbit
        angularSpeed: 1.3,
        initialAngle: 5 * Math.PI / 4,
        color: colors[5],
        centerOffsetX: -110,
        centerOffsetY: 70,
        isShield: true,
      },
      {
        width: 200,
        height: 130, // Wide horizontal orbit
        angularSpeed: 0.8,
        initialAngle: 3 * Math.PI / 2,
        color: colors[6],
        centerOffsetX: 0,
        centerOffsetY: -60,
      },
      {
        width: 220,
        height: 135, // Outer boundary orbit
        angularSpeed: 2.3,
        initialAngle: 7 * Math.PI / 4,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
        isShield: true,
      },
    ],
  },
  {
    id: 21,
    name: 'Grand Orbits',
    durationToSurvive: 140,
    description: 'Massive orbital paths - spacious 9-planet grand tour',
    orbits: [
      {
        width: 150,
        height: 120, // Moderate center orbit
        angularSpeed: 0.4,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
      },
      {
        width: 200,
        height: 140, // Northeast region
        angularSpeed: 0.3,
        initialAngle: 2 * Math.PI / 9,
        color: colors[1],
        centerOffsetX: 120,
        centerOffsetY: -90,
      },
      {
        width: 180,
        height: 160, // Southeast region
        angularSpeed: 0.5,
        initialAngle: 4 * Math.PI / 9,
        color: colors[2],
        centerOffsetX: 140,
        centerOffsetY: 100,
        isShield: false,
      },
      {
        width: 190,
        height: 130, // Southwest region
        angularSpeed: 0.4,
        initialAngle: 6 * Math.PI / 9,
        color: colors[3],
        centerOffsetX: -130,
        centerOffsetY: 110,
      },
      {
        width: 170,
        height: 150, // Northwest region
        angularSpeed: 0.3,
        initialAngle: 8 * Math.PI / 9,
        color: colors[4],
        centerOffsetX: -140,
        centerOffsetY: -100,
      },
      {
        width: 220,
        height: 120, // Far north horizontal
        angularSpeed: 0.4,
        initialAngle: 10 * Math.PI / 9,
        color: colors[5],
        centerOffsetX: 0,
        centerOffsetY: -140,
      },
      {
        width: 130,
        height: 200, // Far west vertical
        angularSpeed: 0.3,
        initialAngle: 12 * Math.PI / 9,
        color: colors[6],
        centerOffsetX: -180,
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 240,
        height: 110, // Far east horizontal
        angularSpeed: 0.5,
        initialAngle: 14 * Math.PI / 9,
        color: colors[0],
        centerOffsetX: 160,
        centerOffsetY: 0,
      },
      {
        width: 140,
        height: 190, // Far south vertical
        angularSpeed: 0.4,
        initialAngle: 16 * Math.PI / 9,
        color: colors[1],
        centerOffsetX: 0,
        centerOffsetY: 160,
        isShield: true,
      },
    ],
  },
  {
    id: 22,
    name: 'Orbital Overload',
    durationToSurvive: 140,
    description: '9 planets - maximum chaos management',
    orbits: [

      {
        width: 120,
        height: 85,
        angularSpeed: 2.8,
        initialAngle: 2 * Math.PI / 4.5,
        color: colors[2],
        centerOffsetX: -95,
        centerOffsetY: -70,
      },

      {
        width: 160,
        height: 120,
        angularSpeed: 2.4,
        initialAngle: Math.PI,
        color: colors[4],
        centerOffsetX: -80,
        centerOffsetY: 80,
      },
      {
        width: 180,
        height: 95,
        angularSpeed: 2.9,
        initialAngle: 5 * Math.PI / 4.5,
        color: colors[5],
        centerOffsetX: 105,
        centerOffsetY: -80,
        isShield: true,
      },

      {
        width: 220,
        height: 110,
        angularSpeed: 2.1,
        initialAngle: 7 * Math.PI / 4.5,
        color: colors[0],
        centerOffsetX: 110,
        centerOffsetY: -85,
      },
      {
        width: 240,
        height: 145,
        angularSpeed: 1.7,
        initialAngle: 8 * Math.PI / 4.5,
        color: colors[1],
        centerOffsetX: -90,
        centerOffsetY: 90,
        isShield: true,
      },
    ],
  },
  {
    id: 23,
    name: 'Orbital Dance',
    durationToSurvive: 140,
    description: 'Massive planetary giants in spiral formation with strategic shields',
    orbits: [
      {
        width: 280,
        height: 160, // MASSIVE horizontal orbit
        angularSpeed: 0.35,
        initialAngle: 0,
        color: colors[0],
        centerOffsetX: 0,
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 220,
        height: 180, // Upper spiral arm
        angularSpeed: 0.28,
        initialAngle: Math.PI / 3,
        color: colors[1],
        centerOffsetX: 80,
        centerOffsetY: -140,
      },
      {
        width: 200,
        height: 240, // Right spiral arm
        angularSpeed: 0.45,
        initialAngle: 2 * Math.PI / 3,
        color: colors[2],
        centerOffsetX: 180,
        centerOffsetY: 0,
        isShield: true,
      },
      {
        width: 230,
        height: 170, // Lower spiral arm
        angularSpeed: 0.32,
        initialAngle: Math.PI,
        color: colors[3],
        centerOffsetX: 0,
        centerOffsetY: 160,
      },
      {
        width: 240,
        height: 150, // Left spiral arm
        angularSpeed: 0.40,
        initialAngle: 4 * Math.PI / 3,
        color: colors[4],
        centerOffsetX: -170,
        centerOffsetY: 0,
      },
      {
        width: 180,
        height: 220, // Inner vertical orbit
        angularSpeed: 0.20,
        initialAngle: 5 * Math.PI / 3,
        color: colors[5],
        centerOffsetX: -60,
        centerOffsetY: -100,
      },
    ],
  },

];

export const getLevelById = (id: number): LevelConfig | undefined => {
  return levels.find(level => level.id === id);
};

export const getNextLevelId = (currentId: number): number | null => {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }
  return levels[currentIndex + 1].id;
};