# Orbital Traffic

A minimalist 2D space-puzzle game about timing and orbits built with React and TypeScript.

## Game Description

Orbital Traffic is a challenging puzzle game where you control the timing of planets and satellites orbiting around a central star. Your goal is to prevent collisions by adjusting orbital speeds and using shield mechanics.

## Features

- **6 Progressive Levels**: Increasing difficulty from basic timing to complex orbital dances
- **Real-time Physics**: Smooth orbital mechanics with collision detection
- **Shield System**: Special orbits that provide temporary collision immunity
- **Speed Control**: Click orbits to cycle through different speed multipliers
- **Pause System**: Press P to pause/unpause gameplay
- **Responsive Design**: Works on different screen sizes

## How to Run

1. Create a new React project:
   ```bash
   npx create-react-app orbital-traffic --template typescript
   cd orbital-traffic
   ```

2. Replace the `src/` folder with the provided code files

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Controls

- **Click orbits**: Cycle through speed settings (normal → fast → slow → normal)
- **Click shield orbits** (blue): Activate temporary collision immunity
- **P key**: Pause/unpause the game

## Game Mechanics

### Regular Orbits
- Planets move at their default orbital speed
- Clicking cycles through speed multipliers: 1x → 2x → 0.5x → 1x
- Speed changes are temporary and revert after 3 seconds

### Shield Orbits
- Marked with blue color and dashed orbit lines
- Clicking activates a 2-second immunity window
- During immunity, collisions involving this orbit are ignored
- Shields have a 5-second cooldown after use

### Collision Detection
- Bodies collide if they get closer than 25 pixels
- Game ends immediately on collision
- Shields prevent collisions during their active period

## Level Progression

1. **First Contact** (20s): Basic concentric orbits
2. **Close Encounters** (25s): Crossing orbital paths
3. **Orbital Dance** (30s): Complex timing challenges
4. **Shield Protocol** (35s): Introduction of shield mechanics
5. **Critical Mass** (40s): Multiple shields and fast orbits
6. **Master Control** (45s): Ultimate challenge with 7 orbits

## Technical Details

- **Framework**: React 18 with TypeScript
- **Rendering**: HTML5 Canvas with requestAnimationFrame
- **Physics**: Real-time orbital simulation with polar-to-cartesian conversion
- **State Management**: React hooks for game logic and animation
- **No External Dependencies**: Pure React and browser APIs

## Code Structure

```
src/
├── components/
│   ├── Canvas.tsx          # Game rendering component
│   ├── Menu.tsx            # Main menu and level selection
│   ├── HUD.tsx             # Heads-up display
│   ├── GameOverlay.tsx     # Win/lose overlays
│   └── OrbitalTrafficGame.tsx # Main game component
├── hooks/
│   ├── useGameLoop.ts      # Animation frame management
│   └── useOrbitalSimulation.ts # Physics and collision detection
├── types.ts                # TypeScript type definitions
├── levels.ts               # Level configurations
├── App.tsx                 # Main app component
└── index.tsx               # React entry point
```

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- requestAnimationFrame
- ES6 features (const/let, arrow functions, etc.)

## Contributing

This is a complete, self-contained React game. To modify:
- Edit `levels.ts` to add new levels or adjust difficulty
- Modify `types.ts` to extend game mechanics
- Update components for new features or UI changes

## License

This project is provided as-is for educational and entertainment purposes.