// Shared audio buffer cache for Web Audio API
// Used by both App.tsx (preloading) and useBackgroundMusic (playback)
// Web Audio API doesn't trigger browser Media Session, which is required for Yandex Games

export const audioBufferCache: Map<string, AudioBuffer> = new Map();

// Shared AudioContext (created once, reused)
let sharedAudioContext: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return sharedAudioContext;
};

// Load and decode audio file into AudioBuffer
export const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
  // Check cache first
  if (audioBufferCache.has(url)) {
    return audioBufferCache.get(url)!;
  }

  const audioContext = getAudioContext();

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Cache the buffer
    audioBufferCache.set(url, audioBuffer);

    return audioBuffer;
  } catch (error) {
    console.error('Failed to load audio:', url, error);
    throw error;
  }
};
