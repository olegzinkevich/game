import React, { useState, useEffect, useRef } from 'react';
import { GameScreen } from './types';
import { levels } from './levels';
import { Menu } from './components/Menu';
import { OrbitalTrafficGame } from './components/OrbitalTrafficGame';
import { LanguageProvider, detectLanguage } from './i18n/LanguageContext';
import { Language, translations } from './i18n/translations';
import { loadAudioBuffer } from './utils/audioCache';

// Yandex Games SDK types
declare global {
  interface Window {
    ysdk: any;
  }
}

const STORAGE_KEY = 'orbitalTraffic_savedGame';
const COMPLETED_LEVELS_KEY = 'orbitalTraffic_completedLevels';

// List of all game resources to preload
const PRELOAD_IMAGES = [
  '/background/menu_bg.jpg',
  '/background/background.jpg',
  '/background/bg2.png',
  '/background/bg3.jpg',
  '/background/bg4.jpg',
  '/background/bg5.png',
  '/background/bg6.jpg',
  '/planets/planet1.png',
  '/planets/planet2.png',
  '/planets/planet3.png',
  '/planets/planet4.png',
  '/planets/planet5.png',
  '/planets/planet6.png',
];

const PRELOAD_AUDIO = [
  '/music/1.mp3',
  '/music/2.mp3',
  '/music/3.mp3',
  '/music/4.mp3',
  '/music/5.mp3',
  '/music/6.mp3',
  '/music/7.mp3',
];

// Preload a single image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log('Preloaded image:', src);
      resolve();
    };
    img.onerror = () => {
      console.warn('Failed to preload image:', src);
      resolve(); // Resolve anyway to not block loading
    };
    img.src = process.env.PUBLIC_URL + src;
  });
};

// Preload a single audio file using Web Audio API (no Media Session trigger)
const preloadAudio = async (src: string): Promise<void> => {
  const fullSrc = process.env.PUBLIC_URL + src;

  try {
    await loadAudioBuffer(fullSrc);
    console.log('Preloaded audio (Web Audio API):', src);
  } catch (error) {
    console.warn('Failed to preload audio:', src, error);
    // Resolve anyway to not block loading
  }
};

// Preload all game resources
const preloadAllResources = async (): Promise<void> => {
  console.log('Starting resource preload...');

  const imagePromises = PRELOAD_IMAGES.map(preloadImage);
  const audioPromises = PRELOAD_AUDIO.map(preloadAudio);

  await Promise.all([...imagePromises, ...audioPromises]);

  console.log('All resources preloaded!');
};

// Orbital Traffic - A minimalist 2D space-puzzle game about timing and orbits
//
// How to run:
// 1. Create a new React project: npx create-react-app orbital-traffic --template typescript
// 2. Replace src/ with the contents of this folder
// 3. Run: npm start
//
// Controls:
// - Click orbits to cycle their speed (normal → fast → slow → normal)
// - Click blue shield orbits to activate temporary collision immunity
// - Press P to pause/unpause the game
//
// Game objective:
// Control orbital timing so planets never collide. Survive for the required time
// in each level with increasing difficulty.

// Global styles to disable selection, context menu, and scrolling
const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden !important;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: none;
    touch-action: none;
  }

  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
  }

  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }

  img, canvas {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: auto;
  }
`;

// Minimal screen shown while waiting for Yandex SDK (no text, just visual)
const SDKWaitScreen: React.FC = () => {
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
      zIndex: 9999,
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid #333',
        borderTop: '4px solid #FFD700',
        borderRadius: '50%',
        animation: 'sdkSpin 1s linear infinite',
      }} />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sdkSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

// Loading screen component (uses direct translations - shown ONLY after SDK language is detected)
const LoadingScreen: React.FC<{ language: Language }> = ({ language }) => {
  const loadingText = translations[language]?.loading || 'Loading...';

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
        {loadingText}
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
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [shouldResume, setShouldResume] = useState<boolean>(false);
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  const [languageDetected, setLanguageDetected] = useState<boolean>(false);

  // Start with default language, will be updated after SDK detection
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('en');

  // Load completed levels from localStorage
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_LEVELS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(parsed);
      }
    } catch (error) {
      console.error('Failed to load completed levels:', error);
    }
    return new Set();
  });

  // Save completed levels to localStorage
  const saveCompletedLevel = (levelId: number) => {
    setCompletedLevels(prev => {
      const newSet = new Set(prev);
      newSet.add(levelId);
      try {
        localStorage.setItem(COMPLETED_LEVELS_KEY, JSON.stringify(Array.from(newSet)));
      } catch (error) {
        console.error('Failed to save completed levels:', error);
      }
      return newSet;
    });
  };

  // Prevent pull-to-refresh on mobile and disable context menu/selection
  useEffect(() => {
    // Prevent pull-to-refresh gesture
    let touchStartY = 0;

    // Check if element or its parents are scrollable (must be defined first)
    const isScrollableElement = (element: HTMLElement | null): boolean => {
      while (element) {
        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          // Check if element actually has scrollable content
          if (element.scrollHeight > element.clientHeight) {
            return true;
          }
        }
        element = element.parentElement;
      }
      return false;
    };

    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const target = e.target as HTMLElement;

      // Allow touch scrolling inside scrollable elements
      if (isScrollableElement(target)) {
        return;
      }

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      if (e.type === 'touchstart') {
        touchStartY = touch.clientY;
      } else if (e.type === 'touchmove') {
        const touchY = touch.clientY;
        const touchYDelta = touchY - touchStartY;

        // If scrolling down (pulling down) at the top of the page, prevent default
        if (touchYDelta > 0 && scrollTop === 0) {
          e.preventDefault();
        }
      }
    };

    // Prevent context menu (right-click menu)
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent text selection on double-click
    const preventSelection = (e: MouseEvent) => {
      if (e.detail > 1) {
        e.preventDefault();
      }
    };

    // Prevent drag start on images and other elements
    const preventDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent scrolling on document/window level only
    const preventScroll = (e: Event) => {
      // Allow scrolling inside scrollable elements
      if (e.target && isScrollableElement(e.target as HTMLElement)) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Prevent wheel scrolling except in scrollable containers
    const preventWheel = (e: WheelEvent) => {
      // Allow scrolling inside scrollable elements
      if (e.target && isScrollableElement(e.target as HTMLElement)) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Prevent keyboard scrolling (arrows, space, page up/down)
    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown', 'Home', 'End'];
      if (scrollKeys.includes(e.key)) {
        // Only prevent if not in an input field
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
    document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('mousedown', preventSelection);
    document.addEventListener('dragstart', preventDragStart);
    document.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('scroll', preventScroll, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });
    document.addEventListener('keydown', preventKeyScroll);

    // Also set overflow hidden on body directly
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('touchmove', preventPullToRefresh);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('mousedown', preventSelection);
      document.removeEventListener('dragstart', preventDragStart);
      document.removeEventListener('scroll', preventScroll);
      window.removeEventListener('scroll', preventScroll);
      document.removeEventListener('wheel', preventWheel);
      document.removeEventListener('keydown', preventKeyScroll);
    };
  }, []);

  // Check for saved game on mount
  useEffect(() => {
    const savedGame = localStorage.getItem(STORAGE_KEY);
    setHasSavedGame(!!savedGame);
  }, [currentScreen]);

  // Track if LoadingAPI.ready() has been called
  const loadingAPICalledRef = useRef(false);

  // Yandex Games SDK initialization and LoadingAPI.ready()
  useEffect(() => {
    let isMounted = true;

    const callLoadingAPIReady = () => {
      if (loadingAPICalledRef.current) {
        console.log('Yandex Games: LoadingAPI.ready() already called, skipping');
        return;
      }

      try {
        if (window.ysdk?.features?.LoadingAPI?.ready) {
          window.ysdk.features.LoadingAPI.ready();
          loadingAPICalledRef.current = true;
          console.log('Yandex Games: LoadingAPI.ready() called - Game is ready for interaction');
        } else {
          console.warn('Yandex Games: LoadingAPI.ready() method not available');
        }
      } catch (error) {
        console.error('Failed to call Yandex LoadingAPI.ready():', error);
      }
    };

    const initializeGame = async () => {
      console.log('Starting game initialization...');

      // Step 1: Wait for window to fully load (basic HTML/CSS/JS)
      if (document.readyState !== 'complete') {
        console.log('Waiting for window load event...');
        await new Promise<void>((resolve) => {
          window.addEventListener('load', () => resolve(), { once: true });
        });
      }
      console.log('Window loaded');

      if (!isMounted) return;

      // Step 2: Wait for Yandex SDK and detect language FIRST (with shorter timeout for language)
      console.log('Waiting for Yandex SDK for language detection...');
      let sdkAttempts = 0;
      const maxSDKAttempts = 30; // 3 seconds max for language detection

      while (!window.ysdk && sdkAttempts < maxSDKAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        sdkAttempts++;
      }

      if (!isMounted) return;

      // Step 3: Detect and set language BEFORE showing any UI
      const lang = detectLanguage();
      setDetectedLanguage(lang);
      setLanguageDetected(true);
      console.log('Language detected:', lang, '- Now showing localized loading screen');

      if (window.ysdk) {
        console.log('Yandex SDK available after', sdkAttempts * 100, 'ms');
      } else {
        console.log('Yandex SDK not available after initial wait, using default language');
      }

      if (!isMounted) return;

      // Step 4: Preload all game resources (images and audio)
      // Now the loading screen will show localized "Loading..." text
      console.log('Preloading game resources...');
      await preloadAllResources();
      console.log('All game resources preloaded');

      if (!isMounted) return;

      // Step 5: If SDK wasn't available before, wait a bit more for it
      if (!window.ysdk) {
        console.log('Waiting more for Yandex SDK...');
        let moreAttempts = 0;
        const maxMoreAttempts = 70; // 7 more seconds

        while (!window.ysdk && moreAttempts < maxMoreAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          moreAttempts++;
        }

        // Re-detect language in case SDK is now available
        if (window.ysdk) {
          const newLang = detectLanguage();
          if (newLang !== lang) {
            setDetectedLanguage(newLang);
            console.log('Language updated after SDK load:', newLang);
          }
        }
      }

      if (!isMounted) return;

      // Step 6: Mark app as ready - show the main menu
      setIsAppReady(true);
      console.log('App is ready - showing main menu');

      // Step 7: Call LoadingAPI.ready() - ALL resources loaded, language detected, UI ready
      callLoadingAPIReady();
    };

    initializeGame();

    return () => {
      isMounted = false;
    };
  }, []); // Run only once on mount

  const handleStartGame = (levelId: number) => {
    // Clear saved game when starting a new game
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedGame(false);
    setShouldResume(false);
    setSelectedLevelId(levelId);
    setCurrentScreen('playing');
  };

  const handleResumeGame = () => {
    const savedGameStr = localStorage.getItem(STORAGE_KEY);
    if (savedGameStr) {
      try {
        const savedGame = JSON.parse(savedGameStr);
        setSelectedLevelId(savedGame.gameState.currentLevel);
        setShouldResume(true);
        setCurrentScreen('playing');
      } catch (error) {
        console.error('Failed to load saved game:', error);
        localStorage.removeItem(STORAGE_KEY);
        setHasSavedGame(false);
      }
    }
  };

  const handleLevelSelect = (levelId: number) => {
    setSelectedLevelId(levelId);
    // Could show level details here if desired
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setShouldResume(false);
  };



  // Show SDK wait screen until language is detected from Yandex SDK
  if (!languageDetected) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        <SDKWaitScreen />
      </>
    );
  }

  // Show localized loading screen until all resources are loaded
  if (!isAppReady) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        <LoadingScreen language={detectedLanguage} />
      </>
    );
  }

  return (
    <LanguageProvider initialLanguage={detectedLanguage}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div className="App" style={{ height: '100%', width: '100%' }}>
        {currentScreen === 'menu' && (
          <Menu
            levels={levels}
            completedLevels={completedLevels}
            onStartGame={handleStartGame}
            onLevelSelect={handleLevelSelect}
            onResumeGame={handleResumeGame}
            hasSavedGame={hasSavedGame}
          />
        )}

        {currentScreen === 'playing' && (
          <OrbitalTrafficGame
            initialLevelId={selectedLevelId}
            onBackToMenu={handleBackToMenu}
            shouldResume={shouldResume}
            onLevelComplete={saveCompletedLevel}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;