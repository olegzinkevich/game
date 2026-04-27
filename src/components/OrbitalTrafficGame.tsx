import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, BodyState, COLLISION_RADIUS } from '../types';
import { useGameLoop } from '../hooks/useGameLoop';
import { useOrbitalSimulation } from '../hooks/useOrbitalSimulation';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useResponsiveCanvas } from '../hooks/useResponsiveCanvas';
import { getLevelById, getNextLevelId } from '../levels';
import { Canvas } from './Canvas';
import { HUD } from './HUD';
import { GameOverlay } from './GameOverlay';
import { PlanetsPanel } from './PlanetsPanel';
import { useTranslation } from '../i18n/LanguageContext';

interface SavedGameState {
  gameState: GameState;
  bodyStates: BodyState[];
  timestamp: number;
}

const STORAGE_KEY = 'orbitalTraffic_savedGame';

const BACKGROUND_IMAGES = [
  `${process.env.PUBLIC_URL}/background/background.jpg`,
  `${process.env.PUBLIC_URL}/background/bg2.png`,
  `${process.env.PUBLIC_URL}/background/bg3.jpg`,
  `${process.env.PUBLIC_URL}/background/bg4.jpg`,
  `${process.env.PUBLIC_URL}/background/bg5.png`,
  `${process.env.PUBLIC_URL}/background/bg6.jpg`,
];

const PLANET_IMAGES = [
  `${process.env.PUBLIC_URL}/planets/planet1.png`,
  `${process.env.PUBLIC_URL}/planets/planet2.png`,
  `${process.env.PUBLIC_URL}/planets/planet3.png`,
  `${process.env.PUBLIC_URL}/planets/planet4.png`,
  `${process.env.PUBLIC_URL}/planets/planet5.png`,
  `${process.env.PUBLIC_URL}/planets/planet6.png`,
];

// Preload a single image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('Game: Preloaded image:', src);
      resolve();
    };
    img.onerror = () => {
      console.warn('Game: Failed to preload image:', src);
      resolve(); // Resolve anyway to not block loading
    };
    img.src = src;
  });
};

// Preload all game resources for the game screen
const preloadGameResources = async (): Promise<void> => {
  console.log('Game: Starting resource preload...');

  const allImages = [...BACKGROUND_IMAGES, ...PLANET_IMAGES];
  const imagePromises = allImages.map(preloadImage);

  await Promise.all(imagePromises);

  console.log('Game: All resources preloaded!');
};

// Yandex Games SDK types
declare global {
  interface Window {
    ysdk: any;
  }
}

interface OrbitalTrafficGameProps {
  initialLevelId?: number;
  onBackToMenu: () => void;
  shouldResume?: boolean;
  onLevelComplete?: (levelId: number) => void;
}

export const OrbitalTrafficGame: React.FC<OrbitalTrafficGameProps> = ({
  initialLevelId = 1,
  onBackToMenu,
  shouldResume = false,
  onLevelComplete,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const resourcesLoadedRef = useRef(false);

  // Load saved game state if resuming
  const loadSavedGame = (): SavedGameState | null => {
    if (!shouldResume) return null;
    
    try {
      const savedGameStr = localStorage.getItem(STORAGE_KEY);
      if (savedGameStr) {
        return JSON.parse(savedGameStr);
      }
    } catch (error) {
      console.error('Failed to load saved game:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  };

  const savedGame = loadSavedGame();
  const [gameState, setGameState] = useState<GameState>(
    savedGame ? {
      ...savedGame.gameState,
      levelStartTime: Date.now() - (savedGame.gameState.elapsedTime * 1000), // Adjust start time
    } : {
      currentLevel: initialLevelId,
      levelStartTime: 0,
      elapsedTime: 0,
      isRunning: false,
      isPaused: false,
      gameWon: false,
      gameLost: false,
      collisionDetected: false,
    }
  );

  const [highlightedPlanet, setHighlightedPlanet] = useState<number | undefined>(undefined);
  const [backgroundSrc, setBackgroundSrc] = useState<string>(BACKGROUND_IMAGES[0]);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState<boolean>(false);
  const [gameOverCount, setGameOverCount] = useState<number>(0);
  const [destroyedPlanets, setDestroyedPlanets] = useState<Set<number>>(new Set());

  // Track if game was manually paused before SDK pause event
  const wasManuallyPausedRef = useRef<boolean>(false);

  const currentLevel = getLevelById(gameState.currentLevel);

  // Orbital simulation hook - must be called before any conditional returns
  const {
    bodyPositions,
    bodyStates,
    update: updateSimulation,
    onOrbitClick,
    changeSpeed,
    resetBodies,
  } = useOrbitalSimulation({
    orbits: currentLevel?.orbits || [],
    initialBodyStates: savedGame?.bodyStates,
    destroyedPlanets: destroyedPlanets,
    onCollision: () => {
      setGameState(prev => ({
        ...prev,
        isRunning: false,
        gameLost: true,
        collisionDetected: true,
      }));
      // Increment game over count for progressive help system
      setGameOverCount(prev => {
        const newCount = prev + 1;
        const key = `gameOverCount_level_${gameState.currentLevel}`;
        localStorage.setItem(key, newCount.toString());
        return newCount;
      });
    },
    onSpeedChange: (orbitIndex) => {
      // Highlight the planet for a short time when speed changes
      setHighlightedPlanet(orbitIndex);
      setTimeout(() => setHighlightedPlanet(undefined), 1000);
    },
  });

  // Background music hook - plays random music and changes on level change
  const { stopMusic } = useBackgroundMusic(gameState.currentLevel, {
    volume: 0.3, // 30% volume
    enabled: true,
  });

  // Responsive canvas dimensions
  const canvasDimensions = useResponsiveCanvas();

  // Preload all game resources before showing the game
  useEffect(() => {
    if (resourcesLoadedRef.current) {
      setIsLoading(false);
      return;
    }

    const loadResources = async () => {
      console.log('Game: Loading resources...');
      setIsLoading(true);

      await preloadGameResources();

      resourcesLoadedRef.current = true;
      setIsLoading(false);
      console.log('Game: Resources loaded, showing game');
    };

    loadResources();
  }, []);

  // Game loop hook - must be called before any conditional returns
  useGameLoop({
    isRunning: gameState.isRunning && !gameState.isPaused,
    onUpdate: (deltaTime) => {
      updateSimulation(deltaTime);

      setGameState(prev => {
        const newElapsedTime = prev.elapsedTime + deltaTime;

        // Check win condition
        if (currentLevel && newElapsedTime >= currentLevel.durationToSurvive) {
          return {
            ...prev,
            elapsedTime: newElapsedTime,
            isRunning: false,
            gameWon: true,
          };
        }

        return {
          ...prev,
          elapsedTime: newElapsedTime,
        };
      });
    },
  });

  // Start level - hook must be before early return
  const startLevel = useCallback((levelId: number) => {
    const level = getLevelById(levelId);
    if (!level) return;

    setGameState({
      currentLevel: levelId,
      levelStartTime: Date.now(),
      elapsedTime: 0,
      isRunning: true,
      isPaused: false,
      gameWon: false,
      gameLost: false,
      collisionDetected: false,
    });

    resetBodies();
  }, [resetBodies]);

  // Pause/unpause
  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'p' || event.key === 'P') {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePause]);

  // Wrapper to stop music before navigating to menu
  const handleBackToMenu = useCallback(() => {
    stopMusic();
    onBackToMenu();
  }, [stopMusic, onBackToMenu]);

  // Game action handlers
  const handleRetry = useCallback(() => {
    startLevel(gameState.currentLevel);
  }, [gameState.currentLevel, startLevel]);

  const handleNextLevel = useCallback(() => {
    const nextLevelId = getNextLevelId(gameState.currentLevel);

    const proceedToNextLevel = () => {
      if (nextLevelId) {
        startLevel(nextLevelId);
      } else {
        // Game completed - go back to menu
        handleBackToMenu();
      }
    };

    // Show fullscreen ad before transitioning to next level
    // TEMPORARILY DISABLED FOR TESTING
    // if (window.ysdk?.adv?.showFullscreenAdv) {
    //   window.ysdk.adv.showFullscreenAdv({
    //     callbacks: {
    //       onOpen: () => {
    //         console.log('Yandex Games: Fullscreen ad opened');
    //       },
    //       onClose: (wasShown: boolean) => {
    //         console.log('Yandex Games: Fullscreen ad closed, wasShown:', wasShown);
    //         // Proceed to next level after ad closes (whether shown or not)
    //         proceedToNextLevel();
    //       },
    //       onError: (error: Error) => {
    //         console.error('Yandex Games: Fullscreen ad error:', error);
    //         // Proceed to next level even if ad fails
    //         proceedToNextLevel();
    //       },
    //     }
    //   });
    // } else {
    //   // SDK not available, proceed directly
    //   proceedToNextLevel();
    // }

    // Proceed directly without ads (for testing)
    proceedToNextLevel();
  }, [gameState.currentLevel, startLevel, handleBackToMenu]);

  const handleReplayLevel = useCallback(() => {
    startLevel(gameState.currentLevel);
  }, [gameState.currentLevel, startLevel]);

  // Handle speed change from planets panel
  const handleSpeedChange = useCallback((orbitIndex: number, speedMultiplier: number) => {
    changeSpeed(orbitIndex, speedMultiplier);
  }, [changeSpeed]);

  // Load game over count from localStorage
  useEffect(() => {
    const key = `gameOverCount_level_${gameState.currentLevel}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setGameOverCount(parseInt(saved, 10));
    } else {
      setGameOverCount(0);
    }
    setDestroyedPlanets(new Set()); // Reset destroyed planets on level change
  }, [gameState.currentLevel]);

  // Handle planet destruction
  const handleDestroyPlanet = useCallback((orbitIndex: number) => {
    setDestroyedPlanets(prev => {
      const newSet = new Set(prev);
      newSet.add(orbitIndex);
      return newSet;
    });
  }, []);

  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    const savedState: SavedGameState = {
      gameState: gameState,
      bodyStates: bodyStates,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      setLastSaveTime(Date.now());
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 2000); // Hide after 2 seconds
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, [gameState, bodyStates]);

  // Handle menu button click (from HUD)
  const handleMenuClick = useCallback(() => {
    // Save current game state before going to menu
    if (gameState.isRunning && !gameState.gameWon && !gameState.gameLost) {
      saveGameState();
    }
    handleBackToMenu();
  }, [gameState, saveGameState, handleBackToMenu]);

  // Yandex Games SDK GameplayAPI integration
  useEffect(() => {
    if (window.ysdk?.features?.GameplayAPI) {
      const ysdk = window.ysdk;

      // Start gameplay when game is running and not paused
      if (gameState.isRunning && !gameState.isPaused && !gameState.gameWon && !gameState.gameLost) {
        try {
          if (ysdk.features.GameplayAPI.start) {
            ysdk.features.GameplayAPI.start();
            console.log('Yandex Games: GameplayAPI.start() called - Gameplay active');
          }
        } catch (error) {
          console.error('Failed to call Yandex GameplayAPI.start():', error);
        }
      }
      // Stop gameplay when game is not running, paused, or ended
      else if (!gameState.isRunning || gameState.isPaused || gameState.gameWon || gameState.gameLost) {
        try {
          if (ysdk.features.GameplayAPI.stop) {
            ysdk.features.GameplayAPI.stop();
            console.log('Yandex Games: GameplayAPI.stop() called - Gameplay paused/stopped');
          }
        } catch (error) {
          console.error('Failed to call Yandex GameplayAPI.stop():', error);
        }
      }
    }
  }, [gameState.isRunning, gameState.isPaused, gameState.gameWon, gameState.gameLost]);

  // Yandex Games SDK game_api_pause and game_api_resume events
  useEffect(() => {
    if (!window.ysdk) return;

    const ysdk = window.ysdk;

    const pauseCallback = () => {
      console.log('Yandex Games: game_api_pause event received');
      // Store current pause state before SDK pause
      wasManuallyPausedRef.current = gameState.isPaused;
      // Pause the game
      setGameState(prev => ({
        ...prev,
        isPaused: true,
      }));
    };

    const resumeCallback = () => {
      console.log('Yandex Games: game_api_resume event received');
      // Only resume if game wasn't manually paused before SDK pause
      if (!wasManuallyPausedRef.current) {
        setGameState(prev => ({
          ...prev,
          isPaused: false,
        }));
      }
    };

    // Subscribe to SDK events
    if (ysdk.on) {
      ysdk.on('game_api_pause', pauseCallback);
      ysdk.on('game_api_resume', resumeCallback);
      console.log('Yandex Games: Subscribed to game_api_pause and game_api_resume events');
    }

    // Cleanup: unsubscribe from events
    return () => {
      if (ysdk.off) {
        ysdk.off('game_api_pause', pauseCallback);
        ysdk.off('game_api_resume', resumeCallback);
        console.log('Yandex Games: Unsubscribed from game_api_pause and game_api_resume events');
      }
    };
  }, [gameState.isPaused]);

  // Auto-save game state every 5 seconds during gameplay
  useEffect(() => {
    if (!gameState.isRunning || gameState.isPaused || gameState.gameWon || gameState.gameLost) {
      return;
    }

    const autoSaveInterval = setInterval(() => {
      saveGameState();
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(autoSaveInterval);
  }, [gameState.isRunning, gameState.isPaused, gameState.gameWon, gameState.gameLost, saveGameState]);

  // Save on page unload / browser close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameState.isRunning && !gameState.gameWon && !gameState.gameLost) {
        saveGameState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState, saveGameState]);

  // Save on visibility change (tab switch, minimize)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState.isRunning && !gameState.gameWon && !gameState.gameLost) {
        saveGameState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState, saveGameState]);

  // Save when pausing
  useEffect(() => {
    if (gameState.isPaused && gameState.isRunning && !gameState.gameWon && !gameState.gameLost) {
      saveGameState();
    }
  }, [gameState.isPaused, gameState.isRunning, gameState.gameWon, gameState.gameLost, saveGameState]);

  // Track level completion and notify parent
  useEffect(() => {
    if (gameState.gameWon && onLevelComplete) {
      onLevelComplete(gameState.currentLevel);
    }
  }, [gameState.gameWon, gameState.currentLevel, onLevelComplete]);

  // Auto-start level on mount (only once), unless resuming
  // Wait for loading to complete before starting the game
  useEffect(() => {
    if (isLoading) return; // Don't start until resources are loaded

    if (!shouldResume || !savedGame) {
      startLevel(initialLevelId);
    } else {
      // Clear saved game after successfully loading
      localStorage.removeItem(STORAGE_KEY);
      // For resumed games, we need to set isRunning to true
      setGameState(prev => ({
        ...prev,
        isRunning: true,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLevelId, shouldResume, isLoading]);

  // Randomize background per level
  useEffect(() => {
    if (!currentLevel) return;
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    setBackgroundSrc(BACKGROUND_IMAGES[randomIndex]);
  }, [currentLevel?.id]);

  // Check for invalid level after all hooks are called
  if (!currentLevel) {
    console.error(`Level ${gameState.currentLevel} not found`);
    return null;
  }

  const responsiveStyles = `
    .game-canvas-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 250px;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .auto-save-indicator {
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(76, 175, 80, 0.95);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    @media (max-width: 767px) {
      .game-canvas-container {
        right: 0 !important;
        bottom: 40vh !important;
        top: 80px !important;
        align-items: flex-start !important;
      }
      .auto-save-indicator {
        top: 50px;
        font-size: 12px;
        padding: 6px 12px;
      }
    }

    @media (min-width: 768px) and (max-width: 1024px) {
      .game-canvas-container {
        right: 200px;
      }
    }
  `;

  // Show loading screen while resources are loading
  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000011',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: 9999,
      }}>
        <div style={{
          fontSize: '2rem',
          color: '#FFD700',
          marginBottom: '20px',
          textShadow: '0 0 10px #FFD700',
        }}>
          {t.loading}
        </div>
        <div style={{
          width: '200px',
          height: '4px',
          backgroundColor: '#333',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FFD700',
            animation: 'loadingPulse 1.5s ease-in-out infinite',
          }} />
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loadingPulse {
            0%, 100% { opacity: 0.3; transform: scaleX(0.3); }
            50% { opacity: 1; transform: scaleX(1); }
          }
        `}} />
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000011',
        overflow: 'hidden',
      }}>
        {/* HUD */}
        <HUD
        level={currentLevel}
        elapsedTime={gameState.elapsedTime}
        isPaused={gameState.isPaused}
        onPause={togglePause}
        onMenu={handleMenuClick}
      />



      {/* Planets Panel */}
      <PlanetsPanel
        orbits={currentLevel.orbits}
        bodyStates={bodyStates}
        onSpeedChange={handleSpeedChange}
        highlightedPlanet={highlightedPlanet}
        gameOverCount={gameOverCount}
        destroyedPlanets={destroyedPlanets}
        onDestroyPlanet={handleDestroyPlanet}
      />

      {/* Space Background - Full Screen */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Behind all UI elements
      }}>
        <Canvas
          width={window.innerWidth}
          height={window.innerHeight}
          orbits={[]} // Empty array for background-only canvas
          bodyPositions={[]} // Empty array for background-only canvas
          centerX={window.innerWidth / 2}
          centerY={window.innerHeight / 2}
          collisionRadius={COLLISION_RADIUS}
          onOrbitClick={() => {}} // No-op for background canvas
          collisionDetected={false}
          highlightedPlanet={undefined}
          isBackgroundOnly={true}
          backgroundSrc={backgroundSrc}
        />
      </div>

      {/* Game Canvas */}
      <div className="game-canvas-container">
        <Canvas
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          orbits={currentLevel.orbits}
          bodyPositions={bodyPositions}
          centerX={canvasDimensions.centerX}
          centerY={canvasDimensions.centerY}
          collisionRadius={COLLISION_RADIUS * canvasDimensions.scale}
          onOrbitClick={onOrbitClick}
          collisionDetected={gameState.collisionDetected}
          highlightedPlanet={highlightedPlanet}
          backgroundSrc={backgroundSrc}
          scale={canvasDimensions.scale}
          destroyedPlanets={destroyedPlanets}
        />
      </div>

      {/* Game Overlays */}
      <GameOverlay
        level={currentLevel}
        gameWon={gameState.gameWon}
        gameLost={gameState.gameLost}
        onRetry={handleRetry}
        onNextLevel={getNextLevelId(gameState.currentLevel) ? handleNextLevel : undefined}
        onBackToMenu={handleBackToMenu}
        onReplayLevel={handleReplayLevel}
      />
      </div>
    </>
  );
};