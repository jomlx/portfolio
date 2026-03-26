import { useRef, useCallback } from 'react';

/**
 * Synthesizes a short "twang" sound using the Web Audio API.
 * No audio files needed — generates sound programmatically.
 */
export function useSoundEffect() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTwang = useCallback((intensity: number = 0.5) => {
    // Lazy-init AudioContext (must be triggered by user gesture)
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    // Oscillator — plucked string sound
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200 + intensity * 300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);

    // Gain envelope — short attack, quick decay
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15 * intensity, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    // Filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  return { playTwang };
}
