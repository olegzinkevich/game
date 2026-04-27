Test scenarios:

1. Framework to use:
React 18+ (javascript or typescript). Avoid using next.js for simple games (without server side), as the bundle size increases. 

2. Styling:
Use basic CSS, not tailwind or other css framework. Important: don’t use inline css (<h1 style="color: blue; text-align: center;">Text</h1>), locate each css class in its own css file (near component file). For example, we have gameCanvas.jsx component, create gameCanvas.css at the same location and import it into gameCanvas.jsx

3. Necessary game screens:
3.1. Onboarding screen 1: time available for play 
3.2. Onboarding screen 2: previous experience
3.3. The onboarding screens CANNOT be skipped (important – there’s no “skip” button).
3.4. How to play screens 
3.5. The “How to play” screens are allowed to be skipped by clicking the “skip” button.
3.6. User can re-view the How to play screens (1,2,3,4 screen, etc.) clicking the circle of the corresponding screen:
3.7. «Onboarding screens» and «How to play screens» should be showed only 1 time for a novice user. Save state of viewed (true/false) screens in localStorage and hide/show them conditionally:
  const onboardingDone = typeof localStorage !== 'undefined' && !!localStorage.getItem('onboarding_done');
  const howToPlayDone = typeof localStorage !== 'undefined' && !localStorage.getItem('how_to_play_done');

4. Yandex Metrika integration:
4.1. Each significant game event should have associated Yandex Metrika JS event call. 
4.2. Metrika counter script is configured and injected into /public/index.hml file between the <head> </head>
Example of counter script: <script src="https://yandex.ru/games/sdk/v2"></script><script type="text/javascript">!function(e,r,t,c,n,a,s){e[n]=e[n]||function(){(e[n].a=e[n].a||[]).push(arguments)},e[n].l=1*new Date;for(var i=0;i<document.scripts.length;i++)if(document.scripts[i].src===c)return;a=r.createElement(t),s=r.getElementsByTagName(t)[0],a.async=1,a.src=c,s.parentNode.insertBefore(a,s)}(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=108350271","ym"),ym(108350271,"init",{ssr:!0,webvisor:!0,clickmap:!0,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:!0,trackLinks:!0})</script>
4.3. List every game button and screen and corresponding yandex metrika js call and prarmeters sent (if any)
Example: Onboarding screen 1:  Сколько у Вас времени на игру? 
(Options: а: <3 min., b: 5-10 min., c: >15 min.)
ym(METRIKA_COUNTER, 'reachGoal', 'onboarding_1_step_have_time', { have_time: PARAMETER })

5. Yandex SDK integration:
5.1. Yandex SDK is integrated into the public/index.html file in the <head> tag: 
 <script src="https://yandex.ru/games/sdk/v2"></script>
5.2. It is initialized in the same file:
<body>:
    <script>
      YaGames
      .init()
      .then(ysdk => {
          console.log('Yandex SDK initialized');
          window.ysdk = ysdk;
      });
    </script>
5.3. While Yandex sdk is being loaded – loader spinner (see const SDKWaitScreen in the game code) is loaded. 
5.4. The game should not be started until the SDK is loaded! LoadingApi method should be called when the game is fully ready (and all resources [js, css, images] are loaded)
ysdk: {
      features?: {
        LoadingAPI?: { ready: () => void };
        GameplayAPI?: { start: () => void; stop: () => void };
      };

while (!window.ysdk && attempts < 100) {
  await new Promise(r => setTimeout(r, 100));  // 100ms x 100 = 10s max
  attempts++;
}
setIsAppReady(true);
5.5. When Yandex sdk was loaded, Send LoadingAPI.ready event:
  if (window.ysdk?.features?.LoadingAPI?.ready) {
    window.ysdk.features.LoadingAPI.ready();
    loadingAPICalledRef.current = true;
  } 

5.6. The game has 2 states: 
User is playing or the game is stoped/paused/menu is opened. Every state should be activated with Yandex sdk:
When game is started: window.ysdk?.features?.GameplayAPI?.start();
When game is stopped:  window.ysdk?.features?.GameplayAPI?.stop();
5.7. The game is be stopped, when user changes browser tab, closes or minimizes the browser. The stop event is sent to Yandex SDK:
useEffect(() => {
  const handle = () => {
    if (document.hidden) gameplayStop();
    else if (currentScreen === 'GAME') gameplayStart();
  };
  document.addEventListener('visibilitychange', handle);
  return () => document.removeEventListener('visibilitychange', handle);
}, [currentScreen]);
5.8. User language is be detected with Yandex SDK:
export const detectLanguage = (): Language => {
  const sdkLang = (window as any).ysdk?.environment?.i18n?.lang;
  if (sdkLang) {
    if (sdkLang === 'ru' || sdkLang === 'uk' || sdkLang === 'be') return 'ru';
    return 'es';  // fallback for all other languages
  }
  return DEFAULT_LANGUAGE;
};

6. Additional technical requirements:
6.1. Game states. User state (current level, achieved points, etc.) is be saved into localStorage and restored when user returns to the game:

// Getter
export function getTotalPoints(): number {
  try {
    return parseInt(localStorage.getItem('sentbuilder_total_points') || '0', 10);
  } catch { return 0; }
}
// Setter
export function addTotalPoints(pts: number): void {
  try {
    const prev = getTotalPoints();
    localStorage.setItem('sentbuilder_total_points', String(prev + pts));
  } catch (_) {}
}

6.2. Localization / Internationalization (i18n). Game is localized into minimum 2 languages.
Localization logic (state context) and translated strings are located at:

src/i18n/
└── LanguageContext.tsx   # Language detection and global state
└── translations.ts      # All strings: { ru: {...}, es: {...} }

6.3. Select, drag/tap and reload page, call of the contextual menu, selecting/saving images are prohibited:
The game should not allow this behavior. The game should prohibit native touch gestures (including long-press triggers) on the game field: example:
onContextMenu={(e) => e.preventDefault()}
Global CSS (injected at src/App.tsx) — disables text selection and the iOS long-press callout on every  element:
 {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;    /* blocks iOS long-tap menu */
    -webkit-tap-highlight-color: transparent;
  }
  img, canvas {
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-touch-callout: none;
  }
Event listeners in the effect at src/App.tsx— blocks the context menu, selection, and native drag at  runtime:
  const preventContextMenu = (e: MouseEvent) => { e.preventDefault(); return false; };
  const preventSelection = (e: MouseEvent) => { if (e.detail > 1) e.preventDefault(); };
  const preventDragStart = (e: DragEvent) => { e.preventDefault(); return false; };
  ...
  document.addEventListener('contextmenu', preventContextMenu);   
  document.addEventListener('mousedown', preventSelection;
  document.addEventListener('dragstart', preventDragStart;
Src/index.css — global selector disables text selection:
  * {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
Src/components/GameScreen.css: — the game screen container explicitly disables selection and native touch
gestures:
  .gs-screen {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    user-select: none;
    touch-action: none;
}
6.4. The browser scroll is prohibited (only custom scroll is allowed):
src/index.css: locks html, body, and root against native scroll:
html, body {
    width: 100%;
    height: 100%;
    overflow: hidden !important;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;    
    /* Prevent all scrolling and overscroll behaviors */
    overscroll-behavior: none;            /* kills swipe-to-refresh */
    overscroll-behavior-x: none;
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: none;
    touch-action: none;
    -ms-touch-action: none;
  }
  #root {
    overflow: hidden;
    position: fixed;
    overscroll-behavior: none;
    touch-action: none;
  }
src/App.tsx: the same rules re-injected as global <style> so they apply before any component mounts:
html, body {
    overflow: hidden !important;
    position: fixed;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: none;
    touch-action: none;
  }
 {
    touch-action: none;
    overscroll-behavior: none;
  }
src/App.tsx: JS event listeners cancel every native scroll trigger (touch drag, wheel, and scroll keys), that also avoids mobile swipe-to-refresh:
 const preventTouchMove = (e: TouchEvent) => { e.preventDefault(); };   // blocks swipe-to-refresh
  const preventWheel     = (e: WheelEvent) => { e.preventDefault(); return false; };
  const preventKeyScroll = (e: KeyboardEvent) => {
    const scrollKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','PageUp','PageDown','Home','End'];
    if (scrollKeys.includes(e.key)) { /* preventDefault unless in input */ }
  };
  document.addEventListener('touchmove', preventTouchMove, { passive: false });  
  document.addEventListener('wheel',     preventWheel,     { passive: false });  
  window.addEventListener  ('wheel',     preventWheel,     { passive: false });  
  document.addEventListener('keydown',   preventKeyScroll);                      
  document.body.style.overflow         = 'hidden';                               
  document.documentElement.style.overflow = 'hidden';                            

6.5. Environment (`.env`) setup:
GENERATE_SOURCEMAP=false      # No source maps in production
INLINE_RUNTIME_CHUNK=false    # Required for Yandex Games, because they block inline scripts

6.6. For styling and mobile devices: handle iOS Safari's dynamic toolbar
maximum-scale=1, user-scalable=no, viewport-fit=cover
Use `--real-vh` CSS variable to handle iOS Safari's dynamic toolbar
const setVH = () => {
  document.documentElement.style.setProperty('--real-vh', `${window.innerHeight * 0.01}px`);
};

6.7. Yandex prescribes auto pausing music when the active screen focus was changed: 
(e.g., the user changed the browser tab, closed browser, minimized the window, etc.). 
In this case the background music should be automatically paused and resumed on user return. For this use Web Audio API. 
Example (see Orbital Planets game code):
  src/App.tsx:
  Preload via Web Audio API (avoids Media Session trigger) 
  const preloadAudio = async (src: string): Promise<void> => {
    const fullSrc = process.env.PUBLIC_URL + src;
    try {
      await loadAudioBuffer(fullSrc);
      console.log('Preloaded audio (Web Audio API):', src);
    } catch (error) {
      console.warn('Failed to preload audio:', src, error);
    }
  };

  src/utils/audioCache.ts:
  Shared AudioContext factory (audioCache.ts)
  let sharedAudioContext: AudioContext | null = null;
  export const getAudioContext = (): AudioContext => {
    if (!sharedAudioContext) {
      sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return sharedAudioContext;
  };
  Fetch + decode into AudioBuffer, cached (audioCache.ts)
  export const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
    if (audioBufferCache.has(url)) return audioBufferCache.get(url)!;
    const audioContext = getAudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBufferCache.set(url, audioBuffer);
    return audioBuffer;
  };

src/hooks/useBackgroundMusic.ts:
  Refs for audio graph nodes (useBackgroundMusic.ts)
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const currentBufferRef = useRef<AudioBuffer | null>(null);
  Initialize context + gain node (useBackgroundMusic.ts)
  const initializeAudio = useCallback(() => {
    if (isInitializedRef.current) return;
    audioContextRef.current = getAudioContext();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = volume;
    isInitializedRef.current = true;
  }, [volume]);
  Resume suspended context (autoplay policy) (useBackgroundMusic.ts)
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);
  Stop + disconnect current source (useBackgroundMusic.ts)
  const stopCurrentSource = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) { /* ignore */ }
      sourceNodeRef.current = null;
    }
  }, []);
  Play an AudioBuffer (looping, with offset) (useBackgroundMusic.ts)
  const playBuffer = useCallback((buffer: AudioBuffer, offset: number = 0) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    stopCurrentSource();
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNodeRef.current);
    source.onended = () => { /* ... */ };
    sourceNodeRef.current = source;
    currentBufferRef.current = buffer;
    startTimeRef.current = audioContextRef.current.currentTime - offset;
    source.start(0, offset);
  }, [stopCurrentSource]);
  Load + play random track (useBackgroundMusic.ts)
  const playRandomTrack = useCallback(async () => {
    initializeAudio();
    await resumeAudioContext();
    const newTrack = getRandomTrack(currentTrack);
    setCurrentTrack(newTrack);
    const buffer = await loadAudioBuffer(newTrack);
    playBuffer(buffer, 0);
    pauseTimeRef.current = 0;
  }, [/* deps */]);
  Pause — compute offset from currentTime (useBackgroundMusic.ts)
  const pausePlayback = useCallback(() => {
    if (!audioContextRef.current || !sourceNodeRef.current || !isPlayingRef.current) return;
    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
    const duration = currentBufferRef.current?.duration || 0;
    pauseTimeRef.current = duration > 0 ? elapsed % duration : 0;
    stopCurrentSource();
  }, [stopCurrentSource]);
  Resume from saved offset (useBackgroundMusic.ts)
  const resumePlayback = useCallback(async () => {
    if (!currentBufferRef.current || isPlayingRef.current) return;
    await resumeAudioContext();
    playBuffer(currentBufferRef.current, pauseTimeRef.current);
  }, [resumeAudioContext, playBuffer]);
  Live volume updates via GainNode (useBackgroundMusic.ts)
useEffect(() => {   
 if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

7. Testing with playwright. The game will be tested in multiple resolutions. to let tests work this code should be integrated:  The contract Playwright relies on:

  a. window.__goToScreen(screen, themeId?) — synchronous state setter. themeId is required for GAME, ignored elsewhere. Navigating to MENU clears the
  selected theme.
  b. window.__screens — array of valid screen ids: ['ONBOARDING', 'HOW_TO_PLAY', 'LEVEL_SELECT', 'MENU', 'GAME']. Lets tests enumerate without hardcoding.
  c. Lifecycle — both are installed in a top-level useEffect on mount, removed on unmount. Tests should wait until typeof window.__goToScreen === 'function'
   before calling.
  d. No auth / no gesture required — the hook works without clicking through onboarding, accepting cookies, or a user gesture. If that ever changes (e.g.
  audio needs a click), tests break silently.

  Worth mentioning but not part of the hook:

  - GAME screens render a <canvas>; the responsive tester waits for that canvas to stop changing before screenshotting. If the game ever renders gameplay
  without a canvas (pure DOM), the settle-wait becomes a no-op.
