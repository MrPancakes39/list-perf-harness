import { useEffect, useRef } from "react";

interface ScrollFpsSamplerOptions {
  idleThresholdMs?: number;
  onSample: (fps: number) => void;
}

export function useScrollFpsSampler({
  idleThresholdMs = 140,
  onSample,
}: ScrollFpsSamplerOptions) {
  const frameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);

  const tick = (timestamp: number) => {
    if (lastFrameTimeRef.current !== null) {
      const delta = timestamp - lastFrameTimeRef.current;

      if (delta > 0) {
        onSample(1000 / delta);
      }
    }

    lastFrameTimeRef.current = timestamp;
    const elapsedSinceScroll = performance.now() - lastScrollTimeRef.current;

    if (elapsedSinceScroll < idleThresholdMs) {
      frameIdRef.current = requestAnimationFrame(tick);
      return;
    }

    frameIdRef.current = null;
    lastFrameTimeRef.current = null;
  };

  const onScroll = () => {
    lastScrollTimeRef.current = performance.now();

    if (frameIdRef.current === null) {
      frameIdRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return onScroll;
}
