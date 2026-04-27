import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopOptions {
  isRunning: boolean;
  onUpdate: (deltaTime: number) => void;
}

export const useGameLoop = ({ isRunning, onUpdate }: UseGameLoopOptions) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      onUpdate(deltaTime / 1000); // Convert to seconds
    }
    previousTimeRef.current = time;

    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, onUpdate]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);

  // Reset timing when starting
  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = undefined;
    }
  }, [isRunning]);
};