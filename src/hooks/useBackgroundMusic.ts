import { useEffect, useRef, useState, useCallback } from 'react';
import { getAudioContext, loadAudioBuffer } from '../utils/audioCache';

const MUSIC_FILES = [
  `${process.env.PUBLIC_URL}/music/1.mp3`,
  `${process.env.PUBLIC_URL}/music/2.mp3`,
  `${process.env.PUBLIC_URL}/music/3.mp3`,
  `${process.env.PUBLIC_URL}/music/4.mp3`,
  `${process.env.PUBLIC_URL}/music/5.mp3`,
  `${process.env.PUBLIC_URL}/music/6.mp3`,
  `${process.env.PUBLIC_URL}/music/7.mp3`,
];

interface UseBackgroundMusicOptions {
  volume?: number; // 0.0 to 1.0
  enabled?: boolean; // Allow disabling music
}

export const useBackgroundMusic = (
  currentLevel: number,
  options: UseBackgroundMusicOptions = {}
) => {
  const { volume = 0.3, enabled = true } = options;

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const currentBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const lastLevelRef = useRef<number>(currentLevel);
  const wasPlayingBeforeHiddenRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);
  // Use ref to track playing state for event handlers (avoids stale closure issues)
  const isPlayingRef = useRef<boolean>(false);

  // Initialize AudioContext and GainNode
  const initializeAudio = useCallback(() => {
    if (isInitializedRef.current) return;

    try {
      audioContextRef.current = getAudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize Web Audio:', error);
    }
  }, [volume]);

  // Resume AudioContext if suspended (needed for autoplay policy)
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.warn('Failed to resume AudioContext:', error);
      }
    }
  }, []);

  // Get a random track different from the current one
  const getRandomTrack = useCallback((currentTrackUrl?: string) => {
    let availableTracks = [...MUSIC_FILES];

    if (currentTrackUrl) {
      availableTracks = availableTracks.filter(track => track !== currentTrackUrl);
    }

    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    return availableTracks[randomIndex];
  }, []);

  // Stop current playback
  const stopCurrentSource = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      sourceNodeRef.current = null;
    }
  }, []);

  // Play audio buffer with looping
  const playBuffer = useCallback((buffer: AudioBuffer, offset: number = 0) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Stop any currently playing source
    stopCurrentSource();

    // Create new source node
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNodeRef.current);

    // Handle when source ends (shouldn't happen with loop, but just in case)
    source.onended = () => {
      if (sourceNodeRef.current === source) {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };

    sourceNodeRef.current = source;
    currentBufferRef.current = buffer;
    startTimeRef.current = audioContextRef.current.currentTime - offset;

    source.start(0, offset);
    setIsPlaying(true);
    isPlayingRef.current = true;
  }, [stopCurrentSource]);

  // Play a new random track
  const playRandomTrack = useCallback(async () => {
    if (!enabled) return;

    initializeAudio();
    await resumeAudioContext();

    const newTrack = getRandomTrack(currentTrack);
    setCurrentTrack(newTrack);

    try {
      const buffer = await loadAudioBuffer(newTrack);
      playBuffer(buffer, 0);
      pauseTimeRef.current = 0;
    } catch (error) {
      console.warn('Failed to play track:', newTrack, error);
    }
  }, [enabled, currentTrack, initializeAudio, resumeAudioContext, getRandomTrack, playBuffer]);

  // Pause playback
  const pausePlayback = useCallback(() => {
    // Use ref to check playing state (avoids stale closure)
    if (!audioContextRef.current || !sourceNodeRef.current || !isPlayingRef.current) return;

    // Calculate current position in the buffer
    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
    const duration = currentBufferRef.current?.duration || 0;
    pauseTimeRef.current = duration > 0 ? elapsed % duration : 0;

    stopCurrentSource();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, [stopCurrentSource]);

  // Resume playback from paused position
  const resumePlayback = useCallback(async () => {
    // Use ref to check playing state (avoids stale closure)
    if (!currentBufferRef.current || isPlayingRef.current) return;

    await resumeAudioContext();
    playBuffer(currentBufferRef.current, pauseTimeRef.current);
  }, [resumeAudioContext, playBuffer]);

  // Toggle play/pause
  const togglePlayback = useCallback(() => {
    if (isPlayingRef.current) {
      pausePlayback();
    } else {
      resumePlayback();
    }
  }, [pausePlayback, resumePlayback]);

  // Stop music completely
  const stopMusic = useCallback(() => {
    stopCurrentSource();
    pauseTimeRef.current = 0;
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, [stopCurrentSource]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Initialize music on mount
  useEffect(() => {
    if (enabled) {
      // Small delay to ensure AudioContext can be created after user interaction
      const timer = setTimeout(() => {
        playRandomTrack();
      }, 100);
      return () => clearTimeout(timer);
    }

    // Cleanup on unmount
    return () => {
      stopCurrentSource();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Change track when level changes
  useEffect(() => {
    if (currentLevel !== lastLevelRef.current && enabled) {
      lastLevelRef.current = currentLevel;
      playRandomTrack();
    }
  }, [currentLevel, enabled, playRandomTrack]);

  // Handle tab visibility changes and window blur/focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!enabled) return;

      if (document.hidden) {
        // Use ref to check actual playing state
        if (isPlayingRef.current) {
          wasPlayingBeforeHiddenRef.current = true;
          pausePlayback();
          console.log('Music paused: tab hidden');
        }
      } else {
        if (wasPlayingBeforeHiddenRef.current) {
          resumePlayback();
          wasPlayingBeforeHiddenRef.current = false;
          console.log('Music resumed: tab visible');
        }
      }
    };

    const handleWindowBlur = () => {
      if (!enabled) return;

      // Use ref to check actual playing state
      if (isPlayingRef.current) {
        wasPlayingBeforeHiddenRef.current = true;
        pausePlayback();
        console.log('Music paused: window blur');
      }
    };

    const handleWindowFocus = () => {
      if (!enabled) return;

      if (wasPlayingBeforeHiddenRef.current) {
        resumePlayback();
        wasPlayingBeforeHiddenRef.current = false;
        console.log('Music resumed: window focus');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [enabled, pausePlayback, resumePlayback]);

  // Yandex Games SDK events
  useEffect(() => {
    const ysdk = (window as any).ysdk;
    if (!ysdk) return;

    const pauseCallback = () => {
      if (!enabled) return;

      // Use ref to check actual playing state
      if (isPlayingRef.current) {
        wasPlayingBeforeHiddenRef.current = true;
        pausePlayback();
        console.log('Yandex Games: Music paused via game_api_pause');
      }
    };

    const resumeCallback = () => {
      if (!enabled) return;

      if (wasPlayingBeforeHiddenRef.current) {
        resumePlayback();
        wasPlayingBeforeHiddenRef.current = false;
        console.log('Yandex Games: Music resumed via game_api_resume');
      }
    };

    if (ysdk.on) {
      ysdk.on('game_api_pause', pauseCallback);
      ysdk.on('game_api_resume', resumeCallback);
    }

    return () => {
      if (ysdk.off) {
        ysdk.off('game_api_pause', pauseCallback);
        ysdk.off('game_api_resume', resumeCallback);
      }
    };
  }, [enabled, pausePlayback, resumePlayback]);

  // Handle user interaction to resume AudioContext (for autoplay policy)
  useEffect(() => {
    const handleUserInteraction = () => {
      resumeAudioContext();
    };

    // Add listeners for user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [resumeAudioContext]);

  return {
    isPlaying,
    togglePlayback,
    stopMusic,
    playRandomTrack,
  };
};
