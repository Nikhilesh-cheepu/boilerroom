"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drives 0–1 "beat" intensity from video audio when unmuted.
 * Keeps a single MediaElementAudioSource per video element; falls back to a
 * soft synthetic pulse when muted or Web Audio fails.
 */
export function useVideoBeat(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  unmuted: boolean,
) {
  const [beat, setBeat] = useState(0.35);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const fakeT = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fakeId: ReturnType<typeof setInterval> | null = null;

    const stopFake = () => {
      if (fakeId != null) {
        clearInterval(fakeId);
        fakeId = null;
      }
    };

    const stopRaf = () => {
      cancelAnimationFrame(rafRef.current);
    };

    if (!unmuted) {
      stopRaf();
      stopFake();
      fakeId = setInterval(() => {
        fakeT.current += 0.08;
        setBeat(0.25 + Math.sin(fakeT.current) * 0.08);
      }, 80);
      return () => stopFake();
    }

    stopFake();

    const runAnalyser = () => {
      const ctx = ctxRef.current;
      const analyser = analyserRef.current;
      if (!ctx || !analyser) return;
      const data = new Uint8Array(analyser.frequencyBinCount);
      if (ctx.state === "suspended") void ctx.resume();
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i] ?? 0;
      const avg = sum / data.length / 255;
      setBeat(0.2 + Math.min(1, avg * 2.2));
      rafRef.current = requestAnimationFrame(runAnalyser);
    };

    try {
      if (!sourceRef.current) {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const src = ctx.createMediaElementSource(video);
        sourceRef.current = src;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        src.connect(analyser);
        analyser.connect(ctx.destination);
      }
      stopRaf();
      rafRef.current = requestAnimationFrame(runAnalyser);
    } catch {
      fakeId = setInterval(() => {
        fakeT.current += 0.12;
        setBeat(0.3 + Math.abs(Math.sin(fakeT.current)) * 0.35);
      }, 50);
    }

    return () => {
      stopRaf();
      stopFake();
    };
  }, [unmuted, videoRef]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      try {
        sourceRef.current?.disconnect();
      } catch {
        /* ignore */
      }
      sourceRef.current = null;
      analyserRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return beat;
}
