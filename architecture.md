# Orbital Chaos - Application Architecture

## Overview

**Orbital Chaos** is a browser-based puzzle game built with React and TypeScript, designed for the Yandex Games platform. Players manage orbital traffic by controlling planet rotation speeds to safely guide spaceships to their destinations while avoiding collisions and shield barriers.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 with TypeScript |
| Build Tool | Create React App (react-scripts) |
| Rendering | HTML5 Canvas API |
| Audio | Web Audio API (AudioContext, AudioBufferSourceNode) |
| State Management | React useState/useReducer + Custom Hooks |
| Internationalization | Custom i18n system with React Context |
| Platform Integration | Yandex Games SDK |
| Styling | Inline styles + CSS-in-JS (via style tags) |

## Project Structure

```
src/
├── components/           # React UI components
│   ├── OrbitalTrafficGame.tsx   # Main game component (canvas + controls)
│   ├── Menu.tsx                  # Level selection screen
│   ├── PlanetsPanel.tsx          # Speed control sliders
│   ├── LevelIntro.tsx            # Pre-level briefing screen
│   ├── GameOver.tsx              # Failure screen
│   ├── LevelComplete.tsx         # Success screen
│   ├── LoadingScreen.tsx         # Asset loading indicator
│   └── SDKWaitScreen.tsx         # SDK initialization spinner
├── hooks/                # Custom React hooks
│   ├── useBackgroundMusic.ts     # Web Audio music player
│   ├── useGameLoop.ts            # requestAnimationFrame loop
│   └── useSoundEffects.ts        # Sound effect management
├── i18n/                 # Internationalization
│   ├── translations.ts           # Translation strings (6 languages)
│   └── LanguageContext.tsx       # Language provider + hook
├── utils/                # Utility functions
│   ├── audioCache.ts             # Shared AudioContext + buffer cache
│   ├── gameLogic.ts              # Physics, collision, game rules
│   ├── particleEffects.ts        # Visual particle systems
│   └── renderUtils.ts            # Canvas drawing helpers
├── levels/               # Level definitions
│   └── levelConfigs.ts           # All level configurations
├── types.ts              # TypeScript interfaces
├── App.tsx               # Root component + SDK integration
└── index.tsx             # Application entry point
```

## Core Architecture

### Application Initialization Flow

```
index.tsx
    │
    ▼
App.tsx
    │
    ├─► SDK Detection ──► SDKWaitScreen (spinner)
    │       │
    │       ▼
    │   Language Detection (from Yandex SDK)
    │       │
    │       ▼
    │   Asset Preloading ──► LoadingScreen (localized)
    │       │
    │       ▼
    └─► Menu.tsx (level selection)
            │
            ▼
        OrbitalTrafficGame.tsx
```

### Component Hierarchy

```
App.tsx (root)
├── LanguageProvider (context)
│   ├── SDKWaitScreen (pre-SDK)
│   ├── LoadingScreen (during asset load)
│   ├── Menu (level selection)
│   └── OrbitalTrafficGame (gameplay)
│       ├── LevelIntro (pre-game briefing)
│       ├── Canvas (game rendering)
│       ├── PlanetsPanel (speed controls)
│       ├── LevelComplete (success)
│       └── GameOver (failure)
```

## State Management

### App-Level State (App.tsx)

```typescript
interface AppState {
  currentScreen: 'loading' | 'menu' | 'game';
  selectedLevel: number;
  completedLevels: Set<number>;
  sdkReady: boolean;
  assetsLoaded: boolean;
}
```

### Game State (OrbitalTrafficGame.tsx)

```typescript
interface GameState {
  phase: 'intro' | 'playing' | 'paused' | 'levelComplete' | 'gameOver';
  currentLevel: number;
  planets: Planet[];
  ships: Ship[];
  particles: Particle[];
  score: number;
  shipsDelivered: number;
  shipsLost: number;
  timeRemaining: number;
}
```

State is managed through:
- `useState` for simple values
- `useReducer` for complex game state
- `useRef` for mutable values that shouldn't trigger re-renders (animation frames, audio nodes)
- `useCallback` for memoized event handlers

## Data Flow

### Game Loop Architecture

```
useGameLoop.ts
      │
      ▼ (requestAnimationFrame)
      │
Update Phase ──────────────────────────────────────┐
      │                                            │
      ├─► Update ship positions (orbital motion)   │
      ├─► Check collisions (ship-ship, ship-shield)│
      ├─► Check arrivals (ship reaching station)   │
      ├─► Spawn new ships (based on level config)  │
      ├─► Update particles (explosions, trails)    │
      └─► Update timer                             │
                                                   │
Render Phase ◄─────────────────────────────────────┘
      │
      ├─► Clear canvas
      ├─► Draw background (space, stars)
      ├─► Draw orbits (rings)
      ├─► Draw planets (rotating sprites)
      ├─► Draw ships (with direction indicators)
      ├─► Draw shields (barrier effects)
      ├─► Draw stations (destination markers)
      ├─► Draw particles (effects)
      └─► Draw UI overlays (score, timer)
```

### User Input Flow

```
User Interaction
      │
      ├─► Speed Slider (PlanetsPanel)
      │       │
      │       ▼
      │   setPlanetSpeed(planetId, speed)
      │       │
      │       ▼
      │   Update planet.rotationSpeed in state
      │       │
      │       ▼
      │   Ships on that orbit move faster/slower
      │
      ├─► Pause Button
      │       │
      │       ▼
      │   setPhase('paused')
      │       │
      │       ▼
      │   Game loop stops processing
      │
      └─► Menu Navigation
              │
              ▼
          stopMusic() → onBackToMenu()
```

## Key Modules

### Game Logic (utils/gameLogic.ts)

Core physics and game rules:

```typescript
// Ship movement on orbits
updateShipPosition(ship, planet, deltaTime)

// Collision detection
checkShipCollision(ship1, ship2): boolean
checkShieldCollision(ship, shield): boolean
checkStationArrival(ship, station): boolean

// Spawning logic
shouldSpawnShip(level, gameTime): boolean
createShip(spawnPoint, orbit): Ship
```

### Audio System (hooks/useBackgroundMusic.ts + utils/audioCache.ts)

Web Audio API implementation (avoids browser Media Session):

```typescript
// Shared audio context (singleton)
getAudioContext(): AudioContext

// Buffer management
loadAudioBuffer(url): Promise<AudioBuffer>

// Playback control
playBuffer(buffer, offset)
pausePlayback()
resumePlayback()
stopMusic()
```

Features:
- Seamless looping
- Pause/resume with position tracking
- Tab visibility handling (pause on hidden)
- Yandex SDK pause/resume events
- Random track selection on level change

### Internationalization (i18n/)

Custom lightweight i18n system:

```typescript
// LanguageContext.tsx
interface I18nContext {
  language: SupportedLanguage;
  t: TranslationStrings;
  translate: (key: string, params?: object) => string;
  setLanguage: (lang: SupportedLanguage) => void;
}

// Supported languages
type SupportedLanguage = 'en' | 'ru' | 'es' | 'tr' | 'kk' | 'uz';
```

Language detection priority:
1. Yandex SDK `environment.i18n.lang`
2. Fallback to English

### Level Configuration (levels/levelConfigs.ts)

```typescript
interface LevelConfig {
  id: number;
  orbits: OrbitConfig[];
  spawnPoints: SpawnPoint[];
  stations: Station[];
  requiredDeliveries: number;
  maxLosses: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface OrbitConfig {
  radius: number;
  planetType: string;
  initialSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  isShield: boolean;
}
```

## Platform Integration

### Yandex Games SDK

Integration points in App.tsx:

```typescript
// SDK initialization
window.YaGames.init()
  .then(ysdk => {
    window.ysdk = ysdk;
    // Language detection
    const lang = ysdk.environment.i18n.lang;
    // Game ready signal
    ysdk.features.LoadingAPI?.ready();
  });

// Event handlers (in useBackgroundMusic.ts)
ysdk.on('game_api_pause', pauseCallback);
ysdk.on('game_api_resume', resumeCallback);
```

### Browser Compliance

Yandex platform requirements addressed:

| Requirement | Implementation |
|-------------|----------------|
| No browser scrollbar | `overflow: hidden` on body + custom scroll for level cards |
| No Media Session | Web Audio API instead of HTML5 Audio |
| Pause on tab switch | `visibilitychange` + `blur/focus` events |
| Loading indicator | `LoadingAPI.ready()` called after assets load |
| Localization | SDK language detection with 6 language support |

## Rendering Architecture

### Canvas Layering

```
┌─────────────────────────────────────────┐
│ UI Layer (React DOM)                    │ z-index: 10
│  - PlanetsPanel                         │
│  - Pause button                         │
│  - Score display                        │
├─────────────────────────────────────────┤
│ Game Canvas                             │ z-index: 1
│  ┌───────────────────────────────────┐  │
│  │ Particles (top)                   │  │
│  ├───────────────────────────────────┤  │
│  │ Ships                             │  │
│  ├───────────────────────────────────┤  │
│  │ Shields                           │  │
│  ├───────────────────────────────────┤  │
│  │ Planets                           │  │
│  ├───────────────────────────────────┤  │
│  │ Orbits                            │  │
│  ├───────────────────────────────────┤  │
│  │ Background                        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Responsive Design

- Canvas scales to viewport while maintaining aspect ratio
- UI uses `clamp()`, `vmin`/`vmax` units for responsive sizing
- Touch support for mobile devices
- Custom scrollbar for level selection on small screens

## Asset Management

### Preloading Strategy (App.tsx)

```typescript
// Images
const imageUrls = [
  '/background/menu_bg.jpg',
  '/planets/*.png',
  '/ships/*.png',
  '/effects/*.png'
];

// Audio (Web Audio buffers)
const audioUrls = [
  '/music/1.mp3' ... '/music/7.mp3',
  '/sounds/*.mp3'
];

// Parallel loading with progress tracking
Promise.all([
  ...imageUrls.map(preloadImage),
  ...audioUrls.map(loadAudioBuffer)
]).then(() => setAssetsLoaded(true));
```

### Caching

- Images: Browser cache via `<img>` preload
- Audio: `audioBufferCache` Map for decoded AudioBuffers
- AudioContext: Singleton pattern via `getAudioContext()`

## Error Handling

### Graceful Degradation

```typescript
// Audio initialization
try {
  audioContext = new AudioContext();
} catch (error) {
  console.warn('Web Audio not supported');
  // Game continues without music
}

// SDK initialization
try {
  const ysdk = await YaGames.init();
} catch (error) {
  // Fallback to default language
  setLanguage('en');
}
```

### Game State Recovery

- Saved game state in localStorage
- Resume capability from Menu
- Automatic pause on visibility change

## Performance Considerations

1. **requestAnimationFrame** for smooth 60fps rendering
2. **Object pooling** for particles (reuse instead of create/destroy)
3. **Canvas clearing** only dirty regions where possible
4. **Memoization** via `useCallback`/`useMemo` for expensive computations
5. **Ref-based state** for values accessed in animation loops (avoids closure stale state)

## Security Notes

- No external API calls beyond Yandex SDK
- No user data collection
- All assets served from same origin
- No eval() or dynamic code execution

## Build & Deployment

```bash
# Development
npm start

# Production build
npm run build

# Output: build/ directory
# Deploy to Yandex Games via their developer console
```

Build output is a static site compatible with Yandex Games hosting requirements.

---

*Document generated: February 2026*
*Game Version: 1.0*
